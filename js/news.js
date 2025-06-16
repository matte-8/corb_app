const newsCacheKey = "corbiolo_news_cache";
const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const newsContainer = document.getElementById("newsContainer");

// 1. Carica dati da cache subito (offline / rapido)
const cached = localStorage.getItem(newsCacheKey);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderNews(parsed);
  } catch (e) {
    console.warn("Errore parsing cache news", e);
  }
}

// 2. Funzione per disegnare le notizie
function renderNews(newsArray) {
  if (!newsArray || newsArray.length === 0) {
    newsContainer.innerHTML = "<p>Nessuna notizia disponibile.</p>";
    return;
  }

  const html = newsArray
    .map(item => `
      <div class="section">
        <img src="img/${item.img}" alt="${item.titolo}" class="team-logo" />
        <div class="section-title-icon">${item.titolo} ${item.nuova === "TRUE" ? '<span class="badge-news">NEW</span>' : ''}</div>
        <p>${item.contenuto}</p>
      </div>
    `)
    .join("");

  newsContainer.innerHTML = html;
}

// 3. Se ricevo richiesta di aggiornamento da Admin
document.addEventListener("aggiornaNews", () => {
  aggiornaNewsDaRemoto();
});

// 4. Funzione per aggiornare i dati da remoto
function aggiornaNewsDaRemoto() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data.news) {
        localStorage.setItem(newsCacheKey, JSON.stringify(data.news));
        renderNews(data.news);
      } else {
        newsContainer.innerHTML = "<p>Errore: dati news non trovati.</p>";
      }
    })
    .catch(err => {
      console.error("Errore aggiornamento news:", err);
      if (!cached) newsContainer.innerHTML = "<p>Errore nel caricamento.</p>";
    });
}
