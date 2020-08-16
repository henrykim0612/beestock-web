const main = (function() {

    // 로그인 처리
    function loginProc() {

        const param = {
            loginId: document.getElementById('loginId').value,
            loginPwd: document.getElementById('loginPwd').value
        }
        const url = CONTEXT_PATH + '/api/v1/login/login-check';
        fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(param)
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            console.log(result);
            // result.token ? goToDashboard() : alert(result.msg);
            fetch(CONTEXT_PATH + '/user/test', {
                method: 'get',
                headers: {'Content-Type': 'application/json', 'X-AUTH-TOKEN' : result.token}
            }).then(function(response) {
                console.log(response);
                return response.json();
            });

        });
    }

    function goToDashboard() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/home/dashboard';
        frm.method = 'get';
        document.body.appendChild(frm);
        frm.submit();
    }

    function insertProc() {
        const param = {
            loginId: document.getElementById('insEmail').value,
            loginPwd: document.getElementById('insPwd').value,
            userName: document.getElementById('insName').value
        }
        const url = CONTEXT_PATH + '/api/v1/login/insert';
        fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(param)
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            console.log(result);
        });
    }

    return {
        loginProc: loginProc,
        insertProc: insertProc
    }

}());

document.addEventListener('DomContentLoaded', function() {

});