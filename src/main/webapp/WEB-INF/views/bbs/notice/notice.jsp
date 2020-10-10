<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>

<script src="${pageContext.request.contextPath}/js/bbs/notice/notice.js"></script>

<div class="level mr-3 mb-6">
    <div class="level-left">
        <div class="control has-icons-left mr-3">
            <div class="select is-rounded">
                <select id="selSearch">
                    <option value="noticeTitle" selected>제목</option>
                    <option value="noticeCont">내용</option>
                </select>
            </div>
            <div class="icon is-small is-left">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div>
            <p class="control has-icons-left">
                <input id="inputSearch" class="input input-search" type="text" placeHolder="키보드 Enter 키 입력시 검색됩니다">
                <span class="icon is-left">
                <i class="fas fa-search" aria-hidden="true"></i>
            </span>
            </p>
        </div>
    </div>
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div class="level-right">
            <div class="control ml-4">
                <div class="buttons">
                    <button class="button is-primary" onclick="main.goToNoticeForm()">공지사항 등록</button>
                </div>
            </div>
        </div>
    </sec:authorize>
</div>

<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
