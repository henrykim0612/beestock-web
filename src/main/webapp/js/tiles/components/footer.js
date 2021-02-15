const footerMain = (function() {

  // 이용약관
  function openModal1() {
    cmmUtils.showModal('footerModal1');
  }

  // 법적 고지
  function openModal2() {
    cmmUtils.showModal('footerModal2');
  }

  return {
    openModal1: openModal1,
    openModal2: openModal2
  }

}());