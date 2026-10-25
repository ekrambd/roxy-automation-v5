import React, { useState, useEffect } from 'react';
import { BookOrder } from '../types';
import { dbService } from '../lib/dbService';

interface ThermalStickerProps {
  orders: BookOrder[];
  storeDomain?: string;
  onClearSelection?: () => void;
}

type RotationAngle = '0' | '90' | '180';
type SizePreset = '80mm' | '4x6' | '3.5x5' | '4x4' | '4x3' | '2x3' | '6x3';

// Barcode SVG Generator with exact visual density
function ThermalBarcode({ value }: { value: string }) {
  const bars: { width: number; space: number }[] = [];
  const clean = (value || '9NKX').toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    bars.push({
      width: (code % 2) + 1.2,
      space: ((code * 2) % 3) + 1.2
    });
  }

  let currentX = 5;
  bars.forEach(b => { currentX += b.width + b.space; });
  const totalWidth = currentX + 5;

  let renderX = 5;
  return (
    <svg viewBox={`0 0 ${totalWidth} 28`} className="h-7 w-36 mx-auto" preserveAspectRatio="none">
      {bars.map((b, idx) => {
        const x = renderX;
        renderX += b.width + b.space;
        return (
          <rect
            key={idx}
            x={x}
            y={0}
            width={b.width}
            height={28}
            fill="#0f172a"
          />
        );
      })}
    </svg>
  );
}

