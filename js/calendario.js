document.addEventListener("DOMContentLoaded", () => {
  const calendario = JSON.parse(localStorage.getItem("calendario") || "[]");
  const grid = document.getElementById("calendarGrid");
  const elenco = document.getElementById("partiteElenco");

  const oggi = new Date();
  const mese = oggi.getMonth(); // 0-11
  const anno = oggi.getFullYear();

  const primoGiorno = new Date(anno, mese, 1);
  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const giornoSettimanaInizio = primoGiorno.getDay(); // 0 = domenica

  const partiteMese = calendario.filter(p => {
    const data = new Date(p.data);
    return data.getMonth() === mese && data.getFullYear() === anno;
  });

  // Map dei giorni con partita
  const giorniPartite = {};
  partiteMese.forEach(p => {
    const giorno = new Date(p.data).getDate();
    giorniPartite[giorno] = p.casa_fuori.toLowerCase();
  });

  // Spazi vuoti inizio mese
  for (let i = 0; i < (giornoSettimanaInizio === 0 ? 6 : giornoSettimanaInizio - 1); i++) {
    const box = document.createElement("div");
    box.className = "day-box empty";
    grid.appendChild(box);
  }

  // Giorni mese
  for (let d = 1; d <= giorniNelMese; d++) {
    const box = document.createElement("div");
    box.className = "day-box";
    if (giorniPartite[d]) {
      box.classList.add("partita", giorniPartite[d]);
    }
    box.textContent = d;
    grid.appendChild(box);
  }

  // Elenco sotto
  if (partiteMese.length === 0) {
    elenco.innerHTML = "<p>Nessuna partita questo mese</p>";
  } else {
    elenco.innerHTML = "";
    partiteMese.sort((a, b) => new Date(a.data) - new Date(b.data)).forEach(p => {
      const dataObj = new Date(p.data);
      const giorno = dataObj.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
      const icona = p.casa_fuori.toLowerCase() === "casa" ? "🏠" : "✈️";

      const row = document.createElement("div");
      row.className = "partita-riga";
      row.innerHTML = `<div>${giorno} - ${p.avversario}</div><div>${icona}</div>`;
      elenco.appendChild(row);
    });
  }
});
