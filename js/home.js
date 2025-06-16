<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin - U.S. Corbiolo C5</title>
  <link rel="stylesheet" href="css/style.css" />
  <style>
    #adminContent { display: none; padding-top: 80px; }
    #passwordPrompt {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.9); display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      color: white; z-index: 2000;
    }
    #passwordPrompt input, #passwordPrompt button {
      padding: 10px; font-size: 16px; margin-top: 10px;
    }
    .section {
      margin: 16px; padding: 14px;
      background: #801e1e; border-radius: 8px;
    }
    .section-title-icon {
      font-size: 18px; margin-bottom: 8px;
    }
    .section input, .section textarea, .section select {
      width: 100%; margin-bottom: 8px;
      padding: 8px; border-radius: 4px; border: none;
    }
    .section button {
      padding: 10px 16px; border: none;
      border-radius: 4px; background: #ffcc00;
      color: #000; cursor: pointer;
    }
    .item {
      background: #b94444; margin: 8px 0; padding: 8px;
      border-radius: 6px; color: white;
    }
    .item input, .item textarea, .item select {
      width: calc(100% - 12px); margin: 4px 0;
    }
    .item button {
      margin-right: 6px; margin-top: 4px;
    }
  </style>
</head>
<body>

<div id="passwordPrompt">
  <h2>Accesso Admin</h2>
  <input type="password" id="adminPass" placeholder="Inserisci password">
  <button onclick="checkPassword()">Accedi</button>
</div>

<div id="adminContent">
  <header class="header">
    <img src="img/logo.png" alt="Logo" class="logo" />
    <h1 class="page-title">Admin</h1>
    <div class="menu-icon" onclick="toggleMenu()">☰</div>
  </header>

  <div class="popup-menu" id="popupMenu">
    <a href="index.html">🏠 Home</a>
    <a href="news.html">🗞️ News</a>
    <a href="squadra.html">👥 Squadra</a>
    <a href="partite.html">⚽️ Partite</a>
    <a href="calendario.html">🗓 Calendario</a>
    <a href="sponsor.html">💰 Sponsor</a>
    <a href="admin.html">🔐 Admin</a>
  </div>

  <!-- Sezioni Interattive -->
  <div class="section">
    <div class="section-title-icon">🆕 Inserimento Contenuti</div>
    <!-- (inserimento: news, giocatori, sponsor, partite, calendario) -->
    <!-- Ti ho già fornito questa parte — posso reinserirla qui su richiesta -->
  </div>

  <div class="section">
    <div class="section-title-icon">✏️ Modifica o Elimina Contenuti</div>
    <div id="modificaNews"></div>
    <div id="modificaGiocatori"></div>
    <div id="modificaSponsor"></div>
    <div id="modificaPartite"></div>
    <div id="modificaCalendario"></div>
  </div>

  <div class="footer">
    <div class="sponsor-title">Sponsor</div>
    <div class="carousel-wrapper">
      <div class="carousel-content">
        <img src="img/sponsor1.png" alt="Sponsor 1" />
        <img src="img/sponsor2.png" alt="Sponsor 2" />
        <img src="img/sponsor3.png" alt="Sponsor 3" />
      </div>
    </div>
  </div>
</div>

<script>
  function toggleMenu() {
    const m = document.getElementById("popupMenu");
    m.style.display = m.style.display === "flex" ? "none" : "flex";
  }

  function checkPassword() {
    const pwd = document.getElementById("adminPass").value;
    if (pwd === "corb25") {
      document.getElementById("passwordPrompt").style.display = "none";
      document.getElementById("adminContent").style.display = "block";
      caricaTuttiIDati();
    } else {
      alert("Password errata");
    }
  }

  function caricaTuttiIDati() {
    renderModifica("newsData", "News", ["titolo", "contenuto"]);
    renderModifica("giocatori", "Giocatori", ["nome", "ruolo", "numero", "foto"]);
    renderModifica("sponsor", "Sponsor", ["nome", "logo", "link"]);
    renderModifica("partite", "Partite", ["data", "ora", "casa", "logocasa", "fuori", "logoavv", "risultato"]);
    renderModifica("calendario", "Calendario", ["data", "avversario", "casa_fuori"]);
  }

  function renderModifica(key, label, fields) {
    const div = document.getElementById("modifica" + label);
    const dati = JSON.parse(localStorage.getItem(key) || "[]");
    div.innerHTML = `<h3>${label}</h3>`;
    dati.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "item";
      fields.forEach(f => {
        const input = document.createElement(f === "contenuto" ? "textarea" : "input");
        input.value = item[f] || "";
        input.dataset.f = f;
        wrapper.appendChild(input);
      });
      const btnSalva = document.createElement("button");
      btnSalva.textContent = "💾 Salva";
      btnSalva.onclick = () => {
        fields.forEach(f => item[f] = wrapper.querySelector(`[data-f="${f}"]`).value.trim());
        dati[index] = item;
        localStorage.setItem(key, JSON.stringify(dati));
        alert("Salvato");
      };
      const btnElimina = document.createElement("button");
      btnElimina.textContent = "🗑️ Elimina";
      btnElimina.onclick = () => {
        if (confirm("Eliminare questo elemento?")) {
          dati.splice(index, 1);
          localStorage.setItem(key, JSON.stringify(dati));
          renderModifica(key, label, fields);
        }
      };
      wrapper.appendChild(btnSalva);
      wrapper.appendChild(btnElimina);
      div.appendChild(wrapper);
    });
  }
</script>

</body>
</html>
