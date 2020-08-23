const main = (function() {

    function login() {
        const form = document.getElementById('loginForm');
        form.submit();
    }

    return {
        login: login
    }
}());
