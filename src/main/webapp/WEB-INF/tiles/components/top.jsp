<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<script src="${pageContext.request.contextPath}/js/tiles/components/top.js"></script>

<sec:authorize access="isAuthenticated()">
    <input type="hidden" id="accountNonExpired" value="<sec:authentication property="principal.accountNonExpired"/>"/>
    <input type="hidden" id="loginId" value="<sec:authentication property="principal.username"/>"/>
    <input type="hidden" id="loginUserNm" value="<sec:authentication property="principal.userNm"/>"/>
</sec:authorize>

<nav class="navbar mb-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
            <img src="" width="112" height="28">
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

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href="${pageContext.request.contextPath}/login/login-home">Others</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item">Menu1</a>
                    <a class="navbar-item">Menu2</a>
                    <a class="navbar-item">Menu3</a>
                    <hr class="navbar-divider">
                    <a class="navbar-item">Menu4</a>
                </div>
            </div>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <sec:authorize access="isAuthenticated()">
                        <span class="icon has-text-link-dark is-medium ml-2 mb-1 cursor" onclick="topMain.goToMyPage()">
                          <i class="fas fa-user-alt"></i>
                        </span>
                    </sec:authorize>
                    <a class="button is-primary is-small" href="${pageContext.request.contextPath}/login/signup"><strong>회원가입</strong></a>
                    <a id="aLogin" class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>로그인</strong></a>
                    <sec:authorize access="isAuthenticated()">
                        <a class="button is-danger is-small" href="${pageContext.request.contextPath}/login/logout"><strong>로그아웃</strong></a>
                    </sec:authorize>
                </div>
            </div>
        </div>
    </div>
</nav>


<%--에러 입력관련 모달--%>
<div id="errModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">에러</p>
            <button class="delete" aria-label="close" onclick="main.closeModal('errModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>서버와 통신도중 문제가 발생했습니다. 다시 진행해주세요.</h2>
        </section>
    </div>
</div>