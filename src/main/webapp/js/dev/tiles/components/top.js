const topMain = (function() {

  function init() {
    initBurgerMenu();
    checkCurrentUserRole();
    setLayout();
    // showNoticeBadge();
    bulmaQuickview.attach();
    initAlarmQuickView();
    initTooltips();
    checkHumanUser();
    removeModalLoginButtons();
    initUpgradeModal();
  }

  function initBurgerMenu() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {

          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
  }

  // 권한이 변경되었다면 적용
  function checkCurrentUserRole() {
    cmmUtils.axiosPost({
      url: '/api/v1/auth/check'
    }, function (response) {});
  }

  // 로그인되면 로그인버튼은 숨김
  function setLayout() {
    const accountNonExpired = document.getElementById('accountNonExpired');
    if (accountNonExpired) {
      if (accountNonExpired.value === 'true') {
        document.getElementById('spanSignUp').remove();
        document.getElementById('spanLogin').remove();
      }
    }
  }

  function initTooltips() {
    const arr = [{selector: '#spanAlarm', content: '알림확인'}];
    if (document.getElementById('myPageTooltip')) {
      arr.push({selector: '#spanMyPage', content: document.getElementById('myPageTooltip').value});
    }
    if (document.getElementById('spanLogout')) {
      arr.push({selector: '#spanLogout', content: '로그아웃'});
    }
    if (document.getElementById('spanLogin')) {
      arr.push({selector: '#spanLogin', content: '로그인'});
    }
    if (document.getElementById('spanSignUp')) {
      arr.push({selector: '#spanSignUp', content: '회원가입'});
    }
    if (document.getElementById('spanFeedback')) {
      arr.push({selector: '#spanFeedback', content: '피드백'});
    }
    cmmUtils.setTippy(arr);
  }

  // 등급업이 된경우 모달 호출
  function initUpgradeModal() {
    if (cmmUtils.getRole() != null) {
      cmmUtils.axiosGet({
        url: '/api/v1/login/usermodal/upgrade-modal'
      }, function(response) {
        if (response) {
          document.getElementById('upgradeCont').innerHTML = response.cont;
          cmmUtils.showModal('upgradeModal');
        }
      })
    }
  }

  // 휴먼 계정 해제 확인
  function checkHumanUser() {
    if (document.getElementById('humanAccount') && document.getElementById('humanAccount').value === '0') {
      cmmUtils.axiosPost({
        url: '/api/v1/login/unlock-user'
      }, function (response) {
        if (response) {
          cmmUtils.showModal('unlockUserModal');
        } else {
          cmmUtils.goToErrorPage();
        }
      });
    }
  }

  function showNoticeBadge() {
    cmmUtils.axiosGet({url: '/api/v1/login/notice-badge'}, function(response) {
      if (response) {
        appendAlarmBadge(response);
        appendAlarmMessages(response);
      }
    });
  }

  function initAlarmQuickView() {
    cmmUtils.axiosGet({url: '/api/v1/login/user-alarm/list'}, function(response) {
      if (response) {
        appendAlarmBadge(response);
        appendAlarmMessages(response);
      }
    });
  }

  // 알림 뱃지 추가
  function appendAlarmBadge(response) {
    const len = response.length;
    const ele = document.getElementById('spanAlarm');
    /*<span title="Badge top right" class="badge is-outlined is-danger is-light">8</span>*/
    if (ele) {
      if (len) {
        const badge = document.createElement('span');
        badge.id = 'alarmBadge'
        badge.classList.add('badge');
        badge.classList.add('is-danger');
        badge.innerText = len;
        ele.appendChild(badge);
      } else {
        if (!!ele.querySelector('#alarmBadge')) {
          ele.querySelector('#alarmBadge').remove();
        }
      }
    }
  }

  // 사용자 알림박스 추가
  function appendAlarmMessages(response) {
    const userAlarmBody = document.getElementById('userAlarmBody');
    cmmUtils.clearChildNodes(userAlarmBody);
    if (response.length) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        const article = document.createElement('article');
        article.classList.add('message');
        article.classList.add('ml-3');
        article.classList.add('mr-3');
        article.classList.add('is-warning');
        article.classList.add('is-small');
        article.setAttribute('data-article-id', data['alarmId']);
        // 바디
        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add('message-body');
        bodyDiv.innerHTML = '<strong>[' + data['regDate'] + ']</strong><br/>' + data['alarmCont'];
        // 버튼
        const btnDiv = document.createElement('div');
        btnDiv.classList.add('mt-3');
        btnDiv.classList.add('flex-row');
        btnDiv.classList.add('justify-content-end');
        if (cmmUtils.nvl(data['linkId']) !== '') {
          // 확인버튼
          const btn1 = document.createElement("button");
          btn1.classList.add('button');
          btn1.classList.add('is-small');
          btn1.classList.add('is-dark');
          btn1.setAttribute('data-button', 'alarmCheck');
          btn1.setAttribute('data-code', data['linkCode']);
          btn1.setAttribute('data-link-id', data['linkId']);
          btn1.setAttribute('data-key', data['alarmId']);
          btn1.innerText = '확인하기';
          btnDiv.appendChild(btn1);
        }
        // 닫기
        const btn2 = document.createElement("button");
        btn2.classList.add('button');
        btn2.classList.add('ml-3');
        btn2.classList.add('is-small');
        btn2.classList.add('is-dark');
        btn2.setAttribute('data-button', 'alarmClose');
        btn2.setAttribute('data-key', data['alarmId']);
        btn2.innerText = '닫기';
        btnDiv.appendChild(btn2);
        bodyDiv.appendChild(btnDiv);
        article.appendChild(bodyDiv);
        fragment.appendChild(article);
      }
      userAlarmBody.appendChild(fragment.cloneNode(true));
      // 확인 버튼 이벤트 리스너
      addUserAlarmCheckEvent(userAlarmBody);
      addUserAlarmCloseEvent(userAlarmBody);
    }
  }

  // 사용자 알림 확인 버튼 이벤트 리스너
  function addUserAlarmCheckEvent(ele) {
    const confirmBtnArr = ele.querySelectorAll('[data-button=alarmCheck]');
    for (let i = 0; i < confirmBtnArr.length; i++) {
      confirmBtnArr[i].addEventListener('click', function() {
        const dataCode = this.getAttribute('data-code');
        const linkId = this.getAttribute('data-link-id');
        const alarmId = this.getAttribute('data-key');
        clickAlarmBox(true, {alarmId: alarmId, dataCode: dataCode, linkId: linkId});
      });
    }
  }

  // 사용자 알림 닫기 버튼 이벤트 리스너
  function addUserAlarmCloseEvent(ele) {
    const confirmBtnArr = ele.querySelectorAll('[data-button=alarmClose]');
    for (let i = 0; i < confirmBtnArr.length; i++) {
      confirmBtnArr[i].addEventListener('click', function() {
        const alarmId = this.getAttribute('data-key');
        clickAlarmBox(false, {alarmId: alarmId, parentNode: ele});
      });
    }
  }

  // 사용자 알림박스 클릭 이벤트
  function clickAlarmBox(isCheck, props) {
    cmmUtils.axiosPost({
      url: '/api/v1/login/user-alarm/delete',
      body: {alarmId: props.alarmId}
    }, function (response) {
      if (0 < response) {
        if (isCheck) {
          // 페이지 이동
          cmmUtils.goToAlarmPage(props.dataCode, props.linkId);
        } else {
          // 닫기
          const node = props.parentNode.querySelector('[data-article-id="' + props.alarmId + '"]');
          node.remove();
        }
      }
    });
  }

  // 알람 모두닫기
  function closeAlarmBoxAll() {
    cmmUtils.axiosPost({
      url: '/api/v1/login/user-alarm/delete-all'
    }, function (response) {
      if (0 < response) {
        cmmUtils.clearChildNodes(document.getElementById('userAlarmBody'));
        document.getElementById('delQuickView').click(); // 퀵뷰 닫기
      }
    });
  }

  function createNoticeBadge(count) {
    if (count) {
      const arr = [document.getElementById('spanServiceCenter'), document.getElementById('spanNotice')];
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        ele.setAttribute('data-badge', count);
        ele.classList.add('has-badge-rounded');
        ele.classList.add('has-badge-danger');
        ele.classList.add('has-badge-inline');
      }
    }
  }

  function goToMyPage() {
    cmmUtils.goToPage('/user/my-page');
  }

  function logout() {
    const argLen = arguments.length;
    const form = document.createElement('form');
    form.method = argLen === 2 ? 'post' : 'get';
    form.action = CONTEXT_PATH + '/login/logout';
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  function login() {
    cmmUtils.goToPage('/login/login-home');
  }

  function signUp() {
    cmmUtils.goToPage('/login/signup');
  }

  // 모달에 붙어있는 로그인 버튼을 로그인 했을 경우에는 제거함
  function removeModalLoginButtons() {
    if (cmmUtils.getRole() != null) {
      document.querySelectorAll('button[name="btnModalLogin"]').forEach(function(e) {
        e.remove();
      })
    }
  }

  // 피드백 전송
  async function sendFeedback() {
    const response = await cmmUtils.awaitAxiosPost({
      url: '/api/v1/feedback/new-feedback',
      loading: 'btnFeedback',
      body: {
        feedbackType: document.getElementById('feedbackSelBox').value,
        feedbackCont: document.getElementById('feedbackContent').value
      }
    });

    cmmUtils.closeModal('feedbackModal')
    if (response) {
      cmmUtils.showModal('feedbackSuccessModal');
    }
  }

  function closeUpgradeModal() {
    cmmUtils.axiosPost({
      url: '/api/v1/login/usermodal/upgrade-modal'
    }, function(response) {
      window.location.reload();
    });
  }

  return {
    init: init,
    goToMyPage: goToMyPage,
    logout: logout,
    login: login,
    signUp: signUp,
    initAlarmQuickView: initAlarmQuickView,
    closeAlarmBoxAll: closeAlarmBoxAll,
    sendFeedback: sendFeedback,
    closeUpgradeModal: closeUpgradeModal
  }

}());

document.addEventListener('DOMContentLoaded', function() {
  topMain.init();
});