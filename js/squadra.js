document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("squadra-container");
  const giocatori = JSON.parse(localStorage.getItem("giocatori") || "[]");

  if (giocatori.length === 0) {
    container.innerHTML = "<p>Nessun giocatore trovato.</p>";
    return;
  }

  container.innerHTML = ""; // svuota contenuto

  giocatori.forEach(gi => {
    const card = document.createElement("div");
    card.className = "player-card";

    const img = document.createElement("img");
    img.className = "player-image";
    img.src = `img/${gi.foto}`;
    img.alt = gi.nome;

    const nome = document.createElement("div");
    nome.className = "player-name";
    nome.textContent = gi.nome;

    const ruolo = document.createElement("div");
    ruolo.className = "player-role";
    ruolo.textContent = gi.ruolo;

    const numero = document.createElement("div");
    numero.className = "player-number";
    numero.textContent = gi.numero;

    card.appendChild(img);
    card.appendChild(nome);
    card.appendChild(ruolo);
    card.appendChild(numero);
    container.appendChild(card);
  });
});
