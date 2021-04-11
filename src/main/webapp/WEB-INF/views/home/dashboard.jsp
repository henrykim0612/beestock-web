<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/common/common_profile_card.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/js/home/dashboard.js" type="text/javascript"></script>

<%--검색조건--%>
<div class="flex-row mt-7">
    <div class="flex-row justify-content-start width-50per">
        <div class="field has-addons" style="margin: 0;">
            <div class="control">
                <input id="inputSearch" class="input input-search is-small" type="text" placeHolder="포트폴리오 검색" maxlength="200"/>
            </div>
            <div class="control">
                <button class="button is-dark is-small" onclick="main.seearchProfile()">
                    <span class="icon"><i class="fas fa-search"></i></span>
                    <span>검색</span>
                </button>
            </div>
        </div>
        <div class="ml-3 flex-col justify-content-center">
            <span id="dashboardHelp" class="icon has-text-info cursor"><i class="fas fa-lg fa-info-circle"></i></span>
        </div>
    </div>
    <div class="flex-row justify-content-end width-50per">
        <div class="tags has-addons is-small">
            <sec:authorize access="hasRole('ROLE_ADMIN')">
                <span class="tag is-dark">version</span>
                <span class="tag is-success">1.4.2</span>
            </sec:authorize>
        </div>
    </div>
</div>

<%--포트폴리오 탭--%>
<div class="tabs is-centered">
    <ul class="mt-2">
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
                <sec:authorize access="hasAnyRole('ROLE_BASIC', 'ROLE_STANDARD')">
                    <span class="badge is-danger is-top-right">Premium Plus</span>
                </sec:authorize>
            </a>
        </li>
    </ul>
</div>

<div id="contIn" class="box is-hidden"></div>
<div id="contOut" class="box is-hidden"></div>
