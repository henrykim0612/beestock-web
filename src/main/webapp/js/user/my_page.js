const main = (function() {

    function goToModProfile() {
        const loginId = document.getElementById('loginId').value;
        const loginPwd = document.getElementById('ipPwd').value;
        cmmUtils.postData({
            url: '/api/v1/login/check-pwd',
            body: {
                loginId: loginId,
                loginPwd: loginPwd
            }
        }).then(function(response) {
            if (response) {
                const form = document.createElement('form');
                form.method = 'get';
                form.action = CONTEXT_PATH + '/user/mod-account';
                document.body.appendChild(form);
                form.submit();
                form.remove();
            } else {
                const helpPwd = document.getElementById('helpPwd');
                helpPwd.classList.remove('is-hidden');
            }
        });
    }

    function keyupIpPwd(e) {
        if (e.key === 'Enter') {
            goToModProfile();
        }
    }

    return {
        goToModProfile: goToModProfile,
        keyupIpPwd: keyupIpPwd
    }
}());

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd);
});