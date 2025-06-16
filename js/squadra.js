const cacheKeyGiocatori = "corbiolo_squadra_cache";
const urlGiocatori = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("squadra-container");

// 1. Mostra i dati salvati in cache
const cachedSquadra = localStorage.getItem(cacheKeyGiocatori);
if (cachedSquadra) {
  try {
    const parsed = JSON.parse(cachedSquadra);
    renderGiocatori(parsed.giocatori);
  } catch (e) {
    console.warn("Errore nella cache dei giocatori:", e);
  }
}

// 2. Renderizza i giocatori
function renderGiocatori(giocatori) {
  if (!giocatori || giocatori.length === 0) {
    container.innerHTML = "Nessun giocatore trovato.";
    return;
  }

  const html = giocatori
    .map(g => `
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

// 3. Funzione per aggiornamento da remoto
function aggiornaSquadraDaRemoto() {
  fetch(urlGiocatori)
    .then(r => r.json())
    .then(data => {
      localStorage.setItem(cacheKeyGiocatori, JSON.stringify(data));
      renderGiocatori(data.giocatori);
    })
    .catch(err => {
      console.error("Errore caricamento giocatori:", err);
      if (!cachedSquadra) container.innerHTML = "Errore nel caricamento.";
    });
}

// 4. Ascolta evento di aggiornamento
document.addEventListener("aggiornaSquadra", () => {
  aggiornaSquadraDaRemoto();
});
