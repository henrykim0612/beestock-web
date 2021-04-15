const main = (function() {

  function init() {
    // 비밀번호 힌트 리스트 생성
    cmmUtils.axiosPost({
      url: '/api/v1/code/list',
      body: {
        parentCodeId: 'Q0000'
      },
      loading: 'selHintCode'
    }, function (response) {
      appendHintOptions(response);
    });
  }

  function appendHintOptions(data) {
    const hiddenHintCode = document.getElementById('hiddenHintCode').value;
    const selHintCode = document.getElementById('selHintCode');
    for (let i = 0; i < data.length; i++) {
      const question = data[i];
      const op = document.createElement('option');
      op.value = question.codeId;
      op.innerText = question.codeNm;
      if (hiddenHintCode === question.codeId) op.selected = true;
      selHintCode.appendChild(op);
    }
  }

  function modifyAccount() {
    const loginId = document.getElementById('ipEmail');
    const loginPwd = document.getElementById('ipPwd');
    const cfPwd = document.getElementById('ipCfPwd');
    const userNm = document.getElementById('ipUserName');
    const userPhone = document.getElementById('ipUserPhone');
    const selHintCode = document.getElementById('selHintCode');
    const ipHintAnswer = document.getElementById('ipHintAnswer');

    if ( verifyInputData({
      loginPwd: loginPwd,
      cfPwd: cfPwd,
      userNm: userNm,
      userPhone: userPhone,
      ipHintAnswer: ipHintAnswer
    }) ) {

      updateProc({
        loginId: loginId.value,
        loginPwd: loginPwd.value,
        userNm: userNm.value,
        userPhone: userPhone.value,
        hintCode: selHintCode.value,
        hintAnswer: ipHintAnswer.value
      });

    }
  }

  function updateProc(body) {
    cmmConfirm.show({msg: '계정을 수정합니다. 오타가 없는지 확인하세요.', color: 'is-warning'}, function() {
      cmmUtils.showLoadingElement(document.getElementById('btnSubmit'));
      cmmUtils.axiosPost({
        url: '/api/v1/login/update-user',
        body: body,
        loading: 'btnSubmit'
      }, function (response) {
        if (response === -401) return cmmUtils.goToLoginHome(); // 해킹의심, 세션끊김
        goToMyPage();
      });
    });
  }

  function verifyInputData(params) {

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

  function showModal(ele) {
    ele.classList.add('is-active');
  }

  function closeModal(id, fId) {
    document.getElementById(id).classList.remove('is-active');
    if (arguments.length === 2) {
      document.getElementById(fId).focus();
    }
  }

  function showErrModal() {
    cmmUtils.hideLoadingElement(document.getElementById('btnSubmit'));
    showModal(document.getElementById('errModal'));
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

  // 핸드폰 번호 체크 정규식
  function isCellular(asValue) {
    const regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
  }

  // 비밀번호 체크 정규식
  function isJobPassword(asValue) {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/; //  8 ~ 16자 영문, 숫자, 특수문자 조합
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
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

  function goToMyPage() {
    cmmUtils.goToPage('/user/my-page');
  }

  return {
    init: init,
    isPwdPattern: isPwdPattern,
    isSamePassword: isSamePassword,
    isUserPhonePattern: isUserPhonePattern,
    modifyAccount: modifyAccount,
    goToMyPage: goToMyPage,
    closeModal: closeModal
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
})