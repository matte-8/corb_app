const url = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const calendarioContainer = document.getElementById("calendario-container");

// Mostra da cache subito
const cache = localStorage.getItem("calendarioCache");
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderCalendario(parsed);
  } catch (e) {
    console.warn("Errore cache calendario");
  }
}

// Poi aggiorna da rete
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    if (data.calendario) {
      localStorage.setItem("calendarioCache", JSON.stringify(data.calendario));
      renderCalendario(data.calendario);
    }
  })
  .catch(() => {
    if (!cache) calendarioContainer.innerHTML = "Errore nel caricamento.";
  });

function renderCalendario(partite) {
  const oggi = new Date();
  const meseCorrente = oggi.getMonth();
  const calendario = [];

  // Filtra partite del mese corrente
  partite.forEach((p) => {
    const d = new Date(p.data);
    if (d.getMonth() === meseCorrente) {
      calendario.push({ ...p, giorno: d.getDate() });
    }
  });

  if (calendario.length === 0) {
    calendarioContainer.innerHTML = "<p>Nessuna partita per questo mese.</p>";
    return;
  }

  // Disegna griglia
  calendarioContainer.innerHTML = "";
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(7, 1fr)";
  grid.style.gap = "8px";

  calendario.forEach((p) => {
    const colore = p.casa_fuori.toLowerCase() === "casa" ? "#3399ff" : "#ffd700";
    const icona = p.casa_fuori.toLowerCase() === "casa" ? "🏠" : "✈️";

    const box = document.createElement("div");
    box.className = "calendar-box";
    box.style.background = "#801e1e";
    box.style.borderRadius = "10px";
    box.style.padding = "10px";
    box.style.textAlign = "center";
    box.style.fontSize = "14px";
    box.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    box.innerHTML = `
      <div class="day-circle" style="background:${colore};width:24px;height:24px;margin:auto;border-radius:50%;">${p.giorno}</div>
      <div style="margin-top:6px;">${p.avversario}</div>
      <div style="font-size:18px;">${icona}</div>
    `;
    grid.appendChild(box);
  });

  calendarioContainer.appendChild(grid);
}
