<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<script src="${pageContext.request.contextPath}/js/tiles/components/top.js" type="text/javascript"></script>

<sec:authorize access="isAuthenticated()">
    <input type="hidden" id="accountNonExpired" value="<sec:authentication property="principal.accountNonExpired"/>"/>
    <input type="hidden" id="loginId" value="<sec:authentication property="principal.username"/>"/>
    <input type="hidden" id="loginUserNm" value="<sec:authentication property="principal.userNm"/>"/>
    <input type="hidden" id="authority" value="<sec:authentication property="principal.authorities"/>"/>
    <input type="hidden" id="humanAccount" value="<sec:authentication property="principal.humanAccount"/>"/>
</sec:authorize>

<nav class="is-fixed-top navbar is-black" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="${pageContext.request.contextPath}/home/dashboard.do">
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
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/dashboard.do"><span class="icon has-text-warning mr-1"><i class="fas fa-home"></i></span>홈</a>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link"><span class="icon has-text-warning mr-1"><i class="fas fa-book"></i></span>소개</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" href="${pageContext.request.contextPath}/home/about.do"><span class="icon has-text-dark mr-1"><i class="fas fa-microphone"></i></span>소개</a>
<%--                    <a class="navbar-item" href=""><span class="icon has-text-dark mr-1"><i class="fab fa-glide-g"></i></span>가이드</a>--%>
                </div>
            </div>

            <sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_PREMIUM_PLUS')">
                <a class="navbar-item" href="${pageContext.request.contextPath}/premium/plus/itemcode.do"><span class="icon has-text-warning mr-1"><i class="fas fa-search-dollar"></i></span>종목검색</a>
            </sec:authorize>

            <%--구독자, 관리자 전용--%>
            <%--<sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link"><span class="icon has-text-warning mr-1"><i class="fas fa-search-dollar"></i></span>BeeStock 프리미엄</a>
                </div>
            </sec:authorize>--%>
            <div class="navbar-item has-dropdown is-hoverable">
                <a id="aServiceCenter" class="navbar-link">
                    <span class="icon has-text-warning mr-1"><i class="fas fa-info"></i></span>
                    <span id="spanServiceCenter">고객지원</span>
                </a>
                <div class="navbar-dropdown">
                    <a id="aNotice" class="navbar-item" href="${pageContext.request.contextPath}/bbs/notice.do">
                        <span class="icon has-text-dark mr-1"><i class="fas fa-bullhorn"></i></span>
                        <span id="spanNotice">공지사항</span>
                    </a>
                    <a class="navbar-item" href="${pageContext.request.contextPath}/bbs/qa.do">
                        <span class="icon has-text-dark mr-1"><i class="fas fa-question-circle"></i></span>
                        <span>Q&A</span>
                    </a>
                </div>
            </div>
            <a class="navbar-item" href="${pageContext.request.contextPath}/home/pricing-table.do"><span class="icon has-text-warning mr-1"><i class="fas fa-dollar-sign"></i></span>가격</a>
            <%--관리자만 가능--%>
            <sec:authorize access="hasRole('ROLE_ADMIN')">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link"><span class="icon has-text-warning mr-1"><i class="fas fa-cogs"></i></span>시스템관리</a>
                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/user-management.do"><span class="icon has-text-dark mr-1"><i class="fas fa-user"></i></span>사용자관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/code-management.do"><span class="icon has-text-dark mr-1"><i class="fas fa-cog"></i></span>시스템 코드관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/profile-management.do"><span class="icon has-text-dark mr-1"><i class="fas fa-address-card"></i></span>포트폴리오 관리</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/quarter-management.do"><span class="icon has-text-dark mr-1"><i class="fas fa-database"></i></span>포트폴리오 분기 수동 업로드</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/latest-price-management.do"><span class="icon has-text-dark mr-1"><i class="fas fa-upload"></i></span>현재가 수동 업로드</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/profile-order-management.do"><span class="icon has-text-dark mr-1"><i class="fas fa-sort-numeric-up"></i></span>포트폴리오 순서 변경</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/userlog.do"><span class="icon has-text-dark mr-1"><i class="fas fa-user-secret"></i></span>사용자 로그분석</a>
                        <a class="navbar-item" href="${pageContext.request.contextPath}/admin/feedback.do"><span class="icon has-text-dark mr-1"><i class="fas fa-paper-plane"></i></span>피드백 확인</a>
                    </div>
                </div>
            </sec:authorize>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <sec:authorize access="isAuthenticated()">
                        <%--피드백--%>
                        <button id="spanFeedback" class="button is-black" onclick="cmmUtils.showModal('feedbackModal')">
                            <span class="icon has-text-warning is-medium has-tooltip-bottom">
                                <i class="fas fa-comment-dots"></i>
                            </span>
                        </button>
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
                        <sec:authorize access="hasRole('ROLE_BASIC')">
                            <input type="hidden" id="myPageTooltip" value="<sec:authentication property="principal.userNm"/>(베이직 사용자)"/>
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
        <p>
            <span class="icon has-text-warning mr-3"><i class="fas fa-bell"></i></span>
            <span class="has-text-white">알림</span>
        </p>
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