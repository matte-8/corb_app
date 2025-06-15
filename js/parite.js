document.addEventListener("DOMContentLoaded", () => {
  const calendarioContainer = document.getElementById("calendarioContainer");
  const risultatoContainer = document.getElementById("risultatoContainer");

  fetch(
    "https://script.google.com/macros/s/AKfycbx1Lh2iRYAlC6JgYpGYXn9m4yv0wlSXpJedAAzzaBjksiv85Cw8pvHFj0gTv74amziuvg/exec"
  )
    .then((res) => res.json())
    .then((data) => {
      const partite = data.partite || [];
      const oggi = new Date();

      let ultima = null;
      let prossima = null;

      partite.forEach((p) => {
        const dataP = new Date(p.data);
        if (dataP < oggi) {
          if (!ultima || dataP > new Date(ultima.data)) {
            ultima = p;
          }
        } else {
          if (!prossima || dataP < new Date(prossima.data)) {
            prossima = p;
          }
        }
      });

      if (ultima) {
        risultatoContainer.innerHTML = `
          <div class="card result-large">
            <div class="result-row">
              <img src="img/${ultima.logocasa}" alt="Casa" class="team-logo">
              <div class="result-score">${ultima.risultato}</div>
              <img src="img/${ultima.logoavv}" alt="Avversario" class="team-logo">
            </div>
            <div class="result-names">
              <div class="team-name">${ultima.casa}</div>
              <div class="team-name">${ultima.fuori}</div>
            </div>
          </div>`;
      }

      if (prossima) {
        document.getElementById("prossimaInfo").innerHTML = `
          <div class="section-title-icon">⚽️ Prossima Partita</div>
          <p>${prossima.casa} - ${prossima.fuori}</p>
          <p>${prossima.data}, ${prossima.ora}</p>
        `;
      }

      const calendario = data.calendario || [];
      calendario.forEach((p) => {
        const colore = p.casa_fuori.toLowerCase() === "casa" ? "#3399ff" : "#ffd700";
        const icona = p.casa_fuori.toLowerCase() === "casa" ? "🏠" : "✈️";
        const giorno = new Date(p.data).getDate();

        const box = document.createElement("div");
        box.className = "calendar-box";
        box.innerHTML = `
          <div class="day-circle" style="background:${colore}">${giorno}</div>
          <div class="team-vs">${p.avversario}</div>
          <div class="match-type">${icona}</div>
        `;
        calendarioContainer.appendChild(box);
      });
    });
});
