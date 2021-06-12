<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/quarter/quarter_management.js" type="text/javascript"></script>

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
</div>


<div class="has-text-right">
   <span id="icoProfileExcelDownload" class="icon has-text-success cursor" onclick="main.downloadProfileExcel()">
        <i class="fas fa-lg fa-file-download"></i>
    </span>
</div>

<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-small ml-3 mr-3 mb-6" role="navigation" aria-label="pagination"></nav>


<%--분기 데이터 테이블--%>
<table id="quarterGrid" class="mt-3 table is-narrow is-hoverable is-fullwidth"></table>
<nav id="quarterPagination" class="pagination is-small ml-3 mr-3 mb-6" role="navigation" aria-label="pagination"></nav>


<%--업로드 모달--%>
<div id="uploadModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card width900px">
        <header class="modal-card-head">
            <p class="modal-card-title">분기 업로드</p>
            <button class="delete" aria-label="close" onclick="main.hideUploadModal()"></button>
        </header>
        <section class="modal-card-body">
            <div class="columns">
                <div class="column is-2 is-vertical-center">
                    <div class="field" id="fileField">
                        <div class="file is-white">
                            <label class="file-label">
                                <input multiple class="file-input" type="file" id="quarterFile" accept=".xlsx">
                                <span class="file-cta">
                                        <span class="file-icon"><i class="fas fa-file-upload"></i></span>
                                        <span class="file-label">파일선택</span>
                                    </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="columns">
                        <div class="column" id="quarterFileDiv">
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button onclick="main.uploadQuarter()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>업로드</span>
            </button>
            <button onclick="main.hideUploadModal()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>닫기</span>
            </button>
        </footer>
    </div>
</div>

<%--분기 상세데이터 모달--%>
<div id="quarterInfoModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card width900px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="qiTitle"></p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('quarterInfoModal');"></button>
        </header>
        <section class="modal-card-body">
            <div class="has-text-right">
                <span id="icoQiExcelDownload" class="icon has-text-success cursor" onclick="main.downloadQuarterInfoExcel()">
                    <i class="fas fa-lg fa-file-download"></i>
                </span>
            </div>
            <table id="quarterInfoGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnRm" onclick="main.removeQuarterInfo()" class="button is-danger is-small">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
                <span>삭제</span>
            </button>
            <button onclick="cmmUtils.closeModal('quarterInfoModal')" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>닫기</span>
            </button>
        </footer>
    </div>
</div>
