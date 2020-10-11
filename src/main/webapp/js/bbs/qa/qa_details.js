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
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa">';
    html += '      <span class="icon is-small"><i class="fas fa-puzzle-piece"></i></span>';
    html += '      <span>Q&A</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
    html += '      <span>Q&A 상세보기</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initCKEditor(response) {

    // 관리자가 아니고 본인이 작성한 글이 아니라면 Edit Toolbar 제거
    if (!global['isAdmin'] && response['regLoginId'] !== global['loginId']) {
      
    }

    if (!global['ckEditQaCont']) {
      cmmUtils.createCKEditor('#qaCont', function(editor) {
        global['ckEditQaCont'] = editor;
      });
    }
    if (!global['ckEditQaCont']) {
      cmmUtils.createCKEditor('#qaAnswer', function(editor) {
        global['ckEditQaAnswer'] = editor;
      });
    }
  }

  function drawDetails() {
    const qaId = document.getElementById('qaId').value;
    const url = '/api/v1/bbs/qa/' + qaId;
    cmmUtils.getData({
      url: url,
    }).then(function (response) {
      cmmUtils.bindData('qaDetailForm', response);
      cmmUtils.setCKEditor([{key: 'qaCont', editor: global['ckEditQaCont']}, {key: 'qaAnswer', editor: global['ckEditQaAnswer']}], response);
      initCKEditor(response);
      checkViewOnly(response);
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function checkViewOnly(response) {

    // 관리자는 답변 활성화
    global['ckEditQaAnswer'].isReadOnly = !global['isAdmin'];

    // 관리자가 아니고 본인의 글이 아니라면
    if (!global['isAdmin'] && response['regLoginId'] !== global['loginId']) {
      setViewOnly();
    } else {
      // 답변이 완료된 글은 수정할 수 없음
      if (!global['isAdmin'] && cmmUtils.nvl(response['qaAnswer']) !== '') {
        setViewOnly();
      }
    }

    function setViewOnly() {
      const qaTitle = document.getElementById('qaTitle')
      qaTitle.disabled = true;
      qaTitle.classList.remove('is-info');
      global['ckEditQaCont'].isReadOnly = true;
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
          if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐, 해킹의심
          cmmUtils.showModal('saveModal');
          if (0 < response) {
            init();
          }
        }).catch(function (err) {
          console.log(err);
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
      cmmUtils.postData({
        url: '/api/v1/bbs/qa/delete',
        body: getParameters(),
        loading: 'btnRm'
      }).then(function (response) {
        if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐, 해킹의심
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
      qaCont: global['ckEditQaCont'].getData(),
      ckSecret: cmmUtils.getCheckedValues('ckSecret')[0],
      regLoginId: document.getElementById('modUptLoginId').value
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
    getGlobal: function() {
      return global;
    },
    goToQa: goToQa,
    modifyQa: modifyQa,
    removeQa: removeQa
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});