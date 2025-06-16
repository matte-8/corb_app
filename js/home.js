const cacheKey = "corbiolo_home_cache";
const apiUrl = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

// Funzione per mostrare i dati nella home
function renderHome(data) {
  // Ultima notizia
  const news = data.news?.[0];
  document.getElementById("newsTitle").textContent = news?.titolo || "Nessuna notizia disponibile.";
  document.getElementById("newsText").textContent = news?.contenuto || "";

  // Prossima partita
  const prossima = data.partite?.find(p => p.futura === "TRUE");
  if (prossima) {
    document.getElementById("prossimaInfo").innerHTML = `
      <div class="section-title-icon">⚽️ Prossima Partita</div>
      <p>${prossima.casa} - ${prossima.fuori}</p>
      <p>${prossima.data}, ${prossima.ora} · Stadio Comunale</p>
    `;
  }

  // Ultima partita
  const ultima = data.partite?.filter(p => p.risultato)?.reverse()?.[0];
  if (ultima) {
    document.getElementById("risultatoContainer").innerHTML = `
      <div class="card result-large">
        <div class="result-row">
          <img src="img/${ultima.logocasa}" alt="Casa" class="team-logo" />
          <div class="result-score">${ultima.risultato}</div>
          <img src="img/${ultima.logoavv}" alt="Avversario" class="team-logo" />
        </div>
        <div class="result-names">
          <div class="team-name">${ultima.casa}</div>
          <div class="team-name">${ultima.fuori}</div>
        </div>
      </div>
    `;
  }

  // Mostra badge "NEW" se ci sono news nuove
  const hasNew = data.news?.some(n => n.nuova === "TRUE");
  if (hasNew) {
    document.getElementById("badgeNewsCard").style.display = "inline-block";
  }
}

// 1. Carica dati dalla cache
const cached = localStorage.getItem(cacheKey);
if (cached) {
  try {
    const parsed = JSON.parse(cached);
    renderHome(parsed);
  } catch (e) {
    console.warn("Errore nel parsing cache:", e);
  }
}

// 2. Carica dati aggiornati da remoto
fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    renderHome(data);
    localStorage.setItem(cacheKey, JSON.stringify(data));
  })
  .catch(err => {
    console.error("Errore aggiornamento dati:", err);
  });
