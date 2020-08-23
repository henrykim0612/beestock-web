<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script src="${pageContext.request.contextPath}/js/login/login_home.js"></script>

<form id="loginForm" method="post" action="${pageContext.request.contextPath}/login/login-proc">
    <nav class="level">
        <div class="level-item has-text-left">
            <div class="field loginField">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                    <input id="loginId" name="username" class="input" type="email" placeholder="Email" value="${username}">
                    <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                    </span>
                    <span class="icon is-small is-right">
                        <i id="icoEmailCheck" class="fas fa-check is-hidden"></i>
                        <i id="icoEmailTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                    </span>
                </div>
                <div class="control">
                    <label class="checkbox">
                        <input id="rememberMe" name="_spring_security_remember_me" type="checkbox">
                        Remember me
                    </label>
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
                    <span class="icon is-small is-left">
                         <i class="fas fa-lock"></i>
                    </span>
                </div>
            </div>
        </div>
    </nav>
    <nav class="level">
        <div class="level-item has-text-centered">
            <div class="field loginField is-grouped is-grouped-centered">
                <div class="control">
                    <button id="btnSubmit" class="button is-warning" onclick="main.login()"><strong>Log in</strong></button>
                </div>
            </div>
        </div>
    </nav>
</form>
<c:if test="${not empty ERRORMSG}">
    <nav class="level mt-3">
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
