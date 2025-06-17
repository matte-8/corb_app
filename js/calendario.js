document.addEventListener("DOMContentLoaded", () => {
  const eventi = JSON.parse(localStorage.getItem("calendario") || "[]");
  const contenitoreMese = document.getElementById("calendarioMese");
  const contenitoreLista = document.getElementById("calendarioLista");
  const meseCorrente = new Date().getMonth();
  const annoCorrente = new Date().getFullYear();

  document.getElementById("meseCorrente").textContent =
    "📅 " + new Date().toLocaleString("it-IT", { month: "long", year: "numeric" });

  const giorniConPartita = eventi
    .map(e => new Date(e.data))
    .filter(d => d.getMonth() === meseCorrente && d.getFullYear() === annoCorrente)
    .map(d => d.getDate());

  // Genera giorni del mese attuale
  const giorniNelMese = new Date(annoCorrente, meseCorrente + 1, 0).getDate();
  contenitoreMese.innerHTML = "";

  for (let giorno = 1; giorno <= giorniNelMese; giorno++) {
    const cerchio = document.createElement("div");
    cerchio.className = "day-circle";
    cerchio.textContent = giorno;
    cerchio.style.margin = "4px";
    if (giorniConPartita.includes(giorno)) {
      const evento = eventi.find(e => new Date(e.data).getDate() === giorno);
      cerchio.style.background = evento.casa_fuori === "casa" ? "#3399ff" : "#ffd700";
    } else {
      cerchio.style.background = "#666";
    }
    contenitoreMese.appendChild(cerchio);
  }

  // Sezione con elenco partite
  contenitoreLista.innerHTML = "";
  if (eventi.length === 0) {
    contenitoreLista.innerHTML = "<p>Nessuna partita disponibile.</p>";
    return;
  }

  eventi.forEach(e => {
    const data = new Date(e.data);
    const giornoSettimana = data.toLocaleDateString("it-IT", { weekday: "long" });
    const giorno = data.getDate();
    const mese = data.toLocaleString("it-IT", { month: "long" });
    const icona = e.casa_fuori === "casa" ? "🏠" : "✈️";
    const colore = e.casa_fuori === "casa" ? "#3399ff" : "#ffd700";

    const riga = document.createElement("div");
    riga.className = "cal-giorno";
    riga.innerHTML = `
      <div class="cal-cerchio" style="background:${colore}">${giorno}</div>
      <div class="cal-testo">${giornoSettimana} ${giorno} ${mese} - ${e.avversario}</div>
      <div class="cal-icon">${icona}</div>
    `;
    contenitoreLista.appendChild(riga);
  });
});
