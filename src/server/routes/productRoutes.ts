import { Router } from 'express';
import { storeProducts } from '../data/store';
import { Product } from '../../types';
import { cacheResponse } from '../middleware/cacheMiddleware';
import { globalCache } from '../services/cacheEngine';
import { shardService } from '../services/shardService';

export const productRouter = Router();

// GET All Products - High-speed cached with ETag & SWR
productRouter.get('/', cacheResponse({ ttlSeconds: 60, staleWhileRevalidateSeconds: 120, tag: 'products' }), (req, res) => {
  res.json(storeProducts);
});

// GET Product by ID with sharded view counter tracking
productRouter.get('/:id', cacheResponse({ ttlSeconds: 60, staleWhileRevalidateSeconds: 120, tag: 'products' }), (req, res) => {
  const { id } = req.params;
  const product = storeProducts.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  // Increment distributed sharded view counter in background
  shardService.incrementCounter(`views_${id}`, 1);

  res.json(product);
});

// POST Create Product - writes and invalidates cache
productRouter.post('/', (req, res) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  storeProducts.unshift(newProduct);

  // Invalidate product caches across cluster
  globalCache.invalidateTag('products');

  res.status(201).json(newProduct);
});

// PUT Update Product - updates and invalidates cache
productRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = storeProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    storeProducts[index] = { ...storeProducts[index], ...req.body };

    // Invalidate product caches
    globalCache.invalidateTag('products');

    res.json(storeProducts[index]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// DELETE Product - removes and invalidates cache
productRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = storeProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    storeProducts.splice(index, 1);

    // Invalidate product caches
    globalCache.invalidateTag('products');

    res.json({ success: true, id });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});
