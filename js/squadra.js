const cacheKey = "giocatori";
const url = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("squadra-container");

function renderGiocatori(lista) {
  container.innerHTML = lista.map(g => `
    <div class="player-card">
      <img src="img/${g.foto}" alt="${g.nome}" class="player-image" />
      <div class="player-info">
        <div class="player-name">${g.nome}</div>
        <div class="player-role">${g.ruolo}</div>
        <div class="player-number">#${g.numero}</div>
      </div>
    </div>
  `).join("");
}

function mergeGiocatori(nuovi, vecchi = []) {
  const map = new Map(vecchi.map(g => [g.nome, g]));
  nuovi.forEach(g => map.set(g.nome, g));
  return Array.from(map.values());
}

let cached = [];
const stored = localStorage.getItem(cacheKey);
if (stored) {
  try {
    cached = JSON.parse(stored);
    renderGiocatori(cached);
  } catch {}
}

fetch(url)
  .then(res => res.json())
  .then(data => {
    const uniti = mergeGiocatori(data.giocatori || [], cached);
    renderGiocatori(uniti);
    localStorage.setItem(cacheKey, JSON.stringify(uniti));
  });
