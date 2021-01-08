const main = (function() {

  let global = {
    isAgreed: false
  }

  function init() {
    getHintList();
    addEventListeners();
  }

  function getHintList() {
    // 비밀번호 힌트 리스트 생성
    cmmUtils.axiosGet({url: '/api/v1/code/children/Q0000', loading: 'selHintCode'}, function(response) {
      appendHintOptions(response);
    });
  }

  function addEventListeners() {
    document.getElementById('chkAgreement').addEventListener('click', function() {
      global['isAgreed'] = this.checked;
      if (this.checked) {
        cmmUtils.closeModal('agreeModal');
        document.getElementById('btnSubmit').disabled = false;
      } else {
        document.getElementById('btnSubmit').disabled = true;
      }
    })
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

  function isEmailPattern() {

    const ipEmail = document.getElementById('ipEmail');
    const helpEmail = document.getElementById('helpEmail');
    const icoEmailCheck = document.getElementById('icoEmailCheck');
    const icoEmailTriangle = document.getElementById('icoEmailTriangle');
    clearClasses([ipEmail, helpEmail]);

    if (ipEmail.value) {
      if ( isEmail(ipEmail.value) ) {
        appendInfoClasses([ipEmail, helpEmail], true);
        removeHiddenClass([icoEmailCheck]);
        appendHiddenClass([icoEmailTriangle, helpEmail]);
      } else { // 이메일 패턴이 아니라면
        appendInfoClasses([ipEmail, helpEmail], false);
        removeHiddenClass([icoEmailTriangle]);
        appendHiddenClass([icoEmailCheck]);
      }
    } else {
      appendHiddenClass([icoEmailCheck, icoEmailTriangle, helpEmail]);
    }
  }

  function isSamePassword() {

    const ipCfPwd = document.getElementById('ipCfPwd');
    const ipPwd = document.getElementById('ipPwd');
    const helpCfPwd = document.getElementById('helpCfPwd');
    const icoCfPwdCheck = document.getElementById('icoCfPwdCheck');
    const icoCfPwdTriangle = document.getElementById('icoCfPwdTriangle');
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
  }

  function isPwdPattern() {

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
  }

  function isUserPhonePattern() {

    const ipUserPhone = document.getElementById('ipUserPhone');
    const helpUserPhone = document.getElementById('helpUserPhone');
    const icoUserPhoneCheck = document.getElementById('icoUserPhoneCheck');
    const icoUserPhoneTriangle = document.getElementById('icoUserPhoneTriangle');
    clearClasses([ipUserPhone, helpUserPhone]);

    if (ipUserPhone.value) {
      if ( isCellular(ipUserPhone.value) ) {
        appendInfoClasses([ipUserPhone, helpUserPhone], true);
        removeHiddenClass([icoUserPhoneCheck]);
        appendHiddenClass([icoUserPhoneTriangle, helpUserPhone]);
      } else {
        appendInfoClasses([ipUserPhone, helpUserPhone], false);
        removeHiddenClass([icoUserPhoneTriangle]);
        appendHiddenClass([icoUserPhoneCheck]);
      }
    } else {
      appendHiddenClass([icoUserPhoneCheck, icoUserPhoneTriangle, helpUserPhone]);
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

  function clearClasses(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      ele.classList.remove('is-hidden');
      ele.classList.remove('is-success');
      ele.classList.remove('is-danger');
    }
  }

  function verifyInputData(params) {

    if (!global['isAgreed']) {
      cmmUtils.showIpModal('이용약관', '이용약관 확인을 체크해주세요.');
      return false;
    }

    if (!params.loginId.value || params.loginId.classList.contains('is-danger')) {
      cmmUtils.showIpModal('이메일');
      return false;
    }

    if (!params.loginPwd.value || params.loginPwd.classList.contains('is-danger')) {
      cmmUtils.showIpModal('비밀번호');
      return false;
    }

    if (!params.cfPwd.value || params.cfPwd.classList.contains('is-danger')) {
      cmmUtils.showIpModal('비밀번호 확인');
      return false;
    }

    if (!params.userNm.value) {
      cmmUtils.showIpModal('이름');
      return false;
    }

    if (!params.userPhone.value || params.userPhone.classList.contains('is-danger')) {
      cmmUtils.showIpModal('핸드폰 번호');
      return false;
    }

    if (!params.ipHintAnswer.value) {
      cmmUtils.showIpModal('비밀번호 힌트 답변');
      return false;
    }

    return true;
  }

  /*회원가입 처리*/
  function signup() {

    const loginId = document.getElementById('ipEmail');
    const loginPwd = document.getElementById('ipPwd');
    const cfPwd = document.getElementById('ipCfPwd');
    const userNm = document.getElementById('ipUserName');
    const userPhone = document.getElementById('ipUserPhone');
    const selHintCode = document.getElementById('selHintCode');
    const ipHintAnswer = document.getElementById('ipHintAnswer');

    if ( verifyInputData({
      loginId: loginId,
      loginPwd: loginPwd,
      cfPwd: cfPwd,
      userNm: userNm,
      userPhone: userPhone,
      ipHintAnswer: ipHintAnswer
    }) ) {
      cmmUtils.axiosPost({
        url: '/api/v1/login/is-existed',
        body: {loginId: loginId.value},
        loading: 'btnSubmit'
      }, function (response) {
        if (!response) {
          insertProc({
            loginId: loginId.value,
            loginPwd: loginPwd.value,
            userNm: userNm.value,
            userPhone: userPhone.value,
            hintCode: selHintCode.value,
            hintAnswer: ipHintAnswer.value
          });
        } else {
          showModal(document.getElementById('dangerModal')); // 이메일 존재
        }
      });
    }
  }

  function insertProc(body) {
    cmmUtils.showLoadingElement(document.getElementById('btnSubmit'));
    cmmUtils.axiosPost({
      url: '/api/v1/login/insert-user',
      body: body
    }, function (response) {
      if (response) {
        showModal(document.getElementById('sucModal'));
      } else {
        showErrModal();
      }
    });
  }

  function showErrModal() {
    cmmUtils.hideLoadingElement(document.getElementById('btnSubmit'));
    showModal(document.getElementById('errModal'));
  }

  function showModal(ele) {
    ele.classList.add('is-active');
  }

  function closeModal(id, fId) {
    document.getElementById(id).classList.remove('is-active');
    if (arguments.length === 2) {
      document.getElementById(fId).focus();
    }
  }

  function focusIpEmail(id) {
    document.getElementById(id).classList.remove('is-active');
    const ipEmail = document.getElementById('ipEmail');
    ipEmail.value = '';
    ipEmail.focus();
  }

  // 이메일 체크 정규식
  function isEmail(asValue) {
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(asValue);
  }

  // 핸드폰 번호 체크 정규식
  function isCellular(asValue) {
    const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴

  }

  // 비밀번호 체크 정규식
  function isJobPassword(asValue) {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/; //  8 ~ 16자 영문, 숫자, 특수문자 조합
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
  }

  function showAgreeModal() {
    cmmUtils.showModal('agreeModal');
  }

  return {
    init: init,
    isEmailPattern: isEmailPattern,
    isPwdPattern: isPwdPattern,
    isSamePassword: isSamePassword,
    isUserPhonePattern: isUserPhonePattern,
    signup: signup,
    closeModal: closeModal,
    showAgreeModal: showAgreeModal,
    focusIpEmail: focusIpEmail
  }

}())

document.addEventListener('DOMContentLoaded', function() {
  main.init();
  main.showAgreeModal();
})