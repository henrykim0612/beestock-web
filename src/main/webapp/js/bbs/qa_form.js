const main = (function() {

  function insertNewQa() {
    if (verifyInputValues()) {
      cmmUtils.postData({
        url: '/api/v1/bbs/qa/insert',
        body: getParameters(),
        loading: 'btnIns'
      }).then(function (response) {
        goToQa();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnIns'));
        cmmUtils.showErrModal();
        console.log(err);
      });
    }
  }

  function verifyInputValues() {
    const qaTitle = document.getElementById('qaTitle').value;
    if (!qaTitle) {
      cmmUtils.showIpModal('제목');
      return false;
    }
    return true;
  }

  function getParameters() {
    return {
      qaTitle: document.getElementById('qaTitle').value,
      qaCont: document.getElementById('qaCont').value,
      ckSecret: cmmUtils.getCheckedValues('ckSecret')[0]
    };
  }


  // 목록으로 돌아가기
  function goToQa() {
    cmmUtils.goToPage('/bbs/qa');
  }

  return {
    goToQa: goToQa,
    insertNewQa: insertNewQa
  }
})();
