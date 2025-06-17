document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("partite-container");
  const partite = JSON.parse(localStorage.getItem("partite") || "[]");

  if (partite.length === 0) {
    container.innerHTML = "<p>Nessuna partita registrata.</p>";
    return;
  }

  container.innerHTML = "";

  partite.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const data = p.data ? new Date(p.data).toLocaleDateString() : "-";
    const ora = p.ora || "";
    const squadraCasa = p.casa || "Casa";
    const squadraFuori = p.fuori || "Ospite";
    const logoCasa = p.logocasa ? `img/${p.logocasa}` : "img/logo.png";
    const logoFuori = p.logoavv ? `img/${p.logoavv}` : "img/opponent.png";
    const risultato = p.risultato || "-";

    card.innerHTML = `
      <div class="result-row">
        <img src="${logoCasa}" alt="${squadraCasa}" class="team-logo" />
        <div class="result-score">${risultato}</div>
        <img src="${logoFuori}" alt="${squadraFuori}" class="team-logo" />
      </div>
      <div class="result-names">
        <div class="team-name">${squadraCasa}</div>
        <div class="team-name">${squadraFuori}</div>
      </div>
      <div style="margin-top: 6px; font-size: 14px;">${data} ${ora}</div>
    `;

    container.appendChild(card);
  });
});
