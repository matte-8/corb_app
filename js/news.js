const newsUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const newsContainer = document.getElementById("newsContainer");
const localKey = "newsData";

// 1. Dati iniziali statici se non c'è cache
const defaultNews = [
  {
    titolo: "Benvenuti nella nuova stagione!",
    contenuto: "Seguiteci per tutte le novità del campionato!",
    img: "img/logo.png",
    nuova: "TRUE"
  }
];

// 2. Mostra dalla cache o default
const cached = localStorage.getItem(localKey);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderNews(parsed);
  } catch {
    renderNews(defaultNews);
  }
} else {
  renderNews(defaultNews);
}

// 3. Aggiorna da Google Sheets
fetch(newsUrl)
  .then(res => res.json())
  .then(data => {
    if (data.news && Array.isArray(data.news)) {
      localStorage.setItem(localKey, JSON.stringify(data.news));
      renderNews(data.news);
    }
  })
  .catch(() => {
    console.warn("Errore durante il fetch delle news.");
  });

function renderNews(newsList) {
  newsContainer.innerHTML = "";
  newsList.forEach(item => {
    const card = document.createElement("div");
    card.className = "section";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.titolo}" class="team-logo">
      <div class="section-title-icon">${item.titolo} ${item.nuova === "TRUE" ? '<span class="badge-news">NEW</span>' : ''}</div>
      <p>${item.contenuto}</p>
    `;
    newsContainer.appendChild(card);
  });
}
