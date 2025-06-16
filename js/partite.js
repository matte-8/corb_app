const cacheKey = "corbiolo_partite_cache";
const calendarioContainer = document.getElementById("calendarioContainer");
const risultatoContainer = document.getElementById("risultatoContainer");
const prossimaInfo = document.getElementById("prossimaInfo");
const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

// 1. Prova subito a usare la cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const data = JSON.parse(cached);
    renderPartite(data);
  } catch (e) {
    console.warn("Errore cache partite:", e);
  }
}

// 2. Rendering partite
function renderPartite(data) {
  const partite = data.partite || [];
  const calendario = data.calendario || [];
  const oggi = new Date();

  risultatoContainer.innerHTML = "";
  calendarioContainer.innerHTML = "";
  prossimaInfo.innerHTML = "";

  // Ultima e prossima partita
  let ultima = null;
  let prossima = null;

  partite.forEach((p) => {
    const dataP = new Date(p.data);
    if (dataP < oggi) {
      if (!ultima || dataP > new Date(ultima.data)) ultima = p;
    } else {
      if (!prossima || dataP < new Date(prossima.data)) prossima = p;
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

  // Calendario griglia
  calendario.forEach((p) => {
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

// 3. Aggiorna live da Sheets
function aggiornaPartiteDaRemoto() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      renderPartite(data);
    })
    .catch(() => {
      if (!cached) {
        calendarioContainer.innerHTML = "<p>Errore nel caricamento.</p>";
      }
    });
}

// 4. Ascolta evento da admin
document.addEventListener("aggiornaPartite", () => {
  aggiornaPartiteDaRemoto();
});
