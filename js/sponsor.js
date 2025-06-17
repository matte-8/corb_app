document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sponsor-container");
  const sponsorList = JSON.parse(localStorage.getItem("sponsor") || "[]");

  if (sponsorList.length === 0) {
    container.innerHTML = "<p>Nessun sponsor disponibile.</p>";
    return;
  }

  container.innerHTML = ""; // Pulisce

  sponsorList.forEach(sp => {
    const card = document.createElement("div");
    card.className = "sponsor-card";

    const logo = document.createElement("img");
    logo.src = `img/${sp.logo}`;
    logo.alt = sp.nome;

    const link = document.createElement("a");
    link.href = sp.link || "#";
    link.target = "_blank";
    link.textContent = sp.nome;

    card.appendChild(logo);
    card.appendChild(link);
    container.appendChild(card);
  });
});
