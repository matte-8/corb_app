const container = document.getElementById("sponsor-container");
const sponsorCache = localStorage.getItem("sponsor");

if (sponsorCache) {
  try {
    const data = JSON.parse(sponsorCache);
    renderSponsor(data);
  } catch (e) {
    console.warn("Errore lettura sponsor");
  }
}

function renderSponsor(data) {
  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p>Nessuno sponsor trovato.</p>";
    return;
  }

  container.innerHTML = "";
  data.forEach(sp => {
    const card = document.createElement("div");
    card.className = "sponsor-card";
    card.innerHTML = `
      <a href="${sp.link || "#"}" target="_blank">
        <img src="img/${sp.logo}" alt="${sp.nome}" />
        <div>${sp.nome}</div>
      </a>
    `;
    container.appendChild(card);
  });
}
