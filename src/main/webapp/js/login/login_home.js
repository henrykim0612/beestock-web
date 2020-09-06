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
    document.getElementById('loginPwd').addEventListener('keyup', main.checkCapsLock)
})

