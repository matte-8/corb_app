const newsCacheKey = "newsData";
const url = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("newsContainer");

function renderNews(news) {
  container.innerHTML = "";
  news.forEach(item => {
    const card = document.createElement("div");
    card.className = "section";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.titolo}" class="team-logo">
      <div class="section-title-icon">${item.titolo} ${item.nuova === "TRUE" ? '<span class="badge-news">NEW</span>' : ''}</div>
      <p>${item.contenuto}</p>
    `;
    container.appendChild(card);
  });
}

function mergeNews(newList, oldList = []) {
  const map = new Map(oldList.map(n => [n.titolo, n]));
  newList.forEach(n => map.set(n.titolo, n)); // override or insert
  return Array.from(map.values());
}

const cached = localStorage.getItem(newsCacheKey);
let cachedData = [];

if (cached) {
  try {
    cachedData = JSON.parse(cached);
    renderNews(cachedData);
  } catch {}
}

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.news) {
      const merged = mergeNews(data.news, cachedData);
      renderNews(merged);
      localStorage.setItem(newsCacheKey, JSON.stringify(merged));
    }
  });
