const partiteUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const partiteCacheKey = "partiteCache";

const risultatoContainer = document.getElementById("risultatoContainer");
const prossimaContainer = document.getElementById("prossimaInfo");
const calendarioContainer = document.getElementById("calendarioContainer");

// Dati statici di default
const defaultPartite = {
  partite: [
    {
      data: "2024-04-10",
      ora: "18:30",
      casa: "U.S. Corbiolo",
      fuori: "Olimpia Verona",
      logocasa: "logo.png",
      logoavv: "opponent.png",
      risultato: "2 - 1"
    },
    {
      data: "2024-04-17",
      ora: "19:00",
      casa: "Sentinelle F.C.",
      fuori: "U.S. Corbiolo",
      logocasa: "opponent2.png",
      logoavv: "logo.png",
      risultato: ""
    }
  ],
  calendario: [
    {
      data: "2024-04-17",
      avversario: "Sentinelle F.C.",
      casa_fuori: "fuori"
    }
  ]
};

// Step 1 – Mostra subito la cache o default
const cached = localStorage.getItem(partiteCacheKey);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderPartite(parsed);
  } catch {
    renderPartite(defaultPartite);
  }
} else {
  renderPartite(defaultPartite);
}

// Step 2 – Aggiorna live da Sheets
fetch(partiteUrl)
  .then(res => res.json())
  .then(data => {
    if (data.partite && data.calendario) {
      localStorage.setItem(partiteCacheKey, JSON.stringify(data));
      renderPartite(data);
    }
  })
  .catch(() => {
    console.warn("Errore nel caricamento delle partite.");
  });

// Funzione principale
function renderPartite(data) {
  const partite = data.partite || [];
  const calendario = data.calendario || [];
  const oggi = new Date();

  // Ultima e prossima
  let ultima = null;
  let prossima = null;

  partite.forEach(p => {
    const dataP = new Date(p.data);
    if (p.risultato && dataP < oggi) {
      if (!ultima || dataP > new Date(ultima.data)) ultima = p;
    } else if (!p.risultato && dataP >= oggi) {
      if (!prossima || dataP < new Date(prossima.data)) prossima = p;
    }
  });

  if (ultima && risultatoContainer) {
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
      </div>
    `;
  }

  if (prossima && prossimaContainer) {
    prossimaContainer.innerHTML = `
      <div class="section-title-icon">⚽️ Prossima Partita</div>
      <p>${prossima.casa} - ${prossima.fuori}</p>
      <p>${prossima.data}, ${prossima.ora}</p>
    `;
  }

  if (calendarioContainer) {
    calendarioContainer.innerHTML = "";
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
}
