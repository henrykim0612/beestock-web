<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/common/common_profile_card.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/home/dashboard.js" type="text/javascript"></script>

<div class="level mr-3 mb-3">
    <div class="level-left">
        <div>
            <p class="control has-icons-left">
                <input id="inputSearch" class="input input-search is-rounded" type="text" placeHolder="포트폴리오 검색"/>
                <span class="icon is-left">
                    <i class="fas fa-search" aria-hidden="true"></i>
                </span>
            </p>
        </div>
        <div class="ml-3">
            <span id="dashboardHelp" class="icon has-text-warning cursor"><i class="fas fa-lg fa-info-circle"></i></span>
        </div>
    </div>
</div>

<div class="tabs is-centered">
    <ul class="mt-3">
        <li id="tabOut" name="tabs" data-cont-id="contOut" class="is-active">
            <a>
                <span class="icon is-small"><i class="fas fa-globe"></i></span>
                <span>해외</span>
            </a>
        </li>
        <li id="tabIn" name="tabs" data-cont-id="contIn">
            <a id="tabInAnchor">
                <span class="icon is-small"><i class="fas fa-globe-asia"></i></span>
                <span>국내</span>
                <sec:authorize access="hasAnyRole('ROLE_USER', 'ROLE_STANDARD')">
                    <span class="badge is-danger is-top-right">Premium Plus</span>
                </sec:authorize>
            </a>
        </li>
    </ul>
</div>

<div id="contIn" class="is-hidden"></div>
<div id="contOut" class="is-hidden"></div>
