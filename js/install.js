let deferredPrompt;

// Per Android / Chrome
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installIcon = document.querySelector(".install-icon");
  if (installIcon) {
    installIcon.style.display = "block";
    installIcon.addEventListener("click", () => {
      installIcon.style.display = "none";
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    });
  }
});

// Per iOS elegante
window.addEventListener("load", () => {
  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const isInStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (isIOS && !isInStandalone) {
    showIOSPrompt();
  }
});

function showIOSPrompt() {
  const popup = document.createElement("div");
  popup.id = "iosPrompt";
  popup.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: white;
      color: black;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      font-size: 15px;
      z-index: 9999;
      animation: slideUp 0.4s ease-out;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>📲 Per installare l'app: premi <strong>Condividi</strong> 🔗 e poi <strong>Aggiungi a Home</strong>.</span>
        <span style="cursor:pointer; font-weight: bold; margin-left: 15px;" onclick="document.getElementById('iosPrompt').remove()">✖️</span>
      </div>
    </div>
  `;

  // Aggiungi animazione CSS dinamicamente
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes slideUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(popup);
}
