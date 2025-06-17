document.addEventListener("DOMContentLoaded", () => {
  const calendario = JSON.parse(localStorage.getItem("calendario") || "[]");
  const contenitoreLista = document.getElementById("calendario");
  const grigliaMese = document.getElementById("grigliaMese");
  const titoloMese = document.getElementById("meseCorrente");

  const oggi = new Date();
  const mese = oggi.getMonth();
  const anno = oggi.getFullYear();
  const nomeMese = oggi.toLocaleString("it", { month: "long" });

  titoloMese.textContent = `📅 ${nomeMese.charAt(0).toUpperCase() + nomeMese.slice(1)} ${anno}`;

  const partiteMese = calendario.filter(e => {
    const d = new Date(e.data);
    return d.getMonth() === mese && d.getFullYear() === anno;
  });

  // CREA GRIGLIA
  const giorniTotali = new Date(anno, mese + 1, 0).getDate();
  grigliaMese.innerHTML = "";

  for (let g = 1; g <= giorniTotali; g++) {
    const dataTest = `${anno}-${String(mese + 1).padStart(2, "0")}-${String(g).padStart(2, "0")}`;
    const partita = partiteMese.find(p => p.data === dataTest);
    const colore = partita ? (partita.casa_fuori === "casa" ? "#3399ff" : "#ffd700") : "#555";

    const giorno = document.createElement("div");
    giorno.className = "day-circle";
    giorno.style.background = colore;
    giorno.textContent = g;
    grigliaMese.appendChild(giorno);
  }

  // SECONDA PARTE - Elenco partite future
  const future = calendario.filter(p => new Date(p.data) >= oggi)
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  if (future.length === 0) {
    contenitoreLista.innerHTML = "<p>Nessuna partita futura.</p>";
    return;
  }

  contenitoreLista.innerHTML = "";
  future.forEach(p => {
    const data = new Date(p.data);
    const giornoSettimana = data.toLocaleDateString("it", { weekday: "long" });
    const giorno = data.getDate();
    const mese = data.toLocaleString("it", { month: "long" });
    const icona = p.casa_fuori === "casa" ? "🏠" : "✈️";
    const colore = p.casa_fuori === "casa" ? "#3399ff" : "#ffd700";

    const box = document.createElement("div");
    box.className = "cal-giorno";
    box.innerHTML = `
      <div class="cal-cerchio" style="background:${colore};">${giorno}</div>
      <div class="cal-testo">${giornoSettimana} ${giorno} ${mese} - ${p.avversario}</div>
      <div class="cal-icon">${icona}</div>
    `;
    contenitoreLista.appendChild(box);
  });
});
