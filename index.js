const http = require('http');
const url = require('url');

let settings = { theme: 'light', notifications: true, language: 'en' };

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else if (pathname === '/api/settings' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(settings));
  } else if (pathname === '/api/settings' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        // Validate language field
        if (update.language !== undefined) {
          const supported = ['en', 'fr', 'de', 'es', 'ja'];
          if (!supported.includes(update.language)) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: `unsupported language: ${update.language}. Supported: ${supported.join(', ')}` }));
            return;
          }
        }
        settings = { ...settings, ...update };
        res.writeHead(200);
        res.end(JSON.stringify(settings));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'invalid json' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Settings API on port ${PORT}`));
