const main = (function() {

  let global = {
    ckEditQaCont: undefined
  }

  function init() {
    createBreadCrumb();
    initCKEditor();
  }

  function initCKEditor() {
    cmmUtils.createCKEditor({selector: '#qaCont'}, function(editor) {
      global['ckEditQaCont'] = editor;
    });
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
    html += '      <span>Q&A 등록</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function insertNewQa() {
    if (verifyInputValues()) {
      cmmUtils.postData({
        url: '/api/v1/bbs/qa/insert',
        body: getParameters(),
        loading: 'btnIns'
      }).then(function (response) {
        if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐, 해킹의심
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
      qaCont: global['ckEditQaCont'].getData(),
      ckSecret: cmmUtils.getCheckedValues('ckSecret')[0]
    };
  }


  // 목록으로 돌아가기
  function goToQa() {
    cmmUtils.goToPage('/bbs/qa');
  }

  return {
    init: init,
    goToQa: goToQa,
    insertNewQa: insertNewQa
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});