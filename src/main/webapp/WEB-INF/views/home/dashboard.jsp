<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/dashboard.js"></script>

<div class="flex-col">

    <sec:authorize access="isAuthenticated()">
        <sec:authentication var="userDetails" property="principal"/>
        <h1>Dashboard Page</h1>
        <h2>principal : <sec:authentication property="principal"/></h2>
        <h2>UserName : <sec:authentication property="principal.username"/></h2>
        <h2>Email : <sec:authentication property="principal.userNm"/></h2>
        <h2>Phone : <sec:authentication property="principal.userPhone"/></h2>
        <h2>AccountNonExpired : <sec:authentication property="principal.accountNonExpired"/></h2>
        <button style="width: 150px;" onclick="main.logout()">Logout</button>
    </sec:authorize>

    <button style="width: 150px;" onclick="main.goToLogin()">Login 페이지 이동</button>
    <button style="width: 150px;" onclick="main.goToUser1()">사용자 페이지 이동</button>
    <button style="width: 150px;" onclick="main.goToSubc1()">구독자 페이지 이동</button>
    <button style="width: 150px;" onclick="main.goToAdmin1()">관리자 페이지 이동</button>
</div>
