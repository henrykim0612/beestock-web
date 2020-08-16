<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/login/login_home.js"></script>

<div class="flex-col">
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

    <div class="flex-col mt-30">
        <div class="flex-row">
            <label for="insEmail">Email</label>
            <input type="text" id="insEmail" style="width: 200px;">
        </div>
        <div class="flex-row">
            <label for="insPwd">Password</label>
            <input type="text" id="insPwd" style="width: 200px;">
        </div>
        <div class="flex-row">
            <label for="insName">Name</label>
            <input type="text" id="insName" style="width: 200px;">
        </div>
        <div>
            <button id="btnInsert" onclick="main.insertProc()" style="width: 150px; height: 50px;">저장</button>
        </div>
    </div>

</div>
