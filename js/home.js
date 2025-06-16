const cacheKey = "homeData";
const container = document.getElementById("homeContainer");

// Carica dati dalla cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const data = JSON.parse(cached);
    renderHome(data);
  } catch (e) {
    container.innerHTML = "Errore nel caricamento dati dalla cache.";
  }
} else {
  container.innerHTML = "<p>Dati non trovati. Vai su Admin per aggiornare.</p>";
}

// Rendering della home
function renderHome(data) {
  // Ultima news
  document.getElementById("newsTitle").textContent = data.news[0]?.titolo || "Nessuna notizia";
  document.getElementById("newsText").textContent = data.news[0]?.contenuto || "";

  // Prossima partita
  const prossima = data.partite.find(p => p.futura === "TRUE");
  if (prossima) {
    document.getElementById("nextMatchTeams").textContent = `${prossima.casa} - ${prossima.fuori}`;
    document.getElementById("nextMatchDate").textContent = `${prossima.data}, ${prossima.ora}`;
  }

  // Ultima partita
  const ultima = data.partite.filter(p => p.risultato).reverse()[0];
  if (ultima) {
    document.getElementById("homeTeam").textContent = ultima.casa;
    document.getElementById("awayTeam").textContent = ultima.fuori;
    document.getElementById("lastResultScore").textContent = ultima.risultato;
    document.getElementById("homeLogo").src = `img/${ultima.logocasa}`;
    document.getElementById("awayLogo").src = `img/${ultima.logoavv}`;
  }
}
