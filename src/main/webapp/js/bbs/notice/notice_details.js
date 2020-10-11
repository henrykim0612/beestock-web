const main = (function() {

  let global = {
    isAdmin: cmmUtils.nvl(document.getElementById('authority')) === '[ROLE_ADMIN]',
    loginId: cmmUtils.nvl(document.getElementById('loginId')),
    ckEditNoticeCont: undefined,
  }

  function init() {
    createBreadCrumb();
    cmmUtils.initCalendar();
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
    html += '    <a href="' + CONTEXT_PATH + '/bbs/notice">';
    html += '      <span class="icon is-small"><i class="fas fa-puzzle-piece"></i></span>';
    html += '      <span>공지사항</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
    html += '      <span>공지사항 상세보기</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function drawDetails() {
    const noticeId = document.getElementById('noticeId').value;
    const url = '/api/v1/bbs/notice/' + noticeId;
    cmmUtils.getData({
      url: url,
    }).then(function (response) {
      cmmUtils.bindData('noticeDetailForm', response);
      initCKEditor(response);
      checkViewOnly();
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function initCKEditor(response) {
    if (!global['ckEditNoticeCont']) {
      const isReadOnly = !global['isAdmin'];
      cmmUtils.createCKEditor({selector: '#noticeCont', isReadOnly: isReadOnly, data: response['noticeCont']}, function(editor) {
        global['ckEditNoticeCont'] = editor;
        editor.isReadOnly = isReadOnly;
      });
    }
  }

  function checkViewOnly() {
    if (!global['isAdmin']) { // 관리자가 아니면 비활성화
      const noticeTitle = document.getElementById('noticeTitle');
      noticeTitle.disabled = true;
      noticeTitle.classList.remove('is-info');
      document.getElementById('ckPinnedNotice1').disabled = true;
      document.getElementById('ckPinnedNotice2').disabled = true;
    }
  }

  function modifyNotice() {
    if (verifyInputValues()) {
      const msg = '해당글을 수정합니다.'
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        cmmUtils.postData({
          url: '/api/v1/bbs/notice/update',
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

  function removeNotice() {
    const msg = '해당글을 삭제합니다.';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.postData({
        url: '/api/v1/bbs/notice/delete',
        body: {
          noticeId: document.getElementById('noticeId').value,
        },
        loading: 'btnRm'
      }).then(function (response) {
        if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐, 해킹의심
        0 < response ? goToNotice() : cmmUtils.showErrModal();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnRm'));
        cmmUtils.showErrModal();
        console.log(err);
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
      noticeId: document.getElementById('noticeId').value,
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
    getGlobal: function() {
      return global;
    },
    goToNotice: goToNotice,
    modifyNotice: modifyNotice,
    removeNotice: removeNotice
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});