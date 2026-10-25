import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const imageRouter = Router();

imageRouter.get('/*', async (req, res) => {
  try {
    // The path requested (e.g. /cdn/uploads/123.jpg)
    const filepath = decodeURIComponent(req.path).replace(/^\//, '');
    const w = parseInt(req.query.w as string);
    const q = parseInt(req.query.q as string) || 80;
    const format = (req.query.format as string) || 'webp';

    const originalPath = path.join(process.cwd(), 'public', filepath);
    const distPath = path.join(process.cwd(), 'dist', filepath);
    
    let sourceBuffer: Buffer | null = null;
    let contentType = 'image/jpeg';

    if (fs.existsSync(originalPath)) {
      sourceBuffer = fs.readFileSync(originalPath);
    } else if (fs.existsSync(distPath)) {
      sourceBuffer = fs.readFileSync(distPath);
    } else {
      // In-memory proxy from live Hostinger KVM VPS server without storing files on local disk
      const remoteDomain = process.env.REMOTE_ASSETS_ORIGIN || 'https://fantinebd.com';
      try {
        const remoteUrl = `${remoteDomain}/${filepath}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const remoteResp = await fetch(remoteUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (remoteResp.ok) {
          sourceBuffer = Buffer.from(await remoteResp.arrayBuffer());
          contentType = remoteResp.headers.get('content-type') || 'image/jpeg';
        }
      } catch (err) {
        // Fallback failed
      }
    }

    if (!sourceBuffer) {
      return res.status(404).send('Image not found');
    }

    // If no resize is requested, send buffer directly
    if (!w && !req.query.format) {
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(sourceBuffer);
    }

    // Transform in memory using sharp without local disk writes
    let transformer = sharp(sourceBuffer);
    
    if (w) {
      transformer = transformer.resize(w, null, { withoutEnlargement: true });
    }
    
    if (format === 'webp') {
      transformer = transformer.webp({ quality: q });
    } else if (format === 'avif') {
      transformer = transformer.avif({ quality: q });
    } else if (format === 'png') {
      transformer = transformer.png({ quality: q });
    } else {
      transformer = transformer.jpeg({ quality: q });
    }

    const data = await transformer.toBuffer();

    res.setHeader('Content-Type', `image/${format}`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(data);
  } catch (error) {
    console.error('Image CDN error:', error);
    res.status(500).send('Error processing image');
  }
});

export { imageRouter };
