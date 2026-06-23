/**
 * Springfield deck — minimal static file server.
 *
 * Serves the pre-built static export in ./public.  Zero npm dependencies
 * (uses Node's built-in http/fs/path/url only).  Single-process to stay
 * well under Hostinger's 120-process shared limit.
 *
 * Port resolution order:
 *   1.  --port <N>  /  -p <N>  CLI flag
 *   2.  PORT env var
 *   3.  fallback 3004
 *
 * Hostinger Custom preset calls:  npm run start -- -p $PORT
 * which lands in (1) above.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, 'public');
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

function resolvePort() {
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if ((argv[i] === '-p' || argv[i] === '--port') && argv[i + 1]) {
      const n = Number(argv[i + 1]);
      if (Number.isInteger(n) && n > 0) return n;
    }
  }
  if (process.env.PORT && Number.isInteger(Number(process.env.PORT))) {
    return Number(process.env.PORT);
  }
  return 3004;
}

const PORT = resolvePort();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml; charset=utf-8',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.eot':  'application/vnd.ms-fontobject',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.pdf':  'application/pdf',
  '.map':  'application/json; charset=utf-8',
};

// Defense-in-depth headers applied to every response.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Text types worth compressing on the fly (images/fonts/pdf are already packed).
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.xml', '.txt']);

function send(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': contentType, ...SECURITY_HEADERS });
  res.end(body);
}

function streamFile(req, res, filePath, status = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  // Static assets get aggressive caching; HTML stays fresh.
  const cacheControl = (ext === '.html' || ext === '')
    ? 'public, max-age=0, must-revalidate'
    : 'public, max-age=31536000, immutable';
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    ...SECURITY_HEADERS,
  };

  if (req.method === 'HEAD') {
    res.writeHead(status, headers);
    return res.end();
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => { if (!res.headersSent) send(res, 404, 'Not Found'); });

  const acceptEnc = req.headers['accept-encoding'] || '';
  if (COMPRESSIBLE.has(ext)) {
    headers['Vary'] = 'Accept-Encoding';
    if (/\bbr\b/.test(acceptEnc)) {
      headers['Content-Encoding'] = 'br';
      res.writeHead(status, headers);
      return stream.pipe(zlib.createBrotliCompress()).pipe(res);
    }
    if (/\bgzip\b/.test(acceptEnc)) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(status, headers);
      return stream.pipe(zlib.createGzip()).pipe(res);
    }
  }
  res.writeHead(status, headers);
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  // Only GET / HEAD are valid for a static site.
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed');
  }
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'Bad Request');
  }
  if (urlPath === '/') urlPath = '/index.html';
  // Path traversal guard
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    return send(res, 403, 'Forbidden');
  }
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      return streamFile(req, res, filePath);
    }
    if (!err && stat.isDirectory()) {
      // Serve <dir>/index.html if present, otherwise a real 404.
      const idx = path.join(filePath, 'index.html');
      return fs.stat(idx, (e2, s2) => {
        if (!e2 && s2.isFile()) return streamFile(req, res, idx);
        return sendNotFound(req, res);
      });
    }
    // Unknown path — return a genuine 404 (no SPA catch-all to index.html).
    return sendNotFound(req, res);
  });
});

// Serve the export's 404.html with a 404 status if it exists, else plain text.
function sendNotFound(req, res) {
  const notFoundPage = path.join(ROOT, '404.html');
  fs.stat(notFoundPage, (err, stat) => {
    if (!err && stat.isFile()) return streamFile(req, res, notFoundPage, 404);
    return send(res, 404, 'Not Found');
  });
}

server.listen(PORT, HOSTNAME, () => {
  console.log(`[springfield] static server on http://${HOSTNAME}:${PORT}  (root: ${ROOT})`);
});
