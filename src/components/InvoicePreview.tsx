import React, { useRef, useState, useEffect } from 'react';
import { BookOrder, EcomSettings, InstituteInfo } from '../types';
import { Printer, MessageCircle, Copy, CheckCircle, Package, Tag, Store, Truck } from 'lucide-react';
import { dbService } from '../lib/dbService';
import { formatWhatsAppLink, DEFAULT_ECOM_SETTINGS, DEFAULT_INSTITUTE_INFO } from '../lib/constants';

interface Props {
  order: BookOrder;
  onPrintSticker?: () => void;
}

export function InvoicePreview({ order, onPrintSticker }: Props) {
  const [ecomSettings, setEcomSettings] = useState<EcomSettings>(DEFAULT_ECOM_SETTINGS);
  const [instituteInfo, setInstituteInfo] = useState<InstituteInfo>(DEFAULT_INSTITUTE_INFO);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      dbService.getEcomSettings().catch(() => DEFAULT_ECOM_SETTINGS),
      dbService.getInstituteInfo().catch(() => DEFAULT_INSTITUTE_INFO)
    ]).then(([eSettings, instInfo]) => {
      if (!isMounted) return;
      if (eSettings) setEcomSettings(eSettings);
      if (instInfo) setInstituteInfo(instInfo);
    });
    return () => { isMounted = false; };
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const windowPrint = window.open('', '', 'width=900,height=650');
    if (!windowPrint) return;
    
    windowPrint.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-white p-8">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 500);
  };

  const handleWhatsApp = () => {
    const text = `*Invoice Details:*\nOrder ID: ${order.id}\nTotal Amount: ৳ ${order.totalAmount || order.totalPrice}\nStatus: ${order.status}`;
    const url = formatWhatsAppLink(order.phone, text);
    window.open(url, '_blank');
  };

  const handleCopy = (text: string, field: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      // fallback
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d),
        time: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(d)
      };
    } catch {
      return { date: dateStr, time: '' };
    }
  };

  const dt = formatDate(order.createdAt);
  const storeName = ecomSettings?.storeName || instituteInfo?.name || 'FAИTIИE BD';
  const storePhone = ecomSettings?.contactPhone || instituteInfo?.phone || '01303142147';
  const storeAddress = ecomSettings?.storeAddress || instituteInfo?.address || 'Banasree, Dhaka';
  const storeDomain = ecomSettings?.storeDomain || (typeof window !== 'undefined' ? window.location.host : 'fantinebd.com');
  const orderIdClean = (order.id || '').replace('ORD-', '');
  
  // Real tracking details
  const hasRealTracking = Boolean(order.courierTrackingCode || order.pathaoConsignmentId || order.steadfastTrackingCode);
  const trackingCode = order.courierTrackingCode || order.pathaoConsignmentId || order.steadfastTrackingCode || '';
  
  const isPhysical = order.orderType === 'physical';
  const courierName = isPhysical 
    ? 'Showroom Counter (POS Pickup)' 
    : order.courierProvider 
      ? (order.courierProvider === 'pathao' ? 'Pathao Courier' : order.courierProvider === 'steadfast' ? 'Steadfast Courier' : order.courierProvider)
      : (order.pathaoConsignmentId ? 'Pathao Courier' : order.steadfastTrackingCode ? 'Steadfast Courier' : 'Standard Courier Delivery');

  const isPaid = order.paymentStatus === 'Paid' || (order.paymentMethod && order.paymentMethod !== 'COD' && order.paymentStatus !== 'Unpaid');
  const delivery = Number(order.deliveryCharge ?? (isPhysical ? 0 : 60));
  const subtotal = order.totalPrice 
    ? Math.max(0, Number(order.totalPrice) - delivery + (Number(order.couponDiscount || order.discountAmount) || 0))
    : ((Number(order.price) || 0) * (Number(order.quantity) || 1));
  const grandTotal = Number(order.totalAmount || order.totalPrice || (subtotal + delivery));
  const paidAmount = isPaid ? grandTotal : 0;
  const dueAmount = isPaid ? 0 : grandTotal;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
      {/* Top action toolbar (hidden during window.print) */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">Invoice preview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Print-ready invoice layout with barcodes, product items, and QR feedback.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Invoice
          </button>
          <button 
            type="button"
            onClick={handlePrint}
            title="Print"
            className="p-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            Print invoice
          </button>
          {onPrintSticker && (
            <button 
              type="button"
              onClick={onPrintSticker}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Sticker</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 overflow-x-auto">
        {/* The Print Area (Exact match for media_1792911568104_5531da4b.png) */}
        <div ref={printRef} className="min-w-[720px] w-full max-w-4xl mx-auto bg-white p-8 border border-slate-200 rounded-2xl text-slate-900 font-sans print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center p-1.5 shrink-0 font-black text-slate-800 text-lg">
                {ecomSettings?.storeLogo || instituteInfo?.logo ? (
                  <img 
                    src={ecomSettings?.storeLogo || instituteInfo?.logo} 
                    alt="Logo" 
                    className="max-h-full w-auto object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  storeName.slice(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">ORDER INVOICE</p>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{storeName}</h1>
                <p className="text-slate-500 text-xs mt-0.5">{storeAddress}</p>
                <p className="text-slate-500 text-xs font-mono">{storePhone}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Barcode Box */}
              <div className="border border-slate-300 rounded-lg p-2.5 text-center min-w-[140px] bg-white">
                <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-1">ORDER BARCODE</p>
                {/* Simulated Barcode */}
                <div className="w-full h-8 bg-slate-900 opacity-90 mx-auto" style={{ background: 'repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 2px, transparent 2px, transparent 4px, #0f172a 4px, #0f172a 7px, transparent 7px, transparent 9px)' }}></div>
                <div className="mt-1 text-[8px] text-slate-400 tracking-wider uppercase font-semibold">ORDER ID</div>
                <div className="font-mono font-black text-base text-slate-900 flex justify-center items-center gap-1.5 mt-0.5">
                  <span>{orderIdClean}</span>
                  <button 
                    onClick={() => handleCopy(orderIdClean, 'id')} 
                    title="Copy Order ID"
                    className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors print:hidden"
                  >
                    {copiedField === 'id' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              
              {/* Dynamic Tracking or POS/Delivery Box */}
              {hasRealTracking ? (
                <div className="border border-slate-300 rounded-lg p-2.5 text-center min-w-[190px] bg-white">
                  <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-1">TRACKING ID</p>
                  <div className="w-full h-8 bg-slate-900 opacity-90 mx-auto" style={{ background: 'repeating-linear-gradient(90deg, #0f172a 0px, #0f172a 1.5px, transparent 1.5px, transparent 3px, #0f172a 3px, #0f172a 5px, transparent 5px, transparent 8px)' }}></div>
                  <div className="mt-1 text-[8px] text-slate-400 tracking-wider uppercase font-semibold">TRACKING BARCODE</div>
                  <div className="font-mono font-black text-base text-slate-900 flex justify-center items-center gap-1.5 mt-0.5">
                    <span>{trackingCode}</span>
                    <button 
                      onClick={() => handleCopy(trackingCode, 'tracking')} 
                      title="Copy Tracking ID"
                      className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors print:hidden"
                    >
                      {copiedField === 'tracking' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ) : isPhysical ? (
                <div className="border border-teal-300 rounded-lg p-2.5 text-center min-w-[190px] bg-teal-50/50">
                  <p className="text-[9px] font-bold text-teal-700 tracking-widest uppercase mb-1">SALE CHANNEL</p>
                  <div className="flex items-center justify-center gap-1.5 py-1 text-teal-800">
                    <Store className="w-4 h-4" />
                    <span className="font-black text-xs">SHOWROOM POS</span>
                  </div>
                  <div className="mt-1 text-[8px] text-teal-600 tracking-wider uppercase font-semibold">DIRECT PICKUP</div>
                  <div className="font-mono font-bold text-xs text-teal-900 mt-0.5">
                    COUNTER SALE
                  </div>
                </div>
              ) : (
                <div className="border border-slate-300 rounded-lg p-2.5 text-center min-w-[190px] bg-slate-50/50">
                  <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-1">DELIVERY STATUS</p>
                  <div className="flex items-center justify-center gap-1.5 py-1 text-slate-700">
                    <Truck className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-xs">STANDARD DELIVERY</span>
                  </div>
                  <div className="mt-1 text-[8px] text-slate-400 tracking-wider uppercase font-semibold">COURIER DISPATCH</div>
                  <div className="font-mono font-bold text-xs text-slate-800 mt-0.5">
                    NOT DISPATCHED YET
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Row (Matching Screenshot) */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span>{order.customerName}</span>
                <span>•</span>
                <span className="font-mono">{order.phone}</span>
                <button 
                  onClick={() => handleCopy(`${order.customerName} • ${order.phone}`, 'customer')} 
                  title="Copy Customer Info"
                  className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors print:hidden"
                >
                  {copiedField === 'customer' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-xs text-slate-700 font-medium">
                {order.address} {order.thana ? `, ${order.thana}` : ''} {order.district ? `, ${order.district}` : ''}
              </div>
              <div className="text-xs text-slate-500">
                Method: {order.paymentMethod || 'COD'} • Courier: {courierName}
              </div>
            </div>

            <div className="text-xs text-right space-y-1 shrink-0 min-w-[180px]">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="font-bold text-slate-900">{dt.date}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Time:</span>
                <span className="font-bold text-slate-900">{dt.time}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Payment:</span>
                <span className="font-bold text-slate-900">{isPaid ? 'Paid' : 'Cash'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className={`font-black uppercase tracking-wider ${isPaid ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {isPaid ? 'PAID' : 'UNPAID'}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-3">
            <thead>
              <tr className="border-t-2 border-b border-slate-900 text-[10px] uppercase tracking-wider text-slate-900 font-bold">
                <th className="py-2.5 text-left font-bold">ITEM DESCRIPTION</th>
                <th className="py-2.5 text-right font-bold w-28">PRICE</th>
                <th className="py-2.5 text-center font-bold w-20">QTY</th>
                <th className="py-2.5 text-right font-bold w-28">TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => {
                  const itemTitle = item.product?.title || item.title || order.productTitle || 'Product';
                  const itemImg = item.variant?.image || item.product?.image || item.image || item.productImage;
                  const itemSku = item.variant?.name || item.sku || 'mv69o';
                  const price = Number(item.variant?.price || item.product?.price || item.price || 0);
                  const qty = Number(item.quantity || 1);
                  return (
                    <tr key={idx}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {itemImg ? (
                            <img src={itemImg} alt={itemTitle} className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{itemTitle}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{itemSku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-800 text-sm">৳ {price.toFixed(2)}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-800 text-sm">{qty}</td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900 text-sm">৳ {(price * qty).toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                (() => {
                  const itemTitle = order.productTitle || 'Store Product';
                  const price = Number(order.price ?? (order.totalPrice ? Math.max(0, order.totalPrice - delivery) / (order.quantity || 1) : 0));
                  const qty = Number(order.quantity || 1);
                  return (
                    <tr>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{itemTitle}</p>
                            {order.orderType && (
                              <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">{order.orderType} order</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-800 text-sm">৳ {price.toFixed(2)}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-800 text-sm">{qty}</td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900 text-sm">৳ {(price * qty).toFixed(2)}</td>
                    </tr>
                  );
                })()
              )}
            </tbody>
          </table>

          {/* Table Bottom Heavy Border */}
          <div className="border-b-2 border-slate-900 mb-6"></div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600 font-medium">Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold">৳ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200 pb-2">
                <span className="text-slate-600 font-medium">Shipping</span>
                <span className="font-mono text-slate-900 font-semibold">৳ {delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 items-center">
                <span className="font-black text-lg text-slate-900 uppercase">GRAND TOTAL</span>
                <span className="font-mono font-black text-xl text-slate-900">৳ {grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 text-slate-600">
                <span>Paid</span>
                <span className="font-mono">৳ {paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-900">
                <span>Due Amount</span>
                <span className="font-mono font-bold text-slate-900">৳ {dueAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* QR Customer Feedback Box */}
          <div className="border border-slate-900 rounded-xl p-4 mb-6 flex items-center gap-5 bg-white">
            <div className="w-20 h-20 shrink-0 bg-white border border-slate-300 rounded-lg p-1.5 flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://${storeDomain}/track?order=${order.id}`)}`} 
                alt="Feedback QR" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-black text-slate-900 text-sm">আপনার অভিজ্ঞতা কেমন?</h4>
              <p className="text-xs text-slate-800 font-semibold">QR স্ক্যান করে অর্ডার ও পণ্য সম্পর্কে মতামত দিন।</p>
              <p className="text-[11px] text-slate-500">আপনার মতামত অন্য ক্রেতাকে সঠিক পণ্য বেছে নিতে সাহায্য করবে।</p>
              <p className="text-xs font-bold text-slate-900 pt-1">Scan to share quick, order-linked feedback.</p>
            </div>
          </div>

          {/* Terms & Note and Authorized Signature */}
          <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
            <div className="max-w-md">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">TERMS & NOTE</p>
              <p className="text-xs text-slate-700 italic">
                {order.notes || `Thank you for your purchase. - ${storeName.toLowerCase()}`}
              </p>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-slate-300 mb-1.5 ml-auto"></div>
              <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">AUTHORIZED SIGNATURE</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
