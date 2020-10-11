const main = (function () {

  function init() {
    // 비밀번호 힌트 리스트 생성
    cmmUtils.getData({
      url: '/api/v1/code/children/Q0000',
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

    const upUserName = document.getElementById('ipUserName');
    const ipUserPhone = document.getElementById('ipUserPhone');

    if (!upUserName.value) {
      cmmUtils.showIpModal('이름', 'ipUserName');
      return false;
    }

    if (!ipUserPhone.value || ipUserPhone.classList.contains('is-danger')) {
      cmmUtils.showIpModal('핸드폰 번호', 'ipUserPhone');
      return false;
    }

    cmmUtils.postData({
      url: '/api/v1/login/find-email',
      body: {
        userNm: upUserName.value,
        userPhone: ipUserPhone.value
      },
      loading: 'btnEmail'
    }).then(function (response) {
      console.log(response);
      showEmailModal(response.data);
    }).catch(function (err) {
      cmmUtils.hideLoadingElement(document.getElementById('btnEmail'));
      showEmailModal();
      console.log(err);
    });
  }

  function findPassword() {

    const ipEmail = document.getElementById('ipEmail');
    const selHintCode = document.getElementById('selHintCode');
    const ipHintAnswer = document.getElementById('ipHintAnswer');

    if (!ipEmail.value || ipEmail.classList.contains('is-danger')) {
      cmmUtils.showIpModal('이메일', 'ipEmail');
      return false;
    }

    cmmUtils.postData({
      url: '/api/v1/login/find-email',
      body: {
        loginId: ipEmail.value,
        hintCode: selHintCode.value,
        hintAnswer: ipHintAnswer.value
      },
      loading: 'btnPwd'
    }).then(function (response) {
      if (!response.data) { // 이메일 없음
        showPwdModal(response.data);
      } else { // 확인했으면 새로운 비밀번호 발급
        cmmUtils.postData({
          url: '/api/v1/login/gen-pwd',
          body: {
            loginId: ipEmail.value,
            hintCode: selHintCode.value,
            hintAnswer: ipHintAnswer.value
          },
          loading: 'btnPwd'
        }).then(function (response) {
          if (response.data === '401') return cmmUtils.goToLoginHome(); // 해킹의심, 세션끊김
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
    cmmUtils.clearChildNodes(emailModalSect);
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
    cmmUtils.clearChildNodes(pwdModalSect);
    let html = '';
    if (tempPwd) {
      html = '<p>임시 비밀번호는 ' + tempPwd + ' 입니다. 로그인후 비밀번호를 변경해주세요.</p>';
    } else {
      html = '<p>등록되어 있지 않은 Email 또는 비밀번호 힌트의 답이 일치하지 않습니다.</p>';
    }
    pwdModalSect.innerHTML = html;
    cmmUtils.showModal('pwdModal');
  }

  function isEmailPattern() {

    const ipEmail = document.getElementById('ipEmail');
    const helpEmail = document.getElementById('helpEmail');
    const icoEmailCheck = document.getElementById('icoEmailCheck');
    const icoEmailTriangle = document.getElementById('icoEmailTriangle');
    cmmUtils.clearClasses([ipEmail, helpEmail]);

    if (ipEmail.value) {
      if ( cmmUtils.isEmail(ipEmail.value) ) {
        cmmUtils.appendInfoClasses([ipEmail, helpEmail], true);
        cmmUtils.removeHiddenClass([icoEmailCheck]);
        cmmUtils.appendHiddenClass([icoEmailTriangle, helpEmail]);
      } else {
        cmmUtils.appendInfoClasses([ipEmail, helpEmail], false);
        cmmUtils.removeHiddenClass([icoEmailTriangle]);
        cmmUtils.appendHiddenClass([icoEmailCheck]);
      }
    } else {
      cmmUtils.appendHiddenClass([icoEmailCheck, icoEmailTriangle, helpEmail]);
    }
  }

  function isUserPhonePattern() {

    const ipUserPhone = document.getElementById('ipUserPhone');
    const helpUserPhone = document.getElementById('helpUserPhone');
    const icoUserPhoneCheck = document.getElementById('icoUserPhoneCheck');
    const icoUserPhoneTriangle = document.getElementById('icoUserPhoneTriangle');
    cmmUtils.clearClasses([ipUserPhone, helpUserPhone]);

    if (ipUserPhone.value) {
      if ( cmmUtils.isCellular(ipUserPhone.value) ) {
        cmmUtils.appendInfoClasses([ipUserPhone, helpUserPhone], true);
        cmmUtils.removeHiddenClass([icoUserPhoneCheck]);
        cmmUtils.appendHiddenClass([icoUserPhoneTriangle, helpUserPhone]);
      } else {
        cmmUtils.appendInfoClasses([ipUserPhone, helpUserPhone], false);
        cmmUtils.removeHiddenClass([icoUserPhoneTriangle]);
        cmmUtils.appendHiddenClass([icoUserPhoneCheck]);
      }
    } else {
      cmmUtils.appendHiddenClass([icoUserPhoneCheck, icoUserPhoneTriangle, helpUserPhone]);
    }
  }


  return {
    init: init,
    changeTab: changeTab,
    findEmail: findEmail,
    findPassword: findPassword,
    isEmailPattern: isEmailPattern,
    isUserPhonePattern: isUserPhonePattern,
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
})