// Menu mobile : ouvre / ferme la navigation.
(function () {
  var bouton = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (!bouton || !menu) return;
  bouton.addEventListener('click', function () {
    var ouvert = bouton.getAttribute('aria-expanded') === 'true';
    bouton.setAttribute('aria-expanded', String(!ouvert));
    bouton.setAttribute('aria-label', ouvert ? 'Ouvrir le menu' : 'Fermer le menu');
    menu.classList.toggle('menu--ouvert', !ouvert);
  });
})();
