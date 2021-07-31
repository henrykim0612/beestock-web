const main = (function() {

  function init() {
    document.getElementById('loginId').focus();
    setTooltips();
    addDOMEvents()
  }

  function setTooltips() {
    cmmUtils.setTippy({
      selector: '#labelRememberMe',
      content: '2주동안 자동 로그인 됩니다.',
      placement: 'right'
    })
  }

  function addDOMEvents() {
    addPwdKeyupEvent();
  }

  function addPwdKeyupEvent() {
    document.getElementById('loginPwd').addEventListener('keyup', keyupEvent);
  }

  function login() {
    if (isRightPassword()) {
      cmmUtils.showLoadingElement(document.getElementById('btnSubmit'));
      const form = document.getElementById('loginForm');
      form.submit();
    }
  }

  // 비밀번호 검증
  function isRightPassword() {
    const loginPwd = document.getElementById('loginPwd');
    if (cmmUtils.hasKoreanWord(loginPwd.value)) {
      cmmUtils.showIpModal('비밀번호', '비밀번호에 한글이 포함되어 있습니다.');
      return false;
    } else {
      return true;
    }
  }

  function keyupEvent(e) {
    try {
      // 대소문자 확인
      const helpPwd = document.getElementById('helpPwd');
      let capsLockOn = e.getModifierState('CapsLock');
      capsLockOn ? helpPwd.classList.remove('is-hidden') : helpPwd.classList.add('is-hidden');
      // 엔터 입력시 로그인
      if (e.key === 'Enter') {
        login();
      }
    } catch(err) {
      console.log(err);
    }
  }

  return {
    init: init,
    login: login
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
})

