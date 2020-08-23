<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>

<%--<sec:authorize access="hasRole('ROLE_USER') and isAuthenticated()">--%>
<%--</sec:authorize>--%>
<%--<p>${errMsg }</p>--%>
<%--<p>${auth }</p>--%>

<section class="hero is-danger">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Access denied.
            </h1>
            <h2 class="subtitle">
                죄송합니다. 해당 URL 접근 권한이 없습니다.
            </h2>
        </div>
    </div>
</section>
