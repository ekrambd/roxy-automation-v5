import type { EcomSettings, InstituteInfo, Product, Brand, ContactMessage } from '../types';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';
import { DEFAULT_BRANDS } from './constants';

const DEFAULT_SETTINGS: EcomSettings = {
  storeName: '', storeLogo: '', storeTagline: '', primaryColor: '#0f8278',
  deliveryChargeInsideDhaka: 60, deliveryChargeOutsideDhaka: 110,
  categories: [], categoryItems: [], heroBanners: [], promoCards: []
};

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim() || '';

const DEFAULT_INSTITUTE: InstituteInfo = {
  name: 'Your Store Name', regNo: '', phone: '01XXXXXXXXX',
  email: 'support@yourstore.com', address: 'Your Store Address',
  street: 'Your Store Street',
  description: 'Your Store Description and Tagline goes here.',
  industry: 'Cosmetics & Skincare', bearingRollLocation: 'Dhaka'
};

type FirestoreValue = {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  stringValue?: string;
  bytesValue?: string;
  referenceValue?: string;
  geoPointValue?: { latitude: number; longitude: number };
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

type FirestoreDocument = { name: string; fields?: Record<string, FirestoreValue> };

const isLegacySeed = (product: Product) =>
  product.id?.startsWith('prod-book-01') || product.id?.startsWith('prod-map-holder') ||
  product.id?.startsWith('prod-gunia') || product.id?.startsWith('prod-tape');

const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export function optimizeImageUrl(url?: string, width = 800): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.includes('images.unsplash.com')) {
    const base = trimmed.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${width}&q=80`;
  }
  return trimmed;
}

export function readStorefrontCache<T>(key: string, fallback: T | null = null): T | null {
  const mem = memoryCache.get(key);
  if (mem && (Date.now() - mem.timestamp < CACHE_TTL_MS)) {
    return mem.data as T;
  }
  try {
    const raw = localStorage.getItem(`noor_survey_${key}`) || localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as T;
      memoryCache.set(key, { data: parsed, timestamp: Date.now() });
      return parsed;
    }
    return fallback;
  } catch { return fallback; }
}

export function writeStorefrontCache<T>(key: string, value: T): void {
  memoryCache.set(key, { data: value, timestamp: Date.now() });
  try { 
    localStorage.setItem(`noor_survey_${key}`, JSON.stringify(value)); 
  } catch { /* non-blocking */ }
}

function readCache<T>(key: string, fallback: T): T {
  return readStorefrontCache<T>(key, fallback) ?? fallback;
}

function writeCache<T>(key: string, value: T): void {
  writeStorefrontCache(key, value);
}

function decodeValue(value: FirestoreValue): unknown {
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('stringValue' in value) return value.stringValue;
  if ('bytesValue' in value) return value.bytesValue;
  if ('referenceValue' in value) return value.referenceValue;
  if ('geoPointValue' in value) return value.geoPointValue;
  if ('arrayValue' in value) return (value.arrayValue?.values || []).map(decodeValue);
  if ('mapValue' in value) return decodeFields(value.mapValue?.fields || {});
  return undefined;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

function documentId(document: FirestoreDocument): string {
  return decodeURIComponent(document.name.split('/').pop() || '');
}

function firestoreBaseUrl(): string | null {
  if (!isFirebaseConfigured) return null;
  const database = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' && firebaseConfig.firestoreDatabaseId !== 'default'
    ? firebaseConfig.firestoreDatabaseId
    : '(default)';
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(firebaseConfig.projectId)}/databases/${encodeURIComponent(database)}/documents`;
}

async function fetchFirestore(path: string, collectionRequest = false): Promise<FirestoreDocument | FirestoreDocument[]> {
  const baseUrl = firestoreBaseUrl();
  if (!baseUrl) throw new Error('Firebase is not configured');
  const separator = path.includes('?') ? '&' : '?';
  const url = `${baseUrl}/${path}${separator}key=${encodeURIComponent(firebaseConfig.apiKey)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Firestore REST ${response.status}`);
  const payload = await response.json();
  return collectionRequest ? (payload.documents || []) as FirestoreDocument[] : payload as FirestoreDocument;
}

function normalizeInstitute(info: InstituteInfo): InstituteInfo {
  const digits = (info.phone || '').replace(/\D/g, '');
  const phone = !digits || digits === '8801732623827' || digits === '01732623827' ? '01329458568' : info.phone;
  return { ...info, phone, regNo: '' };
}

