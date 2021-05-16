<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/bbs/notice/notice_details.js" type="text/javascript"></script>

<input type="hidden" id="noticeId" value="${noticeId}"/>

<form id="noticeDetailForm">
    <div class="columns mb-5">
        <div class="column is-1 is-vertical-center">
            <label id="labelModUptDate" class="label" for="uptDate">최근 수정일</label>
        </div>
        <div class="column">
            <p id="uptDate" data-bind="true" data-id="uptDate"></p>
        </div>
    </div>
    <h1 class="title is-4" data-bind="true" data-id="noticeTitle"></h1>
    <div class="box">
        <div data-bind="true" data-id="noticeCont"></div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div id="uptDiv">
            <button id="btnMod is-small" onclick="main.goToModify()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
                <span>수정</span>
            </button>
        </div>
    </sec:authorize>
    <div class="ml-3">
        <button onclick="main.goToNotice()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
