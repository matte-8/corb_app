const cacheKeyPartite = "corbiolo_partite_cache";
const urlPartite = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

const calendarioContainer = document.getElementById("calendarioContainer");
const risultatoContainer = document.getElementById("risultatoContainer");
const prossimaContainer = document.getElementById("prossimaInfo");

// Mostra subito i dati dalla cache
const cachedPartite = localStorage.getItem(cacheKeyPartite);
if (cachedPartite) {
  try {
    const parsed = JSON.parse(cachedPartite);
    renderPartite(parsed.partite, parsed.calendario);
  } catch (e) {
    console.warn("Errore nella cache partite:", e);
  }
}

// Funzione principale di rendering
function renderPartite(partite, calendario) {
  risultatoContainer.innerHTML = "";
  prossimaContainer.innerHTML = "";
  calendarioContainer.innerHTML = "";

  const oggi = new Date();
  let ultima = null;
  let prossima = null;

  partite.forEach((p) => {
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
    prossimaContainer.innerHTML = `
      <div class="section-title-icon">⚽️ Prossima Partita</div>
      <p>${prossima.casa} - ${prossima.fuori}</p>
      <p>${prossima.data}, ${prossima.ora}</p>
    `;
  }

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

// Carica dati aggiornati
function aggiornaPartiteDaRemoto() {
  fetch(urlPartite)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem(cacheKeyPartite, JSON.stringify(data));
      renderPartite(data.partite, data.calendario);
    })
    .catch((err) => {
      console.error("Errore fetch partite:", err);
    });
}

// Evento manuale per aggiornare
document.addEventListener("aggiornaPartite", () => {
  aggiornaPartiteDaRemoto();
});
