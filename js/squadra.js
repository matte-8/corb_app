const urlGiocatori = "https://script.google.com/macros/s/AKfycbx1Lh2iRYAlC6JgYpGYXn9m4yv0wlSXpJedAAzzaBjksiv85Cw8pvHFj0gTv74amziuvg/exec";
const container = document.getElementById("squadra-container");

// Mostra subito i dati dalla cache
const cache = localStorage.getItem("giocatori");
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderGiocatori(parsed);
  } catch (e) {
    console.warn("Errore nella cache.");
  }
}

// Carica i dati aggiornati
fetch(urlGiocatori)
  .then((r) => r.json())
  .then((data) => {
    localStorage.setItem("giocatori", JSON.stringify(data));
    renderGiocatori(data);
  })
  .catch(() => {
    if (!cache) container.innerHTML = "Errore nel caricamento.";
  });

function renderGiocatori(data) {
  if (!data.giocatori || data.giocatori.length === 0) {
    container.innerHTML = "Nessun giocatore trovato.";
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
