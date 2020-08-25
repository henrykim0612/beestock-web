const topMain = (function() {

    function init() {
        const accountNonExpired = document.getElementById('accountNonExpired');
        if (accountNonExpired) {
            if (accountNonExpired.value === 'true') {
                document.getElementById('aLogin').classList.add('is-hidden');
            }
        }
    }

    function goToMyPage() {
        const form = document.createElement('form');
        form.method = 'get';
        form.action = CONTEXT_PATH + '/user/my-page';
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    return {
        init: init,
        goToMyPage: goToMyPage
    }

}());

document.addEventListener('DOMContentLoaded', function() {
    topMain.init();
});