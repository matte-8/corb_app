const SHEET_URL = "https://script.google.com/macros/s/AKfycbx1Lh2iRYAlC6JgYpGYXn9m4yv0wlSXpJedAAzzaBjksiv85Cw8pvHFj0gTv74amziuvg/exec";

// --- Caricamento iniziale ---
window.addEventListener("DOMContentLoaded", () => {
  const cachedData = localStorage.getItem("corbioloData");
  if (cachedData) {
    populateHome(JSON.parse(cachedData));
  }
  fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("corbioloData", JSON.stringify(data));
      populateHome(data);
    })
    .catch(err => console.error("Errore nel caricamento dati:", err));
});

// --- Popola la home con i dati ---
function populateHome(data) {
  showNewsBadge(data.news);
  showLastNews(data.news);
  showLastResult(data.partite);
  showNextMatch(data.calendario);
}

// --- Badge "NEW" se esistono notizie nuove ---
function showNewsBadge(news) {
  const hasNew = news.some(n => n.nuova === "TRUE");
  if (hasNew) {
    document.getElementById("badgeNews").style.display = "inline-block";
    document.getElementById("badgeNewsCard").style.display = "inline-block";
  } else {
    document.getElementById("badgeNews").style.display = "none";
    document.getElementById("badgeNewsCard").style.display = "none";
  }
}

// --- Ultima notizia nella home ---
function showLastNews(news) {
  if (!news.length) return;
  const last = news[0];
  const container = document.getElementById("last-news");
  container.innerHTML = `
    <div class="section-title-icon">🗞️ Ultima Notizia</div>
    <p><strong>${last.titolo}</strong></p>
    <p>${last.contenuto}</p>
  `;
}

// --- Mostra ultima partita giocata (più recente con risultato) ---
function showLastResult(partite) {
  if (!partite || !partite.length) return;
  const sorted = partite
    .filter(p => p.risultato && p.risultato.trim() !== "")
    .sort((a, b) => new Date(b.data) - new Date(a.data));
  const match = sorted[0];
  if (!match) return;

  document.getElementById("result-card").innerHTML = `
    <div class="result-row">
      <img src="${match.logocasa}" alt="${match.casa}" class="team-logo" />
      <div class="result-score">${match.risultato}</div>
      <img src="${match.logoavv}" alt="${match.fuori}" class="team-logo" />
    </div>
    <div class="result-names">
      <div class="team-name">${match.casa}</div>
      <div class="team-name">${match.fuori}</div>
    </div>
  `;
}

// --- Mostra prossima partita (più futura) ---
function showNextMatch(calendario) {
  if (!calendario || !calendario.length) return;
  const now = new Date();
  const sorted = calendario
    .map(item => ({ ...item, date: new Date(item.data) }))
    .filter(item => item.date >= now)
    .sort((a, b) => a.date - b.date);
  const next = sorted[0];
  if (!next) return;

  const giornoSettimana = next.date.toLocaleDateString('it-IT', { weekday: 'long' });
  const dataString = next.date.toLocaleDateString('it-IT');
  const casa = next.casa_fuori.toLowerCase() === "casa";
  const emoji = casa ? "🏠" : "✈️";

  document.getElementById("next-match-card").innerHTML = `
    <div class="card-icon">📅</div>
    <div><strong>${giornoSettimana}, ${dataString}</strong></div>
    <div>${emoji} vs ${next.avversario}</div>
  `;
}