export const publicStoreService = {
  async getProducts(): Promise<Product[]> {
    try {
      let documents = await fetchFirestore('ecom_products?pageSize=1000', true) as FirestoreDocument[];
      if (documents.length === 0) documents = await fetchFirestore('products?pageSize=1000', true) as FirestoreDocument[];
      const products = documents
        .map(document => ({ ...decodeFields(document.fields || {}), id: documentId(document) } as Product))
        .filter(product => !isLegacySeed(product))
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      writeCache('noor_ecom_products', products);
      return products;
    } catch (error) {
      console.warn('Fast product read failed; using cache:', error);
      return readCache<Product[]>('noor_ecom_products', [])
        .filter(product => !isLegacySeed(product))
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
    }
  },

  async getEcomSettings(): Promise<EcomSettings> {
    const cached = readCache<EcomSettings | null>('noor_ecom_settings', null);
    try {
      const document = await fetchFirestore('settings/ecom_settings') as FirestoreDocument;
      const data = decodeFields(document.fields || {}) as unknown as EcomSettings;
      const { pixelId: _pixel, metaApiToken: _meta, steadfastApiKey: _key, steadfastSecretKey: _secret, ...publicData } = data;
      const result = { ...DEFAULT_SETTINGS, ...publicData, pixelId: META_PIXEL_ID };
      writeCache('noor_ecom_settings', publicData);
      return result;
    } catch (error) {
      console.warn('Fast settings read failed; using cache:', error);
      const { pixelId: _pixel, metaApiToken: _meta, steadfastApiKey: _key, steadfastSecretKey: _secret, ...publicCached } = cached || {};
      return { ...DEFAULT_SETTINGS, ...publicCached, pixelId: META_PIXEL_ID };
    }
  },

  async getInstituteInfo(): Promise<InstituteInfo> {
    const cached = readCache<InstituteInfo | null>('noor_institute_info', null);
    try {
      const document = await fetchFirestore('settings/institute_info') as FirestoreDocument;
      const result = normalizeInstitute({ ...DEFAULT_INSTITUTE, ...decodeFields(document.fields || {}) } as InstituteInfo);
      writeCache('noor_institute_info', result);
      return result;
    } catch (error) {
      console.warn('Fast institute read failed; using cache:', error);
      return normalizeInstitute({ ...DEFAULT_INSTITUTE, ...(cached || {}) });
    }
  },

  async getBrands(): Promise<Brand[]> {
    const cached = readCache<Brand[]>('noor_brands', []);
    try {
      const documents = await fetchFirestore('brands?pageSize=100', true) as FirestoreDocument[];
      if (Array.isArray(documents)) {
        const brands = documents.map(document => ({
          ...decodeFields(document.fields || {}),
          id: documentId(document)
        })) as Brand[];
        writeCache('noor_brands', brands);
        return brands;
      }
      return cached || [];
    } catch (error) {
      console.warn('Fast brands read failed; using cache:', error);
      return cached || [];
    }
  },

  async getLandingPageSettings(slugOrId?: string, productFallback?: Product): Promise<import('../types').LandingPageData> {
    const cacheKey = `noor_lp_${slugOrId || productFallback?.slug || productFallback?.id || 'default'}`;
    const cached = readCache<import('../types').LandingPageData | null>(cacheKey, null);

    const keysToCheck: string[] = [];
    if (slugOrId) keysToCheck.push(`landing_page_${slugOrId}`);
    if (productFallback) {
      if (productFallback.slug && !keysToCheck.includes(`landing_page_${productFallback.slug}`)) {
        keysToCheck.push(`landing_page_${productFallback.slug}`);
      }
      if (productFallback.id && !keysToCheck.includes(`landing_page_${productFallback.id}`)) {
        keysToCheck.push(`landing_page_${productFallback.id}`);
      }
    }
    if (keysToCheck.length === 0) {
      keysToCheck.push('landing_page_default');
    }

    try {
      // Parallel fast fetch
      const promises = keysToCheck.map(key => 
        fetchFirestore(`settings/${key}`)
          .then(doc => {
            const docData = decodeFields((doc as FirestoreDocument).fields || {}) as unknown as import('../types').LandingPageData;
            return { key, data: docData };
          })
          .catch(() => null)
      );

      const results = await Promise.all(promises);
      const found = results.find(r => r && r.data && Object.keys(r.data).length > 0);
      if (found) {
        const { DEFAULT_LANDING_PAGE_SETTINGS } = await import('./constants');
        const fullData = { ...DEFAULT_LANDING_PAGE_SETTINGS, ...found.data };
        writeCache(cacheKey, fullData);
        return fullData;
      }
    } catch (err) {
      console.warn('Fast landing page read error:', err);
    }

    if (cached) {
      const { DEFAULT_LANDING_PAGE_SETTINGS } = await import('./constants');
      return { ...DEFAULT_LANDING_PAGE_SETTINGS, ...cached };
    }
    if (productFallback) {
      const { createDefaultLandingForProduct } = await import('./constants');
      return createDefaultLandingForProduct(productFallback);
    }
    const { DEFAULT_LANDING_PAGE_SETTINGS } = await import('./constants');
    return DEFAULT_LANDING_PAGE_SETTINGS;
  },

  async submitContactMessage(message: Partial<ContactMessage>): Promise<ContactMessage> {
    const msg: ContactMessage = {
      id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: message.name || '',
      email: message.email || '',
      phone: message.phone || '',
      subject: message.subject || '',
      message: message.message || '',
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    try {
      if (isFirebaseConfigured) {
        const { db } = await import('./firebase');
        const { doc, setDoc } = await import('firebase/firestore');
        if (db) {
          await setDoc(doc(db, 'contact_messages', msg.id), msg);
        }
      }
    } catch (err) {
      console.warn('Direct Firestore save failed, using local cache:', err);
    }

    // Save to local cache
    try {
      const raw = localStorage.getItem('noor_contact_messages');
      const list: ContactMessage[] = raw ? JSON.parse(raw) : [];
      const updated = [msg, ...list.filter(m => m.id !== msg.id)];
      localStorage.setItem('noor_contact_messages', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('contact-messages-updated', { detail: updated }));
    } catch {
      // non-blocking
    }

    return msg;
  }
};
