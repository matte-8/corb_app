const cacheKey = "corbiolo_home_cache";
const apiUrl = "https://script.google.com/macros/s/AKfycbx1Lh2iRYAlC6JgYpGYXn9m4yv0wlSXpJedAAzzaBjksiv85Cw8pvHFj0gTv74amziuvg/exec";

// 1. Applica dati nella home
function renderHome(data) {
  // Ultima notizia
  document.getElementById("newsTitle").textContent = data.news[0]?.titolo || "Nessuna notizia";
  document.getElementById("newsText").textContent = data.news[0]?.contenuto || "";

  // Prossima partita
  const prossima = data.partite.find(p => p.futura === "TRUE");
  if (prossima) {
    document.getElementById("nextMatchTeams").textContent = `${prossima.casa} - ${prossima.fuori}`;
    document.getElementById("nextMatchDate").textContent = `${prossima.data}, ${prossima.ora} · Stadio Comunale`;
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

// 2. Prova a caricare dalla cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const cachedData = JSON.parse(cached);
    renderHome(cachedData);
  } catch {}
}

// 3. Poi aggiorna live dai dati di Sheets
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    renderHome(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
  })
  .catch(err => {
    console.warn("Errore durante aggiornamento live:", err);
  });
