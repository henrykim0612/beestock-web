const main = (function() {

    function login() {
        const form = document.getElementById('loginForm');
        form.submit();
    }

    function checkCapsLock(e) {
        const helpPwd = document.getElementById('helpPwd');
        let capsLockOn = e.getModifierState('CapsLock');
        capsLockOn ? helpPwd.classList.remove('is-hidden') : helpPwd.classList.add('is-hidden');
    }

    return {
        login: login,
        checkCapsLock: checkCapsLock
    }
}());

document.addEventListener('DOMContentLoaded', function() {

    tippy('#labelRememberMe', {
        content: '체크시 2주동안 자동 로그인 됩니다.',
        placement: 'right'
    });

    document.getElementById('loginPwd').addEventListener('keyup', main.checkCapsLock)

})

