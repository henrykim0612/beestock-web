const main = (function() {

    // 로그인 처리
    function loginProc() {

        const param = {
            email: document.getElementById('email').value,
            pwd: document.getElementById('pwd').value
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
            if (result.status === '200') {
                // 로그인
                goToDashboard();
            } else {
                alert('아이디 또는 비밀번호가 틀렸습니다.');
            }
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