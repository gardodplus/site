// Envoi des formulaires sans quitter la page (Web3Forms).
// Sans JavaScript, le formulaire s'envoie quand même, vers la page de confirmation de Web3Forms.
(function () {
  document.querySelectorAll('.js-formulaire').forEach(function (form) {
    var statut = form.querySelector('.formulaire__statut');
    var bouton = form.querySelector('button[type="submit"]');

    function afficher(message, type) {
      statut.textContent = message;
      statut.className = 'formulaire__statut formulaire__statut--' + type;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var donnees = Object.fromEntries(new FormData(form));
      bouton.disabled = true;
      afficher('Envoi en cours…', 'attente');
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(donnees)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.success, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            afficher('Merci ! Ton message est bien parti, on te répond vite.', 'ok');
          } else {
            afficher("L'envoi n'a pas marché. Réessaie dans un moment, ou écris-nous directement à contact@gardodplus.fr.", 'erreur');
          }
        })
        .catch(function () {
          afficher("L'envoi n'a pas marché (connexion ?). Réessaie, ou écris-nous à contact@gardodplus.fr.", 'erreur');
        })
        .finally(function () { bouton.disabled = false; });
    });
  });
})();
