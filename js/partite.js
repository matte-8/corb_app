const urlPartite = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const calendarioContainer = document.getElementById("calendarioContainer");
const risultatoContainer = document.getElementById("risultatoContainer");
const prossimaInfo = document.getElementById("prossimaInfo");

const cacheKey = "corbiolo_partite_cache";

// 1. Mostra la cache subito
const cache = localStorage.getItem(cacheKey);
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderPartite(parsed);
  } catch (e) {
    console.warn("Errore cache partite:", e);
  }
}

// 2. Aggiorna live dai dati
fetch(urlPartite)
  .then(res => res.json())
  .then(data => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    renderPartite(data);
  })
  .catch(err => {
    console.error("Errore nel caricamento live:", err);
    if (!cache) {
      calendarioContainer.innerHTML = "Errore nel caricamento.";
    }
  });

// 3. Funzione per mostrare i dati
function renderPartite(data) {
  const partite = data.partite || [];
  const calendario = data.calendario || [];
  const oggi = new Date();

  let ultima = null;
  let prossima = null;

  partite.forEach(p => {
    const dataP = new Date(p.data);
    if (dataP < oggi) {
      if (!ultima || dataP > new Date(ultima.data)) {
        ultima = p;
      }
    } else {
      if (!prossima || dataP < new Date(prossima.data)) {
        prossima = p;
      }
    }
  });

  if (ultima) {
    risultatoContainer.innerHTML = `
      <div class="card result-large">
        <div class="result-row">
          <img src="img/${ultima.logocasa}" alt="Casa" class="team-logo">
          <div class="result-score">${ultima.risultato}</div>
          <img src="img/${ultima.logoavv}" alt="Avversario" class="team-logo">
        </div>
        <div class="result-names">
          <div class="team-name">${ultima.casa}</div>
          <div class="team-name">${ultima.fuori}</div>
        </div>
      </div>`;
  }

  if (prossima) {
    prossimaInfo.innerHTML = `
      <div class="section-title-icon">⚽️ Prossima Partita</div>
      <p>${prossima.casa} - ${prossima.fuori}</p>
      <p>${prossima.data}, ${prossima.ora}</p>
    `;
  }

  calendarioContainer.innerHTML = ""; // Pulisce prima
  calendario.forEach(p => {
    const colore = p.casa_fuori.toLowerCase() === "casa" ? "#3399ff" : "#ffd700";
    const icona = p.casa_fuori.toLowerCase() === "casa" ? "🏠" : "✈️";
    const giorno = new Date(p.data).getDate();

    const box = document.createElement("div");
    box.className = "calendar-box";
    box.innerHTML = `
      <div class="day-circle" style="background:${colore}">${giorno}</div>
      <div class="team-vs">${p.avversario}</div>
      <div class="match-type">${icona}</div>
    `;
    calendarioContainer.appendChild(box);
  });
}
