import React, { useEffect, useState, useRef } from 'react';
import { 
  ShoppingBag, ExternalLink, Search, Filter, Plus, Phone, MapPin, Calendar, 
  CheckCircle, Clock, Truck, XCircle, Trash2, Edit3, Printer, 
  Check, ArrowUpDown, User, Package, DollarSign, Send, ShieldCheck,
  ChevronDown, FileSpreadsheet, Download, Upload, MessageSquare,
  Copy, RefreshCw, FileText, CheckSquare, AlertCircle, Sparkles, Tag,
  ArrowLeft, MoreVertical, MoreHorizontal, Globe, Store, Minus, ShoppingCart
} from 'lucide-react';
import { BookOrder, Product } from '../types';
import { OrderDetailsView } from './OrderDetailsView';
import { dbService } from '../lib/dbService';
import { formatWhatsAppLink, formatTelegramLink } from '../lib/constants';
import { ApiClient } from '../services/apiClient';
import { motion, AnimatePresence } from 'motion/react';
import ResponsiveImage from './ResponsiveImage';

import { ConfirmDialog } from './ui/ConfirmDialog';
import { InvoicePreview } from './InvoicePreview';
import { ThermalStickerPreview } from './ThermalStickerPreview';

interface OrderManagerProps {
  orders: BookOrder[];
  products?: Product[];
  onAddOrder: (order: BookOrder) => Promise<void>;
  onUpdateOrder: (order: BookOrder) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
}

// Crisp Barcode SVG Generator for print outputs
function BarcodeSVG({ value, height = 38 }: { value: string; height?: number }) {
  const bars: { width: number; space: number }[] = [];
  const clean = (value || 'ORD-1001').toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    bars.push({
      width: (code % 3) + 1.5,
      space: ((code * 2) % 3) + 1.5
    });
  }

  let currentX = 10;
  bars.forEach(b => { currentX += b.width + b.space; });
  const totalWidth = currentX + 10;

  let renderX = 10;
  return (
    <svg viewBox={`0 0 ${totalWidth} ${height}`} className="w-full h-10" preserveAspectRatio="none">
      {bars.map((b, idx) => {
        const x = renderX;
        renderX += b.width + b.space;
        return (
          <rect
            key={idx}
            x={x}
            y={0}
            width={b.width}
            height={height}
            fill="#000000"
          />
        );
      })}
    </svg>
  );
}

// Available Export Column Options for Custom Column Modal
const DEFAULT_EXPORT_COLUMNS = [
  { id: 'id', label: 'ID', defaultChecked: true },
  { id: 'customerName', label: 'Customer Name', defaultChecked: true },
  { id: 'phone', label: 'Phone', defaultChecked: true },
  { id: 'address', label: 'Address', defaultChecked: true },
  { id: 'status', label: 'Status', defaultChecked: true },
  { id: 'channel', label: 'Channel', defaultChecked: true },
  { id: 'shopId', label: 'Shop ID', defaultChecked: true },
  { id: 'supplierIds', label: 'Supplier IDs', defaultChecked: true },
  { id: 'resellerId', label: 'Reseller ID', defaultChecked: true },
  { id: 'attributionId', label: 'Attribution ID', defaultChecked: true },
  { id: 'affiliateCode', label: 'Affiliate Code', defaultChecked: true },
  { id: 'net', label: 'Net', defaultChecked: true },
  { id: 'logistics', label: 'Logistics', defaultChecked: true },
  { id: 'logisticsCharge', label: 'Logistics Charge', defaultChecked: true },
  { id: 'total', label: 'Total', defaultChecked: true },
  { id: 'rEarn', label: 'R. Earn', defaultChecked: true },
  { id: 'resell', label: 'Resell', defaultChecked: true },
  { id: 'paid', label: 'Paid', defaultChecked: true },
  { id: 'due', label: 'Due', defaultChecked: true },
  { id: 'rDue', label: 'R. Due', defaultChecked: true },
  { id: 'profit', label: 'Profit', defaultChecked: true },
  { id: 'created', label: 'Created', defaultChecked: true },
  { id: 'logisticsNote', label: 'Logistics Note', defaultChecked: true },
  { id: 'contactName', label: 'Contact Name', defaultChecked: true },
  { id: 'contactPhone', label: 'Contact Phone', defaultChecked: true },
];


const MAIN_STATUSES = [
  { id: 'Pending', label: 'Pending' },
  { id: 'Confirmed', label: 'Approved' },
  { id: 'Packaging', label: 'Packaging' },
  { id: 'Ready for Shipment', label: 'Ready for Shipment' },
  { id: 'Shipped', label: 'Courier' },
  { id: 'Delivered', label: 'Delivered' }
];

const EXCEPTION_STATUSES = ['Hold', 'Under Review', 'Not Responding', 'Return', 'Cancelled'];

