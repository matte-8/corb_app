const urlSponsor = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("sponsor-container");
const carousel = document.getElementById("carousel-sponsor");
const cacheKey = "sponsorCache";

// Mostra subito dati dalla cache
const cache = localStorage.getItem(cacheKey);
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderSponsor(parsed);
  } catch (e) {
    console.warn("Errore nella cache sponsor.");
  }
}

// Carica da Sheets
fetch(urlSponsor)
  .then(res => res.json())
  .then(data => {
    if (data.sponsor && Array.isArray(data.sponsor)) {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      renderSponsor(data);
    }
  })
  .catch(() => {
    if (!cache) container.innerHTML = "<p>Errore nel caricamento sponsor.</p>";
  });

function renderSponsor(data) {
  if (!data.sponsor || data.sponsor.length === 0) {
    container.innerHTML = "<p>Nessun sponsor trovato.</p>";
    return;
  }

  const staticList = data.sponsor
    .map(s => `
      <div class="section">
        <img src="img/${s.logo}" alt="${s.nome}" class="team-logo">
        <div class="section-title-icon">${s.nome}</div>
        <p><a href="${s.link}" target="_blank">Visita</a></p>
      </div>
    `)
    .join("");

  container.innerHTML = staticList;

  // Aggiungi alla giostra
  const logos = data.sponsor
    .map(s => `<img src="img/${s.logo}" alt="${s.nome}" />`)
    .join("");

  carousel.innerHTML = logos + logos; // doppio per loop animazione
}
