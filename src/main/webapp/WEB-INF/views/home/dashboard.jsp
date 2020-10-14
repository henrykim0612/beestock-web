<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/dashboard.js"></script>

<div class="tabs is-centered">
    <ul>
        <li id="tabIn" name="tabs" class="is-active" data-cont-id="contIn">
            <a>
                <span class="icon is-small"><i class="fas fa-globe-asia" aria-hidden="true"></i></span>
                <span>국내</span>
            </a>
        </li>
        <li id="tabOut" name="tabs" data-cont-id="contOut">
            <a>
                <span class="icon is-small"><i class="fas fa-globe" aria-hidden="true"></i></span>
                <span>국외</span>
            </a>
        </li>
    </ul>
</div>

<div id="contIn">
    <div class="columns">
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
    </div>
</div>
<div id="contOut" class="is-hidden">
    <div class="columns">
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
        <div class="column">
            <div class="box"></div>
        </div>
    </div>
</div>


