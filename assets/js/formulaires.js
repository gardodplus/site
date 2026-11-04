// Envoi des formulaires sans quitter la page.
// - Formulaire bénévole : Web3Forms (réponse lisible, succès ou erreur).
// - « Préviens-moi » : Brevo (réponse non lisible depuis notre site, on confirme dès que l'envoi est parti ;
//   la validité de l'e-mail est contrôlée avant l'envoi, puis Brevo envoie le mail de confirmation).
// Sans JavaScript, chaque formulaire s'envoie quand même, vers la page de confirmation du service.
(function () {
  var MESSAGES = {
    web3forms: {
      ok: 'Merci ! Ton message est bien parti, on te répond vite.',
      erreur: "L'envoi n'a pas marché. Réessaie dans un moment, ou écris-nous directement à contact@gardodplus.fr."
    },
    brevo: {
      ok: "C'est noté ! Vérifie ta boîte mail (et tes spams) pour confirmer ton inscription.",
      erreur: "Oups, l'inscription n'a pas marché. Réessaie dans un moment."
    }
  };

  function envoyerWeb3Forms(form) {
    var donnees = Object.fromEntries(new FormData(form));
    return fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(donnees)
    })
      .then(function (r) { return r.json().then(function (j) { return r.ok && j.success; }); });
  }

  function envoyerBrevo(form) {
    var donnees = new FormData(form);
    if (donnees.get('email_address_check')) return Promise.resolve(true); // robot : on ne transmet pas
    return fetch(form.action, { method: 'POST', mode: 'no-cors', body: donnees })
      .then(function () { return true; });
  }

  document.querySelectorAll('.js-formulaire').forEach(function (form) {
    var service = form.dataset.service === 'brevo' ? 'brevo' : 'web3forms';
    var statut = form.querySelector('.formulaire__statut');
    var bouton = form.querySelector('button[type="submit"]');

    function afficher(cle, type) {
      statut.textContent = cle;
      statut.classList.remove('formulaire__statut--ok', 'formulaire__statut--erreur', 'formulaire__statut--attente');
      statut.classList.add('formulaire__statut--' + type);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      bouton.disabled = true;
      afficher('Envoi en cours…', 'attente');
      var envoi = service === 'brevo' ? envoyerBrevo(form) : envoyerWeb3Forms(form);
      envoi
        .then(function (ok) {
          if (ok) { form.reset(); afficher(MESSAGES[service].ok, 'ok'); }
          else { afficher(MESSAGES[service].erreur, 'erreur'); }
        })
        .catch(function () { afficher(MESSAGES[service].erreur, 'erreur'); })
        .finally(function () { bouton.disabled = false; });
    });
  });
})();
