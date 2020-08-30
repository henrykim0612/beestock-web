const main = (function() {

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

  function updateProfile() {
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
    cmmUtils.showLoadingElement(document.getElementById('btnSubmit'));
    cmmUtils.postData({
      url: '/api/v1/login/update',
      body: body
    }).then(function(response) {
      const data = JSON.stringify(response);
      cmmUtils.hideLoadingElement(document.getElementById('btnSubmit'));
      if (data) {
        cmmUtils.goToPage('/user/my-page');
      } else {
        showErrModal();
      }
    }).catch(function(err) {
      showErrModal();
      console.log(err);
    });
  }

  function verifyInputData(params) {

    if (!params.loginPwd.value || params.loginPwd.classList.contains('is-danger')) {
      showIpModal('비밀번호', 'ipPwd');
      return false;
    }

    if (!params.cfPwd.value || params.cfPwd.classList.contains('is-danger')) {
      showIpModal('비밀번호 확인', 'cfPwd');
      return false;
    }

    if (!params.userNm.value) {
      showIpModal('이름', 'ipUserName');
      return false;
    }

    if (!params.userPhone.value || params.userPhone.classList.contains('is-danger')) {
      showIpModal('핸드폰 번호', 'ipUserPhone');
      return false;
    }

    if (!params.ipHintAnswer.value) {
      showIpModal('비밀번호 힌트 답변', 'ipHintAnswer');
      return false;
    }

    return true;
  }

  function showIpModal(text, fId) {
    const ipModal = document.getElementById('inputModal');
    const ipModalTitle = document.getElementById('ipModalTitle');
    const ipModalH2 = document.getElementById('ipModalH2');
    const btnClsIpModal = document.getElementById('btnClsIpModal');

    ipModalTitle.innerText = text + ' 입력 오류';
    ipModalH2.innerText = text + ' 입력값을 확인해주세요.';
    btnClsIpModal.setAttribute('onclick', 'main.closeModal(\"inputModal\", \"' + fId + '\")');
    showModal(ipModal);
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
      if ( isCelluar(ipUserPhone.value) ) {
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
  function isCelluar(asValue) {
    const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
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

  return {
    init: init,
    isPwdPattern: isPwdPattern,
    isSamePassword: isSamePassword,
    isUserPhonePattern: isUserPhonePattern,
    updateProfile: updateProfile,
    closeModal: closeModal
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
})