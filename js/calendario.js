document.addEventListener("DOMContentLoaded", () => {
  const urlCalendario = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
  const calendarioContainer = document.getElementById("calendario-container");
  const cacheKey = "partiteCache";

  // 1. Mostra dati dalla cache
  const cache = localStorage.getItem(cacheKey);
  if (cache) {
    try {
      const parsed = JSON.parse(cache);
      renderCalendario(parsed.calendario || []);
    } catch (e) {
      console.warn("Errore parsing cache calendario.");
    }
  }

  // 2. Aggiorna live da Sheets
  fetch(urlCalendario)
    .then(res => res.json())
    .then(data => {
      if (data.calendario) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        renderCalendario(data.calendario);
      }
    })
    .catch(() => {
      if (!cache) calendarioContainer.innerHTML = "Errore nel caricamento.";
    });

  // 3. Render
  function renderCalendario(partite) {
    if (!Array.isArray(partite) || partite.length === 0) {
      calendarioContainer.innerHTML = "<p>Nessuna partita trovata.</p>";
      return;
    }

    calendarioContainer.innerHTML = ""; // Pulisce

    partite.forEach(p => {
      const dataMatch = new Date(p.data);
      const giorno = dataMatch.getDate();
      const casa = p.casa_fuori.toLowerCase() === "casa";
      const colore = casa ? "#3399ff" : "#ffd700";
      const icona = casa ? "🏠" : "✈️";

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
});
