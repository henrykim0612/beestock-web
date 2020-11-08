<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/quarter/quarter_management.js"></script>

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
                        <option value="profileTitle" selected>프로필명</option>
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
    <table id="dataGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3 mb-6" role="navigation" aria-label="pagination"></nav>


<%--분기 데이터 테이블--%>
<table id="quarterGrid" class="mt-3 table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
<nav id="quarterPagination" class="pagination is-rounded is-small ml-3 mr-3 mb-6" role="navigation" aria-label="pagination"></nav>


<%--업로드 모달--%>
<div id="uploadModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">분기 업로드</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('uploadModal');"></button>
        </header>
        <section class="modal-card-body">
            <form method="post" enctype="multipart/form-data" id="fileUploadForm">
                <div class="level">
                    <div class="level-left mb-4">
                        <div class="file has-name is-primary is-fullwidth">
                            <label class="file-label">
                                <input class="file-input" type="file" id="quarterFile" name="quarterFile" onchange="main.changeFileInput(this)" accept=".xlsx">
                                <span class="file-cta">
                                      <span class="file-icon"><i class="fas fa-upload"></i></span>
                                      <span class="file-label">엑셀파일 선택</span>
                                </span>
                                <span class="file-name" id="spanFileName"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button onclick="main.uploadQuarter()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>업로드</span>
            </button>
            <button onclick="cmmUtils.closeModal('uploadModal')" class="button is-dark">
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
            <table id="quarterInfoGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button onclick="cmmUtils.closeModal('quarterInfoModal')" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>닫기</span>
            </button>
        </footer>
    </div>
</div>
