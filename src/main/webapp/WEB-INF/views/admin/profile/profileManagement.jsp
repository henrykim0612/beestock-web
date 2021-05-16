<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/profile/profile_management.js" type="text/javascript"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="field has-addons">
            <p class="control has-icons-left">
                <span class="select">
                    <select id="selType" onchange="main.changeSelType(this)">
                        <option value="" selected>전체</option>
                        <option value="1">국내</option>
                        <option value="2">해외</option>
                    </select>
                </span>
                <span class="icon is-left"><i class="fas fa-globe-asia" aria-hidden="true"></i></span>
            </p>
            <p class="control has-icons-left">
                <span class="select">
                    <select id="selSearch">
                        <option value="profileTitle" selected>포트폴리오명</option>
                        <option value="profileSubtitle">보조명</option>
                        <option value="profileInfo">설명</option>
                    </select>
                </span>
                <span class="icon is-left"><i class="fas fa-filter" aria-hidden="true"></i></span>
            </p>
            <p class="control">
                <input id="inputSearch" class="input input-search" type="text" placeHolder="키보드 Enter 키 입력시 검색됩니다">
            </p>
            <p class="control">
                <button id="btnSearch" class="button is-dark" onclick="main.reloadGrid()">
                    <span class="icon is-small"><i class="fas fa-search"></i></span>
                    <span>검색</span>
                </button>
            </p>
        </div>
    </div>
    <div class="level-right">
        <div class="control ml-4">
            <div class="buttons">
                <button class="button is-primary is-small" onclick="main.goToProfileForm()">
                    <span class="icon is-small"><i class="fas fa-plus-circle"></i></span>
                    <span>포트폴리오 등록</span>
                </button>
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
    <table id="dataGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
</div>

<nav id="dataPagination" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>

