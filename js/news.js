const cacheKeyNews = "corbiolo_news_cache";
const container = document.getElementById("newsContainer");
const urlNews = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

// 1. Mostra subito dati in cache
const cached = localStorage.getItem(cacheKeyNews);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderNews(parsed.news);
  } catch (e) {
    console.warn("Errore parsing cache news:", e);
  }
}

// 2. Funzione per renderizzare
function renderNews(news) {
  container.innerHTML = "";
  if (!news || news.length === 0) {
    container.innerHTML = "<p>Nessuna notizia disponibile.</p>";
    return;
  }

  news.forEach(item => {
    const card = document.createElement("div");
    card.className = "section";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.titolo}" class="team-logo">
      <div class="section-title-icon">
        ${item.titolo} ${item.nuova === "TRUE" ? '<span class="badge-news">NEW</span>' : ''}
      </div>
      <p>${item.contenuto}</p>
    `;
    container.appendChild(card);
  });
}

// 3. Aggiorna da remoto
function aggiornaNewsDaRemoto() {
  fetch(urlNews)
    .then(res => res.json())
    .then(data => {
      if (data.news) {
        localStorage.setItem(cacheKeyNews, JSON.stringify(data));
        renderNews(data.news);
      }
    })
    .catch(err => {
      console.error("Errore fetch news:", err);
      if (!cached) container.innerHTML = "<p>Errore nel caricamento notizie.</p>";
    });
}

// 4. Ascolta evento da admin
document.addEventListener("aggiornaNews", () => {
  aggiornaNewsDaRemoto();
});
