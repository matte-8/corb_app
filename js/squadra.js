const cacheKey = "corbiolo_squadra_cache";
const container = document.getElementById("squadra-container");
const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

// 1. Mostra subito i dati da cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderGiocatori(parsed);
  } catch (e) {
    console.warn("Errore nella cache della squadra", e);
  }
}

// 2. Funzione di rendering
function renderGiocatori(data) {
  if (!data.giocatori || data.giocatori.length === 0) {
    container.innerHTML = "<p>Nessun giocatore trovato.</p>";
    return;
  }

  const html = data.giocatori
    .map((g) => `
      <div class="player-card">
        <img src="img/${g.foto}" alt="${g.nome}" class="player-image" />
        <div class="player-info">
          <div class="player-name">${g.nome}</div>
          <div class="player-role">${g.ruolo}</div>
          <div class="player-number">#${g.numero}</div>
        </div>
      </div>
    `)
    .join("");

  container.innerHTML = html;
}

// 3. Listener per aggiornamento manuale (da admin.js)
document.addEventListener("aggiornaSquadra", () => {
  aggiornaSquadraDaRemoto();
});

// 4. Funzione per aggiornare i dati
function aggiornaSquadraDaRemoto() {
  fetch(apiUrl)
    .then((r) => r.json())
    .then((data) => {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      renderGiocatori(data);
    })
    .catch(() => {
      if (!cached) container.innerHTML = "<p>Errore nel caricamento.</p>";
    });
}
