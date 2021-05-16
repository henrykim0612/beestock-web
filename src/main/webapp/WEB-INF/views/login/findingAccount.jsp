<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script src="${pageContext.request.contextPath}/${jsDir}/login/finding_account.js" type="text/javascript"></script>

<div class="tabs is-centered is-boxed">
    <ul id="tabUl">
        <li id="liEmail" class="is-active" onclick="main.changeTab(this, 'tabContent0')">
            <a>
                <span class="icon is-small"><i class="fas fa-id-card" aria-hidden="true"></i></span>
                <span>아이디 찾기</span>
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
                <label class="label">사용자 이름</label>
                <div class="control has-icons-left has-icons-right">
                    <input id="ipUserName" class="input" type="text" placeholder="사용자 이름" maxlength="200">
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
                <label class="label">핸드폰 번호</label>
                <div class="control has-icons-left has-icons-right">
                    <input id="ipUserPhone" class="input" type="text" placeholder="'-' 없이 입력" onblur="main.isUserPhonePattern()" maxlength="50">
                    <span class="icon is-small is-left">
                         <i class="fas fa-mobile-alt"></i>
                    </span>
                    <span class="icon is-small is-right">
                        <i id="icoUserPhoneCheck" class="fas fa-check is-hidden"></i>
                        <i id="icoUserPhoneTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                    </span>
                </div>
                <p id="helpUserPhone" class="help is-hidden">핸드폰 번호 형식을 다시 확인해주세요.</p>
            </div>
        </div>
    </nav>
    <nav class="level">
        <div class="level-item has-text-centered">
            <div class="field loginField is-grouped is-grouped-centered">
                <div class="control">
                    <button id="btnEmail" class="button is-warning" onclick="main.findEmail()">
                        <span class="icon is-small"><i class="fas fa-search"></i></span>
                        <span>아이디 찾기</span>
                    </button>
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
                <label class="label">아이디</label>
                <div class="control has-icons-left has-icons-right">
                    <input id="ipEmail" class="input" type="email" placeholder="아이디 입력" maxlength="50">
                    <span class="icon is-small is-left">
                        <i class="fas fa-id-card"></i>
                    </span>
                    <span class="icon is-small is-right">
                        <i id="icoEmailCheck" class="fas fa-check is-hidden"></i>
                        <i id="icoEmailTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                    </span>
                </div>
<%--                <p id="helpEmail" class="help is-hidden">입력하신 값은 이메일 형식이 아닙니다.</p>--%>
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
                    <input id="ipHintAnswer" class="input" type="text" placeholder="비밀번호 힌트 질문 답변" maxlength="200">
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
                    <button id="btnPwd" class="button is-warning" onclick="main.findPassword()">
                        <span class="icon is-small"><i class="fas fa-search"></i></span>
                        <span>비밀번호 찾기</span>
                    </button>
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
            <p class="modal-card-title">아이디 확인 결과</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('emailModal')"></button>
        </header>
        <section id="emailModalSect" class="modal-card-body">
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home.do"><strong>로그인 창으로 이동</strong></a>
            </div>
        </footer>
    </div>
</div>

<div class="modal" id="newPwdModal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">새로운 비밀번호 입력</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('newPwdModal')"></button>
        </header>
        <section class="modal-card-body">
            <div class="content">
                <nav class="level">
                    <div class="level-item has-text-left">
                        <div class="field loginField">
                            <label class="label">비밀번호</label>
                            <div class="control has-icons-left has-icons-right">
                                <input id="ipPwd" class="input" type="password" placeholder="8 ~ 16자 영문, 숫자, 특수문자 조합" onblur="main.isPwdPattern(this)" maxlength="20">
                                <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                                <span class="icon is-small is-right">
                                    <i id="icoPwdCheck" class="fas fa-check is-hidden"></i>
                                    <i id="icoPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                                </span>
                            </div>
                            <p id="helpPwd" class="help is-hidden">비밀번호 형식을 다시 확인해주세요(8 ~ 16자 영문, 숫자, 특수문자 조합).</p>
                        </div>
                    </div>
                </nav>
                <nav class="level">
                    <div class="level-item has-text-left">
                        <div class="field loginField">
                            <label class="label">비밀번호 확인</label>
                            <div class="control has-icons-left has-icons-right">
                                <input id="ipCfPwd" class="input" type="password" placeholder="비밀번호 확인" onblur="main.isSamePassword()" maxlength="20">
                                <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                                <span class="icon is-small is-right">
                                    <i id="icoCfPwdCheck" class="fas fa-check is-hidden"></i>
                                    <i id="icoCfPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                                </span>
                            </div>
                            <p id="helpCfPwd" class="help is-hidden">비밀번호가 일치하지 않습니다.</p>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <button class="button is-warning" onclick="main.changePwd()">
                    <span class="icon"><i class="fas fa-key"></i></span>
                    <strong>비밀번호 변경</strong>
                </button>
            </div>
        </footer>
    </div>
</div>

<div id="sucModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">비밀번호 변경완료</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('sucModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>비밀번호가 변경되었습니다.</h2>
            <p>로그인 페이지로 이동하여 변경된 비밀번호로 접속하십시오.</p>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home.do">
                    <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                    <strong>로그인 창으로 이동</strong>
                </a>
            </div>
        </footer>
    </div>
</div>