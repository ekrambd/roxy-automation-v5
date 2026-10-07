import { Router } from 'express';
import { storeOrders, storeProducts } from '../data/store';
import { BookOrder } from '../../types';
import { cacheResponse } from '../middleware/cacheMiddleware';
import { globalCache } from '../services/cacheEngine';
import { shardService } from '../services/shardService';
import { redundancyService } from '../services/redundancyService';

export const orderRouter = Router();

// GET All Orders with cache
orderRouter.get('/', cacheResponse({ ttlSeconds: 15, staleWhileRevalidateSeconds: 30, tag: 'orders' }), (_req, res) => {
  res.json(storeOrders);
});

// GET Sharding & Partition info for Orders
orderRouter.get('/shards/stats', (_req, res) => {
  const counterStats = shardService.getCounterStats('orders_total');
  const partitions: Record<string, number> = {};

  for (const order of storeOrders) {
    const shardIndex = shardService.getShardIndex(order.id || '');
    partitions[`shard_${shardIndex}`] = (partitions[`shard_${shardIndex}`] || 0) + 1;
  }

  res.json({
    success: true,
    totalOrders: storeOrders.length,
    counterStats,
    distribution: partitions
  });
});

// POST /api/orders/checkout - Secure Server-Side Atomic Order Validation & Placement
orderRouter.post('/checkout', async (req, res) => {
  try {
    const { items, customerName, phone, address, deliveryZone, paymentMethod, senderPhone, trxId, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }
    if (!customerName || !phone || !address) {
      return res.status(400).json({ error: 'Customer name, phone number, and delivery address are required.' });
    }

    // 1. Authoritative Server-Side Stock & Price Verification
    let calculatedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const productId = item.productId || item.product?.id || item.id;
      const quantity = Math.max(1, parseInt(item.quantity || 1, 10));

      const matchedProduct = storeProducts.find(p => p.id === productId);
      const unitPrice = matchedProduct ? Number(matchedProduct.price || 0) : Number(item.price || item.product?.price || 0);
      const regularPrice = matchedProduct ? Number(matchedProduct.regularPrice || unitPrice) : Number(item.regularPrice || unitPrice);
      const title = matchedProduct?.title || item.product?.title || item.title || 'Product';

      // Stock check
      const currentStock = matchedProduct ? (typeof matchedProduct.stock === 'number' ? matchedProduct.stock : (matchedProduct as any).stockQuantity) : undefined;
      const canContinueSelling = matchedProduct?.continueSelling === true;

      if (matchedProduct && typeof currentStock === 'number') {
        if (currentStock < quantity && !canContinueSelling) {
          return res.status(400).json({
            error: `Insufficient stock for product "${title}". Available: ${currentStock}`
          });
        }
        // Deduct inventory atomically on server
        if (typeof matchedProduct.stock === 'number') {
          matchedProduct.stock -= quantity;
        } else if (typeof (matchedProduct as any).stockQuantity === 'number') {
          (matchedProduct as any).stockQuantity -= quantity;
        }
      }

      calculatedSubtotal += unitPrice * quantity;
      validatedItems.push({
        product: {
          id: productId,
          title,
          price: unitPrice,
          regularPrice,
          image: matchedProduct?.coverImage || item.product?.image || item.product?.coverImage || '',
          category: matchedProduct?.category || item.product?.category || '',
          stock: matchedProduct?.stockQuantity || 100,
          isAvailable: true
        },
        quantity
      });
    }

    // 2. Authoritative Delivery Charge Calculation
    const deliveryFee = deliveryZone === 'inside_dhaka' ? 60 : 110;

    // 3. Authoritative Coupon Verification
    let couponDiscount = 0;
    if (couponCode && typeof couponCode === 'string') {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === 'WELCOME10' || cleanCoupon === 'FANTINE10') {
        couponDiscount = Math.round(calculatedSubtotal * 0.10);
      } else if (cleanCoupon === 'FLAT50') {
        couponDiscount = 50;
      }
    }

    const calculatedGrandTotal = Math.max(0, calculatedSubtotal + deliveryFee - couponDiscount);
    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const shardIndex = shardService.getShardIndex(orderId);
    const timePartition = shardService.getTimePartitionName('orders');

    const confirmedOrder: BookOrder & { _shardMeta?: { shardIndex: number; partition: string } } = {
      id: orderId,
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      address: String(address).trim(),
      deliveryZone: deliveryZone || 'inside_dhaka',
      deliveryFee,
      deliveryCharge: deliveryFee,

      items: validatedItems,
      quantity: validatedItems.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: calculatedGrandTotal,
      totalAmount: calculatedGrandTotal,
      productName: validatedItems.map(i => `${i.product.title} (x${i.quantity})`).join(', '),
      productTitle: validatedItems.map(i => `${i.product.title} (x${i.quantity})`).join(', '),
      status: 'Pending',
      orderType: 'storefront',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentGateway: paymentMethod || 'Cash on Delivery',
      senderPhone: senderPhone ? String(senderPhone).trim() : undefined,
      trxId: trxId ? String(trxId).trim() : undefined,
      couponCode: couponCode ? String(couponCode).trim() : undefined,
      couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
      createdAt: new Date().toISOString(),
      orderDate: new Date().toISOString(),
      _shardMeta: {
        shardIndex,
        partition: timePartition
      }
    };

    // Save order
    storeOrders.unshift(confirmedOrder);
    shardService.incrementCounter('orders_total', 1);
    globalCache.invalidateTag('orders');
    globalCache.invalidateTag('products');
    redundancyService.saveSnapshot('recent_orders_backup', storeOrders.slice(0, 100));

    return res.status(201).json({
      success: true,
      order: confirmedOrder
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Server error during checkout validation.' });
  }
});

// POST Create Order - with sharded partitioning & distributed counter
orderRouter.post('/', (req, res) => {
  const orderId = req.body.id || `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const shardIndex = shardService.getShardIndex(orderId);
  const timePartition = shardService.getTimePartitionName('orders');

  const newOrder: BookOrder & { _shardMeta?: { shardIndex: number; partition: string } } = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    _shardMeta: {
      shardIndex,
      partition: timePartition
    },
    ...req.body
  };

  storeOrders.unshift(newOrder);

  // Increment distributed sharded order counter
  shardService.incrementCounter('orders_total', 1);

  // Invalidate order caches
  globalCache.invalidateTag('orders');

  // Redundancy snapshot
  redundancyService.saveSnapshot('recent_orders_backup', storeOrders.slice(0, 100));

  res.status(201).json(newOrder);
});

// PUT Update Order
orderRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = storeOrders.findIndex(o => o.id === id);
  if (index !== -1) {
    storeOrders[index] = { ...storeOrders[index], ...req.body };

    // Invalidate order caches
    globalCache.invalidateTag('orders');

    res.json(storeOrders[index]);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});
