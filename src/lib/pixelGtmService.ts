// Utility for Meta (Facebook) Pixel & Google Tag Manager (GTM) event tracking

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    dataLayer?: any[];
  }
}

const initializedPixelIds = new Set<string>();
const initializedGtmIds = new Set<string>();

export const initPixelAndGtm = (pixelId?: string, gtmId?: string) => {
  if (typeof window === 'undefined') return;

  // Defer execution to avoid blocking the main thread during initial render
  setTimeout(() => {
    // Initialize Meta Pixel
    const normalizedPixelId = pixelId?.trim();
    if (normalizedPixelId && !initializedPixelIds.has(normalizedPixelId)) {
      if (!window.fbq) {
        const fbq: any = function (...args: any[]) {
          if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
          else fbq.queue.push(args);
        };
        fbq.push = fbq;
        fbq.loaded = true;
        fbq.version = '2.0';
        fbq.queue = [];
        window.fbq = fbq;
        window._fbq = fbq;

        const script = document.createElement('script');
        script.id = 'fb-pixel-script';
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
      }

      window.fbq('init', normalizedPixelId);
      initializedPixelIds.add(normalizedPixelId);
    }

    // Initialize GTM
    const normalizedGtmId = gtmId?.trim();
    if (normalizedGtmId && !initializedGtmIds.has(normalizedGtmId)) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(normalizedGtmId)}`;
      document.head.appendChild(script);
      initializedGtmIds.add(normalizedGtmId);
    }
  }, 3500); // 3.5 seconds delay
};

export const createEventId = (prefix: string) => {
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${randomPart}`;
};

export const trackEvent = (eventName: string, data: Record<string, any> = {}, eventId?: string) => {
  if (typeof window === 'undefined') return;

  // 1. Meta Pixel track
  if (window.fbq) {
    try {
      if (eventId) window.fbq('track', eventName, data, { eventID: eventId });
      else window.fbq('track', eventName, data);
    } catch (e) {
      console.warn('Pixel event track failed:', e);
    }
  }

  // 2. GTM dataLayer push
  window.dataLayer = window.dataLayer || [];
  try {
    const gtmEventNames: Record<string, string> = {
      PageView: 'page_view',
      ViewContent: 'view_item',
      AddToCart: 'add_to_cart',
      InitiateCheckout: 'begin_checkout',
      Purchase: 'purchase'
    };
    window.dataLayer.push({
      event: gtmEventNames[eventName] || eventName.toLowerCase(),
      event_id: eventId,
      ...data
    });
  } catch (e) {
    console.warn('GTM dataLayer push failed:', e);
  }
};
