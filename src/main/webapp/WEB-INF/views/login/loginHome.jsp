<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script src="${pageContext.request.contextPath}/js/login/login_home.js" type="text/javascript"></script>

<div class="height600px flex-col justify-content-center">
    <div class="flex-row justify-content-center mb-3">
        <img class="width-20-p" src="${pageContext.request.contextPath}/resources/images/logo/horizontal/logo.png">
    </div>
    <form id="loginForm" method="post" action="${pageContext.request.contextPath}/login/login-proc">
        <nav class="level">
            <div class="level-item has-text-left">
                <div class="field loginField">
                    <label class="label">아이디</label>
                    <div class="control has-icons-left has-icons-right">
                        <input id="loginId" name="username" class="input" type="text" placeholder="ID" value="${username}">
                        <span class="icon is-small is-left">
                        <i class="fas fa-id-card"></i>
                    </span>
                        <span class="icon is-small is-right">
                        <i id="icoEmailCheck" class="fas fa-check is-hidden"></i>
                        <i id="icoEmailTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                    </span>
                    </div>
                    <div class="control field mt-2">
                        <input type="checkbox" id="rememberMe" name="_spring_security_remember_me" class="is-checkradio is-primary is-circle">
                        <label id="labelRememberMe" for="rememberMe">자동 로그인</label>
                        <input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}"/>
                    </div>
                </div>
            </div>
        </nav>
        <nav class="level">
            <div class="level-item has-text-left">
                <div class="field loginField">
                    <label class="label">Password</label>
                    <div class="control has-icons-left has-icons-right">
                        <input id="loginPwd" name="password" class="input" type="password" placeholder="Password" value="${password}">
                        <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
                    </div>
                    <p id="helpPwd" class="help is-info is-hidden">Caps Lock 키가 켜져있습니다.</p>
                </div>
            </div>
        </nav>
        <nav class="level">
            <div class="level-item has-text-centered">
                <div class="field loginField is-grouped is-grouped-centered">
                    <div class="flex-col justify-content-center">
                        <div class="buttons mb-3">
                            <button type="button" class="button is-primary" onclick="topMain.signUp()">
                                <span class="icon"><i class="fas fa-user-plus"></i></span>
                                <span><strong>회원가입</strong></span>
                            </button>
                            <button type="button" id="btnSubmit" class="button is-warning" onclick="main.login()">
                                <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                                <span><strong>로그인</strong></span>
                            </button>
                        </div>
                        <div class="flex-col justify-content-center">
                            <a class="is-primary" href="${pageContext.request.contextPath}/login/finding-account.do"><strong>아이디/패스워드 찾기</strong></a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </form>
    <c:if test="${not empty ERRORMSG}">
        <nav class="level mt-5">
            <div class="level-item has-text-centered">
                <article class="message is-danger is-small loginField">
                    <div class="message-header">
                        <p>Login failed.</p>
                    </div>
                    <div class="message-body">
                        <strong>${ERRORMSG }</strong>
                    </div>
                </article>
            </div>
        </nav>
    </c:if>
</div>