function StatusStepper({ order, onChange }: { order: BookOrder, onChange: (o: BookOrder, s: string) => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const currentIdx = MAIN_STATUSES.findIndex(s => s.id === order.status);
  const isException = EXCEPTION_STATUSES.includes(order.status) || (currentIdx === -1 && order.status);

  return (
    <div className="flex items-center w-full min-w-[200px] gap-2">
      {isException ? (
        <div className="flex-1 flex items-center justify-between bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-1.5">
          <span className="text-[11px] font-bold text-rose-700">{order.status}</span>
        </div>
      ) : (
        <div className="flex items-center flex-1">
          {MAIN_STATUSES.map((step, idx) => {
            const isCompleted = currentIdx >= idx;
            const isCurrent = currentIdx === idx;
            return (
              <React.Fragment key={step.id}>
                <div 
                  onClick={() => onChange(order, step.id)}
                  title={`Mark as ${step.label}`}
                  className={`relative flex items-center justify-center w-4 h-4 rounded-full cursor-pointer transition-all shrink-0 border-2 ${
                    isCurrent ? 'border-teal-600 bg-white ring-2 ring-teal-100 ring-offset-1' :
                    isCompleted ? 'border-teal-600 bg-teal-600' : 
                    'border-slate-200 bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {isCompleted && !isCurrent && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  {isCurrent && <div className="w-1.5 h-1.5 bg-teal-600 rounded-full" />}
                </div>
                {idx < MAIN_STATUSES.length - 1 && (
                  <div className={`h-[3px] flex-1 mx-0.5 rounded-full transition-colors ${
                    currentIdx > idx ? 'bg-teal-600' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
      
      {/* Exception Menu */}
      <div className="relative" ref={menuRef}>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        <AnimatePresence>
          {showMenu && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[60]"
            >
               <div className="px-3 pb-2 mb-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                 Update Status
               </div>
               
               {isException && (
                 <button 
                   onClick={() => { onChange(order, 'Pending'); setShowMenu(false); }}
                   className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                 >
                   <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                   waiting-Reset to
                 </button>
               )}
               {EXCEPTION_STATUSES.map(status => (
                 <button 
                   key={status}
                   onClick={() => { onChange(order, status); setShowMenu(false); }}
                   className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center gap-2 ${
                     status === 'Cancelled' ? 'text-rose-600 hover:bg-rose-50' : 'text-amber-700 hover:bg-amber-50'
                   }`}
                 >
                   {status === 'Cancelled' ? <XCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                   {status === 'Hold'? 'Suspended' : status === 'Under Review'? 'Verification' : status === 'Not Responding'? 'No answer' : status === 'Return'? 'Return' : 'canceled'}
                 </button>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OrderManager({
  orders,
  products = [],
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder
}: OrderManagerProps) {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'landing' | 'physical' | 'store'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [paginationMode, setPaginationMode] = useState<'pages' | 'cursor'>('pages');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [dispatchDialog, setDispatchDialog] = useState<{ orderId: string; message: string; success: boolean } | null>(null);
  const [openActionMenuOrderId, setOpenActionMenuOrderId] = useState<string | null>(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<BookOrder | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ newStatus: string; count: number } | null>(null);
  const [invoiceBrand, setInvoiceBrand] = useState({
    name: 'FAИTIИE BD',
    tagline: 'Skincare Solutions',
    phone: '01303142147',
    email: 'fantinebd@gmail.com',
    website: 'fantinebd.com',
    logo: '/logo_transparent.webp'
  });

  // Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Print Mode State
  const [activePrintMode, setActivePrintMode] = useState<
    'invoice' | 'stickers' | 'mini-stickers' | 'packing-slips' | 'pos-receipt' | 'pick-list' | 'check-list' | 'commercial' | null
  >(null);
  const [printOrdersList, setPrintOrdersList] = useState<BookOrder[]>([]);

  // Modals
  const [isExportColumnsModalOpen, setIsExportColumnsModalOpen] = useState(false);
  const [selectedExportColumns, setSelectedExportColumns] = useState<string[]>(
    DEFAULT_EXPORT_COLUMNS.map(c => c.id)
  );

  const [isImportCourierModalOpen, setIsImportCourierModalOpen] = useState(false);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);
  
  const [isBulkSmsModalOpen, setIsBulkSmsModalOpen] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState('Your order has been successfully received. Shipping on cash-on-delivery by courier soon. Thank you!');
  const [sendingSms, setSendingSms] = useState(false);

  // Customer Courier Delivery Ratio & Fraud Check Modal
  const [bulkCourierConfirm, setBulkCourierConfirm] = useState<{
    isOpen: boolean;
    provider: 'steadfast' | 'pathao';
    providerName: string;
    count: number;
  }>({
    isOpen: false,
    provider: 'steadfast',
    providerName: 'Steadfast',
    count: 0
  });



  // Catalog products for POS selection
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(products || []);

  useEffect(() => {
    if (products && products.length > 0) {
      setCatalogProducts(products);
    } else {
      dbService.getProducts().then(prods => {
        if (prods && prods.length > 0) setCatalogProducts(prods);
      });
    }
  }, [products]);

  // Real POS Order State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [posSelectedItems, setPosSelectedItems] = useState<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    coverImage?: string;
    stockQuantity?: number;
  }[]>([]);
  const [posProductSearch, setPosProductSearch] = useState('');
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posPhone, setPosPhone] = useState('');
  const [posAddress, setPosAddress] = useState('');
  const [posOrderType, setPosOrderType] = useState<'physical' | 'delivery'>('physical');
  const [posDeliveryCharge, setPosDeliveryCharge] = useState(0);
  const [posDiscount, setPosDiscount] = useState(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState('Cash');
  const [posPaymentStatus, setPosPaymentStatus] = useState<'Paid' | 'Unpaid'>('Paid');
  const [posNotes, setPosNotes] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<BookOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<BookOrder | null>(null);
  const [editFormData, setEditFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    productTitle: '',
    price: 0,
    quantity: 1,
    deliveryCharge: 0,
    couponCode: '',
    luckyCouponCode: '',
    discountAmount: 0,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } catch {
      return '';
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-order-actions]')) {
        setOpenActionMenuOrderId(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadInvoiceBrand = async () => {
      try {
        const [ecomSettings, instituteInfo] = await Promise.all([
          dbService.getEcomSettings(),
          dbService.getInstituteInfo()
        ]);

        if (!mounted) return;

        setInvoiceBrand({
          name: ecomSettings.storeName || instituteInfo?.name || 'FAИTIИE BD',
          tagline: ecomSettings.storeTagline || instituteInfo?.description || 'Skincare Solutions',
          phone: instituteInfo?.phone || ecomSettings.contactPhone || '01303142147',
          email: instituteInfo?.email || ecomSettings.contactEmail || 'fantinebd@gmail.com',
          website: 'fantinebd.com',
          logo: ecomSettings.storeLogo || instituteInfo?.logo || '/logo_transparent.webp'
        });
      } catch (err) {
        console.warn('Failed to load invoice brand data:', err);
      }
    };

    loadInvoiceBrand();
    return () => {
      mounted = false;
    };
  }, []);

  const calculateOrderTotal = (price: number, quantity: number, deliveryCharge: number, discountAmount: number) => {
    const subtotal = Math.max(0, price) * Math.max(1, quantity);
    return Math.max(0, subtotal + Math.max(0, deliveryCharge) - Math.max(0, discountAmount));
  };

  const openEditOrder = (order: BookOrder) => {
    setEditingOrder(order);
    setEditFormData({
      customerName: order.customerName || '',
      phone: order.phone || '',
      address: order.address || '',
      productTitle: order.productTitle || '',
      price: order.price || 0,
      quantity: order.quantity || 1,
      deliveryCharge: order.deliveryCharge || 0,
      couponCode: order.couponCode || '',
      luckyCouponCode: order.luckyCouponCode || '',
      discountAmount: order.discountAmount || 0,
      orderType: order.orderType || 'physical',
      status: order.status || 'Confirmed',
      notes: order.notes || ''
    } as any);
    setViewingOrder(null);
    setIsEditModalOpen(true);
  };

  const closeEditOrder = () => {
    setIsEditModalOpen(false);
    setEditingOrder(null);
  };

  const handleSaveOrderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsSubmitting(true);
    try {
      const discountAmount = Math.max(0, Number(editFormData.discountAmount) || 0);
      const totalPrice = calculateOrderTotal(
        Number(editFormData.price) || 0,
        Number(editFormData.quantity) || 1,
        Number(editFormData.deliveryCharge) || 0,
        discountAmount
      );

      const updatedOrder: BookOrder = {
        ...editingOrder,
        customerName: (editFormData.customerName || '').trim(),
        phone: (editFormData.phone || '').trim(),
        address: (editFormData.address || '').trim(),
        productTitle: (editFormData.productTitle || '').trim() || editingOrder.productTitle,
        price: Number(editFormData.price) || 0,
        quantity: Math.max(1, Number(editFormData.quantity) || 1),
        deliveryCharge: Number(editFormData.deliveryCharge) || 0,
        couponCode: (editFormData.couponCode || '').trim() || undefined,
        luckyCouponCode: (editFormData.luckyCouponCode || '').trim() || undefined,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        totalPrice,
        notes: (editFormData.notes || '').trim() || undefined
      };

      await onUpdateOrder(updatedOrder);
      closeEditOrder();
    } catch (err) {
      console.error('Update order error:', err);
      alert('There was a problem updating the order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.luckyCouponCode && order.luckyCouponCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.address && order.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || order.orderType === typeFilter;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, itemsPerPage]);

  // Selected orders array
  const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.id));

  // Metrics
  const totalOrders = orders.length;
  const landingCount = orders.filter(o => o.orderType === 'landing').length;
  const physicalCount = orders.filter(o => o.orderType === 'physical').length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const totalRevenue = orders
    .filter(o => o.status === 'Delivered' || o.status === 'Confirmed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + (o.totalPrice || 580), 0);

  // Handlers for Checkboxes
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (order: BookOrder, newStatus: BookOrder['status']) => {
    const updated = { ...order, status: newStatus };
    await onUpdateOrder(updated);
  };

  // Bulk Status Update Action
  const handleBulkStatusChange = (newStatus: string) => {
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order.');
      return;
    }
    setBulkStatusConfirm({ newStatus, count: selectedOrderIds.length });
  };

  const confirmBulkStatusChange = async () => {
    if (!bulkStatusConfirm) return;
    const { newStatus } = bulkStatusConfirm;
    const idsToUpdate = [...selectedOrderIds];
    setBulkStatusConfirm(null);

    for (const orderId of idsToUpdate) {
      const target = orders.find(o => o.id === orderId);
      if (target) {
        await onUpdateOrder({ ...target, status: newStatus as any });
      }
    }

    setIsActionsMenuOpen(false);
  };


  // Dispatch to Steadfast Courier
  const handleSteadfastDispatch = async (order: BookOrder) => {
    setDispatchingId(order.id);
    setOpenActionMenuOrderId(null);
    try {
      const result = await dbService.sendToSteadfastCourier(order);
      if (result.success && result.trackingCode) {
        onUpdateOrder({
          ...order,
          status: 'Shipped',
          courierProvider: 'steadfast',
          steadfastTrackingCode: result.trackingCode,
          steadfastStatus: 'In Transit'
        });
      }
      setDispatchDialog({
        orderId: order.id,
        message: result.message || 'Parcel entry has been successfully made to Steadfast Courier!',
        success: result.success
      });
    } catch (err: any) {
      console.error('Steadfast dispatch error:', err);
      setDispatchDialog({
        orderId: order.id,
        message: err?.message || 'There is a problem with courier booking',
        success: false
      });
    } finally {
      setDispatchingId(null);
    }
  };

  // Dispatch to Pathao Courier
  const handlePathaoDispatch = async (order: BookOrder) => {
    setDispatchingId(order.id);
    setOpenActionMenuOrderId(null);
    try {
      const result = await dbService.sendToPathaoCourier(order);
      if (result.success && result.consignmentId) {
        onUpdateOrder({
          ...order,
          status: 'Shipped',
          courierProvider: 'pathao',
          pathaoConsignmentId: result.consignmentId,
          pathaoTrackingCode: result.trackingCode || result.consignmentId,
          pathaoStatus: result.orderStatus || 'Pending',
          pathaoDeliveryFee: result.deliveryFee
        });
      }
      setDispatchDialog({
        orderId: order.id,
        message: result.message || `send courierE successfulBooking done! (Consignment: ${result.consignmentId})`,
        success: result.success
      });
    } catch (err: any) {
      console.error('Pathao dispatch error:', err);
      setDispatchDialog({
        orderId: order.id,
        message: err?.message || 'There is a problem with the booking of Pathao Courier',
        success: false
      });
    } finally {
      setDispatchingId(null);
    }
  };

  const handleBulkTransferToCourier = (provider: 'steadfast' | 'pathao' = 'steadfast') => {
    if (selectedOrderIds.length === 0) {
      return;
    }

    const providerName = provider === 'pathao'? 'Send it' : 'Steadfast';
    setBulkCourierConfirm({
      isOpen: true,
      provider,
      providerName,
      count: selectedOrderIds.length
    });
  };

  const handleExecuteBulkTransfer = async () => {
    const { provider, providerName } = bulkCourierConfirm;
    setBulkCourierConfirm(prev => ({ ...prev, isOpen: false }));

    let successCount = 0;
    for (const id of selectedOrderIds) {
      const target = orders.find(o => o.id === id);
      if (target) {
        try {
          if (provider === 'pathao') {
            const res = await dbService.sendToPathaoCourier(target);
            if (res.success && res.consignmentId) {
              await onUpdateOrder({
                ...target,
                status: 'Shipped',
                courierProvider: 'pathao',
                pathaoConsignmentId: res.consignmentId,
                pathaoTrackingCode: res.trackingCode || res.consignmentId,
                pathaoStatus: res.orderStatus || 'Pending',
                pathaoDeliveryFee: res.deliveryFee
              });
              successCount++;
            }
          } else {
            const res = await dbService.sendToSteadfastCourier(target);
            if (res.success && res.trackingCode) {
              await onUpdateOrder({ 
                ...target, 
                status: 'Shipped', 
                courierProvider: 'steadfast',
                steadfastTrackingCode: res.trackingCode,
                steadfastStatus: 'In Transit'
              });
              successCount++;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    setIsActionsMenuOpen(false);
  };

  const handleDeleteOrderClick = (order: BookOrder) => {
    setOpenActionMenuOrderId(null);
    setDeleteConfirmOrder(order);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteConfirmOrder) return;
    const target = deleteConfirmOrder;
    setDeleteConfirmOrder(null);
    await onDeleteOrder(target.id);
  };

  const handleSyncCourier = async () => {
    const candidates = orders.filter(order =>
      (order.steadfastTrackingCode || order.pathaoConsignmentId) && 
      (selectedOrderIds.length === 0 || selectedOrderIds.includes(order.id))
    );
    if (candidates.length === 0) {
      alert('Could not find Steadfast or Pathao tracking code to sync.');
      return;
    }

    let successCount = 0;
    for (const order of candidates) {
      try {
        if (order.pathaoConsignmentId) {
          const result = await ApiClient.getPathaoStatus(order.pathaoConsignmentId);
          const normalized = (result.status || '').toLowerCase();
          const status = normalized.includes('delivered')
            ? 'Delivered'
            : (normalized.includes('cancelled') || normalized.includes('returned'))
              ? 'Return'
              : order.status;
          await onUpdateOrder({ ...order, status, pathaoStatus: result.status });
          successCount++;
        } else if (order.steadfastTrackingCode) {
          const result = await ApiClient.getSteadfastStatus(order.steadfastTrackingCode);
          const normalized = result.status.toLowerCase();
          const status = normalized === 'delivered'
            ? 'Delivered'
            : normalized.includes('cancelled')
              ? 'Cancelled'
              : order.status;
          await onUpdateOrder({ ...order, status, steadfastStatus: result.status });
          successCount++;
        }
      } catch (error) {
        console.error(`Courier sync failed for ${order.id}:`, error);
      }
    }
    setIsActionsMenuOpen(false);
    alert(`${successCount} / ${candidates.length} T the courier Status successfulway synced।`);
  };

  // Export as Steadfast Bulk CSV Format
  const exportSteadfastCSV = () => {
    const list = selectedOrders.length > 0 ? selectedOrders : filteredOrders;
    if (list.length === 0) {
      alert('There are no orders to export.');
      return;
    }

    const headers = ['Invoice', 'Name', 'Contact', 'Address', 'Amount', 'Note'];
    const rows = list.map(o => [
      `"${o.id}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.totalPrice || (o.price * o.quantity + o.deliveryCharge)}"`,
      `"${(o.productTitle + ' x' + o.quantity).replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Steadfast_Bulk_Upload_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  // Export as Pathao Bulk CSV Format
  const exportPathaoCSV = () => {
    const list = selectedOrders.length > 0 ? selectedOrders : filteredOrders;
    if (list.length === 0) {
      alert('There are no orders to export.');
      return;
    }

    const headers = [
      'Item Type', 'Delivery Type', 'Item Quantity', 'Recipient Name', 
      'Recipient Phone', 'Recipient Address', 'Recipient City', 'Recipient Zone', 
      'Amount to Collect', 'Item Description'
    ];

    const rows = list.map(o => [
      '"PARCEL"',
      '"NORMAL"',
      `"${o.quantity || 1}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.district || 'Dhaka'}"`,
      `"${o.thana || 'Dhaka'}"`,
      `"${o.totalPrice || (o.price * o.quantity + o.deliveryCharge)}"`,
      `"${(o.productTitle + ' - ' + o.id).replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pathao_Bulk_Upload_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  // Custom Columns Export (Screenshot 5)
  const handleDownloadCustomColumnsCSV = () => {
    const list = selectedOrders.length > 0 ? selectedOrders : filteredOrders;
    if (list.length === 0) {
      alert('There are no orders to export.');
      return;
    }

    const cols = DEFAULT_EXPORT_COLUMNS.filter(c => selectedExportColumns.includes(c.id));
    const headers = cols.map(c => c.label);

    const rows = list.map(o => {
      return cols.map(c => {
        let val = '';
        switch (c.id) {
          case 'id': val = o.id; break;
          case 'customerName': val = o.customerName; break;
          case 'phone': val = o.phone; break;
          case 'address': val = o.address; break;
          case 'status': val = o.status; break;
          case 'channel': val = o.orderType; break;
          case 'shopId': val = 'SHOP-01'; break;
          case 'supplierIds': val = 'SUP-01'; break;
          case 'resellerId': val = '-'; break;
          case 'attributionId': val = '-'; break;
          case 'affiliateCode': val = o.couponCode || '-'; break;
          case 'net': val = String(o.price * o.quantity); break;
          case 'logistics': val = o.steadfastTrackingCode ? 'Steadfast' : 'Courier'; break;
          case 'logisticsCharge': val = String(o.deliveryCharge); break;
          case 'total': val = String(o.totalPrice); break;
          case 'rEarn': val = '0'; break;
          case 'resell': val = 'No'; break;
          case 'paid': val = o.paymentMethod !== 'COD' ? String(o.totalPrice) : '0'; break;
          case 'due': val = o.paymentMethod === 'COD' ? String(o.totalPrice) : '0'; break;
          case 'rDue': val = '0'; break;
          case 'profit': val = String(Math.round(o.totalPrice * 0.4)); break;
          case 'created': val = new Date(o.createdAt).toLocaleDateString('en-US'); break;
          case 'logisticsNote': val = o.notes || '-'; break;
          case 'contactName': val = o.customerName; break;
          case 'contactPhone': val = o.phone; break;
          default: val = '';
        }
        return `"${val.replace(/"/g, '""')}"`;
      });
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Orders_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportColumnsModalOpen(false);
  };

  // Open Print Mode with selected or single order
  const handleOpenPrintView = (
    mode: 'invoice' | 'stickers' | 'mini-stickers' | 'packing-slips' | 'pos-receipt' | 'pick-list' | 'check-list' | 'commercial',
    singleOrder?: BookOrder
  ) => {
    if (singleOrder) {
      setPrintOrdersList([singleOrder]);
    } else if (selectedOrders.length > 0) {
      setPrintOrdersList(selectedOrders);
    } else {
      setPrintOrdersList(filteredOrders.slice(0, 10));
    }
    setActivePrintMode(mode);
    setIsActionsMenuOpen(false);
  };

  // Real POS Order Helpers
  const openPosModal = () => {
    setPosCustomerName('');
    setPosPhone('');
    setPosAddress('Showroom Counter / Store Pickup');
    setPosOrderType('physical');
    setPosDeliveryCharge(0);
    setPosDiscount(0);
    setPosPaymentMethod('Cash');
    setPosPaymentStatus('Paid');
    setPosNotes('');
    setPosProductSearch('');

    if (catalogProducts.length > 0) {
      const p = catalogProducts[0];
      setPosSelectedItems([{
        productId: p.id,
        title: p.title,
        price: p.price,
        quantity: 1,
        coverImage: p.coverImage || (p.images && p.images[0]) || '',
        stockQuantity: p.stockQuantity ?? 100
      }]);
    } else {
      setPosSelectedItems([]);
    }
    setIsAddModalOpen(true);
  };

  const handleAddProductToPos = (prod: Product) => {
    setPosSelectedItems(prev => {
      const existing = prev.find(i => i.productId === prod.id);
      if (existing) {
        return prev.map(i => i.productId === prod.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev,
        {
          productId: prod.id,
          title: prod.title,
          price: prod.price,
          quantity: 1,
          coverImage: prod.coverImage || (prod.images && prod.images[0]) || '',
          stockQuantity: prod.stockQuantity ?? 100
        }
      ];
    });
    setPosProductSearch('');
  };

  const handleUpdateItemQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setPosSelectedItems(prev => prev.filter(i => i.productId !== productId));
    } else {
      setPosSelectedItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i));
    }
  };

  const handleUpdateItemPrice = (productId: string, newPrice: number) => {
    setPosSelectedItems(prev => prev.map(i => i.productId === productId ? { ...i, price: Math.max(0, newPrice) } : i));
  };

  const handleRemovePosItem = (productId: string) => {
    setPosSelectedItems(prev => prev.filter(i => i.productId !== productId));
  };

  const posSubtotal = posSelectedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const posTotalPayable = Math.max(0, posSubtotal + Number(posDeliveryCharge || 0) - Number(posDiscount || 0));

  // Create Real POS Order Submit
  const handleCreatePhysicalOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (posSelectedItems.length === 0) {
      alert('Please select at least one product from your catalog for this POS order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const year = new Date().getFullYear();
      const num = orders.length + 1001;
      const combinedTitle = posSelectedItems.map(i => `${i.quantity}x ${i.title}`).join(', ');
      const totalUnits = posSelectedItems.reduce((acc, i) => acc + i.quantity, 0);

      const newOrder: BookOrder = {
        id: `ORD-${year}-${num}`,
        customerName: posCustomerName.trim() || 'Walk-in Customer',
        phone: posPhone.trim() || '01000000000',
        address: posAddress.trim() || (posOrderType === 'physical' ? 'Showroom Counter / Store Pickup' : 'Dhaka Delivery'),
        productTitle: combinedTitle,
        price: posSelectedItems[0]?.price || 0,
        deliveryCharge: Number(posDeliveryCharge || 0),
        discountAmount: Number(posDiscount || 0),
        quantity: totalUnits,
        totalPrice: posTotalPayable,
        totalAmount: posTotalPayable,
        orderType: posOrderType === 'physical' ? 'physical' : 'store',
        status: posOrderType === 'physical' && posPaymentStatus === 'Paid' ? 'Delivered' : 'Confirmed',
        paymentMethod: posPaymentMethod,
        paymentStatus: posPaymentStatus,
        items: posSelectedItems.map(i => ({
          product: {
            id: i.productId,
            title: i.title,
            price: i.price,
            coverImage: i.coverImage
          } as any,
          quantity: i.quantity,
          unitPrice: i.price,
          totalPrice: i.price * i.quantity,
          title: i.title,
          image: i.coverImage
        })),
        courierProvider: '',
        courierTrackingCode: '',
        notes: posNotes.trim(),
        createdAt: new Date().toISOString()
      };

      await onAddOrder(newOrder);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Add POS order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Import Courier File CSV Parser
  const handleImportCourierCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setImportStatusMessage('No sufficient data found in CSV file.');
        return;
      }

      let updatedCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2) {
          const idOrPhone = parts[0];
          const trackingOrStatus = parts[1];

          const match = orders.find(o => o.id === idOrPhone || o.phone === idOrPhone);
          if (match) {
            await onUpdateOrder({
              ...match,
              steadfastTrackingCode: trackingOrStatus.startsWith('CID') || trackingOrStatus.startsWith('ST') 
                ? trackingOrStatus 
                : match.steadfastTrackingCode,
              status: trackingOrStatus.toLowerCase().includes('deliver') ? 'Delivered' : match.status
            });
            updatedCount++;
          }
        }
      }

      setImportStatusMessage(`${updatedCount} T order successfulway has been updated!`);
    };
    reader.readAsText(file);
  };

  // Send Bulk SMS Handler
  const handleSendBulkSms = () => {
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one recipient.');
      return;
    }
    setSendingSms(true);
    setTimeout(() => {
      setSendingSms(false);
      setIsBulkSmsModalOpen(false);
      alert(`${selectedOrderIds.length} T of order customerOn your mobile Send SMSIt has been completed!`);
    }, 1200);
  };

  // IF PRINT MODE IS ACTIVE: Render dedicated Printable Pages (Matching Screenshots 1, 2, 3)
  if (activePrintMode) {
    return (
      <div className="bg-slate-100 min-h-screen p-4 sm:p-8 font-sans">
        {/* Print Overlay Controls Bar */}
        <div className="max-w-6xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActivePrintMode(null)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to orders</span>
            </button>
            <div className="text-xs font-bold text-slate-800">
              {activePrintMode === 'invoice' && 'Tax Invoices'}
              {activePrintMode === 'stickers' && 'Order Parcel Stickers'}
              {activePrintMode === 'mini-stickers' && 'Mini Parcel Stickers'}
              {activePrintMode === 'packing-slips' && 'Packing Slips'}
              {activePrintMode === 'pos-receipt' && 'POS Thermal Receipts'}
              {activePrintMode === 'pick-list' && 'Warehouse Pick List'}
              {activePrintMode === 'check-list' && 'Order Verification Check List'}
              {activePrintMode === 'commercial' && 'Commercial / PO Documents'}
              <span className="ml-2 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px]">
                {printOrdersList.length} selected
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
            >
              Clear selection
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print {activePrintMode === 'stickers' ? 'Stickers' : 'Document'}</span>
            </button>
          </div>
        </div>

        {/* --- 1. INVOICE PRINT VIEW (Matching Reference Design) --- */}
        {activePrintMode === 'invoice' && (
          <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {printOrdersList.map((ord) => (
              <InvoicePreview 
                key={ord.id} 
                order={ord} 
                onPrintSticker={() => handleOpenPrintView('stickers', ord)}
              />
            ))}
          </div>
        )}
        {/* --- 2. THERMAL STICKER PRINT VIEW (Matching Reference Design) --- */}
        {(activePrintMode === 'stickers' || activePrintMode === 'mini-stickers' || activePrintMode === 'pos-receipt') && (
          <ThermalStickerPreview
            orders={printOrdersList}
            storeDomain={invoiceBrand.website || 'fantinebd.com'}
            onClearSelection={() => setSelectedOrderIds([])}
          />
        )}

        {/* --- 3. OTHER PRINT VIEWS (Packing Slips, Pick List, Commercial) --- */}
        {(activePrintMode === 'packing-slips' || activePrintMode === 'pick-list' || activePrintMode === 'check-list' || activePrintMode === 'commercial') && (
          <div className="max-w-3xl mx-auto space-y-6">
            {printOrdersList.map(ord => (
              <div key={ord.id} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm text-xs space-y-3 font-sans">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-extrabold text-sm text-slate-900">{activePrintMode.toUpperCase()} - {ord.id}</span>
                  <span className="font-mono font-bold text-slate-600">{ord.phone}</span>
                </div>
                <div className="space-y-1">
                  <p><strong>Customer:</strong> {ord.customerName}</p>
                  <p><strong>Address:</strong> {ord.address}</p>
                  <p><strong>Product:</strong> {ord.productTitle} × {ord.quantity}</p>
                  <p><strong>Total (COD):</strong> Tk. {ord.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD MAIN ORDER MANAGEMENT DASHBOARD VIEW ---
  if (viewingOrder) {
    return (
      <OrderDetailsView 
        order={viewingOrder} 
        onClose={() => setViewingOrder(null)} 
        onUpdateStatus={async (id, newStatus) => {
          await onUpdateOrder({ ...viewingOrder, status: newStatus });
          setViewingOrder({ ...viewingOrder, status: newStatus });
        }}
        onEditOrder={openEditOrder}
        onUpdateOrder={async (updatedOrder) => {
          await onUpdateOrder(updatedOrder);
          setViewingOrder(updatedOrder);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-teal-600" />
            <span>Orders & POS Sales</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage online orders, showroom counter POS sales, and courier shipments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={openPosModal}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Store className="h-4 w-4 mr-1.5" />
            New POS Order
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">total order</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalOrders}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block">Landing page order</span>
          <span className="text-xl sm:text-2xl font-extrabold text-indigo-600">{landingCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider block">Physical order</span>
          <span className="text-xl sm:text-2xl font-extrabold text-teal-700">{physicalCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block">Pending</span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-600">{pendingCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Estimate gross sales</span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">Tk. {totalRevenue}</span>
        </div>
      </div>

      {/* Selected Items Floating Action Toolbar */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg">
              {selectedOrderIds.length} selected
            </span>
            <span>Order selected</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Clear selection
            </button>

            {/* Print Parcel Stickers Quick Button */}
            <button
              onClick={() => handleOpenPrintView('stickers')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Stickers</span>
            </button>

            {/* Print Tax Invoices Quick Button */}
            <button
              onClick={() => handleOpenPrintView('invoice')}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Print Invoices</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Controls with Actions & Export Dropdowns */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Customer Name, Mobile or Order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold w-full md:w-auto shrink-0">
            <button 
              onClick={() => setTypeFilter('all')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              all Type
            </button>
            <button 
              onClick={() => setTypeFilter('landing')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === 'landing' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Landing ({landingCount})
            </button>
            <button 
              onClick={() => setTypeFilter('physical')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                typeFilter === 'physical' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              feeGical ({physicalCount})
            </button>
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="all">All status</option>
            <option value="Pending">waiting</option>
            <option value="Confirmed">allowed</option>
            <option value="Packaging">Packaging</option>
            <option value="Ready for Shipment">Ready for shipment</option>
            <option value="Shipped">by courier</option>
            <option value="Delivered">delivered</option>
            <option value="Hold">adjourned</option>
            <option value="Under Review">verification</option>
            <option value="Not Responding">no response</option>
            <option value="Return">return</option>
            <option value="Cancelled">canceled</option>
          </select>

          {/* BULK ACTIONS DROPDOWN BUTTON (Matching Screenshots) */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => {
                setIsActionsMenuOpen(!isActionsMenuOpen);
                setIsExportMenuOpen(false);
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-between gap-2 border border-slate-200 transition-colors cursor-pointer"
            >
              <span>Actions</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Actions Menu Popup List (Exact match for Screenshot options) */}
            {isActionsMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs font-semibold text-slate-800 space-y-1 max-h-96 overflow-y-auto animate-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Bulk Print & Docs
                </div>

                <button
                  onClick={() => handleOpenPrintView('invoice')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-slate-600" />
                  <span>Print invoices</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('packing-slips')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-slate-600" />
                  <span>Print packing slips</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('pos-receipt')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <DollarSign className="h-4 w-4 text-slate-600" />
                  <span>Print POS Receipts</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('stickers')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <Tag className="h-4 w-4 text-slate-600" />
                  <span>Print Parcel Stickers</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('mini-stickers')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <Tag className="h-4 w-4 text-slate-600" />
                  <span>Print Mini Stickers</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('pick-list')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <CheckSquare className="h-4 w-4 text-slate-600" />
                  <span>Pick List</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('check-list')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4 text-slate-600" />
                  <span>Check List</span>
                </button>

                <button
                  onClick={() => handleOpenPrintView('commercial')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-slate-600" />
                  <span>Commercial / PO Docs</span>
                </button>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 pt-2 border-t border-slate-100">
                  Courier Integration (send it Steadfast)
                </div>

                <button
                  onClick={() => handleBulkTransferToCourier('pathao')}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-800 rounded-xl flex items-center space-x-2 cursor-pointer font-bold"
                >
                  <Send className="h-4 w-4 text-red-600" />
                  <span>Send to Pathaosend</span>
                </button>

                <button
                  onClick={() => handleBulkTransferToCourier('steadfast')}
                  className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-800 rounded-xl flex items-center space-x-2 cursor-pointer font-bold"
                >
                  <Truck className="h-4 w-4 text-amber-600" />
                  <span>Send to SteadfastSteadfast</span>
                </button>

                <button
                  onClick={handleSyncCourier}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer font-semibold"
                >
                  <RefreshCw className="h-4 w-4 text-teal-600" />
                  <span>Sync courier status</span>
                </button>

                <button
                  onClick={() => {
                    setIsActionsMenuOpen(false);
                    setIsImportCourierModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-slate-600" />
                  <span>Import courier file</span>
                </button>

                <button
                  onClick={() => {
                    setIsActionsMenuOpen(false);
                    setIsBulkSmsModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                  <span>Send Bulk SMS</span>
                </button>

                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 pt-2 border-t border-slate-100">
                  Update Status
                </div>

                <button onClick={() => handleBulkStatusChange('Confirmed')} className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Mark Confirmed</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Packaging')} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-indigo-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <Package className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Mark Packaging</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Ready for Shipment')} className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-indigo-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <Truck className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Mark Ready for Shipment</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Shipped')} className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-purple-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <Truck className="h-3.5 w-3.5 text-purple-600" />
                  <span>Mark Shipping</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Delivered')} className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Mark Delivered</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Hold')} className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Mark Hold</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Under Review')} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <Search className="h-3.5 w-3.5 text-slate-600" />
                  <span>Mark Under Review</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Not Responding')} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-800 rounded-lg flex items-center space-x-2 cursor-pointer font-semibold">
                  <Phone className="h-3.5 w-3.5 text-rose-600" />
                  <span>Mark Not Responding</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Return')} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <RefreshCw className="h-3.5 w-3.5 text-rose-600" />
                  <span>Mark Return</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Cancelled')} className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-800 rounded-lg flex items-center space-x-2 cursor-pointer font-bold">
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  <span>Mark Canceled</span>
                </button>

                <button onClick={() => handleBulkStatusChange('Pending')} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-800 rounded-lg flex items-center space-x-2 cursor-pointer">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-600" />
                  <span>Reset to Placed</span>
                </button>
              </div>
            )}
          </div>

          {/* EXPORT BULK COURIER CSV BUTTON */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => {
                setIsExportMenuOpen(!isExportMenuOpen);
                setIsActionsMenuOpen(false);
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-between gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Courier Bulk CSV</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs font-semibold text-slate-800 space-y-1 animate-in zoom-in-95 duration-150">
                <button
                  onClick={exportSteadfastCSV}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-900 rounded-xl flex items-center space-x-2 cursor-pointer font-bold"
                >
                  <Download className="h-4 w-4 text-emerald-600" />
                  <span>Steadfast Bulk Upload CSV</span>
                </button>

                <button
                  onClick={exportPathaoCSV}
                  className="w-full text-left px-3 py-2 hover:bg-teal-50 text-teal-900 rounded-xl flex items-center space-x-2 cursor-pointer font-bold"
                >
                  <Download className="h-4 w-4 text-teal-600" />
                  <span>Pathao Courier Bulk CSV</span>
                </button>

                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    setIsExportColumnsModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center space-x-2 cursor-pointer border-t border-slate-100"
                >
                  <FileSpreadsheet className="h-4 w-4 text-slate-600" />
                  <span>Custom Columns Export (CSV/Excel)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-visible">
        <div className="overflow-visible min-h-[300px] pb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer h-4 w-4"
                  />
                </th>
                <th className="py-3.5 px-3 text-center w-12 font-bold text-slate-400">SL</th>
                <th className="py-3.5 px-4">ORDER & ITEMS</th>
                <th className="py-3.5 px-4">CUSTOMER</th>
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    <span>FULFILMENT</span>
                    <span className="text-[10px] text-slate-400 lowercase font-medium">⇅ Priority</span>
                  </div>
                </th>
                <th className="py-3.5 px-4">PAYMENT</th>
                <th className="py-3.5 px-4">DELIVERY</th>
                <th className="py-3.5 px-4">PROFIT</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                    No orders found।
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, idx) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const serialNo = (currentPage - 1) * itemsPerPage + idx + 1;
                  const totalAmt = order.totalAmount || order.totalPrice || ((order.price || 0) * (order.quantity || 1) + (order.deliveryCharge || 0));
                  const isPaid = order.paymentStatus === 'Paid' || (order.paymentMethod && order.paymentMethod !== 'COD' && order.paymentMethod !== 'Cash on Delivery');
                  const dueAmt = isPaid ? 0 : totalAmt;
                  const isPhysicalOrder = order.orderType === 'physical';
                  const hasRealCourier = Boolean(order.courierTrackingCode || order.pathaoConsignmentId || order.steadfastTrackingCode || (order.courierProvider && order.courierProvider !== 'Pathao (inactive)'));
                  const courierName = order.courierProvider ? (order.courierProvider.toLowerCase() === 'pathao' ? 'Pathao' : order.courierProvider.toLowerCase() === 'steadfast' ? 'Steadfast' : order.courierProvider) : (order.pathaoConsignmentId ? 'Pathao' : order.steadfastTrackingCode ? 'Steadfast' : null);
                  const trackingCode = order.courierTrackingCode || order.pathaoConsignmentId || order.steadfastTrackingCode || null;
                  const profitAmt = (order.profit !== undefined && order.profit !== null && order.profit !== '') ? Number(order.profit) : null;
                  
                  const isOver24h = (() => {
                    try {
                      return (Date.now() - new Date(order.createdAt).getTime()) >= 24 * 60 * 60 * 1000;
                    } catch {
                      return false;
                    }
                  })();

                  const primaryTitle = order.productTitle || order.items?.[0]?.product?.title || order.items?.[0]?.title || 'Product';
                  const primaryQty = order.items?.[0]?.quantity || order.quantity || 1;
                  const extraItemsCount = order.items && order.items.length > 1 ? order.items.length - 1 : 0;

                  return (
                    <tr 
                      key={order.id} 
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button, input, select, a, svg')) return;
                        setViewingOrder(order);
                      }}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${isSelected ? 'bg-teal-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOrder(order.id)}
                          className="rounded-full border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer h-4 w-4"
                        />
                      </td>

                      {/* SL # */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-slate-500 text-xs font-mono">
                          {serialNo}
                        </span>
                      </td>

                      {/* ORDER & ITEMS */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs font-mono">#{order.id.replace('ORD-', '')}</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(order.id.replace('ORD-', ''));
                                setCopiedId(order.id);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              title="Copy order ID"
                              className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            >
                              {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                              <Globe className="w-3 h-3 text-sky-500" />
                              Customer
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800 line-clamp-1">
                            <span>{primaryQty}x {primaryTitle}</span>
                            {extraItemsCount > 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                +{extraItemsCount} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-bold font-mono text-slate-900">
                              ৳ {Number(totalAmt).toFixed(2)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}>
                              {isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {formatShortDate(order.createdAt)} · {formatRelativeTime(order.createdAt)}
                            </span>
                          </div>

                          {order.notes && order.notes.trim() ? (
                            <div className="pt-0.5">
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] text-slate-600 max-w-xs">
                                <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">Note: {order.notes.trim()}</span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="space-y-1.5">
                          <div className="font-bold text-slate-900 text-xs">
                            {order.customerName}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-mono font-medium text-slate-700">{order.phone}</span>
                            <a
                              href={formatWhatsAppLink(order.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-2.5 h-2.5" /> WA
                            </a>
                            <a
                              href={formatTelegramLink(order.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                              title="Telegram"
                            >
                              <Send className="w-2.5 h-2.5" /> TG
                            </a>
                            <a
                              href={`tel:${order.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
                              title="Call"
                            >
                              <Phone className="w-2.5 h-2.5" /> Call
                            </a>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <span className="truncate max-w-[170px]" title={order.address}>
                              {order.address}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPrintView('invoice', order);
                              }}
                              title="Print slip / invoice"
                              className="inline-flex items-center gap-0.5 text-slate-500 hover:text-slate-800 transition-colors shrink-0 font-medium"
                            >
                              <FileText className="w-3 h-3 text-slate-400" /> Slip
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* FULFILMENT */}
                      <td className="py-3.5 px-4 min-w-[150px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : order.status === 'Packaging'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-sky-50 text-sky-700 border border-sky-200'
                            }`}>
                              {order.status || 'Confirmed'}
                            </span>
                            {order.status !== 'Delivered' && (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await onUpdateOrder({ ...order, status: 'Packaging' });
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                                title="Mark Packaging"
                              >
                                <Package className="w-3 h-3" /> Pack
                              </button>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {formatRelativeTime(order.createdAt)}
                          </div>
                          {isOver24h && (
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                                Over 24h idle
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* PAYMENT */}
                      <td className="py-3.5 px-4 min-w-[120px]">
                        <div className="space-y-1">
                          <div className="font-mono font-bold text-slate-900 text-sm">
                            ৳ {Number(totalAmt).toFixed(2)}
                          </div>
                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border-rose-200'
                            }`}>
                              {isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            Due ৳ {Number(dueAmt).toFixed(2)}
                          </div>
                        </div>
                      </td>

                      {/* DELIVERY */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        {isPhysicalOrder ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Store className="h-3 w-3" />
                              Showroom POS
                            </span>
                            <div className="text-[10px] text-slate-400">Direct Pickup</div>
                          </div>
                        ) : hasRealCourier ? (
                          <div className="space-y-0.5">
                            <div className="text-xs font-semibold text-slate-800">
                              {courierName || 'Courier'}
                            </div>
                            <div className="text-xs font-mono text-slate-500 truncate max-w-[120px]" title={trackingCode || ''}>
                              #{trackingCode}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              Standard Delivery
                            </span>
                            <div className="text-[10px] text-slate-400">Not Dispatched</div>
                          </div>
                        )}
                      </td>

                      {/* PROFIT */}
                      <td className="py-3.5 px-4 min-w-[90px]">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {profitAmt !== null ? `৳ ${profitAmt.toFixed(2)}` : '—'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="relative inline-flex items-center justify-end" data-order-actions>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuOrderId(prev => prev === order.id ? null : order.id);
                            }}
                            title="Order actions"
                            aria-haspopup="menu"
                            aria-expanded={openActionMenuOrderId === order.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          <AnimatePresence>
                            {openActionMenuOrderId === order.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.14 }}
                                className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl text-left"
                              >
                                <button
                                  type="button"
                                  onClick={() => handlePathaoDispatch(order)}
                                  disabled={dispatchingId === order.id || Boolean(order.pathaoConsignmentId)}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Send className="h-4 w-4 text-red-600" />
                                  <span>{dispatchingId === order.id ? 'Booking...' : 'Send to Pathao'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSteadfastDispatch(order)}
                                  disabled={dispatchingId === order.id || Boolean(order.steadfastTrackingCode)}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Send className="h-4 w-4 text-amber-600" />
                                  <span>{dispatchingId === order.id ? 'Booking...' : 'Send to Steadfast'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuOrderId(null);
                                    handleOpenPrintView('invoice', order);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <Printer className="h-4 w-4" />
                                  <span>Print invoice</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuOrderId(null);
                                    handleOpenPrintView('stickers', order);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <Tag className="h-4 w-4 text-slate-600" />
                                  <span>Print sticker</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuOrderId(null);
                                    openEditOrder(order);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrderClick(order)}
                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination & Rows Toolbar (media_1792911210063_a9541798.png) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 bg-white border-t border-slate-200 rounded-b-2xl">
          {/* Left: Pages/Cursor toggle, Rows dropdown, Range */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Pages / Cursor Mode Toggle */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaginationMode('pages')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  paginationMode === 'pages'
                    ? 'bg-[#093526] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pages
              </button>
              <button
                type="button"
                onClick={() => setPaginationMode('cursor')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  paginationMode === 'cursor'
                    ? 'bg-[#093526] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cursor
              </button>
            </div>

            {/* Rows Dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>Rows</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-teal-600 cursor-pointer appearance-none"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Range text */}
            <div className="text-xs font-medium text-slate-600">
              {filteredOrders.length === 0
                ? '0 of 0'
                : `${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length}`}
            </div>
          </div>

          {/* Right: Prev, numbered buttons, Next */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            >
              Prev
            </button>
            {getPageNumbers(currentPage, Math.max(1, totalPages)).map((p, idx) => (
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 font-bold select-none">...</span>
              ) : (
                <button
                  type="button"
                  key={`page-${p}`}
                  onClick={() => setCurrentPage(Number(p))}
                  className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === p
                      ? 'bg-[#093526] text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              )
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {dispatchDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className={`px-5 py-4 flex items-start gap-3 ${dispatchDialog.success ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${dispatchDialog.success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {dispatchDialog.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Steadfast</p>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    {dispatchDialog.success ? 'Parcel entry completed' : 'Parcel entry failed'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {dispatchDialog.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDispatchDialog(null)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-white/80 hover:text-slate-900 transition-colors"
                  aria-label="Close dialog"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 py-4 flex justify-end bg-white">
                <button
                  type="button"
                  onClick={() => setDispatchDialog(null)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold text-white ${dispatchDialog.success ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                >
                  ok
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmOrder && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-4 flex items-start gap-3 bg-rose-50">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Delete order</p>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    This is the orderT want to delete?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    <span className="font-semibold text-slate-900">{deleteConfirmOrder.customerName}</span>
                    {' '}({deleteConfirmOrder.id}) orderT will be permanently deleted।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOrder(null)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-white/80 hover:text-slate-900 transition-colors"
                  aria-label="Close dialog"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 py-4 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOrder(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteOrder}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bulkStatusConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-4 flex items-start gap-3 bg-indigo-50">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Update Status</p>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    Status Update make sure
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Are you sure that is selected <span className="font-semibold text-slate-900">{bulkStatusConfirm.count}</span> Order Status "<span className="font-semibold text-slate-900">{bulkStatusConfirm.newStatus}</span>" want to do?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBulkStatusConfirm(null)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-white/80 hover:text-slate-900 transition-colors"
                  aria-label="Close dialog"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 py-4 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setBulkStatusConfirm(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmBulkStatusChange}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EXPORT COLUMNS MODAL (Exact match for Screenshot 5) --- */}
      {isExportColumnsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Export columns</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the fields included in CSV or Excel downloads.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedExportColumns(DEFAULT_EXPORT_COLUMNS.map(c => c.id))}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExportColumns(['id', 'customerName', 'phone', 'address', 'total', 'status'])}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Compact
                </button>
                <button 
                  onClick={() => setIsExportColumnsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 ml-2"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Grid of Checkboxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-800 max-h-72 overflow-y-auto pr-1">
              {DEFAULT_EXPORT_COLUMNS.map((col) => {
                const isChecked = selectedExportColumns.includes(col.id);
                return (
                  <label key={col.id} className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setSelectedExportColumns(selectedExportColumns.filter(i => i !== col.id));
                        } else {
                          setSelectedExportColumns([...selectedExportColumns, col.id]);
                        }
                      }}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <span>{col.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsExportColumnsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                canceled
              </button>
              <button
                type="button"
                onClick={handleDownloadCustomColumnsCSV}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download CSV / Excel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IMPORT COURIER FILE MODAL --- */}
      {isImportCourierModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Import Courier file</h3>
              <button onClick={() => setIsImportCourierModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Providing courier services CSV Upload the file। In the first column in the file Order ID And In the second column Tracking ID will have to stay।
            </p>

            <div className="border-2 border-dashed border-slate-300 p-6 rounded-2xl text-center bg-slate-50 space-y-3">
              <Upload className="h-8 w-8 mx-auto text-slate-400" />
              <div className="text-xs font-bold text-slate-700">
                CSV Select the file
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCourierCsv}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
              />
            </div>

            {importStatusMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center">
                {importStatusMessage}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsImportCourierModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                turn off
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SEND BULK SMS MODAL --- */}
      {isBulkSmsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">the bulk SMS{selectedOrderIds.length} John</h3>
              </div>
              <button onClick={() => setIsBulkSmsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMS message text</label>
              <textarea
                rows={4}
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsBulkSmsModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                canceled
              </button>
              <button
                type="button"
                disabled={sendingSms}
                onClick={handleSendBulkSms}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                <span>{sendingSms? 'Sending...' : 'Send SMS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real POS Order Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-slate-100 px-6 py-4 bg-white shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Showroom POS & Direct Sale</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        Point of Sale
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Create counter orders from real store inventory</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreatePhysicalOrder} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Product Selection & Cart (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Catalog Product Search & Picker */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-teal-600" />
                          <span>Select Store Product</span>
                        </label>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {catalogProducts.length} items available
                        </span>
                      </div>

                      {/* Search bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={posProductSearch}
                          onChange={(e) => setPosProductSearch(e.target.value)}
                          placeholder="Search product by title..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                        />
                      </div>

                      {/* Products Quick Picker Grid */}
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                        {catalogProducts
                          .filter(p => !posProductSearch.trim() || p.title.toLowerCase().includes(posProductSearch.toLowerCase()))
                          .map((prod) => {
                            const isAdded = posSelectedItems.some(i => i.productId === prod.id);
                            return (
                              <div 
                                key={prod.id} 
                                className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-200"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {prod.coverImage || (prod.images && prod.images[0]) ? (
                                    <img 
                                      src={prod.coverImage || prod.images?.[0]} 
                                      alt={prod.title} 
                                      className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-white" 
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                                      <Package className="h-4 w-4" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{prod.title}</p>
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="font-bold text-teal-700">৳ {prod.price.toLocaleString()}</span>
                                      <span className="text-slate-400">·</span>
                                      <span className="text-slate-500">Stock: {prod.stockQuantity ?? 100}</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAddProductToPos(prod)}
                                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                    isAdded 
                                      ? 'bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100'
                                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-xs'
                                  }`}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>{isAdded ? 'Add More' : 'Add'}</span>
                                </button>
                              </div>
                            );
                          })}
                        {catalogProducts.filter(p => !posProductSearch.trim() || p.title.toLowerCase().includes(posProductSearch.toLowerCase())).length === 0 && (
                          <div className="text-center py-4 text-xs text-slate-400">
                            No matching products found.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected Products in Cart */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ShoppingCart className="h-4 w-4 text-teal-600" />
                          <span>Order Items ({posSelectedItems.length})</span>
                        </label>
                        {posSelectedItems.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setPosSelectedItems([])}
                            className="text-[11px] font-semibold text-rose-500 hover:text-rose-700"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      {posSelectedItems.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                          <ShoppingBag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs text-slate-600 font-bold">No products selected yet</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add" on any product from the catalog above</p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white">
                          {posSelectedItems.map((item) => (
                            <div key={item.productId} className="p-3 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                {item.coverImage ? (
                                  <img 
                                    src={item.coverImage} 
                                    alt={item.title} 
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-white" 
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                                    <Package className="h-4 w-4" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] text-slate-500">Unit: ৳</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={item.price}
                                      onChange={(e) => handleUpdateItemPrice(item.productId, Number(e.target.value))}
                                      className="w-16 px-1.5 py-0.5 text-xs font-bold border border-slate-200 rounded bg-slate-50 text-slate-800 focus:bg-white"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Stepper & Subtotal */}
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateItemQty(item.productId, item.quantity - 1)}
                                    className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800 min-w-7 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateItemQty(item.productId, item.quantity + 1)}
                                    className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                <div className="text-right min-w-16">
                                  <span className="text-xs font-black text-slate-900">
                                    ৳ {(item.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemovePosItem(item.productId)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Customer & Payment Details (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Customer Info Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="h-4 w-4 text-teal-600" />
                        <span>Customer & Sale Details</span>
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Customer Name</label>
                        <input
                          type="text"
                          value={posCustomerName}
                          onChange={(e) => setPosCustomerName(e.target.value)}
                          placeholder="Walk-in Customer (or Name)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={posPhone}
                            onChange={(e) => setPosPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Sale Channel</label>
                          <select
                            value={posOrderType}
                            onChange={(e) => {
                              const val = e.target.value as 'physical' | 'delivery';
                              setPosOrderType(val);
                              if (val === 'delivery') {
                                setPosDeliveryCharge(prev => prev === 0 ? 60 : prev);
                                if (posAddress === 'Showroom Counter / Store Pickup') setPosAddress('');
                              } else {
                                setPosDeliveryCharge(0);
                                if (!posAddress) setPosAddress('Showroom Counter / Store Pickup');
                              }
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                          >
                            <option value="physical">Showroom POS</option>
                            <option value="delivery">Courier Delivery</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Address / Pickup Counter</label>
                        <input
                          type="text"
                          value={posAddress}
                          onChange={(e) => setPosAddress(e.target.value)}
                          placeholder="Showroom Counter / Store Pickup"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4 text-teal-600" />
                        <span>Payment & Billing</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Method</label>
                          <select
                            value={posPaymentMethod}
                            onChange={(e) => setPosPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                          >
                            <option value="Cash">Cash (Counter)</option>
                            <option value="bKash">bKash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Card / POS">Card / POS Terminal</option>
                            <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Status</label>
                          <select
                            value={posPaymentStatus}
                            onChange={(e) => setPosPaymentStatus(e.target.value as 'Paid' | 'Unpaid')}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                          >
                            <option value="Paid">Paid (Instant)</option>
                            <option value="Unpaid">Unpaid / Due</option>
                          </select>
                        </div>
                      </div>

                      {/* Delivery Charge & Discount */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Delivery Charge (৳)</label>
                          <input
                            type="number"
                            min={0}
                            value={posDeliveryCharge}
                            onChange={(e) => setPosDeliveryCharge(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Discount (৳)</label>
                          <input
                            type="number"
                            min={0}
                            value={posDiscount}
                            onChange={(e) => setPosDiscount(Math.max(0, Number(e.target.value)))}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Order Note (Optional)</label>
                        <input
                          type="text"
                          value={posNotes}
                          onChange={(e) => setPosNotes(e.target.value)}
                          placeholder="Showroom counter receipt note..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                        />
                      </div>
                    </div>

                    {/* Summary Calculation Box */}
                    <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-slate-800">৳ {posSubtotal.toLocaleString()}</span>
                      </div>
                      {posDeliveryCharge > 0 && (
                        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                          <span>Delivery Fee:</span>
                          <span className="font-bold text-slate-800">+ ৳ {posDeliveryCharge.toLocaleString()}</span>
                        </div>
                      )}
                      {posDiscount > 0 && (
                        <div className="flex justify-between items-center text-xs font-medium text-emerald-700">
                          <span>Discount Applied:</span>
                          <span className="font-bold">- ৳ {posDiscount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-teal-200/80 pt-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">Total Payable:</span>
                        <span className="text-lg font-black text-teal-800">৳ {posTotalPayable.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || posSelectedItems.length === 0}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{isSubmitting ? 'Creating Order...' : `Complete POS Order · ৳ ${posTotalPayable.toLocaleString()}`}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Order Modal */}


      <AnimatePresence>
        {isEditModalOpen && editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
            >
              <div className="flex justify-between items-center border-b border-slate-100 p-5 bg-white shrink-0 sticky top-0 z-10">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Edit3 className="h-5 w-5 text-teal-600" />
                    <span>Edit the order</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Order ID: <span className="font-mono font-bold text-slate-700">{editingOrder.id}</span>
                  </p>
                </div>
                <button onClick={closeEditOrder} className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOrderEdit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.customerName}
                      onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Name / Title</label>
                  <input
                    type="text"
                    value={editFormData.productTitle}
                    onChange={(e) => setEditFormData({ ...editFormData, productTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tk.</label>
                    <input
                      type="number"
                      min={0}
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Amount</label>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.quantity}
                      onChange={(e) => setEditFormData({ ...editFormData, quantity: Math.max(1, Number(e.target.value)) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tk.</label>
                    <input
                      type="number"
                      min={0}
                      value={editFormData.deliveryCharge}
                      onChange={(e) => setEditFormData({ ...editFormData, deliveryCharge: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tk.</label>
                    <input
                      type="number"
                      min={0}
                      value={editFormData.discountAmount}
                      onChange={(e) => setEditFormData({ ...editFormData, discountAmount: Math.max(0, Number(e.target.value)) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Discount code</label>
                    <input
                      type="text"
                      value={editFormData.couponCode}
                      onChange={(e) => setEditFormData({ ...editFormData, couponCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono uppercase"
                      placeholder="e.g. SAVE100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-800 mb-1">🎟️ Lucky Draw Coupon</label>
                    <input
                      type="text"
                      value={editFormData.luckyCouponCode}
                      onChange={(e) => setEditFormData({ ...editFormData, luckyCouponCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-amber-300 bg-amber-50/50 rounded-xl text-xs font-bold text-amber-900 font-mono uppercase"
                      placeholder="e.g. R15-123456"
                    />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                    <div className="text-[11px] text-slate-500 font-bold">New Total Rs</div>
                    <div className="text-lg font-black text-teal-700">
                      Tk. {calculateOrderTotal(
                        Number(editFormData.price) || 0,
                        Number(editFormData.quantity) || 1,
                        Number(editFormData.deliveryCharge) || 0,
                        Number(editFormData.discountAmount) || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note</label>
                  <textarea
                    rows={2}
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeEditOrder}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    canceled
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Update the order'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* Bulk Courier Transfer Confirm Dialog */}
      <ConfirmDialog
        isOpen={bulkCourierConfirm.isOpen}
        type="info"
        title="Do courier bookings?"
        message={`Are you sure that is selected ${bulkCourierConfirm.count} T order ${bulkCourierConfirm.providerName} by courier Want to make a booking?`}
        confirmText="Yes, make a booking"
        cancelText="canceled"
        onConfirm={handleExecuteBulkTransfer}
        onClose={() => setBulkCourierConfirm(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
