const main = (function() {

    function init() {
        const accountNonExpired = document.getElementById('accountNonExpired');
        console.log(accountNonExpired.value);
        if (accountNonExpired.value === 'true') {
            document.getElementById('aLogin').classList.add('is-hidden');
        }
    }

    function logout() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/login/logout';
        frm.method = 'get';
        document.body.appendChild(frm);
        frm.submit();
    }

    function goToLogin() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/login/login-home';
        document.body.appendChild(frm);
        frm.submit();
    }

    function goToUser1() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/user/user1';
        document.body.appendChild(frm);
        frm.submit();
    }

    function goToSubc1() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/subc/subc1';
        document.body.appendChild(frm);
        frm.submit();
    }


    function goToAdmin1() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/admin/admin1';
        document.body.appendChild(frm);
        frm.submit();
    }

    return {
        init: init,
        goToLogin: goToLogin,
        goToUser1: goToUser1,
        goToSubc1: goToSubc1,
        goToAdmin1: goToAdmin1,
        logout: logout
    }

}());

document.addEventListener('DOMContentLoaded', function() {
    main.init();
});