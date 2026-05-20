const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DATA_FILE || path.join(__dirname, 'data.json');

function load() {
  if (!fs.existsSync(DB_FILE)) return { bookmarks: [], nextId: 1 };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function all() { return load().bookmarks; }

function get(id) { return load().bookmarks.find(b => b.id === id) || null; }

function create({ title, url, tags = [] }) {
  const data = load();
  const bookmark = { id: data.nextId++, title, url, tags, favorite: false, createdAt: new Date().toISOString() };
  data.bookmarks.push(bookmark);
  save(data);
  return bookmark;
}

function update(id, fields) {
  const data = load();
  const idx = data.bookmarks.findIndex(b => b.id === id);
  if (idx === -1) return null;
  data.bookmarks[idx] = { ...data.bookmarks[idx], ...fields };
  save(data);
  return data.bookmarks[idx];
}

function remove(id) {
  const data = load();
  const idx = data.bookmarks.findIndex(b => b.id === id);
  if (idx === -1) return false;
  data.bookmarks.splice(idx, 1);
  save(data);
  return true;
}

module.exports = { all, get, create, update, remove };
