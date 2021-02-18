const main = (function() {

  function login() {
    if (isRightPassword()) {
      const form = document.getElementById('loginForm');
      form.submit();
    }
  }

  // 패스워드 검증
  function isRightPassword() {
    const loginPwd = document.getElementById('loginPwd');
    if (cmmUtils.hasKoreanWord(loginPwd.value)) {
      cmmUtils.showIpModal('한글을 포함한 패스워드', '패스워드에 한글이 포함되어 있습니다.');
      return false;
    } else {
      return true;
    }
  }

  function keyupEvent(e) {
    // 대소문자 확인
    const helpPwd = document.getElementById('helpPwd');
    let capsLockOn = e.getModifierState('CapsLock');
    capsLockOn ? helpPwd.classList.remove('is-hidden') : helpPwd.classList.add('is-hidden');
    // 엔터 입력시 로그인
    if (e.key === 'Enter') {
      login();
    }
  }

  return {
    login: login,
    keyupEvent: keyupEvent
  }
}());

document.addEventListener('DOMContentLoaded', function() {

  tippy('#labelRememberMe', {
    content: '2주동안 자동 로그인 됩니다.',
    placement: 'right'
  });

  document.getElementById('loginPwd').addEventListener('keyup', main.keyupEvent)

})

