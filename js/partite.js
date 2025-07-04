document.addEventListener("DOMContentLoaded", () => {
  const partiteContainer = document.getElementById("partiteContainer");
  const partite = JSON.parse(localStorage.getItem("partite") || "[]");

  partiteContainer.innerHTML = "";

  if (partite.length === 0) {
    partiteContainer.innerHTML = `
      <div class="section">
        <div class="section-title-icon">⚽ Nessuna partita registrata</div>
      </div>`;
    return;
  }

  partite.forEach(p => {
    const box = document.createElement("div");
    box.className = "section";

    const homeLogo = p.home_logo ? `img/${p.home_logo}` : "img/logo.png";
    const awayLogo = p.away_logo ? `img/${p.away_logo}` : "img/opponent.png";
    const homeName = p.home || "-";
    const awayName = p.away || "-";
    const risultato = p.score || "-";

    box.innerHTML = `
      <div class="result-row">
        <img src="${homeLogo}" alt="Logo Casa" class="team-logo" />
        <div class="result-score">${risultato}</div>
        <img src="${awayLogo}" alt="Logo Fuori" class="team-logo" />
      </div>
      <div class="result-names">
        <div class="team-name">${homeName}</div>
        <div class="team-name">${awayName}</div>
      </div>
    `;

    partiteContainer.appendChild(box);
  });
});
