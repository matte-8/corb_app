const urlNews = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("news-container");
const cacheKey = "corbiolo_news_cache";

// Mostra subito la cache se esiste
const cache = localStorage.getItem(cacheKey);
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderNews(parsed);
  } catch (e) {
    console.warn("Errore nella cache news.");
  }
}

// Carica dati aggiornati
fetch(urlNews)
  .then(res => res.json())
  .then(data => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    renderNews(data);
  })
  .catch(() => {
    if (!cache) container.innerHTML = "Errore nel caricamento delle notizie.";
  });

function renderNews(data) {
  if (!data.news || data.news.length === 0) {
    container.innerHTML = "Nessuna notizia disponibile.";
    return;
  }

  const html = data.news
    .map(n => `
      <div class="section">
        <div class="section-title-icon">
          🗞️ ${n.nuova === "TRUE" ? '<span class="badge-news">NEW</span>' : ''}
        </div>
        <p><strong>${n.titolo}</strong></p>
        <p>${n.contenuto}</p>
        ${n.img ? `<img src="img/${n.img}" alt="${n.titolo}" style="max-width:100%; border-radius:8px; margin-top:10px;">` : ''}
      </div>
    `)
    .join("");

  container.innerHTML = html;
}