export function ThermalStickerPreview({ orders, storeDomain, onClearSelection }: ThermalStickerProps) {
  const [rotation, setRotation] = useState<RotationAngle>('0');
  const [sizePreset, setSizePreset] = useState<SizePreset>('80mm');
  const [showItemBreakdown, setShowItemBreakdown] = useState<boolean>(true);
  const [liveDomain, setLiveDomain] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.host && !window.location.host.includes('localhost')) {
      return window.location.host;
    }
    return 'fantinebd.com';
  });

  useEffect(() => {
    let isMounted = true;
    dbService.getEcomSettings().then(settings => {
      if (!isMounted) return;
      if (settings?.storeDomain && !settings.storeDomain.includes('nursurvey') && !settings.storeDomain.includes('livewell')) {
        setLiveDomain(settings.storeDomain);
      } else if (typeof window !== 'undefined' && window.location.host && !window.location.host.includes('localhost')) {
        setLiveDomain(window.location.host);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const isSuspicious = (d?: string) => !d || d.toLowerCase().includes('nursurvey') || d.toLowerCase().includes('livewell');
  const effectiveDomain = !isSuspicious(storeDomain) ? storeDomain! : liveDomain;
  const cleanDomain = effectiveDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  // Width styling based on selected preset
  const getPresetWidthClass = () => {
    switch (sizePreset) {
      case '80mm': return 'w-[320px] max-w-[320px]';
      case '4x6': return 'w-[384px] max-w-[384px]';
      case '3.5x5': return 'w-[336px] max-w-[336px]';
      case '4x4': return 'w-[384px] max-w-[384px]';
      case '4x3': return 'w-[384px] max-w-[384px]';
      case '2x3': return 'w-[260px] max-w-[260px]';
      case '6x3': return 'w-[480px] max-w-[480px]';
      default: return 'w-[320px] max-w-[320px]';
    }
  };

  const getRotationClass = () => {
    switch (rotation) {
      case '90': return 'rotate-90 origin-center';
      case '180': return 'rotate-180 origin-center';
      default: return 'rotate-0';
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = 'POS labels';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Top Header Row matching media_1792911653657_d2a4e2e8.png */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700 print:hidden">
        <span>Selected orders: <strong>{orders.length}</strong></span>
        {onClearSelection && (
          <button 
            type="button"
            onClick={onClearSelection}
            className="px-4 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold cursor-pointer transition-colors"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* THERMAL RECEIPT LAYOUT CONTROLS Card (media_1792911653657_d2a4e2e8.png) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs print:hidden space-y-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              THERMAL RECEIPT LAYOUT CONTROLS
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust thermal label dimensions, orientation & item visibility for bulk printing.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setShowItemBreakdown(!showItemBreakdown)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold border border-emerald-700/60 text-emerald-800 bg-white hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            {showItemBreakdown ? 'Hide Item Breakdown' : 'Show Item Breakdown'}
          </button>
        </div>

        {/* Buttons Row: Rotation Angle & Label Size Presets */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          {/* Rotation Angle */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-900">Rotation Angle</div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['0', '90', '180'] as RotationAngle[]).map((angle) => {
                const label = angle === '0' ? '0° (Normal)' : angle === '90' ? '90° (Right)' : '180° (Flip)';
                const isActive = rotation === angle;
                return (
                  <button
                    key={angle}
                    type="button"
                    onClick={() => setRotation(angle)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-teal-800 bg-teal-50/60 text-teal-950 shadow-2xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label Size Presets */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-900">Label Size Presets</div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: '80mm', label: 'Thermal 80mm' },
                { id: '4x6', label: 'Courier 4 × 6' },
                { id: '3.5x5', label: '3.5 × 5' },
                { id: '4x4', label: '4 × 4' },
                { id: '4x3', label: '4 × 3' },
                { id: '2x3', label: '2 × 3' },
                { id: '6x3', label: '6 × 3' },
              ].map((preset) => {
                const isActive = sizePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSizePreset(preset.id as SizePreset)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-teal-800 bg-teal-50/60 text-teal-950 shadow-2xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Render Stickers Section */}
      <div className="flex flex-col items-center gap-8 py-4">
        {orders.map((ord) => {
          const orderCleanId = (ord.id || '').replace(/^ORD-/, '');
          
          const isPaid = ord.paymentMethod && ord.paymentMethod !== 'COD';
          const delivery = Number(ord.deliveryCharge ?? 60);
          const price = Number(ord.price ?? 900);
          const qty = Number(ord.quantity ?? 1);
          const subtotal = ord.totalPrice 
            ? Math.max(0, Number(ord.totalPrice) - delivery) 
            : (price * qty);
          const grandTotal = Number(ord.totalPrice ?? (subtotal + delivery));

          // Zone logic
          const fullAddress = `${ord.address || ''} ${ord.thana || ''} ${ord.district || ''}`.toLowerCase();
          const isInsideDhaka = fullAddress.includes('dhaka') || fullAddress.includes('uttara') || fullAddress.includes('mirpur') || fullAddress.includes('gulshan') || fullAddress.includes('banani') || fullAddress.includes('dhanmondi');
          const zoneText = isInsideDhaka ? 'Inside Dhaka' : (ord.district ? `Outside Dhaka (${ord.district})` : 'Outside Dhaka');

          const productTitle = ord.productTitle || 'Store Product';
          const variantSku = (ord as any).variantName || (ord as any).sku || '';

          return (
            <div 
              key={ord.id}
              className={`thermal-sticker-page print:m-0 print:p-0 page-break-after-always transition-transform duration-200 ${getRotationClass()}`}
            >
              {/* Exact Sticker Card (media_1792911653657_d2a4e2e8.png) */}
              <div className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs font-sans text-slate-900 print:border-none print:shadow-none print:rounded-none ${getPresetWidthClass()}`}>
                
                {/* 1. Barcode & Order ID Header */}
                <div className="text-center pb-3">
                  <div className="font-mono font-black text-xs text-slate-900 tracking-wider">
                    {orderCleanId}
                  </div>
                  <div className="my-1.5 flex justify-center">
                    <ThermalBarcode value={orderCleanId} />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    by {cleanDomain}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    ORDER ID
                  </div>
                </div>

                {/* Horizontal Divider */}
                <div className="border-t border-slate-100 my-3.5"></div>

                {/* 2. Customer Information */}
                <div className="space-y-0.5">
                  <div className="font-mono font-black text-base text-slate-900 tracking-tight">
                    {ord.phone}
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {ord.customerName}
                  </div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed">
                    {ord.address}
                    {ord.thana ? `, ${ord.thana}` : ''}
                    {ord.district ? `, ${ord.district}` : ''}
                  </div>
                </div>

                {/* Horizontal Divider */}
                <div className="border-t border-slate-100 my-3.5"></div>

                {/* 3. Delivery Zone */}
                <div className="font-bold text-sm text-slate-900">
                  {zoneText}
                </div>

                {/* 4. Optional Item Breakdown */}
                {showItemBreakdown && (
                  <>
                    {/* Horizontal Divider */}
                    <div className="border-t border-slate-100 my-3.5"></div>

                    {/* Product Row */}
                    <div className="space-y-1 text-xs">
                      {ord.items && ord.items.length > 0 ? (
                        ord.items.map((it: any, i: number) => {
                          const itTitle = it.product?.title || it.title || productTitle;
                          const itQty = it.quantity || 1;
                          const itPrice = Number(it.variant?.price || it.product?.price || it.price || price);
                          const itSku = it.variant?.name || it.sku || variantSku;
                          return (
                            <div key={i} className="mb-2">
                              <div className="flex justify-between items-start font-bold text-slate-900">
                                <span className="pr-2">{itQty} × {itTitle}</span>
                                <span className="font-mono shrink-0">৳ {itPrice.toFixed(2)}</span>
                              </div>
                              {itSku ? (
                                <div className="text-[11px] font-mono text-slate-400">
                                  {itSku}
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <div>
                          <div className="flex justify-between items-start font-bold text-slate-900">
                            <span className="pr-2">{qty} × {productTitle}</span>
                            <span className="font-mono shrink-0">৳ {price.toFixed(2)}</span>
                          </div>
                          {variantSku ? (
                            <div className="text-[11px] font-mono text-slate-400">
                              {variantSku}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Dashed line */}
                      <div className="border-t border-dashed border-slate-200 my-2.5"></div>

                      {/* Subtotal */}
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Subtotal:</span>
                        <span className="font-mono font-bold text-slate-800">৳ {subtotal.toFixed(2)}</span>
                      </div>

                      {/* Shipping */}
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Shipping:</span>
                        <span className="font-mono font-bold text-slate-800">৳ {delivery.toFixed(2)}</span>
                      </div>

                      {/* Dashed line */}
                      <div className="border-t border-dashed border-slate-200 my-2.5"></div>

                      {/* COD Due */}
                      <div className="flex justify-between items-baseline pt-0.5">
                        <span className="font-bold text-sm text-slate-900">
                          {isPaid ? 'Paid in full:' : 'COD due:'}
                        </span>
                        <span className="font-mono font-black text-base text-slate-900">
                          ৳ {grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          );
        })}
      </div>
      
      {/* Styles for print output matching media_1792911653658_afb022a8.png */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .thermal-sticker-page {
            page-break-after: always;
            break-after: page;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 8mm 0;
          }
        }
      `}</style>
    </div>
  );
}
