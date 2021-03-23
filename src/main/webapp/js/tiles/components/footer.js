const footerMain = (function() {

  // 이용약관
  function openModal1() {
    cmmUtils.showModal('footerModal1');
  }

  // 법적 고지
  function openModal2() {
    cmmUtils.showModal('footerModal2');
  }

  // 개인정보 처리방침
  function openModal3() {
    cmmUtils.showModal('footerModal3');
  }

  // 법령링크
  function openGov() {
    cmmUtils.goToLinkPop('https://www.law.go.kr/LSW/LsiJoLinkP.do?lsNm=%EC%A0%84%EC%9E%90%EC%83%81%EA%B1%B0%EB%9E%98+%EB%93%B1%EC%97%90%EC%84%9C%EC%9D%98+%EC%86%8C%EB%B9%84%EC%9E%90%EB%B3%B4%ED%98%B8%EC%97%90+%EA%B4%80%ED%95%9C+%EB%B2%95%EB%A5%A0+%EC%8B%9C%ED%96%89%EB%A0%B9&paras=1&docType=JO&languageType=KO&joNo=002100002#');
  }

  return {
    openModal1: openModal1,
    openModal2: openModal2,
    openModal3: openModal3,
    openGov: openGov
  }

}());