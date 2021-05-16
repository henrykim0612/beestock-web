const main = (function() {

  let global = {
    isAdmin: cmmUtils.nvl(document.getElementById('authority')) === '[ROLE_ADMIN]',
    loginId: cmmUtils.nvl(document.getElementById('loginId')),
    ckEditQaCont: undefined,
    ckEditQaAnswer: undefined
  }

  function init() {
    createBreadCrumb();
    drawDetails();
  }

  function createBreadCrumb() {
    const breadCrumbNav = document.getElementById('breadCrumbNav');
    let html = '';
    html += '<ul>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard.do">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BEESTOCK</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa.do">';
    html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
    html += '      <span>고객지원</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa.do">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
    html += '      <span>Q&A</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
    html += '      <span>Q&A 수정</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function drawDetails() {
    const qaId = document.getElementById('qaId').value;
    const url = '/api/v1/bbs/qa/' + qaId;
    cmmUtils.axiosGet({url: url}, function(response) {
      cmmUtils.bindData('qaDetailForm', response);
      initCKEditor(response)
      checkViewOnly(response);
    });
  }

  function initCKEditor(response) {
    const isReadOnly = global.loginId !== response['regLoginId'];
    cmmUtils.createCKEditor({selector: '#qaCont', isReadOnly: isReadOnly, data: response['qaCont']}, function(editor) {
      global['ckEditQaCont'] = editor;
    });
    // 관리자는 답변 활성화
    if (global['isAdmin']) {
      cmmUtils.createCKEditor({selector: '#qaAnswer', data: cmmUtils.nvl(response['qaAnswer'])}, function(editor) {
        global['ckEditQaAnswer'] = editor;
      });
    }
  }

  function checkViewOnly(response) {
    // 관리자가 아니고 본인의 글이 아니라면
    if (response['regLoginId'] !== global['loginId']) {
      setViewOnly();
    } else {
      // 답변이 완료된 글은 수정할 수 없음
      if (cmmUtils.nvl(response['qaAnswer']) !== '') {
        setViewOnly();
      }
    }

    function setViewOnly() {
      const qaTitle = document.getElementById('qaTitle')
      qaTitle.disabled = true;
      qaTitle.classList.remove('is-info');
      document.getElementById('ckSecret1').disabled = true;
      document.getElementById('ckSecret2').disabled = true;
      if (!global['isAdmin']) {
        document.getElementById('uptDiv').remove();
        document.getElementById('removeDiv').remove();
      }
    }
  }

  function modifyQa() {
    if (verifyInputValues()) {
      const msg = '해당글을 수정합니다.'
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        cmmUtils.axiosPost({
          url: '/api/v1/bbs/qa/update',
          body: getParameters(),
          loading: 'btnMod'
        }, function (response) {
          cmmUtils.showModal('saveModal');
        });
      });
    }
  }

  function removeQa() {
    const msg = '해당글을 삭제합니다.';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/bbs/qa/delete',
        body: getParameters(),
        loading: 'btnRm'
      }, function (response) {
        0 < response ? goToQa() : cmmUtils.goToErrorPage(response);
      });
    });
  }

  function verifyInputValues() {
    const qaTitle = document.getElementById('qaTitle').value;
    if (!qaTitle) {
      cmmUtils.showIpModal('제목');
      return false;
    }
    if (!global.ckEditQaCont.getData()) {
      cmmUtils.showIpModal('내용');
      return false;
    }
    return true;
  }

  function getParameters() {
    const props = {
      qaId: document.getElementById('qaId').value,
      qaTitle: document.getElementById('qaTitle').value,
      qaCont: global['ckEditQaCont'].getData(),
      ckSecret: cmmUtils.getCheckedValues('ckSecret')[0],
      regLoginId: document.getElementById('modUptLoginId').value,
      qaNo: parseInt(document.getElementById('qaNo').value)
    }
    if (global['isAdmin']) {
      props['qaAnswer'] = global['ckEditQaAnswer'].getData();
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