<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<script src="${pageContext.request.contextPath}/js/tiles/components/top.js" type="text/javascript"></script>

<sec:authorize access="isAuthenticated()">
    <input type="hidden" id="accountNonExpired" value="<sec:authentication property="principal.accountNonExpired"/>"/>
    <input type="hidden" id="loginId" value="<sec:authentication property="principal.username"/>"/>
    <input type="hidden" id="loginUserNm" value="<sec:authentication property="principal.userNm"/>"/>
    <input type="hidden" id="authority" value="<sec:authentication property="principal.authorities"/>"/>
</sec:authorize>

<nav class="is-fixed-top navbar is-black" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="${pageContext.request.contextPath}/home/dashboard">
            <img src="${pageContext.request.contextPath}/resources/images/logo/app/logo-a-h-01.png">
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
            <sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link"><span class="icon has-text-warning mr-1"><i class="fas fa-search-dollar"></i></span>BeeStock 프리미엄</a>
                </div>
            </sec:authorize>
            <div class="navbar-item has-dropdown is-hoverable">
                <a id="aServiceCenter" class="navbar-link">
                    <span class="icon has-text-warning mr-1"><i class="fas fa-info"></i></span>
                    <span id="spanServiceCenter">고객센터</span>
                </a>
                <div class="navbar-dropdown">
                    <a id="aNotice" class="navbar-item" href="${pageContext.request.contextPath}/bbs/notice">
                        <span class="icon has-text-primary mr-1"><i class="fas fa-flag"></i></span>
                        <span id="spanNotice">공지사항</span>
                    </a>
                    <a class="navbar-item" href="${pageContext.request.contextPath}/bbs/qa">
                        <span class="icon has-text-primary mr-1"><i class="fas fa-question-circle"></i></span>
                        <span>Q&A</span>
                    </a>
                </div>
            </div>
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/pricing-table"><span class="icon has-text-warning mr-1"><i class="fas fa-book-reader"></i></span>구독</a>
            <%--관리자만 가능--%>
            <sec:authorize access="hasRole('ROLE_ADMIN')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link"><span class="icon has-text-warning mr-1"><i class="fas fa-cogs"></i></span>시스템관리</a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/user-management"><span class="icon has-text-primary mr-1"><i class="fas fa-cog"></i></span>사용자관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/code-management"><span class="icon has-text-primary mr-1"><i class="fas fa-cog"></i></span>시스템 코드관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/profile-management"><span class="icon has-text-primary mr-1"><i class="fas fa-address-card"></i></span>포트폴리오 관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/quarter-management"><span class="icon has-text-primary mr-1"><i class="fas fa-database"></i></span>포트폴리오 분기 수동 업로드</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/profile-order-management"><span class="icon has-text-primary mr-1"><i class="fas fa-sort-numeric-up"></i></span>포트폴리오 순서 변경</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/latest-price-management"><span class="icon has-text-primary mr-1"><i class="fas fa-hand-holding-usd"></i></span>Daily 주가 수동 업로드</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/avg-price-management"><span class="icon has-text-primary mr-1"><i class="fas fa-hand-holding-usd"></i></span>평균주가 수동 업로드</a>
                    </div>
                </div>
            </sec:authorize>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <sec:authorize access="isAuthenticated()">
                        <%--알림 아이콘--%>
                        <button class="button is-black" data-show="quickview" data-target="alarmQuickView">
                            <span id="spanAlarm" class="icon has-text-warning is-medium has-tooltip-bottom">
                                <i class="fas fa-bell"></i>
                            </span>
                        </button>
                        <%--마이 페이지--%>
                        <button id="spanMyPage" class="button is-black" onclick="topMain.goToMyPage()">
                            <span class="icon has-text-warning is-medium has-tooltip-bottom">
                                <i class="fas fa-user-alt"></i>
                            </span>
                        </button>
                        <sec:authorize access="hasRole('ROLE_USER')">
                            <input type="hidden" id="myPageTooltip" value="<sec:authentication property="principal.userNm"/>(일반 사용자)"/>
                        </sec:authorize>
                        <sec:authorize access="hasRole('ROLE_STANDARD')">
                            <input type="hidden" id="myPageTooltip" value="<sec:authentication property="principal.userNm"/>(스탠다드 사용자)"/>
                        </sec:authorize>
                        <sec:authorize access="hasRole('ROLE_PREMIUM')">
                            <input type="hidden" id="myPageTooltip" value="<sec:authentication property="principal.userNm"/>(프리미엄 사용자)"/>
                        </sec:authorize>
                        <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
                            <input type="hidden" id="myPageTooltip" value="<sec:authentication property="principal.userNm"/>(프리미엄 플러스 사용자)"/>
                        </sec:authorize>
                        <sec:authorize access="hasRole('ROLE_ADMIN')">
                            <input type="hidden" id="myPageTooltip" value="<sec:authentication property="principal.userNm"/>(관리자)"/>
                        </sec:authorize>
                    </sec:authorize>
                    <%--회원가입--%>
                    <button id="spanSignUp" class="button is-black" onclick="topMain.signUp()">
                        <span class="icon has-text-primary is-medium has-tooltip-bottom">
                            <i class="fas fa-user-plus"></i>
                        </span>
                    </button>
                    <%--로그인--%>
                    <button id="spanLogin" class="button is-black" onclick="topMain.login()">
                        <span class="icon has-text-warning is-medium has-tooltip-bottom">
                            <i class="fas fa-sign-in-alt"></i>
                        </span>
                    </button>
                    <sec:authorize access="isAuthenticated()">
                        <%--로그아웃--%>
                        <button id="spanLogout" class="button is-black" onclick="topMain.logout()">
                            <span class="icon has-text-danger is-medium has-tooltip-bottom">
                                <i class="fas fa-sign-out-alt"></i>
                            </span>
                        </button>
                    </sec:authorize>
                </div>
            </div>
        </div>
    </div>
</nav>

<nav id="breadCrumbNav" class="cmm-mt-60 ml-5 breadcrumb has-arrow-separator" aria-label="breadcrumbs">
</nav>

<%--Tree view--%>
<div id="alarmQuickView" class="quickview">
    <header class="quickview-header is-black">
        <p class="title"><span class="icon has-text-warning mr-3"><i class="fas fa-bell"></i></span>알림</p>
        <span id="delQuickView" class="delete" data-dismiss="quickview" onclick="topMain.initAlarmQuickView()"></span>
    </header>
    <div class="quickview-body">
        <div class="flex-row justify-content-end">
            <button type="button" class="mt-1 button is-black is-small" onclick="topMain.closeAlarmBoxAll()"><strong>알림 모두 닫기</strong></button>
        </div>
        <div class="quickview-block mt-5" id="userAlarmBody">
        </div>
    </div>
    <footer class="quickview-footer">
    </footer>
</div>