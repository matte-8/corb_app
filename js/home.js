const cacheKey = "corbiolo_home_cache";
const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

// 1. Rendering HTML
function renderHome(data) {
  // Ultima News
  document.getElementById("newsTitle").textContent = data.news?.[0]?.titolo || "Nessuna notizia";
  document.getElementById("newsText").textContent = data.news?.[0]?.contenuto || "";

  // Prossima partita
  const prossima = (data.partite || []).find(p => p.futura === "TRUE");
  if (prossima) {
    document.getElementById("nextMatchTeams").textContent = `${prossima.casa} - ${prossima.fuori}`;
    document.getElementById("nextMatchDate").textContent = `${prossima.data}, ${prossima.ora} · Stadio Comunale`;
  }

  // Ultimo risultato
  const ultimeGiocate = (data.partite || []).filter(p => p.risultato).reverse();
  const ultima = ultimeGiocate[0];
  if (ultima) {
    document.getElementById("homeTeam").textContent = ultima.casa;
    document.getElementById("awayTeam").textContent = ultima.fuori;
    document.getElementById("lastResultScore").textContent = ultima.risultato;
    document.getElementById("homeLogo").src = `img/${ultima.logocasa}`;
    document.getElementById("awayLogo").src = `img/${ultima.logoavv}`;
  }
}

// 2. Mostra dati dalla cache subito (fallback)
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderHome(parsed);
  } catch (e) {
    console.warn("Errore cache home.");
  }
}

// 3. Aggiorna con i dati live da Sheets
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    renderHome(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
  })
  .catch(err => {
    console.error("Errore aggiornamento dati home:", err);
  });
