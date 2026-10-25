import { Router } from 'express';
import { prisma } from '../db';
import { requireAdmin } from '../middleware/adminAuth';
import { cacheResponse } from '../middleware/cacheMiddleware';

import { storeSettings } from '../data/store';

export const instituteRouter = Router();

instituteRouter.get('/', cacheResponse({ ttlSeconds: 300, staleWhileRevalidateSeconds: 600, tag: 'institute' }), async (req, res) => {
  try {
    const item = await prisma.instituteInfo.findUnique({ where: { id: 'global' } });
    if (item && Object.keys(item).length > 0) {
      return res.json(item);
    }
  } catch {
    // ignore db error
  }
  if (storeSettings && (storeSettings as any).instituteInfo && Object.keys((storeSettings as any).instituteInfo).length > 0) {
    return res.json((storeSettings as any).instituteInfo);
  }
  res.json({
    name: storeSettings.companyName || 'FAИTIИE BD',
    phone: storeSettings.contactPhone || '01303142147',
    email: storeSettings.contactEmail || 'fantinebd@gmail.com',
    address: storeSettings.storeAddress || 'Banasree,Dhaka',
    street: storeSettings.storeAddress || 'Banasree,Dhaka',
    description: storeSettings.storeTagline || 'Skincare Solutions',
    industry: 'Cosmetics & Skincare',
    bearingRollLocation: 'Dhaka',
    logo: storeSettings.storeLogo || '/logo_transparent.webp'
  });
});

instituteRouter.post('/', requireAdmin, async (req, res) => {
  const item = await prisma.instituteInfo.upsert({
    where: { id: 'global' },
    update: req.body,
    create: { id: 'global', ...req.body }
  });
  res.json(item);
});
