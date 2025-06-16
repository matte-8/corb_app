const url = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";
const cacheKey = "corbiolo_home_cache";

// Caricamento iniziale da cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const data = JSON.parse(cached);
    renderHome(data);
  } catch (e) {
    console.warn("Errore nel parsing della cache:", e);
  }
}

// Aggiornamento live da Google Sheets
fetch(url)
  .then(res => res.json())
  .then(data => {
    renderHome(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
  })
  .catch(err => {
    console.warn("Errore durante il caricamento dati live:", err);
  });

function renderHome(data) {
  // NEWS badge
  const hasNew = data.news.some(n => n.nuova === "TRUE");
  if (hasNew) {
    document.getElementById("badgeNewsCard").style.display = "inline-block";
  }

  // ULTIMA NEWS
  const ultimaNews = data.news[0];
  document.getElementById("newsTitle").textContent = ultimaNews?.titolo || "Nessuna notizia";
  document.getElementById("newsText").textContent = ultimaNews?.contenuto || "";

  // PROSSIMA PARTITA
  const prossima = data.partite.find(p => p.futura === "TRUE");
  if (prossima) {
    const infoBox = document.getElementById("prossimaInfo");
    infoBox.innerHTML = `
      <div class="section-title-icon">⚽️ Prossima Partita</div>
      <p>${prossima.casa} - ${prossima.fuori}</p>
      <p>${prossima.data}, ${prossima.ora} · Stadio Comunale</p>
    `;
  }

  // ULTIMA PARTITA
  const ultimaGiocata = data.partite.filter(p => p.risultato).reverse()[0];
  if (ultimaGiocata) {
    document.getElementById("homeLogo").src = "img/" + ultimaGiocata.logocasa;
    document.getElementById("awayLogo").src = "img/" + ultimaGiocata.logoavv;
    document.getElementById("lastResultScore").textContent = ultimaGiocata.risultato;
    document.getElementById("homeTeam").textContent = ultimaGiocata.casa;
    document.getElementById("awayTeam").textContent = ultimaGiocata.fuori;
  }
}
