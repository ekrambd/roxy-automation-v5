import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, Package, RefreshCw, ShoppingBag, Truck, Calendar, 
  MapPin, AlertCircle, Edit3, FileText, FileSpreadsheet, AlertTriangle, 
  Ban, Globe, Smartphone, Monitor, User, ChevronUp, ChevronDown, Check, Copy, Phone,
  PauseCircle, XCircle, ArrowRight, Printer, History, Send, Tag, Clock
} from 'lucide-react';
import { BookOrder } from '../types';
import { InvoicePreview } from './InvoicePreview';
import { ThermalStickerPreview } from './ThermalStickerPreview';
import { motion } from 'motion/react';

interface Props {
  order: BookOrder;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
  onEditOrder: (order: BookOrder) => void;
  onUpdateOrder?: (updatedOrder: BookOrder) => Promise<void>;
}

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Packaging',
  'Ready for Shipment',
  'Shipped',
  'Delivered',
  'Return',
  'Cancelled'
];

const LIFECYCLE_STEPS = [
  { key: 'Pending', label: 'Pending', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'Packaging', label: 'Packaging', icon: Package },
  { key: 'Ready for Shipment', label: 'Shipment', icon: Send },
  { key: 'Shipped', label: 'Shipping', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Check }
];

const getStatusIndex = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 5;
  if (s === 'shipped') return 4;
  if (s === 'ready for shipment') return 3;
  if (s === 'packaging') return 2;
  if (s === 'confirmed') return 1;
  if (s === 'pending') return 0;
  return 1;
};

const getProgressPercentage = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 100;
  if (s === 'shipped') return 80;
  if (s === 'ready for shipment') return 65;
  if (s === 'packaging') return 50;
  if (s === 'confirmed') return 35;
  if (s === 'pending') return 15;
  if (s === 'hold') return 30;
  return 0;
};

const getNextStepInfo = (status: string, onUpdateStatus: (id: string, s: string) => Promise<void>, orderId: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') {
    return {
      title: 'Order Completed & Fulfilled',
      desc: 'Customer received the parcel. Payment and fulfillment finalized.',
      btnText: 'Fulfilled ✓',
      btnIcon: CheckCircle,
      isCompleted: true,
      action: undefined as (() => void) | undefined
    };
  }
  if (s === 'shipped') {
    return {
      title: 'Order is currently in transit',
      desc: 'Package is on the way to customer address. Confirm upon delivery.',
      btnText: 'Confirm Delivery',
      btnIcon: Check,
      isCompleted: false,
      action: () => { onUpdateStatus(orderId, 'Delivered'); }
    };
  }
  if (s === 'ready for shipment') {
    return {
      title: 'Awaiting courier handover',
      desc: 'Handover package to Steadfast/Pathao courier rider.',
      btnText: 'Hand Over to Courier',
      btnIcon: Truck,
      isCompleted: false,
      action: () => { onUpdateStatus(orderId, 'Shipped'); }
    };
  }
  if (s === 'packaging') {
    return {
      title: 'Parcel packaging in progress',
      desc: 'Generate courier waybill and mark ready for shipping dispatch.',
      btnText: 'Ready for Shipment',
      btnIcon: Send,
      isCompleted: false,
      action: () => { onUpdateStatus(orderId, 'Ready for Shipment'); }
    };
  }
  if (s === 'pending') {
    return {
      title: 'Review and confirm customer order',
      desc: 'Verify customer contact details and advance order to confirmed status.',
      btnText: 'Confirm Order',
      btnIcon: CheckCircle,
      isCompleted: false,
      action: () => { onUpdateStatus(orderId, 'Confirmed'); }
    };
  }
  return {
    title: 'Move confirmed lines into packing',
    desc: 'Move items to warehouse packing station to prepare parcels.',
    btnText: 'Start Packaging',
    btnIcon: Package,
    isCompleted: false,
    action: () => { onUpdateStatus(orderId, 'Packaging'); }
  };
};

