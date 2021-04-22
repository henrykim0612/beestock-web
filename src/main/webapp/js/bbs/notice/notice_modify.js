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
    cmmUtils.initCalendar();
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
    html += '      <span>공지사항 수정</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function drawDetails() {
    const url = '/api/v1/bbs/notice/' + global.noticeId;
    cmmUtils.axiosGet({url: url}, function(response) {
      cmmUtils.bindData('noticeDetailForm', response);
      initCKEditor(response);
      checkViewOnly();
    });
  }

  function initCKEditor(response) {
    if (!global['ckEditNoticeCont']) {
      const isReadOnly = !global['isAdmin'];
      cmmUtils.createCKEditor({selector: '#noticeCont', isReadOnly: isReadOnly, data: response['noticeCont']}, function(editor) {
        global['ckEditNoticeCont'] = editor;
      });
    }
  }

  function checkViewOnly() {
    if (!global['isAdmin']) { // 관리자가 아니면 비활성화
      const noticeTitle = document.getElementById('noticeTitle');
      noticeTitle.disabled = true;
      noticeTitle.classList.remove('is-info');
      // document.getElementById('ckPinnedNotice1').disabled = true;
      // document.getElementById('ckPinnedNotice2').disabled = true;
    }
  }

  function modifyNotice() {
    if (verifyInputValues()) {
      const msg = '해당글을 수정합니다.'
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        cmmUtils.axiosPost({
          url: '/api/v1/bbs/notice/update',
          body: getParameters(),
          loading: 'btnMod'
        }, function (response) {
          cmmUtils.showModal('saveModal');
        });
      });
    }
  }

  function removeNotice() {
    const msg = '해당글을 삭제합니다.';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/bbs/notice/delete',
        body: {noticeId: global.noticeId},
        loading: 'btnRm'
      }, function (response) {
        0 < response ? goToNotice() : cmmUtils.goToErrorPage(response);
      });
    });
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
      noticeId: global.noticeId,
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
    modifyNotice: modifyNotice,
    removeNotice: removeNotice
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});