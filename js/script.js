function toggleMenu() {
  const menu = document.getElementById("popupMenu");
  menu.classList.toggle("open");
}
<div id="news-container"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script>
const SHEET_API = "https://script.google.com/macros/s/AKfycby2micXUeoJcAb0zx-MncNXFMJLkf5BtPJdKcTkgzHXNHuSZIHr5ActFbcyKlt0OnJk/exec";

fetch(SHEET_API)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("news-container");
    container.innerHTML = ""; // Pulisce il contenuto
    data.forEach(item => {
      const box = document.createElement("div");
      box.className = "section";
      box.innerHTML = `
        <div class="section-title-icon">🗞️ ${item.titolo}</div>
        <p>${item.contenuto}</p>
        ${item.immagine ? `<img src="${item.immagine}" style="max-width:100%; margin-top:8px;">` : ""}
      `;
      container.appendChild(box);
    });
  })
  .catch(error => {
    console.error("Errore nel caricamento delle news:", error);
  });
</script>
