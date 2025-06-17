document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("newsContainer");
  const news = JSON.parse(localStorage.getItem("news") || "[]");

  if (news.length === 0) {
    container.innerHTML = "<p>📰 Nessuna notizia disponibile.</p>";
    return;
  }

  news.forEach(item => {
    const card = document.createElement("div");
    card.className = "section";
    card.innerHTML = `
      <div class="section-title-icon">🗞️ ${item.titolo}</div>
      <p>${item.contenuto}</p>
    `;
    container.appendChild(card);
  });
});
