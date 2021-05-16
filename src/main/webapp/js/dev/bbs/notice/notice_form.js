const main = (function() {

  let global = {
    isAdmin: cmmUtils.nvl(document.getElementById('authority')) === '[ROLE_ADMIN]',
    loginId: cmmUtils.nvl(document.getElementById('loginId')),
    ckEditNoticeCont: undefined,
  }

  function init() {
    createBreadCrumb();
    cmmUtils.initCalendar();
    initCKEditor();
  }

  function initCKEditor() {
    if (!global['ckEditNoticeCont']) {
      cmmUtils.createCKEditor({selector: '#noticeCont'}, function(editor) {
        global['ckEditNoticeCont'] = editor;
      });
    }
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
    html += '      <span>공지사항 등록</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function insertNotice() {
    if (verifyInputValues()) {
      cmmUtils.axiosPost({
        url: '/api/v1/bbs/notice/insert',
        body: getParameters(),
        loading: 'btnIns'
      }, function (response) {
        goToNotice();
      });
    }
  }

  function verifyInputValues() {
    const noticeTitle = document.getElementById('noticeTitle').value;
    const stDate = cmmUtils.getCalendarValue('alarmStDate');
    const edDate = cmmUtils.getCalendarValue('alarmEdDate');
    if (!noticeTitle) {
      cmmUtils.showIpModal('제목');
      return false;
    }
    if (!global.ckEditNoticeCont.getData()) {
      cmmUtils.showIpModal('내용');
      return false;
    }
    if (!stDate && edDate) {
      cmmUtils.showIpModal('공지 시작일');
      return false;
    }
    if (stDate && !edDate) {
      cmmUtils.showIpModal('공지 종료일');
      return false;
    }
    if ((stDate && edDate) && (!cmmUtils.isValidDateRange('alarmStDate', 'alarmEdDate'))) {
      cmmUtils.showIpModal('공지기간', '공지 종료일은 공지 시작일보다 빠를 수 없습니다.');
      return false;
    }
    return true;
  }

  function getParameters() {
    return {
      noticeTitle: document.getElementById('noticeTitle').value,
      noticeCont: global['ckEditNoticeCont'].getData(),
      alarmStDate: cmmUtils.getCalendarValue('alarmStDate'),
      alarmEdDate: cmmUtils.getCalendarValue('alarmEdDate'),
      ckPinnedNotice: cmmUtils.getCheckedValues('ckPinnedNotice')[0]
    };
  }

  // 목록으로 돌아가기
  function goToNotice() {
    cmmUtils.goToPage('/bbs/notice');
  }

  return {
    init: init,
    goToNotice: goToNotice,
    insertNotice: insertNotice
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});