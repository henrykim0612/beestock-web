const topMain = (function() {

    function init() {
        const accountNonExpired = document.getElementById('accountNonExpired');
        if (accountNonExpired) {
            if (accountNonExpired.value === 'true') {
                document.getElementById('aLogin').classList.add('is-hidden');
            }
        }
    }

    return {
        init: init
    }

}());

document.addEventListener('DOMContentLoaded', function() {
    topMain.init();
});