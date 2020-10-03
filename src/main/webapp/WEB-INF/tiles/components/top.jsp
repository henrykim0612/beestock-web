<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<script src="${pageContext.request.contextPath}/js/tiles/components/top.js"></script>

<sec:authorize access="isAuthenticated()">
    <input type="hidden" id="accountNonExpired" value="<sec:authentication property="principal.accountNonExpired"/>"/>
    <input type="hidden" id="loginId" value="<sec:authentication property="principal.username"/>"/>
    <input type="hidden" id="loginUserNm" value="<sec:authentication property="principal.userNm"/>"/>
    <input type="hidden" id="authority" value="<sec:authentication property="principal.authorities"/>"/>
</sec:authorize>

<nav class="navbar is-dark mb-1" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="${pageContext.request.contextPath}/home/dashboard">
            <img src="${pageContext.request.contextPath}/resources/images/logo.png" width="112" height="28">
        </a>
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="topNav">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="topNav" class="navbar-menu">
        <div class="navbar-start">
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/dashboard">Home</a>
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/documentation">Documentation</a>
            <%--구독자, 관리자 전용--%>
            <sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_SUBC')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="${pageContext.request.contextPath}/premium/stock-item">BeeStock 프리미엄</a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="${pageContext.request.contextPath}/premium/stock-item">종목코드 현황</a>
                    </div>
                </div>
            </sec:authorize>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href="${pageContext.request.contextPath}/bbs/notice">고객센터</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" href="${pageContext.request.contextPath}/bbs/notice">공지사항</a>
                    <a class="navbar-item" href="${pageContext.request.contextPath}/bbs/qa">Q&A</a>
                </div>
            </div>
            <%--관리자만 가능--%>
            <sec:authorize access="hasRole('ROLE_ADMIN')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="${pageContext.request.contextPath}/admin/user-management">시스템관리</a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/user-management">사용자관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/code-management">시스템 코드관리</a>
                    </div>
                </div>
            </sec:authorize>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <sec:authorize access="isAuthenticated()">
                        <span class="icon has-text-info is-medium ml-2 mb-1 cursor" onclick="topMain.goToMyPage()">
                          <i class="fas fa-user-alt"></i>
                        </span>
                    </sec:authorize>
                    <a class="button is-primary is-small" href="${pageContext.request.contextPath}/login/signup"><strong>회원가입</strong></a>
                    <a id="aLogin" class="button is-info is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>로그인</strong></a>
                    <sec:authorize access="isAuthenticated()">
                        <a class="button is-danger is-small" href="${pageContext.request.contextPath}/login/logout"><strong>로그아웃</strong></a>
                    </sec:authorize>
                </div>
            </div>
        </div>
    </div>
</nav>

<nav id="breadCrumbNav" class="ml-5 breadcrumb has-arrow-separator" aria-label="breadcrumbs">
</nav>