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
    html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
    html += '      <span>고객센터</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
    html += '      <span>Q&A</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
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
        cmmUtils.verifyResponse(response);
        goToQa();
      }).catch(function (err) {
        cmmUtils.goToErrorPage(err);
      });
    }
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
    insertNewQa: insertNewQa,
    test: function() { return global.ckEditQaCont;}
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});