<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/mod/profile.js"></script>

<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Email</label>
            <div class="control has-icons-left">
                <input disabled id="ipEmail" class="input" type="email" value="<sec:authentication property="principal.username"/>">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipPwd" class="input" type="password" placeholder="8 ~ 16자 영문, 숫자, 특수문자 조합" onblur="main.isPwdPattern()">
                <span class="icon is-small is-left">
                     <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoPwdCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpPwd" class="help is-hidden">패스워드 형식을 다시 확인해주세요(8 ~ 16자 영문, 숫자, 특수문자 조합).</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Confirm password</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipCfPwd" class="input" type="password" placeholder="패스워드 확인" onblur="main.isSamePassword()">
                <span class="icon is-small is-left">
                     <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoCfPwdCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoCfPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpCfPwd" class="help is-hidden">패스워드가 일치하지 않습니다.</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Your Name</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipUserName" class="input" type="text" placeholder="사용자 이름 또는 닉네임" value="<sec:authentication property="principal.userNm"/>">
                <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Your Mobile</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipUserPhone" class="input" type="text" placeholder="'-' 포함입력(010-xxxx-xxxx)" onblur="main.isUserPhonePattern()" value="<sec:authentication property="principal.userPhone"/>">
                <span class="icon is-small is-left">
                     <i class="fas fa-mobile-alt"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoUserPhoneCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoUserPhoneTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpUserPhone" class="help is-hidden">핸드폰 번호 형식을 다시 확인해주세요(010-xxxx-xxxx).</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-centered">
        <div class="field loginField is-grouped is-grouped-centered">
            <div class="control">
                <button id="btnSubmit" class="button is-link" onclick="main.updateProfile()"><strong>Update</strong></button>
            </div>
        </div>
    </div>
</nav>

<%--텍스트 입력관련 모달--%>
<div id="inputModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p id="ipModalTitle" class="modal-card-title"></p>
            <button id="btnClsIpModal" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
            <h2 id="ipModalH2"></h2>
        </section>
    </div>
</div>

<%--에러 입력관련 모달--%>
<div id="errModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">에러</p>
            <button class="delete" aria-label="close" onclick="main.closeModal('errModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>서버와 통신도중 문제가 발생했습니다. 다시 진행해주세요.</h2>
        </section>
    </div>
</div>