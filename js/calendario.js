const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

const calendarioContainer = document.getElementById("calendario-container");

// Mostra dati dalla cache subito (se disponibili)
const cached = localStorage.getItem("calendario");
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderCalendario(parsed);
  } catch (e) {
    console.warn("Cache corrotta, ignorata.");
  }
}

// Carica i dati aggiornati da Google Sheets
fetch(urlCalendario)
  .then((r) => r.json())
  .then((data) => {
    localStorage.setItem("calendario", JSON.stringify(data));
    renderCalendario(data);
  })
  .catch(() => {
    if (!cached) {
      calendarioContainer.innerHTML = "Errore nel caricamento calendario.";
    }
  });

// Rendering
function renderCalendario(data) {
  if (!data.calendario || data.calendario.length === 0) {
    calendarioContainer.innerHTML = "Nessuna partita trovata.";
    return;
  }

  const calendarioHTML = data.calendario
    .map((match) => {
      const isCasa = match.casa_fuori.toLowerCase() === "casa";
      const icon = isCasa ? "🏠" : "✈️";
      return `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #600;">
          <div>
            <strong>${match.data}</strong><br>${match.avversario}
          </div>
          <div style="font-size: 20px;">${icon}</div>
        </div>
      `;
    })
    .join("");

  calendarioContainer.innerHTML = calendarioHTML;
}
