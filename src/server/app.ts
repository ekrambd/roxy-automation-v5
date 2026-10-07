import express from 'express';
import os from 'os';
import { productRouter } from './routes/productRoutes';
import { orderRouter } from './routes/orderRoutes';
import { settingsRouter, courierRouter, facebookRouter } from './routes/settingsRoutes';
import { backupRouter } from './routes/backupRoutes';
import { benchmarkRouter } from './routes/benchmarkRoutes';
import { aiRouter } from './routes/aiRoutes';
import { uploadRouter } from './routes/uploadRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { sliderRouter } from './routes/sliderRoutes';
import { customerRouter } from './routes/customerRoutes';
import { couponRouter } from './routes/couponRoutes';
import { reviewRouter } from './routes/reviewRoutes';
import { brandRouter } from './routes/brandRoutes';
import { contactRouter } from './routes/contactRoutes';
import { landingRouter } from './routes/landingRoutes';
import { instituteRouter } from './routes/instituteRoutes';
import { imageRouter } from './routes/imageCDN';

import { globalCache } from './services/cacheEngine';
import { shardService } from './services/shardService';
import { circuitBreakerRegistry } from './services/circuitBreaker';
import { backupEngine } from './services/backupEngine';
import { telemetryService } from './services/telemetryService';

export const app = express();

// ==========================================
// COMPREHENSIVE SECURITY HEADERS (Helmet Equivalent)
// ==========================================
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.removeHeader('X-Powered-By'); // Hide Express signature
  next();
});

app.use(express.json({ limit: '2mb' }));

// Initialize automated periodic database backups
backupEngine.startScheduledBackups(6);

// ==========================================
// SYSTEM DESIGN MONITORING & TELEMETRY
// ==========================================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Noor Digital Enterprise High-Availability E-Commerce Engine',
    workerPid: process.pid,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/system/metrics', (_req, res) => {
  const metrics = telemetryService.getMetrics();
  res.json({
    success: true,
    ok: true,
    metrics,
    system: {
      platform: os.platform(),
      cpus: os.cpus().length,
      freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
      totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
      processMemoryUsageMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
      workerPid: process.pid,
      uptimeSeconds: Math.round(process.uptime())
    },
    cache: globalCache.getStats(),
    circuitBreakers: {
      fcm: circuitBreakerRegistry.fcm.getStats(),
      steadfast: circuitBreakerRegistry.steadfastCourier.getStats(),
      metaPixel: circuitBreakerRegistry.metaPixel.getStats(),
      geminiAI: circuitBreakerRegistry.geminiAI.getStats(),
      firestore: circuitBreakerRegistry.firestore.getStats()
    }
  });
});

app.get('/api/system/cache', (_req, res) => {
  res.json({
    success: true,
    stats: globalCache.getStats()
  });
});

app.post('/api/system/cache/clear', (_req, res) => {
  globalCache.clear();
  res.json({ success: true, message: 'All in-memory caches purged across worker' });
});

// ==========================================
// ROUTE REGISTRATIONS
// ==========================================
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/courier', courierRouter);
app.use('/api/facebook', facebookRouter);
app.use('/api/admin/backups', backupRouter);
app.use('/api/system', benchmarkRouter);
app.use('/api/ai', aiRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/sliders', sliderRouter);
app.use('/api/customers', customerRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/brands', brandRouter);
app.use('/api/contact-messages', contactRouter);
app.use('/api/landing-pages', landingRouter);
app.use('/api/institute', instituteRouter);
app.use('/cdn', imageRouter);


// Dynamic Firebase Messaging Service Worker
app.get('/firebase-messaging-sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

    firebase.initializeApp({
      apiKey: "${process.env.VITE_FIREBASE_API_KEY || ''}",
      authDomain: "${process.env.VITE_FIREBASE_AUTH_DOMAIN || ''}",
      projectId: "${process.env.VITE_FIREBASE_PROJECT_ID || ''}",
      storageBucket: "${process.env.VITE_FIREBASE_STORAGE_BUCKET || ''}",
      messagingSenderId: "${process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''}",
      appId: "${process.env.VITE_FIREBASE_APP_ID || ''}"
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification?.title || 'ZinniaMart';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/logo.png',
        data: {
          url: payload.data?.url || '/'
        }
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      const urlToOpen = event.notification.data?.url || '/';
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
      );
    });
  `);
});

// Send Push Notification endpoint via FCM legacy server protocol protected by Circuit Breaker
app.post('/api/notifications/send', async (req, res) => {
  const { title, body, icon, url, tokens } = req.body;
  
  if (!title || !body || !tokens || !Array.isArray(tokens) || tokens.length === 0) {
    res.status(400).json({ success: false, message: 'title, body, and non-empty tokens array are required' });
    return;
  }

  try {
    const { storeSettings } = await import('./data/store');
    const serverKey = storeSettings.fcmServerKey || process.env.FCM_SERVER_KEY;

    if (!serverKey) {
      res.status(400).json({ 
        success: false, 
        message: 'FCM Server Key is not configured. Please set it in Admin Settings.' 
      });
      return;
    }

    const result = await circuitBreakerRegistry.fcm.execute(async () => {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${serverKey}`
        },
        body: JSON.stringify({
          registration_ids: tokens,
          notification: {
            title,
            body,
            icon: icon || '/logo.png',
            sound: 'default'
          },
          data: {
            url: url || '/'
          }
        })
      });
      return await response.json();
    });
    
    res.json({ 
      success: true, 
      multicast_id: (result as any).multicast_id,
      success_count: (result as any).success,
      failure_count: (result as any).failure,
      results: (result as any).results || []
    });
  } catch (err: any) {
    console.error('Failed to send push notifications:', err);
    res.status(502).json({ success: false, error: err.message || 'Failed to deliver notifications via FCM' });
  }
});
