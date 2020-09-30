const main = (function() {

  let global = {
    isAdmin: document.getElementById('authority').value === '[ROLE_ADMIN]',
    loginId: document.getElementById('loginId').value
  }

  function init() {
    drawDetails();
  }

  function drawDetails() {
    const qaId = document.getElementById('qaId').value;
    const url = '/api/v1/bbs/qa/' + qaId;
    cmmUtils.getData({
      url: url,
    }).then(function (response) {
      cmmUtils.bindData('qaDetailForm', response);
      checkViewOnly(response);
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function checkViewOnly(response) {

    document.getElementById('qaAnswer').disabled = !global['isAdmin']; // 관리자는 답변 활성화
    if (!global['isAdmin'] && response['regLoginId'] !== global['loginId']) { // 관리자가 아니고 본인의 글이 아니라면
      setViewOnly();
    } else {
      if (!global['isAdmin'] && cmmUtils.nvl(response['qaAnswer']) !== '') {
        // 답변이 완료된 글은 수정할 수 없음
        setViewOnly();
      }
    }

    function setViewOnly() {
      document.getElementById('qaTitle').disabled = true;
      document.getElementById('qaCont').disabled = true;
      document.getElementById('ckSecret1').disabled = true;
      document.getElementById('ckSecret2').disabled = true;
      document.getElementById('uptDiv').remove();
      document.getElementById('removeDiv').remove();
    }
  }

  function modifyQa() {
    if (verifyInputValues()) {
      const msg = '해당글을 수정합니다.'
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        cmmUtils.postData({
          url: '/api/v1/bbs/qa/update',
          body: getParameters(),
          loading: 'btnMod'
        }).then(function (response) {
          cmmUtils.showModal('saveModal');
          if (0 < response) {
            init();
          }
        }).catch(function (err) {
          cmmUtils.hideLoadingElement(document.getElementById('btnMod'));
          cmmUtils.showErrModal();
          console.log(err);
        });
      });
    }
  }

  function removeQa() {
    const msg = '해당글을 삭제합니다.';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      const url = '/api/v1/bbs/qa/delete/' + document.getElementById('qaId').value;
      cmmUtils.getData({
        url: url,
        loading: 'btnRm'
      }).then(function (response) {
        0 < response ? goToQa() : cmmUtils.showErrModal();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnRm'));
        cmmUtils.showErrModal();
        console.log(err);
      });
    });
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
    const props = {
      qaId: document.getElementById('qaId').value,
      qaTitle: document.getElementById('qaTitle').value,
      qaCont: document.getElementById('qaCont').value,
      ckSecret: cmmUtils.getCheckedValues('ckSecret')[0]
    }
    if (global['isAdmin']) {
      props['qaAnswer'] = document.getElementById('qaAnswer').value;
    }
    return props;
  }


  // 목록으로 돌아가기
  function goToQa() {
    cmmUtils.goToPage('/bbs/qa');
  }

  return {
    init: init,
    goToQa: goToQa,
    modifyQa: modifyQa,
    removeQa: removeQa
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});