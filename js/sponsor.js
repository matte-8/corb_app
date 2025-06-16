const urlSponsor = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const container = document.getElementById("sponsorContainer");

// Prova a caricare dalla cache
const cache = localStorage.getItem("sponsor");
if (cache) {
  try {
    const parsed = JSON.parse(cache);
    renderSponsor(parsed);
  } catch (e) {
    console.warn("Errore parsing cache sponsor:", e);
  }
}

// Aggiorna live da Sheets
fetch(urlSponsor)
  .then((r) => r.json())
  .then((data) => {
    if (data.sponsor) {
      localStorage.setItem("sponsor", JSON.stringify(data.sponsor));
      renderSponsor(data.sponsor);
    }
  })
  .catch(() => {
    if (!cache) {
      container.innerHTML = "<p>Errore nel caricamento sponsor.</p>";
    }
  });

function renderSponsor(sponsorList) {
  if (!sponsorList || sponsorList.length === 0) {
    container.innerHTML = "<p>Nessuno sponsor disponibile al momento.</p>";
    return;
  }

  const html = sponsorList
    .map(s => `
      <div class="sponsor-box">
        <img src="img/${s.logo}" alt="${s.nome}" class="sponsor-icon">
        <div class="sponsor-name">${s.nome}</div>
        ${s.link ? `<a href="${s.link}" class="sponsor-link" target="_blank">Visita</a>` : ""}
      </div>
    `)
    .join("");

  container.innerHTML = html;
}
