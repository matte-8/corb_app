const urlGiocatori = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("squadra-container");
const cacheKey = "giocatori";

// Mostra subito dati dalla cache
const cache = localStorage.getItem(cacheKey);
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderGiocatori(parsed);
  } catch (e) {
    console.warn("Errore nella cache squadra.");
  }
}

// Carica i dati aggiornati da Google Sheets
fetch(urlGiocatori)
  .then((r) => r.json())
  .then((data) => {
    if (data.giocatori && Array.isArray(data.giocatori)) {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      renderGiocatori(data);
    } else {
      console.error("Formato dati non valido");
    }
  })
  .catch(() => {
    if (!cache) container.innerHTML = "<p>Errore nel caricamento della squadra.</p>";
  });

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
