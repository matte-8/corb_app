let deferredPrompt;

// Gestione evento installabile
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

// iOS: suggerimento per l'installazione manuale
window.addEventListener("load", () => {
  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const isInStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (isIOS && !isInStandalone) {
    setTimeout(() => {
      alert("Per installare l'app su iOS, premi 'Condividi' e poi 'Aggiungi a Home'.");
    }, 1000);
  }
});
