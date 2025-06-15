document.addEventListener("DOMContentLoaded", () => {
  const calendarioContainer = document.getElementById("calendario");

  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec")  // Inserisci qui il tuo URL
    .then((res) => res.json())
    .then((data) => {
      const eventi = data.calendario || [];

      eventi.forEach(evento => {
        const giorno = document.createElement("div");
        giorno.classList.add("cal-giorno");

        const cerchio = document.createElement("div");
        cerchio.classList.add("cal-cerchio");
        cerchio.style.backgroundColor = evento.casa_fuori === "casa" ? "#0066cc" : "#ffcc00";
        cerchio.textContent = new Date(evento.data).getDate();

        const testo = document.createElement("div");
        testo.classList.add("cal-testo");
        testo.innerHTML = `
          ${evento.data} - ${evento.avversario}
          <span class="cal-icon">${evento.casa_fuori === "casa" ? "🏠" : "✈️"}</span>
        `;

        giorno.appendChild(cerchio);
        giorno.appendChild(testo);
        calendarioContainer.appendChild(giorno);
      });
    })
    .catch(err => {
      calendarioContainer.innerHTML = `<p style="text-align:center;">Errore nel caricamento</p>`;
      console.error("Errore fetch calendario:", err);
    });
});
