const urlGiocatori = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("squadra-container");
const cacheKey = "corbiolo_giocatori";

// 1. Mostra i dati dalla cache
const cache = localStorage.getItem(cacheKey);
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderGiocatori(parsed);
  } catch (e) {
    console.warn("Errore nella cache:", e);
  }
}

// 2. Recupera i dati live da Google Sheets
fetch(urlGiocatori)
  .then(res => res.json())
  .then(data => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    renderGiocatori(data);
  })
  .catch(err => {
    console.error("Errore nel fetch live:", err);
    if (!cache) container.innerHTML = "Errore nel caricamento.";
  });

// 3. Rendering HTML dei giocatori
function renderGiocatori(data) {
  if (!data.giocatori || data.giocatori.length === 0) {
    container.innerHTML = "Nessun giocatore trovato.";
    return;
  }

  const html = data.giocatori.map(g => `
    <div class="player-card">
      <img src="img/${g.foto}" alt="${g.nome}" class="player-image" />
      <div class="player-info">
        <div class="player-name">${g.nome}</div>
        <div class="player-role">${g.ruolo}</div>
        <div class="player-number">#${g.numero}</div>
      </div>
    </div>
  `).join("");

  container.innerHTML = html;
}
