const cacheKey = "corbiolo_home_cache";
const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

// Applica i dati nella home
function renderHome(data) {
  // Ultima notizia
  const ultimaNews = data.news?.[0];
  if (ultimaNews) {
    document.getElementById("newsTitle").textContent = ultimaNews.titolo;
    document.getElementById("newsText").textContent = ultimaNews.contenuto;

    // Badge se la news è nuova
    if (ultimaNews.nuova === "TRUE") {
      const badge = document.getElementById("badgeNewsCard");
      if (badge) badge.style.display = "inline-block";
    }
  }

  // Prossima partita
  const prossima = data.partite?.find(p => p.futura === "TRUE");
  if (prossima) {
    document.getElementById("prossimaInfo").innerHTML = `
      <div class="section-title-icon">⚽️ Prossima Partita</div>
      <p>${prossima.casa} - ${prossima.fuori}</p>
      <p>${prossima.data}, ${prossima.ora} · Stadio Comunale</p>
    `;
  }

  // Ultima partita (con risultato)
  const ultima = (data.partite || []).filter(p => p.risultato).reverse()[0];
  if (ultima) {
    document.getElementById("homeLogo").src = `img/${ultima.logocasa}`;
    document.getElementById("awayLogo").src = `img/${ultima.logoavv}`;
    document.getElementById("lastResultScore").textContent = ultima.risultato;
    document.getElementById("homeTeam").textContent = ultima.casa;
    document.getElementById("awayTeam").textContent = ultima.fuori;
  }
}

// Prova a caricare subito i dati dalla cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const cachedData = JSON.parse(cached);
    renderHome(cachedData);
  } catch (e) {
    console.warn("Errore nella cache:", e);
  }
}

// Poi aggiorna i dati da remoto
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    renderHome(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
  })
  .catch(err => {
    console.warn("Errore nel caricamento live:", err);
  });
