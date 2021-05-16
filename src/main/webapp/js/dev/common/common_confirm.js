const cmmConfirm = (function () {

  let global = {
    callback: undefined
  }

  function show(props, callback) {
    cmmUtils.removeClassAll('confirmArticle');
    setColor(props);
    setMessage(props);
    global['callback'] = callback;
    cmmUtils.showModal('confirmModal');
  }

  function closeModal() {
    cmmUtils.closeModal('confirmModal');
  }

  function setMessage(props) {
    document.getElementById('confirmTextDiv').innerHTML = props['msg'];
  }

  function setColor(props) {
    const confirmArticle = document.getElementById('confirmArticle');
    confirmArticle.classList.add('message');
    confirmArticle.classList.add(props['color'] != null ? props['color'] : 'is-dark');
  }

  // 확인
  function confirm() {
    cmmUtils.closeModal('confirmModal');
    global['callback']();
  }

  return {
    show: show,
    closeModal: closeModal,
    confirm: confirm
  }

})();