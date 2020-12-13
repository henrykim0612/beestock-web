<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script src="${pageContext.request.contextPath}/js/login/finding_account.js" type="text/javascript"></script>

<div class="tabs is-centered is-boxed">
    <ul id="tabUl">
        <li id="liEmail" class="is-active" onclick="main.changeTab(this, 'tabContent0')">
            <a>
                <span class="icon is-small"><i class="fas fa-at" aria-hidden="true"></i></span>
                <span>이메일 찾기</span>
            </a>
        </li>
        <li id="liPassword" onclick="main.changeTab(this, 'tabContent1')">
            <a>
                <span class="icon is-small"><i class="fas fa-unlock-alt" aria-hidden="true"></i></span>
                <span>비밀번호 찾기</span>
            </a>
        </li>
    </ul>
</div>

<%--Email 찾기--%>
<div id="tabContent0" name="tabContents" class="container">
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
        <div class="level-item has-text-centered">
            <div class="field loginField is-grouped is-grouped-centered">
                <div class="control">
                    <button id="btnEmail" class="button is-info" onclick="main.findEmail()"><strong>이메일 찾기</strong></button>
                </div>
            </div>
        </div>
    </nav>
</div>

<%--Password 찾기--%>
<div id="tabContent1" name="tabContents" class="container is-hidden">
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
    <nav class="level">
        <div class="level-item has-text-centered">
            <div class="field loginField is-grouped is-grouped-centered">
                <div class="control">
                    <button id="btnPwd" class="button is-info" onclick="main.findPassword()"><strong>임시 비밀번호 생성</strong></button>
                </div>
            </div>
        </div>
    </nav>
</div>


<%--Email 확인 모달--%>
<div id="emailModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Email 확인 결과</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('emailModal')"></button>
        </header>
        <section id="emailModalSect" class="modal-card-body">
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>로그인 창으로 이동</strong></a>
            </div>
        </footer>
    </div>
</div>

<%--Email 확인 모달--%>
<div id="pwdModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Password 확인 결과</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('pwdModal')"></button>
        </header>
        <section id="pwdModalSect" class="modal-card-body">
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>로그인 창으로 이동</strong></a>
            </div>
        </footer>
    </div>
</div>