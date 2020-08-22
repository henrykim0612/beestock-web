<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

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
                    <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>Log in</strong></a>
                </div>
            </div>
        </div>
    </div>
</nav>