export function OrderDetailsView({ order, onClose, onUpdateStatus, onEditOrder, onUpdateOrder }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Quick edit & Fraud block states matching design
  const [isFraudOpen, setIsFraudOpen] = useState(true);
  const [isMorePricingOpen, setIsMorePricingOpen] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState<number | string>(order.deliveryCharge ?? 60);
  const [discount, setDiscount] = useState<number | string>(order.couponDiscount || order.discountAmount || 0);
  const [extraDelivery, setExtraDelivery] = useState<number | string>(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSavingQuickEdit, setIsSavingQuickEdit] = useState(false);
  const [quickEditSaved, setQuickEditSaved] = useState(false);
  const [blockedItems, setBlockedItems] = useState<{ [key: string]: boolean }>({});
  const [allBlocked, setAllBlocked] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-more-actions]')) {
        setIsMoreActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleCopy = async (text: string, field: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const toggleBlock = (key: string) => {
    setBlockedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBlockAll = () => {
    const next = !allBlocked;
    setAllBlocked(next);
    setBlockedItems({
      ip: next,
      device: next,
      phone: next,
      account: next
    });
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
      setDiscount(50);
    }
  };

  const handleSaveQuickEdit = async () => {
    if (!onUpdateOrder) return;
    setIsSavingQuickEdit(true);
    try {
      const numDelivery = Number(deliveryCharge) || 0;
      const numDiscount = Number(discount) || 0;
      const numExtra = Number(extraDelivery) || 0;
      const finalGrandTotal = Math.max(0, Number(baseSubtotal) + numDelivery + numExtra - numDiscount);
      
      const updated: BookOrder = {
        ...order,
        deliveryCharge: numDelivery + numExtra,
        couponDiscount: numDiscount,
        discountAmount: numDiscount,
        totalAmount: finalGrandTotal,
        totalPrice: finalGrandTotal,
        couponCode: couponCode ? couponCode.trim() : order.couponCode
      };
      
      await onUpdateOrder(updated);
      setQuickEditSaved(true);
      setTimeout(() => setQuickEditSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update quick edit:', err);
    } finally {
      setIsSavingQuickEdit(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, e.target.value);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStepProgress = () => {
    const s = order.status || 'Pending';
    if (['Cancelled', 'Return', 'Hold', 'Not Responding', 'Under Review'].includes(s)) return 0;
    if (s === 'Pending') return 1;
    if (s === 'Confirmed') return 2;
    if (s === 'Packaging' || s === 'Ready for Shipment') return 3;
    if (s === 'Shipped') return 4;
    if (s === 'Delivered') return 5;
    return 1;
  };

  const currentStep = getStepProgress();
  const currentIdx = getStatusIndex(order.status || 'Confirmed');
  const progressPct = getProgressPercentage(order.status || 'Confirmed');
  const nextInfo = getNextStepInfo(order.status || 'Confirmed', onUpdateStatus, order.id);

  const steps = [
    { label: 'Confirm Order', icon: ShoppingBag, step: 2 },
    { label: 'Processing Order', icon: RefreshCw, step: 3 },
    { label: 'Product Dispatched', icon: Package, step: 4 },
    { label: 'On Delivery', icon: Truck, step: 4 },
    { label: 'Delivery Completed', icon: CheckCircle, step: 5 },
  ];

  const formatDate = (d?: string) => {
    if (!d) return 'N/A';
    try {
      return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));
    } catch {
      return d;
    }
  };

  const baseSubtotal = Number(order.totalPrice || order.totalAmount) > 0
    ? Math.max(0, (Number(order.totalPrice || order.totalAmount) - (Number(order.deliveryCharge) || 0) + (Number(order.couponDiscount || order.discountAmount) || 0)))
    : ((Number(order.price) || 0) * (Number(order.quantity) || 1));
  const currentTotal = Math.max(0, Number(baseSubtotal) + Number(deliveryCharge || 0) + Number(extraDelivery || 0) - Number(discount || 0));

  return (
    <div className="flex-1 min-h-screen bg-slate-50 font-sans p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-xs border border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Orders Details</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowInvoice(!showInvoice);
              if (!showInvoice) setShowSticker(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {showInvoice ? 'View Details' : 'View Invoice'}
          </button>
          <button
            onClick={() => {
              setShowSticker(!showSticker);
              if (!showSticker) setShowInvoice(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-sm font-bold border border-teal-200 transition-colors cursor-pointer"
          >
            <Tag className="w-4 h-4 text-teal-600" />
            {showSticker ? 'View Details' : 'Print Sticker'}
          </button>
          <button
            onClick={() => onEditOrder(order)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-bold border border-amber-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <a 
            href="/" 
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-500" />
            Visit Site
          </a>
        </div>
      </div>

      {showInvoice ? (
        <InvoicePreview 
          order={order} 
          onPrintSticker={() => {
            setShowInvoice(false);
            setShowSticker(true);
          }}
        />
      ) : showSticker ? (
        <ThermalStickerPreview orders={[order]} storeDomain="fantinebd.com" />
      ) : (
        <>
          {/* ORDER PROGRESS Card (media_1792910274190_00e7a775.png) */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6 mb-6">
        {/* Section Group Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            SECTION 1 · LIFECYCLE & DISPATCH
          </span>
        </div>

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
            </div>
            <span className="text-xs font-black text-slate-700 tracking-wider uppercase">ORDER PROGRESS</span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/60">
              {order.status || 'Confirmed'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-900">
              Progress {progressPct}%
            </span>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#093526] rounded-full transition-all duration-300" 
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          {order.status === 'Delivered'
            ? 'Customer received and confirmed order delivery.'
            : order.status === 'Shipped'
            ? 'Parcel dispatched and in transit with courier.'
            : order.status === 'Packaging'
            ? 'Items currently being packed in warehouse.'
            : order.status === 'Pending'
            ? 'New order placed, awaiting review and confirmation.'
            : 'Customer and order details are confirmed.'}
        </p>

        {/* Progress Stepper Bar */}
        <div className="flex items-center overflow-x-auto pb-4 gap-2 text-xs">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = currentIdx > idx || (currentIdx === idx && idx === LIFECYCLE_STEPS.length - 1);
            const isActive = currentIdx === idx && idx !== LIFECYCLE_STEPS.length - 1;
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.key}>
                {idx > 0 && (
                  <div className={`h-0.5 w-8 shrink-0 transition-colors ${currentIdx >= idx ? 'bg-[#093526]' : 'bg-slate-200'}`} />
                )}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-700 text-emerald-700 flex items-center justify-center bg-white shadow-2xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center bg-slate-50">
                      <StepIcon className="w-3 h-3" />
                    </div>
                  )}
                  <span className={`text-xs ${isActive ? 'font-black text-emerald-950' : isCompleted ? 'font-bold text-slate-900' : 'font-medium text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Recommended next step box */}
        {(() => {
          const NextIcon = nextInfo.btnIcon;
          return (
            <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 transition-all ${
              nextInfo.isCompleted 
                ? 'bg-emerald-50/70 border-emerald-200' 
                : 'bg-slate-50/70 border-slate-200/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                  nextInfo.isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {nextInfo.isCompleted ? '✓' : Math.min(5, currentIdx + 1)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{nextInfo.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{nextInfo.desc}</p>
                </div>
              </div>
              {nextInfo.action ? (
                <button
                  type="button"
                  onClick={nextInfo.action}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-sm px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer transition-colors shrink-0"
                >
                  <NextIcon className="w-4 h-4 text-slate-700" />
                  <span>{nextInfo.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{nextInfo.btnText}</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* More actions dropdown & Print bar */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <div className="relative" data-more-actions>
            <button
              type="button"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>••• More actions</span>
            </button>

            {isMoreActionsOpen && (
              <div className="absolute left-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 z-50 w-40 bg-white border border-slate-200 rounded-xl shadow-xl p-1 text-left animate-fadeIn">
                <button
                  type="button"
                  onClick={async () => {
                    await onUpdateStatus(order.id, 'Hold');
                    setIsMoreActionsOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors cursor-pointer"
                >
                  <PauseCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Hold</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await onUpdateStatus(order.id, 'Cancelled');
                    setIsMoreActionsOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl shadow-2xs cursor-pointer transition-colors"
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: Invoice Preview & Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 2: BILLING & INVOICE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                SECTION 2 · BILLING & INVOICE
              </span>
              <span className="text-xs text-slate-400 font-medium">Official Print-Ready Document</span>
            </div>
            <InvoicePreview order={order} />
          </div>

          {/* SECTION 3: ORDERED ITEMS & BREAKDOWN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                SECTION 3 · ORDERED ITEMS & BREAKDOWN
              </span>
              <span className="text-xs text-slate-400 font-medium font-mono">
                {order.items?.length || 1} Item{(order.items?.length || 1) > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-black text-slate-500 uppercase">
                    <th className="pb-4 font-semibold">Product</th>
                    <th className="pb-4 font-semibold text-center">Unit Price</th>
                    <th className="pb-4 font-semibold text-center">Quantity</th>
                    <th className="pb-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item: any, idx: number) => {
                      const itemTitle = item.product?.title || item.title || order.productTitle || 'Product';
                      const itemImg = item.variant?.image || item.product?.image || item.image || item.productImage;
                      const itemQty = Number(item.quantity) || 1;
                      const itemUnitPrice = Number(item.variant?.price || item.product?.price || item.price || order.price) || 0;
                      
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {itemImg ? (
                                  <img src={itemImg} alt={itemTitle} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-5 h-5 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-800 line-clamp-2">{itemTitle}</p>
                                {item.variant?.name && (
                                  <span className="text-xs text-slate-500">{item.variant.name}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center font-mono text-sm text-slate-600">৳ {itemUnitPrice}</td>
                          <td className="py-4 text-center font-mono text-sm text-slate-600">{itemQty}</td>
                          <td className="py-4 text-right font-mono font-bold text-slate-800">৳ {itemUnitPrice * itemQty}</td>
                        </tr>
                      );
                    })
                  ) : (
                    (() => {
                      const fallbackQty = Number(order.quantity) || 1;
                      const fallbackPrice = order.price ?? (order.totalPrice ? Math.max(0, (Number(order.totalPrice) - (Number(order.deliveryCharge) || 0)) / fallbackQty) : 0);
                      return (
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-slate-400" />
                              </div>
                              <p className="font-bold text-sm text-slate-800 line-clamp-2">{order.productTitle || 'Product'}</p>
                            </div>
                          </td>
                          <td className="py-4 text-center font-mono text-sm text-slate-600">৳ {fallbackPrice}</td>
                          <td className="py-4 text-center font-mono text-slate-600">{fallbackQty}</td>
                          <td className="py-4 text-right font-mono font-bold text-slate-800">৳ {Number(fallbackPrice) * fallbackQty}</td>
                        </tr>
                      );
                    })()
                  )}
                </tbody>
              </table>

              {/* Cart Totals */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-2 bg-slate-50 p-4 rounded-xl mb-2">
                  <span className="font-bold text-slate-800 text-sm">Cart Totals</span>
                  <span className="font-bold text-slate-800 text-sm text-right">Price</span>
                </div>
                <div className="px-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Sub Total</span>
                    <span className="font-mono text-slate-800 font-bold">
                      ৳ {Number(baseSubtotal).toFixed(2)}
                    </span>
                  </div>
                  {Number(discount) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-rose-500 font-medium">Discount</span>
                      <span className="font-mono text-rose-600 font-bold">- ৳ {Number(discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Shipping</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {deliveryCharge ? `৳ ${Number(deliveryCharge).toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-slate-900">Total price</span>
                    <span className="font-mono font-black text-orange-500 text-lg">
                      ৳ {Number(currentTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) - Sticky and Grouped */}
        <div className="space-y-6 lg:sticky lg:top-6 self-start">
          
          {/* SECTION 4: QUICK EDIT (PRICE & CHARGES) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                SECTION 4 · FINANCIAL QUICK EDIT
              </span>
              <span className="text-xs text-slate-400 font-medium">Instant Recalculation</span>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6">
              {/* Header inside quick edit */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                  <FileText className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">PRICE & CHARGES</h3>
                  <p className="text-xs text-slate-400 font-medium">Update delivery, discounts, and extra fees</p>
                </div>
              </div>

              {/* Paid or Due alert banner */}
              {order.paymentStatus === 'Paid' || (order.paymentMethod && order.paymentMethod !== 'COD' && order.paymentStatus !== 'Unpaid') ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono font-black text-emerald-900 text-base">
                        Paid in Full · ৳ {Number(currentTotal).toFixed(2)}
                      </span>
                      <p className="text-xs text-emerald-700 font-medium">
                        Payment received via {order.paymentMethod || 'Cash'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    No Due
                  </span>
                </div>
              ) : (
                <div className="bg-[#fff9eb] border border-[#fde8b8] rounded-2xl p-4 flex items-center gap-3 mb-5">
                  <AlertTriangle className="w-6 h-6 text-[#b45309] shrink-0" />
                  <span className="font-mono font-bold text-[#92400e] text-lg">
                    Due ৳ {Number(currentTotal).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Subtotal & Grand total */}
              <div className="flex justify-between items-center mb-5 px-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-mono font-bold text-slate-900">৳ {Number(baseSubtotal).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-slate-600 font-medium">Grand total</span>
                  <span className="font-mono font-black text-slate-900 text-base">৳ {Number(currentTotal).toFixed(2)}</span>
                </div>
              </div>

              {/* Floating label inputs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="relative border-2 border-[#093526] rounded-2xl px-4 pt-3.5 pb-2 bg-white">
                  <label className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[11px] font-bold text-slate-700">
                    Delivery charge
                  </label>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(e.target.value)}
                    className="w-full font-mono text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                  />
                </div>

                <div className="relative border border-slate-300 rounded-2xl px-4 pt-3.5 pb-2 bg-white focus-within:border-2 focus-within:border-[#093526]">
                  <label className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[11px] font-bold text-slate-600">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full font-mono text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Coupon or discount code */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 border border-slate-300 rounded-2xl px-4 pt-3.5 pb-2 bg-white focus-within:border-2 focus-within:border-[#093526]">
                  <label className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[11px] font-bold text-slate-600">
                    Coupon or discount code
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="E.g. PROMO10"
                    className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-2xl border border-slate-300 text-slate-800 hover:bg-slate-50 text-sm font-bold px-6 py-3.5 transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>

              {/* Collapsible More pricing (media_1792910246375_5976fa46.png) */}
              <div className="border-t border-slate-200/80 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsMorePricingOpen(!isMorePricingOpen)}
                  className="flex items-center justify-between w-full text-left font-bold text-slate-900 text-base py-1 cursor-pointer"
                >
                  <span>More pricing</span>
                  {isMorePricingOpen ? <ChevronUp className="w-5 h-5 text-slate-700" /> : <ChevronDown className="w-5 h-5 text-slate-700" />}
                </button>

                {isMorePricingOpen && (
                  <div className="pt-4">
                    <div className="relative border border-slate-300 rounded-2xl px-4 pt-3.5 pb-2 bg-white focus-within:border-2 focus-within:border-[#093526]">
                      <label className="absolute -top-2.5 left-3.5 bg-white px-1.5 text-[11px] font-bold text-slate-600">
                        Extra delivery
                      </label>
                      <input
                        type="number"
                        value={extraDelivery}
                        onChange={(e) => setExtraDelivery(e.target.value)}
                        className="w-full font-mono text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save Quick Edit Button */}
              <button
                type="button"
                onClick={handleSaveQuickEdit}
                disabled={isSavingQuickEdit}
                className="w-full mt-5 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {quickEditSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Price Updated Successfully!</span>
                  </>
                ) : isSavingQuickEdit ? (
                  'Updating Price...'
                ) : (
                  'Save Quick Edit'
                )}
              </button>
            </div>
          </div>

          {/* SECTION 5: FRAUD & CHECKOUT BLOCKS (media_1792910196253_d3d56a8b.png) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                SECTION 5 · SECURITY & FRAUD
              </span>
              <span className="text-xs text-slate-400 font-medium">Automated Gateway Rules</span>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFraudOpen(!isFraudOpen)}>
                <h3 className="font-bold text-slate-900 text-lg">Fraud & checkout blocks</h3>
                <button type="button" className="text-slate-700 hover:text-slate-950">
                  {isFraudOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isFraudOpen && (
                <div className="mt-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">CHECKOUT RESTRICTIONS</p>
                      <p className="text-sm text-slate-600 mt-1 leading-snug">
                        Blocked identities immediately reject new storefront checkouts without exposing internal reasons.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBlockAll}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors shadow-2xs cursor-pointer ${
                        allBlocked 
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'border-rose-300 text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <Ban className="w-4 h-4 text-rose-600" />
                      {allBlocked ? 'Unblock all' : 'Block all'}
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* IP Address */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">IP Address</p>
                          <p className="text-xs font-mono text-slate-600 mt-0.5">{order.ipAddress || (order.orderType === 'physical' ? 'Showroom POS Counter' : 'Online Storefront')}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBlock('ip')}
                        className={`text-sm font-bold transition-colors cursor-pointer px-2 py-1 ${
                          blockedItems.ip 
                            ? 'text-rose-600 font-black' 
                            : 'text-slate-800 hover:text-rose-600'
                        }`}
                      >
                        {blockedItems.ip ? 'Blocked' : 'Block'}
                      </button>
                    </div>

                    {/* Browser / Device */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Browser / Device</p>
                          <p className="text-xs font-mono text-slate-600 mt-0.5">{order.device || (order.orderType === 'physical' ? 'POS Counter Terminal' : 'Customer Device')}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBlock('device')}
                        className={`text-sm font-bold transition-colors cursor-pointer px-2 py-1 ${
                          blockedItems.device 
                            ? 'text-rose-600 font-black' 
                            : 'text-slate-800 hover:text-rose-600'
                        }`}
                      >
                        {blockedItems.device ? 'Blocked' : 'Block'}
                      </button>
                    </div>

                    {/* Customer Phone */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Customer Phone</p>
                          <p className="text-xs font-mono text-slate-600 mt-0.5">{order.phone || 'N/A'}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBlock('phone')}
                        className={`text-sm font-bold transition-colors cursor-pointer px-2 py-1 ${
                          blockedItems.phone 
                            ? 'text-rose-600 font-black' 
                            : 'text-slate-800 hover:text-rose-600'
                        }`}
                      >
                        {blockedItems.phone ? 'Blocked' : 'Block'}
                      </button>
                    </div>

                    {/* Customer Account */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-600 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Customer Account</p>
                          <p className="text-xs font-mono text-slate-600 mt-0.5">{order.customerName} ({order.id})</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBlock('account')}
                        className={`text-sm font-bold transition-colors cursor-pointer px-2 py-1 ${
                          blockedItems.account 
                            ? 'text-rose-600 font-black' 
                            : 'text-slate-800 hover:text-rose-600'
                        }`}
                      >
                        {blockedItems.account ? 'Blocked' : 'Block'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 6: SHIPPING ADDRESS & CUSTOMER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                SECTION 6 · CUSTOMER & DELIVERY
              </span>
              <span className="text-xs text-slate-400 font-medium">Verified Shipping Address</span>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-slate-400" />
                Shipping Address
              </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{order.customerName}</span>
                <button
                  onClick={() => handleCopy(order.customerName, 'name')}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Copy Name"
                >
                  {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span>
                  {order.address}
                  {(order.thana || order.district) && ` (${order.thana ? `${order.thana}, ` : ''}${order.district || ''})`}
                </span>
                <button
                  onClick={() => handleCopy(`${order.address} ${order.thana || ''} ${order.district || ''}`, 'addr')}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                  title="Copy Address"
                >
                  {copiedField === 'addr' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {order.email && <p>{order.email}</p>}
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-slate-800 font-medium">{order.phone}</span>
                <button
                  onClick={() => handleCopy(order.phone, 'phone')}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

          {/* Additional Info / Note */}
          {order.notes && (
            <div className="bg-amber-50 rounded-xl shadow-xs border border-amber-200 p-6">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Customer Note
              </h3>
              <p className="text-sm text-amber-800">{order.notes}</p>
            </div>
          )}

        </div>
      </div>
      </>
      )}
    </div>
  );
}
