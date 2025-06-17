
// HOME.JS

// NEWS
const news = JSON.parse(localStorage.getItem("newsData") || "[]");
if (news.length > 0) {
  document.getElementById("newsTitle").textContent = news[0].titolo || "-";
  document.getElementById("newsText").textContent = news[0].contenuto || "-";
}

// PROSSIMA PARTITA
const calendario = JSON.parse(localStorage.getItem("calendario") || "[]");
if (calendario.length > 0) {
  const prossima = calendario.find(e => new Date(e.data) >= new Date());
  if (prossima) {
    const d = new Date(prossima.data);
    const op = prossima.avversario || "-";
    const cf = prossima.casa_fuori === "casa" ? "in casa" : "in trasferta";
    document.getElementById("nextMatchTeams").textContent = "vs " + op + " (" + cf + ")";
    document.getElementById("nextMatchDate").textContent = d.toLocaleDateString("it-IT", {
      day: "numeric", month: "short", year: "numeric"
    });
  }
}

// ULTIMA PARTITA
const partite = JSON.parse(localStorage.getItem("partite") || "[]");
if (partite.length > 0) {
  const ultima = partite[0];
  document.getElementById("homeTeam").textContent = ultima.casa || "-";
  document.getElementById("awayTeam").textContent = ultima.fuori || "-";
  document.getElementById("lastResultScore").textContent = ultima.risultato || "-";
  document.getElementById("homeLogo").src = "img/" + (ultima.logocasa || "logo.png");
  document.getElementById("awayLogo").src = "img/" + (ultima.logoavv || "opponent.png");
  document.getElementById("mvpDisplay").textContent = "🏆 MVP: " + (ultima.mvp || "--");
}
