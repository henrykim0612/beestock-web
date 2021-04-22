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
    html += '      <span>Q&A 등록</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function insertNewQa() {
    if (verifyInputValues()) {
      cmmConfirm.show({msg: 'Q&A로 등록 하시겠습니까?', color: 'is-warning'}, function() {
        cmmUtils.axiosPost({
          url: '/api/v1/bbs/qa/insert',
          body: getParameters(),
          loading: 'btnIns'
        }, function (response) {
          goToQa();
        });
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
    insertNewQa: insertNewQa
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});