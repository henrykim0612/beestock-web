const main = (function() {

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
            } else {
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
        if (!params.loginId.value || params.loginId.classList.contains('is-danger')) {
            showIpModal('이메일', 'ipEmail');
            return false;
        }

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

        return true;
    }

    /*회원가입 처리*/
    function signup() {

        const loginId = document.getElementById('ipEmail');
        const loginPwd = document.getElementById('ipPwd');
        const cfPwd = document.getElementById('ipCfPwd');
        const userNm = document.getElementById('ipUserName');
        const userPhone = document.getElementById('ipUserPhone');

        if ( verifyInputData({
            loginId: loginId,
            loginPwd: loginPwd,
            cfPwd: cfPwd,
            userNm: userNm,
            userPhone: userPhone
        }) ) {

            cmmUtils.showLoadingElement(document.getElementById('btnSubmit'));
            cmmUtils.postData({
                url: '/api/v1/login/is-existed',
                body: {loginId: loginId.value}
            }).then(function(response) {
                cmmUtils.hideLoadingElement(document.getElementById('btnSubmit'));
                if (!response) {
                    insertProc({
                        loginId: loginId.value,
                        loginPwd: loginPwd.value,
                        userNm: userNm.value,
                        userPhone: userPhone.value
                    });
                } else {
                    showModal(document.getElementById('dangerModal')); // 이메일 존재
                }
            }).catch(function(err) {
                showErrModal();
                console.log(err);
            });

        }
    }

    function insertProc(body) {
        cmmUtils.showLoadingElement(document.getElementById('btnSubmit'));
        cmmUtils.postData({
            url: '/api/v1/login/insert',
            body: body
        }).then(function(response) {
            const data = JSON.stringify(response);
            cmmUtils.hideLoadingElement(document.getElementById('btnSubmit'));
            if (data) {

                showModal(document.getElementById('sucModal'));

            } else {
                showErrModal();
            }
        }).catch(function(err) {
            showErrModal();
            console.log(err);
        });
    }

    function showErrModal() {
        cmmUtils.hideLoadingElement(document.getElementById('btnSubmit'));
        showModal(document.getElementById('errModal'));
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
    function isCelluar(asValue) {
        const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
        return regExp.test(asValue); // 형식에 맞는 경우 true 리턴

    }

    // 비밀번호 체크 정규식
    function isJobPassword(asValue) {
        const regExp = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/; //  8 ~ 16자 영문, 숫자, 특수문자 조합
        return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
    }

    return {
        isEmailPattern: isEmailPattern,
        isPwdPattern: isPwdPattern,
        isSamePassword: isSamePassword,
        isUserPhonePattern: isUserPhonePattern,
        signup: signup,
        closeModal: closeModal,
        focusIpEmail: focusIpEmail
    }

}());
