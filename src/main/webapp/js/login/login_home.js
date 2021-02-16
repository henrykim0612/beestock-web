const main = (function() {

  function login() {
    const form = document.getElementById('loginForm');
    form.submit();
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
    content: '2주동안 자동 로그인 됩니다.', // TODO: 2주동안 진짜 되는건지 확인이 필요
    placement: 'right'
  });

  document.getElementById('loginPwd').addEventListener('keyup', main.keyupEvent)

})

