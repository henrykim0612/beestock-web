<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>

<script src="${pageContext.request.contextPath}/${jsDir}/bbs/notice/notice.js" type="text/javascript"></script>

<div class="level mr-3 mb-6">
    <div class="level-left">
        <div class="field has-addons">
            <p class="control has-icons-left">
                <span class="select">
                    <select id="selSearch">
                        <option value="noticeTitle" selected>제목</option>
                        <option value="noticeCont">내용</option>
                    </select>
                </span>
                <span class="icon is-left"><i class="fas fa-filter" aria-hidden="true"></i></span>
            </p>
            <p class="control">
                <input id="inputSearch" class="input input-search" type="text" placeHolder="키보드 Enter 키 입력시 검색됩니다" maxlength="200">
            </p>
            <p class="control">
                <button id="btnSearch" class="button is-dark" onclick="main.reloadGrid()">
                    <span class="icon is-small"><i class="fas fa-search"></i></span>
                    <span>검색</span>
                </button>
            </p>
        </div>
    </div>
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div class="level-right">
            <div class="control ml-4">
                <div class="buttons">
                    <button class="button is-primary is-small" onclick="main.goToNoticeForm()">
                        <span class="icon is-small"><i class="fas fa-plus-circle"></i></span>
                        <span>공지사항 등록</span>
                    </button>
                </div>
            </div>
        </div>
    </sec:authorize>
</div>

<%--테이블 그리드--%>
<div class="box">
    <table id="dataGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
    <nav id="dataPagination" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
</div>

