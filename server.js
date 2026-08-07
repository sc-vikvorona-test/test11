const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function serveStatic(res, filePath) {
  if (!fs.existsSync(filePath)) return json(res, 404, { error: 'not found' });
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'text/javascript' };
  res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
  res.end(fs.readFileSync(filePath));
}

function readBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { resolve(null); } });
  });
}

const server = http.createServer(async (req, res) => {
  const { method } = req;
  const [pathname] = req.url.split('?');

  if (method === 'OPTIONS') {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  if (pathname === '/health') return json(res, 200, { status: 'ok' });

  if (pathname === '/api/bookmarks' && method === 'GET') return json(res, 200, db.all());

  if (pathname === '/api/bookmarks' && method === 'POST') {
    const body = await readBody(req);
    if (!body) return json(res, 400, { error: 'invalid json' });
    if (!body.title || !body.url) return json(res, 400, { error: 'title and url are required' });
    return json(res, 201, db.create(body));
  }

  const singleMatch = pathname.match(/^\/api\/bookmarks\/(\d+)$/);
  if (singleMatch && method === 'GET') {
    const b = db.get(parseInt(singleMatch[1]));
    return b ? json(res, 200, b) : json(res, 404, { error: 'not found' });
  }
  if (singleMatch && method === 'PUT') {
    const body = await readBody(req);
    if (!body) return json(res, 400, { error: 'invalid json' });
    const b = db.update(parseInt(singleMatch[1]), body);
    return b ? json(res, 200, b) : json(res, 404, { error: 'not found' });
  }
  if (singleMatch && method === 'DELETE') {
    const ok = db.remove(parseInt(singleMatch[1]));
    return ok ? json(res, 200, { deleted: true }) : json(res, 404, { error: 'not found' });
  }

  // Favorite toggle — BUG: always sets favorite:true, never reads current state
  const favMatch = pathname.match(/^\/api\/bookmarks\/(\d+)\/favorite$/);
  if (favMatch && method === 'POST') {
    const id = parseInt(favMatch[1]);
    const b = db.get(id);
    if (!b) return json(res, 404, { error: 'not found' });
    const updated = db.update(id, { favorite: true });  // BUG: should be !b.favorite
    return json(res, 200, updated);
  }

  if (method === 'GET') {
    const file = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    return serveStatic(res, path.join(__dirname, 'public', file));
  }

  json(res, 404, { error: 'not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Linksaver API on port ${PORT}`));
