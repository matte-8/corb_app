document.addEventListener("DOMContentLoaded", () => {
  mostraUltimaNews();
  mostraUltimaPartita();
  mostraProssimaPartita();
});

function getDati(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function mostraUltimaNews() {
  const news = getDati("newsData"); // <-- giusto così, da "newsData"
  if (news.length > 0) {
    document.getElementById("newsTitle").textContent = news[0].titolo || "-";
    document.getElementById("newsText").textContent = news[0].contenuto || "-";
    document.getElementById("badgeNewsCard").style.display = "inline-block";
  }
}

function mostraUltimaPartita() {
  const partite = getDati("partite");

  const passate = partite.filter(p => {
    const d = new Date(p.data + "T" + (p.ora || "00:00"));
    return d < new Date();
  }).sort((a, b) => new Date(b.data) - new Date(a.data));

  if (passate.length > 0) {
    const partita = passate[0];
    document.getElementById("homeLogo").src = "img/" + (partita.logocasa || "logo.png");
    document.getElementById("awayLogo").src = "img/" + (partita.logoavv || "opponent.png");
    document.getElementById("lastResultScore").textContent = partita.risultato || "-";
    document.getElementById("homeTeam").textContent = partita.casa || "-";
    document.getElementById("awayTeam").textContent = partita.fuori || "-";
  }
}

function mostraProssimaPartita() {
  const partite = getDati("partite");

  const future = partite.filter(p => {
    const d = new Date(p.data + "T" + (p.ora || "00:00"));
    return d >= new Date();
  }).sort((a, b) => new Date(a.data) - new Date(b.data));

  if (future.length > 0) {
    const prossima = future[0];
    const squadre = (prossima.casa || "-") + " vs " + (prossima.fuori || "-");
    const dataMatch = formattaData(prossima.data) + " " + (prossima.ora || "");
    document.getElementById("nextMatchTeams").textContent = squadre;
    document.getElementById("nextMatchDate").textContent = dataMatch;
  }
}

function formattaData(d) {
  if (!d) return "-";
  const parts = d.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
