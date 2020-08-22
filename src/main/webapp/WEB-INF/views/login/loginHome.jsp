<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/login/login_home.js"></script>

<form method="post" action="${pageContext.request.contextPath}/login/login-proc">
    <nav class="level">
        <div class="level-item has-text-left">
            <div class="field loginField">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                    <input id="ipEmail" class="input" type="email" placeholder="Email">
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
                    <input id="ipPwd" class="input" type="password" placeholder="Password">
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
                    <input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}"/>
                    <button id="btnSubmit" class="button is-warning" onclick="main.signup()"><strong>Log in</strong></button>
                </div>
            </div>
        </div>
    </nav>
</form>


<%--<div class="flex-col">
    <h1>${errMsg }</h1>
    <form method="post" action="${pageContext.request.contextPath}/login/login-proc">
        <div class="flex-row">
            <div class="flex-col">
                <div class="flex-row justify-content-end">
                    <label for="loginId">Email</label>
                    <input type="text" id="loginId" name="username" style="width: 200px;">
                </div>
                <div class="flex-row justify-content-end">
                    <label for="loginPwd">Password</label>
                    <input type="text" id="loginPwd" name="password" style="width: 200px;">
                </div>
            </div>
            <div>
                <label for="rememberMe">자동 로그인</label>
                <input id="rememberMe" name="_spring_security_remember_me" type="checkbox">
                <input name="${_csrf.parameterName}" type="hidden" value="${_csrf.token}"/>
                <input type="submit" value="로그인" style="width: 150px; height: 50px;"/>
            </div>
        </div>
    </form>
</div>--%>
