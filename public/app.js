const API = '/api/bookmarks';

async function load() {
  const res = await fetch(API);
  const bookmarks = await res.json();
  const ul = document.getElementById('bookmarks');
  ul.innerHTML = bookmarks.map(b => `
    <li>
      <span><a href="${b.url}" target="_blank">${b.title}</a>
        ${(b.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      </span>
      <button onclick="del(${b.id})">✕</button>
    </li>`).join('');
}

document.getElementById('add-form').onsubmit = async e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;
  await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, url }) });
  e.target.reset();
  load();
};

async function del(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  load();
}

load();
