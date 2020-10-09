<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/profile/profile_management.js"></script>

<div class="level-left mr-3 mb-5">
    <div class="control has-icons-left mr-3">
        <div class="select is-rounded">
            <select id="selType">
                <option value="profileTitle" selected>전체</option>
                <option value="profileSubtitle">국내</option>
                <option value="profileInfo">해외</option>
            </select>
        </div>
        <div class="icon is-small is-left">
            <i class="fas fa-search"></i>
        </div>
    </div>
    <div class="control has-icons-left mr-3">
        <div class="select is-rounded">
            <select id="selSearch">
                <option value="profileTitle" selected>프로파일명</option>
                <option value="profileSubtitle">프로파일 서브명</option>
                <option value="profileInfo">프로파일 정보</option>
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
    <div class="control ml-4">
        <div class="buttons">
            <button class="button is-primary is-small" onclick="">프로파일 등록</button>
        </div>
    </div>
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

