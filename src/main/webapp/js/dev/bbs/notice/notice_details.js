const main = (function() {

  let global = {
    noticeId: null,
    isAdmin: cmmUtils.nvl(document.getElementById('authority')) === '[ROLE_ADMIN]',
    loginId: cmmUtils.nvl(document.getElementById('loginId')),
    ckEditNoticeCont: undefined,
  }

  function init() {
    global.noticeId = document.getElementById('noticeId').value;
    createBreadCrumb();
    drawDetails();
    insertAlarm();
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
    html += '    <a href="' + CONTEXT_PATH + '/bbs/notice.do">';
    html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
    html += '      <span>고객지원</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/notice.do">';
    html += '      <span class="icon is-small"><i class="fas fa-bullhorn"></i></span>';
    html += '      <span>공지사항</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-bullhorn"></i></span>';
    html += '      <span>공지사항 상세보기</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function drawDetails() {
    const noticeId = document.getElementById('noticeId').value;
    const url = '/api/v1/bbs/notice/' + noticeId;
    cmmUtils.axiosGet({url: url}, function(response) {
      cmmUtils.bindData('noticeDetailForm', response);
    });
  }

  // 수신 상태로 변경
  function insertAlarm() {
    cmmUtils.axiosPost({url: '/api/v1/bbs/notice/insert-alarm', body: {noticeId: global.noticeId}});
  }

  // 목록으로 돌아가기
  function goToNotice() {
    cmmUtils.goToPage('/bbs/notice');
  }

  // 수정 페이지로로
 function goToModify() {
   const url = '/bbs/notice/modify/' + global.noticeId;
   cmmUtils.goToPage(url);
  }

  return {
    init: init,
    goToNotice: goToNotice,
    goToModify: goToModify
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});