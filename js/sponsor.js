const cacheKeySponsor = "corbiolo_sponsor_cache";
const urlSponsor = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

const sponsorContainer = document.getElementById("sponsor-container");

// Mostra subito i dati dalla cache
const cached = localStorage.getItem(cacheKeySponsor);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderSponsor(parsed.sponsor);
  } catch (e) {
    console.warn("Errore nella cache sponsor:", e);
  }
}

// Funzione di rendering sponsor
function renderSponsor(sponsor) {
  sponsorContainer.innerHTML = "";

  if (!sponsor || sponsor.length === 0) {
    sponsorContainer.innerHTML = "<p>Nessuno sponsor disponibile.</p>";
    return;
  }

  const html = sponsor
    .map((s) => `
      <div class="sponsor-box">
        <img src="img/${s.logo}" alt="${s.nome}" class="sponsor-icon" />
        <div class="sponsor-name">${s.nome}</div>
        <a href="${s.link}" class="sponsor-link" target="_blank">Visita sito</a>
      </div>
    `)
    .join("");

  sponsorContainer.innerHTML = html;
}

// Carica dati aggiornati
function aggiornaSponsorDaRemoto() {
  fetch(urlSponsor)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem(cacheKeySponsor, JSON.stringify(data));
      renderSponsor(data.sponsor);
    })
    .catch((err) => {
      console.error("Errore fetch sponsor:", err);
    });
}

// Aggiorna manuale da admin
document.addEventListener("aggiornaSponsor", () => {
  aggiornaSponsorDaRemoto();
});
