const topMain = (function() {

  function init() {
    initBurgerMenu();
    setLayout();
    // showNoticeBadge();
    bulmaQuickview.attach();
    initAlarmQuickView();
    initTooltips();
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
    cmmUtils.setTippy(arr);
  }

  function showNoticeBadge() {
    cmmUtils.getData({
      url: '/api/v1/login/notice-badge'
    }).then(createNoticeBadge).catch(function (err) {
      cmmUtils.goToErrorPage(err);
    });
  }

  function initAlarmQuickView() {
    cmmUtils.getData({
      url: '/api/v1/login/user-alarm/list',
    }).then(function(response) {
      if (response) {
        appendAlarmBadge(response);
        appendAlarmMessages(response);
      }
    }).catch(function (err) {
      cmmUtils.goToErrorPage(err);
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
        btnDiv.classList.add('is-flex');
        btnDiv.classList.add('is-flex-direction-row');
        btnDiv.classList.add('is-justify-content-center');
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
    cmmUtils.postData({
      url: '/api/v1/login/user-alarm/delete',
      body: {alarmId: props.alarmId},
    }).then(function (response) {
      cmmUtils.verifyResponse(response);
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
    }).catch(function (err) {
      cmmUtils.goToErrorPage(err);
    });
  }

  // 알람 모두닫기
  function closeAlarmBoxAll() {
    cmmUtils.postData({
      url: '/api/v1/login/user-alarm/delete-all'
    }).then(function (response) {
      cmmUtils.verifyResponse(response);
      if (0 < response) {
        cmmUtils.clearChildNodes(document.getElementById('userAlarmBody'));
        document.getElementById('delQuickView').click(); // 퀵뷰 닫기
      }
    }).catch(function (err) {
      cmmUtils.goToErrorPage(err);
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
    cmmUtils.goToPage('/login/logout');
  }

  function login() {
    cmmUtils.goToPage('/login/login-home');
  }

  function signUp() {
    cmmUtils.goToPage('/login/signup');
  }

  return {
    init: init,
    goToMyPage: goToMyPage,
    logout: logout,
    login: login,
    signUp: signUp,
    initAlarmQuickView: initAlarmQuickView,
    closeAlarmBoxAll: closeAlarmBoxAll
  }

}());

document.addEventListener('DOMContentLoaded', function() {
  topMain.init();
});