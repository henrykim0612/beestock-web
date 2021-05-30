const main = (function () {

  function init() {
    initTabEvent();
  }

  function initTabEvent() {
    const tabs = document.getElementById('tabs').querySelectorAll('li');
    tabs.forEach(function(e) {
      e.addEventListener('click', function() {
        tabs.forEach(function(v) {
          v.classList.remove('is-active');
        });
        e.classList.add('is-active');
        hiddenTabContentAll();
        document.getElementById(e.dataset.contId).classList.remove('is-hidden');
      });
    })
  }

  function hiddenTabContentAll() {
    document.querySelectorAll('[data-name="tabContent"]').forEach(function(e) {
      e.classList.add('is-hidden');
    })
  }

  return {
    init: init,
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
