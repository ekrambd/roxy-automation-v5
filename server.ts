import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import zlib from "zlib";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { app } from "./src/server/app";

// Vercel injects production variables. Local development reads the ignored file.
dotenv.config({ path: '.env.local' });

const PORT = Number(process.env.PORT) || 3004;

// Native HTTP Gzip/Deflate Compression Middleware (Zero dependency)
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (!acceptEncoding.includes('gzip') && !acceptEncoding.includes('deflate')) {
    return next();
  }

  const originalSend = res.send.bind(res);
  res.send = (body: any) => {
    // Only compress text, json, and html payloads larger than 1KB
    if (typeof body === 'string' || Buffer.isBuffer(body)) {
      const contentType = (res.getHeader('Content-Type') as string) || '';
      const isCompressible = contentType.includes('text') || contentType.includes('json') || contentType.includes('javascript') || contentType.includes('xml');

      if (isCompressible && (typeof body === 'string' ? Buffer.byteLength(body) : body.length) > 1024) {
        if (acceptEncoding.includes('gzip')) {
          res.setHeader('Content-Encoding', 'gzip');
          res.removeHeader('Content-Length');
          return zlib.gzip(body, (err, compressed) => {
            if (err) return originalSend(body);
            originalSend(compressed);
          });
        }
      }
    }
    return originalSend(body);
  };
  next();
});

// ==================== VITE / STATIC SERVER ====================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    // Static Assets Cache (Immutable 1-year cache for fingerprinted JS/CSS/Images)
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
        }
      }
    }));

    // Fallback static files directly from public directory
    app.use(express.static(path.join(process.cwd(), 'public')));

    // In-memory Page Cache for index.html (Ultra-fast memory serving with ETag)
    let cachedIndexHtml: string | null = null;
    let cachedIndexEtag: string | null = null;

    const getIndexHtml = () => {
      if (!cachedIndexHtml) {
        const filePath = path.join(distPath, 'index.html');
        if (fs.existsSync(filePath)) {
          cachedIndexHtml = fs.readFileSync(filePath, 'utf-8');
          cachedIndexEtag = `"${crypto.createHash('md5').update(cachedIndexHtml).digest('hex')}"`;
        }
      }
      return { html: cachedIndexHtml, etag: cachedIndexEtag };
    };

    // SPA Page Route Handler with Micro-caching & 304 fast-path
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/cdn') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      const { html, etag } = getIndexHtml();
      if (!html) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }

      // Check 304 Not Modified
      const clientEtag = req.headers['if-none-match'];
      if (clientEtag && clientEtag === etag) {
        res.setHeader('ETag', etag);
        res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
        res.setHeader('X-Page-Cache', 'HIT-304');
        return res.status(304).end();
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (etag) res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
      res.setHeader('X-Page-Cache', 'HIT-MEMORY');
      res.send(html);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Noor E-Commerce Architecture active on http://localhost:${PORT}`);
  });
}

startServer();
