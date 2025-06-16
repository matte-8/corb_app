let deferredPrompt;

// Mostra il pulsante di installazione su Android/Chrome
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

// Mostra un popup elegante su iOS
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
      background: #fff;
      color: #000;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      font-size: 14px;
    ">
      📲 Per installare l'app premi <strong>Condividi</strong> <span style="font-size: 18px;">🔗</span> e poi <strong>Aggiungi a Home</strong>.
      <button onclick="document.getElementById('iosPrompt').remove()" style="
        float: right;
        margin-left: 10px;
        padding: 4px 8px;
        font-size: 12px;
        border: none;
        background: #660000;
        color: white;
        border-radius: 5px;
        cursor: pointer;
      ">OK</button>
    </div>
  `;
  document.body.appendChild(popup);
}
