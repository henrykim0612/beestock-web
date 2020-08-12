<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/dashboard.js"></script>

<div class="flex-col">

    <sec:authorize access="isAuthenticated()">
        <sec:authentication var="userDetails" property="principal"/>
        <h1>Dashboard Page</h1>
        <p>principal : <sec:authentication property="principal"/></p>
        <p>principal.username : <sec:authentication property="principal.username"/></p>
        <p>principal.email : <sec:authentication property="principal.userName"/></p>
        <p>principal.email : <sec:authentication property="principal.userPhone"/></p>
        <p>principal.accountNonExpired : <sec:authentication property="principal.accountNonExpired"/></p>
        <button style="width: 150px;" onclick="main.logout()">Logout</button>
    </sec:authorize>

    <button style="width: 150px;" onclick="main.goToLogin()">Login 페이지 이동</button>
    <button style="width: 150px;" onclick="main.goToUser1()">사용자 페이지 이동</button>
    <button style="width: 150px;" onclick="main.goToSubc1()">구독자 페이지 이동</button>
    <button style="width: 150px;" onclick="main.goToAdmin1()">관리자 페이지 이동</button>
</div>
