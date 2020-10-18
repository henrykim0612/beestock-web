const topMain = (function() {

    function init() {
        setLayout();
        showNoticeBadge();
    }

    function setLayout() {
        const accountNonExpired = document.getElementById('accountNonExpired');
        if (accountNonExpired) {
            if (accountNonExpired.value === 'true') {
                document.getElementById('aLogin').classList.add('is-hidden');
            }
        }
    }

    function showNoticeBadge() {
        cmmUtils.getData({
            url: '/api/v1/login/notice-badge'
        }).then(createNoticeBadge).catch(function (err) {
            cmmUtils.showErrModal();
            console.log(err);
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