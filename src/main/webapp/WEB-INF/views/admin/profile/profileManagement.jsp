<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/profile/profile_management.js"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="control has-icons-left mr-3">
            <div class="select is-rounded">
                <select id="selType" onchange="main.changeSelType(this)">
                    <option value="" selected>전체</option>
                    <option value="1">국내</option>
                    <option value="2">해외</option>
                </select>
            </div>
            <div class="icon is-small is-left">
                <i class="fas fa-globe-asia"></i>
            </div>
        </div>
        <div class="control has-icons-left mr-3">
            <div class="select is-rounded">
                <select id="selSearch">
                    <option value="profileTitle" selected>프로필명</option>
                    <option value="profileSubtitle">보조명</option>
                    <option value="profileInfo">설명</option>
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
    <div class="level-right">
        <div class="control ml-4">
            <div class="buttons">
                <button class="button is-primary" onclick="main.goToProfileForm()">프로파일 등록</button>
            </div>
        </div>
    </div>
</div>


<div class="has-text-right">
   <span id="icoExcelDownload" class="icon has-text-success cursor" onclick="main.downloadExcel()">
        <i class="fas fa-lg fa-file-download"></i>
    </span>
</div>

<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
</div>

<nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>

