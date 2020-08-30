const main = (function () {

  function init() {
    // 비밀번호 힌트 리스트 생성
    cmmUtils.getData({
      url: '/api/v1/code/Q0000',
      loading: 'selHintCode'
    }).then(function (response) {
      appendHintOptions(response);
    }).catch(function (err) {
      cmmUtils.hideLoadingElement(document.getElementById('selHintCode'));
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function appendHintOptions(data) {
    const selHintCode = document.getElementById('selHintCode');
    for (let i = 0; i < data.length; i++) {
      const question = data[i];
      const op = document.createElement('option');
      op.value = question.codeId;
      op.innerText = question.codeNm;
      selHintCode.appendChild(op);
    }
  }

  function changeTab(_this, contentId) {
    const lis = document.getElementById('tabUl').querySelectorAll('li');
    for (let i = 0; i < lis.length; i++) {
      lis[i].classList.remove('is-active');
    }

    const tabContents = document.getElementsByName('tabContents');
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].classList.add('is-hidden');
    }

    _this.classList.add('is-active');
    document.getElementById(contentId).classList.remove('is-hidden');
  }

  function findEmail() {
    cmmUtils.postData({
      url: '/api/v1/login/user',
      body: {
        userNm: document.getElementById('ipUserName').value,
        userPhone: document.getElementById('ipUserPhone').value
      },
      loading: 'btnEmail'
    }).then(function (response) {
      showEmailModal(response.data);
    }).catch(function (err) {
      cmmUtils.hideLoadingElement(document.getElementById('btnEmail'));
      showEmailModal();
      console.log(err);
    });
  }

  function findPassword() {
    const loginId = document.getElementById('ipEmail').value;
    const selHintCode = document.getElementById('selHintCode').value;
    const ipHintAnswer = document.getElementById('ipHintAnswer').value;

    cmmUtils.postData({
      url: '/api/v1/login/user',
      body: {
        loginId: loginId,
        hintCode: selHintCode,
        hintAnswer: ipHintAnswer
      },
      loading: 'btnPwd'
    }).then(function (response) {
      if (!response.data) { // 이메일 없음
        showPwdModal(response.data);
      } else { // 확인했으면 새로운 비밀번호 발급
        cmmUtils.postData({
          url: '/api/v1/login/gen-pwd',
          body: {
            loginId: loginId,
          },
          loading: 'btnPwd'
        }).then(function (response) {
          showPwdModal(response.data);
        }).catch(function (err) {
          cmmUtils.hideLoadingElement(document.getElementById('btnPwd'));
          cmmUtils.showErrModal();
          console.log(err);
        });
      }
    }).catch(function (err) {
      cmmUtils.hideLoadingElement(document.getElementById('btnPwd'));
      cmmUtils.showErrModal();
      console.log(err);
    });
  }


  function showEmailModal(data) {
    const emailModalSect = document.getElementById('emailModalSect');
    while (emailModalSect.firstChild) {
      emailModalSect.removeChild(emailModalSect.firstChild);
    }
    let html = '';
    if (data) {
      html = '<p>가입하신 Email 계정은 <strong>' + data.loginId + '</strong> 입니다.</p>';
    } else {
      html = '<p>등록되어 있지 않은 Email 입니다. 이름과 핸드폰번호를 확인해주세요.</p>';
    }
    emailModalSect.innerHTML = html;
    cmmUtils.showModal('emailModal');
  }

  function showPwdModal(tempPwd) {
    const pwdModalSect = document.getElementById('pwdModalSect');
    while (pwdModalSect.firstChild) {
      pwdModalSect.removeChild(pwdModalSect.firstChild);
    }
    let html = '';
    if (tempPwd) {
      html = '<p>임시 비밀번호는 ' + tempPwd + ' 입니다. 로그인후 비밀번호를 변경해주세요.</p>';
    } else {
      html = '<p>등록되어 있지 않은 Email 입니다.</p>';
    }
    pwdModalSect.innerHTML = html;
    cmmUtils.showModal('pwdModal');
  }

  return {
    init: init,
    changeTab: changeTab,
    findEmail: findEmail,
    findPassword: findPassword
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
})