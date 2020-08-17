const main = (function() {

    function insertProc() {
        const param = {
            loginId: document.getElementById('insEmail').value,
            loginPwd: document.getElementById('insPwd').value,
            userNm: document.getElementById('insName').value
        }
        const url = CONTEXT_PATH + '/api/v1/login/insert';
        fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(param)
        }).then(function(response) {
            console.log(response);
            return response.json();
        }).then(function(result) {
            console.log(result);
        });
    }

    return {
        insertProc: insertProc
    }

}());

document.addEventListener('DomContentLoaded', function() {

});