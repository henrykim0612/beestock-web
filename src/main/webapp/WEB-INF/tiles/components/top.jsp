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

<nav class="is-fixed-top navbar is-dark" role="navigation" aria-label="main navigation">
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
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/dashboard"><span class="icon has-text-warning mr-1"><i class="fas fa-home"></i></span>홈</a>
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/documentation"><span class="icon has-text-warning mr-1"><i class="fas fa-book"></i></span>BeeStock 가이드</a>
            <%--구독자, 관리자 전용--%>
            <sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_SUBC')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="${pageContext.request.contextPath}/premium/in-stock-item"><span class="icon has-text-warning mr-1"><i class="fas fa-search-dollar"></i></span>BeeStock 프리미엄</a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="${pageContext.request.contextPath}/premium/in-stock-item"><span class="icon has-text-primary mr-1"><i class="fas fa-dollar-sign"></i></span>국내 종목코드 현황</a>
                    </div>
                </div>
            </sec:authorize>
            <div class="navbar-item has-dropdown is-hoverable">
                <a id="aServiceCenter" class="navbar-link" href="${pageContext.request.contextPath}/bbs/notice">
                    <span class="icon has-text-warning mr-1"><i class="fas fa-info"></i></span>
                    <span id="spanServiceCenter">고객센터</span>
                </a>
                <div class="navbar-dropdown">
                    <a id="aNotice" class="navbar-item" href="${pageContext.request.contextPath}/bbs/notice">
                        <span class="icon has-text-primary mr-1"><i class="fas fa-flag"></i></span>
                        <span id="spanNotice">공지사항</span>
                    </a>
                    <a class="navbar-item" href="${pageContext.request.contextPath}/bbs/qa"><span class="icon has-text-primary mr-1"><i class="fas fa-question-circle"></i></span>Q&A</a>
                </div>
            </div>
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/pricing-table"><span class="icon has-text-warning mr-1"><i class="fas fa-book-reader"></i></span>구독</a>
            <%--관리자만 가능--%>
            <sec:authorize access="hasRole('ROLE_ADMIN')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="${pageContext.request.contextPath}/admin/user-management"><span class="icon has-text-warning mr-1"><i class="fas fa-cogs"></i></span>시스템관리</a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/user-management"><span class="icon has-text-primary mr-1"><i class="fas fa-cog"></i></span>사용자관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/code-management"><span class="icon has-text-primary mr-1"><i class="fas fa-cog"></i></span>시스템 코드관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/profile-management"><span class="icon has-text-primary mr-1"><i class="fas fa-address-card"></i></span>프로필 관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/quarter-management"><span class="icon has-text-primary mr-1"><i class="fas fa-database"></i></span>분기별 프로필 관리</a>
                    </div>
                </div>
            </sec:authorize>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <sec:authorize access="isAuthenticated()">
                        <span class="icon has-text-warning is-medium ml-2 mb-1 cursor" onclick="topMain.goToMyPage()">
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

<nav id="breadCrumbNav" class="cmm-mt-60 ml-5 breadcrumb has-arrow-separator" aria-label="breadcrumbs">
</nav>