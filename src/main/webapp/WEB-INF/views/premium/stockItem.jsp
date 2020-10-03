<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/premium/stock_item.js"></script>

<div class="level-left mr-3 mb-5">
    <div class="control has-icons-left mr-3">
        <div class="select is-rounded">
            <select id="selSearch">
                <option value="itemCode" selected>종목코드</option>
                <option value="itemName">종목명</option>
            </select>
        </div>
        <div class="icon is-small is-left">
            <i class="fas fa-search"></i>
        </div>
    </div>
    <div class="mr-3">
        <p class="control has-icons-left">
            <input id="inputSearch" class="input input-search" type="text" placeHolder="키보드 Enter 키 입력시 검색됩니다">
            <span class="icon is-left">
                <i class="fas fa-search" aria-hidden="true"></i>
            </span>
        </p>
    </div>
    <div class="control has-icons-left">
        <div class="control input-single-date">
            <input id="schRegDate" type="date">
        </div>
    </div>
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div class="control ml-4">
            <div class="buttons">
                <button class="button is-primary" onclick="">종목코드 업로드</button>
            </div>
        </div>
    </sec:authorize>
</div>

<div class="level-right">
    <span id="icoExcelDownload" class="icon is-small has-text-success cursor" onclick="main.downloadExcel()">
        <i class="fas fa-lg fa-file-download"></i>
    </span>
</div>
<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-striped is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>