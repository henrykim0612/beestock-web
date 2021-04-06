const main = (function () {

  function init() {
  }

  function payment() {
    alert('PG 연동 준비중입니다.');
  }

  return {
    init: init,
    payment: payment
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
