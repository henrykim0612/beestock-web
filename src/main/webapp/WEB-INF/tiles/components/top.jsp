<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<script src="${pageContext.request.contextPath}/js/tiles/components/top.js"></script>

<sec:authorize access="isAuthenticated()">
    <input type="hidden" id="accountNonExpired" value="<sec:authentication property="principal.accountNonExpired"/>"/>
</sec:authorize>

<nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
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
                <a class="navbar-link" href="${pageContext.request.contextPath}/login/login-home">Log in / Sign up</a>
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
                    <a class="button is-primary is-small" href="${pageContext.request.contextPath}/login/signup"><strong>Sign up</strong></a>
                    <a id="aLogin" class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>Log in</strong></a>
                    <sec:authorize access="isAuthenticated()">
                        <a class="button is-danger is-small" href="${pageContext.request.contextPath}/login/logout"><strong>Log out</strong></a>
                    </sec:authorize>
                </div>
            </div>
        </div>
    </div>
</nav>