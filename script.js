// script.js - fetch events.json and render a list of starred repositories

function escapeHtml(str){
  if(!str) return '';
  return str.replace(/[&<>"]/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]);
  });
}

function formatDate(iso){
  if(!iso) return '';
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  return d.toLocaleString();
}

function renderList(events, container){
  if(!events || events.length === 0){
    container.innerHTML = '<li>No starred repositories yet.</li>';
    return;
  }

  container.innerHTML = events.map(ev => {
    const description = escapeHtml(ev.description || '');
    const language = ev.language ? `<span class="lang">${escapeHtml(ev.language)}</span>` : '';
    const time = ev.starred_at ? `<span class="time">${formatDate(ev.starred_at)}</span>` : '';

    return `
      <li class="repo">
        <div class="meta">
          <h3><a href="${ev.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(ev.owner)}/${escapeHtml(ev.name)}</a></h3>
          <p>${description}</p>
          <div class="details">${language}${time}</div>
        </div>
      </li>`;
  }).join('\n');
}

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('repo-list');
  try{
    const res = await fetch('events.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const events = await res.json();
    renderList(events, list);
  }catch(err){
    list.innerHTML = `<li class="error">Failed to load starred repositories: ${escapeHtml(err.message)}</li>`;
    console.error(err);
  }
});
