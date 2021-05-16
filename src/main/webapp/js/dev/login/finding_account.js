const main = (function () {

  let __loginId = null;
  let __hintCode = null;
  let __hintAnswer = null;

  function init() {
    // 비밀번호 힌트 리스트 생성
    cmmUtils.axiosGet({url: '/api/v1/code/children/Q0000', loading: 'selHintCode'}, function(response) {
      appendHintOptions(response);
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

    cmmUtils.axiosPost({
      url: '/api/v1/login/find-email',
      body: {
        userNm: upUserName.value,
        userPhone: ipUserPhone.value
      },
      loading: 'btnEmail'
    }, function (response) {
      showEmailModal(response.data);
    });
  }

  function findPassword() {

    const ipEmail = document.getElementById('ipEmail');
    const selHintCode = document.getElementById('selHintCode');
    const ipHintAnswer = document.getElementById('ipHintAnswer');

    // if (!ipEmail.value || ipEmail.classList.contains('is-danger')) {
    //   cmmUtils.showIpModal('이메일', 'ipEmail');
    //   return false;
    // }

    cmmUtils.axiosPost({
      url: '/api/v1/login/find-email',
      body: {
        loginId: ipEmail.value,
        hintCode: selHintCode.value,
        hintAnswer: ipHintAnswer.value
      },
      loading: 'btnPwd'
    }, function (response) {
      if (!response.data) { // 이메일 없음
        showPwdModal(response.data);
      } else { // 확인했으면 새로운 비밀번호 모달창 호출
        __loginId = ipEmail.value;
        __hintCode = selHintCode.value;
        __hintAnswer = ipHintAnswer.value;
        cmmUtils.showModal('newPwdModal');
      }
    });
  }

  function showEmailModal(data) {
    const emailModalSect = document.getElementById('emailModalSect');
    cmmUtils.clearChildNodes(emailModalSect);
    let html = '';
    if (data) {
      html = '<p>가입하신 아이디는 <strong>' + data.loginId + '</strong> 입니다.</p>';
    } else {
      html = '<p>등록되어 있지 않은 아이디 입니다. 이름과 핸드폰번호를 확인해주세요.</p>';
    }
    emailModalSect.innerHTML = html;
    cmmUtils.showModal('emailModal');
  }

  function showPwdModal(tempPwd) {
    const pwdModalSect = document.getElementById('pwdModalSect');
    cmmUtils.clearChildNodes(pwdModalSect);
    let html = '';
    if (tempPwd) {
      html = '<p>임시 비밀번호를 메일로 전송 드렸습니다.</p><p>보안을 위해 로그인후 비밀번호를 바로 변경해주세요.</p>';
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

  function isPwdPattern(e) {

    const ipPwd = document.getElementById('ipPwd');
    const helpPwd = document.getElementById('helpPwd');
    const icoPwdCheck = document.getElementById('icoPwdCheck');
    const icoPwdTriangle = document.getElementById('icoPwdTriangle');
    clearClasses([ipPwd, helpPwd]);

    if (ipPwd.value) {
      if ( isJobPassword(ipPwd.value) ) {
        appendInfoClasses([ipPwd, helpPwd], true);
        removeHiddenClass([icoPwdCheck]);
        appendHiddenClass([icoPwdTriangle, helpPwd]);
      } else {
        appendInfoClasses([ipPwd, helpPwd], false);
        removeHiddenClass([icoPwdTriangle]);
        appendHiddenClass([icoPwdCheck]);
      }
    } else {
      appendHiddenClass([icoPwdCheck, icoPwdTriangle, helpPwd]);
    }

    isEmptyPwd(e);
  }

  function clearClasses(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      ele.classList.remove('is-hidden');
      ele.classList.remove('is-success');
      ele.classList.remove('is-danger');
    }
  }

  function removeHiddenClass(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      ele.classList.remove('is-hidden');
    }
  }

  function appendHiddenClass(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      ele.classList.add('is-hidden');
    }
  }

  function appendInfoClasses(eleArr, isSuccess) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      ele.classList.add(isSuccess ? 'is-success' : 'is-danger');
    }
  }

  function isEmptyPwd(e) {
    const helpCfPwd = document.getElementById('helpCfPwd');
    const icoCfPwdTriangle = document.getElementById('icoCfPwdTriangle');
    const icoCfPwdCheck = document.getElementById('icoCfPwdCheck');
    const ipCfPwd = document.getElementById('ipCfPwd');
    if (!e.value) {
      appendHiddenClass([icoCfPwdTriangle, icoCfPwdCheck, helpCfPwd]);
      removeHighlightClassAll([ipCfPwd]);
    } else {
      if (ipCfPwd.value) {
        isSamePassword();
      }
    }
  }

  function removeHighlightClassAll(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      ele.classList.remove('is-success');
      ele.classList.remove('is-danger');
    }
  }

  function isSamePassword() {
    const ipCfPwd = document.getElementById('ipCfPwd');
    const ipPwd = document.getElementById('ipPwd');
    const helpCfPwd = document.getElementById('helpCfPwd');
    const icoCfPwdCheck = document.getElementById('icoCfPwdCheck');
    const icoCfPwdTriangle = document.getElementById('icoCfPwdTriangle');
    if (ipCfPwd.value) {
      clearClasses([ipCfPwd, helpCfPwd]);
      if (ipPwd.value === ipCfPwd.value) {
        appendInfoClasses([ipCfPwd, helpCfPwd], true);
        removeHiddenClass([icoCfPwdCheck]);
        appendHiddenClass([icoCfPwdTriangle, helpCfPwd]);
      } else {
        appendInfoClasses([ipCfPwd, helpCfPwd], false);
        removeHiddenClass([icoCfPwdTriangle]);
        appendHiddenClass([icoCfPwdCheck]);
      }
    } else {
      removeHighlightClassAll([ipCfPwd]);
      appendHiddenClass([icoCfPwdTriangle, helpCfPwd]);
    }
  }

  function isJobPassword(asValue) {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/; //  8 ~ 16자 영문, 숫자, 특수문자 조합
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
  }

  // 비밀번호 변경
  async function changePwd() {
    const pwd = document.getElementById('ipPwd');
    const cfPwd = document.getElementById('ipCfPwd');
    if (isValidPwd(pwd, cfPwd)) {

      const response = await cmmUtils.awaitAxiosPost({
        url: '/api/v1/login/change-pwd',
        body: {
          loginId: __loginId,
          hintCode: __hintCode,
          hintAnswer: __hintAnswer,
          loginPwd: pwd.value
        }
      });

      if (response) {
        cmmUtils.closeModal('newPwdModal');
        cmmUtils.showModal('sucModal');
      } else {
        cmmUtils.showCustomErrModal('비밀번호 변경에 실패했습니다.');
      }

    }
  }

  function isValidPwd(pwd, cfPwd) {

    if (!cfPwd.value || pwd.classList.contains('is-danger')) {
      cmmUtils.showIpModal('비밀번호');
      return false;
    }

    if (!cfPwd.value || cfPwd.classList.contains('is-danger')) {
      cmmUtils.showIpModal('비밀번호 확인');
      return false;
    }

    return true;

  }

  return {
    init: init,
    changeTab: changeTab,
    findEmail: findEmail,
    findPassword: findPassword,
    isEmailPattern: isEmailPattern,
    isUserPhonePattern: isUserPhonePattern,
    isPwdPattern: isPwdPattern,
    isSamePassword: isSamePassword,
    changePwd: changePwd
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
})