<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/login/signup.js"></script>

<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipEmail" class="input" type="email" placeholder="Email 형식" onblur="main.isEmailPattern()">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoEmailCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoEmailTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpEmail" class="help is-hidden">입력하신 값은 이메일 형식이 아닙니다.</p>
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
                <input id="ipUserName" class="input" type="text" placeholder="사용자 이름 또는 닉네임">
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
                <input id="ipUserPhone" class="input" type="text" placeholder="'-' 포함입력(010-xxxx-xxxx)" onblur="main.isUserPhonePattern()">
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
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">비밀번호 힌트 질문</label>
            <div class="control has-icons-left ">
                <div class="select">
                    <select id="selHintCode">
                    </select>
                </div>
                <div class="icon is-small is-left">
                    <i class="fas fa-question-circle"></i>
                </div>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">비밀번호 힌트 답변</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipHintAnswer" class="input" type="text" placeholder="비밀번호 힌트 질문 답변">
                <span class="icon is-small is-left">
                    <i class="fas fa-pencil-alt"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level mt-6">
    <div class="level-item has-text-centered">
        <div class="field loginField is-grouped is-grouped-centered">
            <div class="control">
                <button id="btnSubmit" class="button is-primary" onclick="main.signup()"><strong>회원가입</strong></button>
            </div>
        </div>
    </div>
</nav>


<%--완료 모달--%>
<div id="sucModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">회원가입 완료</p>
            <button class="delete" aria-label="close" onclick="main.closeModal('sucModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>회원가입 감사합니다.</h2>
            <p><strong>BeeStock</strong>에서 다양한 정보를 확인하십시오.</p>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>로그인 창으로 이동</strong></a>
            </div>
        </footer>
    </div>
</div>

<%--이메일 중복--%>
<div id="dangerModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Email 중복</p>
            <button class="delete" aria-label="close" onclick="main.focusIpEmail('dangerModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>현재 사용중인 이메일 입니다. 다른 이메일을 입력해주세요.</h2>
        </section>
    </div>
</div>

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

