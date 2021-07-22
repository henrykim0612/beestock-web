<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/latestprice/latest_price_management.js" type="text/javascript"></script>

<%--검색조건--%>
<div class="columns">
    <div class="column">
        <div class="field">
            <input type="radio" class="is-checkradio is-primary is-circle" id="profileType1" name="profileType" value="1" checked="checked">
            <label for="profileType1">국내</label>
            <input type="radio" class="is-checkradio is-primary is-circle" id="profileType2" name="profileType" value="2">
            <label for="profileType2">해외</label>
        </div>
    </div>
</div>
<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="field has-addons">
            <p class="control has-icons-left">
                <span class="select">
                        <select id="selSearch">
                            <option value="1" selected>종목코드</option>
                            <option value="2">종목명</option>
                        </select>
                    </span>
                <span class="icon is-left"><i class="fas fa-filter" aria-hidden="true"></i></span>
            </p>
            <p class="control">
                <input id="inputSearch" class="input input-search" type="text" placeHolder="키보드 Enter 키 입력시 검색됩니다"/>
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
                    <button class="button is-primary is-small" onclick="main.showUploadModal()">
                        <span class="icon is-small"><i class="fas fa-file-upload"></i></span>
                        <span>국내 데일리 현재가 업로드</span>
                    </button>
                    <button id="btnLastPrice" class="button is-danger is-small" onclick="main.saveLastPrice()">
                        <span class="icon is-small"><i class="fas fa-stamp"></i></span>
                        <span>해외 종가 저장</span>
                    </button>
                </div>
            </div>
        </div>
    </sec:authorize>
</div>

<%--엑셀 다운로드--%>
<sec:authorize access="hasAnyRole('ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS', 'ROLE_ADMIN')">
    <div class="has-text-right">
        <span id="icoExcelDownload" class="icon has-text-success cursor" onclick="main.downloadExcel()"><i class="fas fa-lg fa-file-download"></i></span>
    </div>
</sec:authorize>

<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-narrow is-bordered is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>

<%--업로드 모달--%>
<sec:authorize access="hasRole('ROLE_ADMIN')">
    <div id="uploadModal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card width900px">
            <header class="modal-card-head">
                <p class="modal-card-title">국내 종목코드 업로드</p>
                <button class="delete" aria-label="close" onclick="main.hideUploadModal()"></button>
            </header>
            <section class="modal-card-body">
                <div class="columns">
                    <div class="column is-2 is-vertical-center">
                        <div class="field" id="fileField">
                            <div class="file is-white">
                                <label class="file-label">
                                    <input multiple class="file-input" type="file" id="uploadFile" accept=".xlsx">
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
                            <div class="column" id="uploadFileDiv">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot justify-content-center">
                <button onclick="main.uploadStockItem()" class="button is-success is-small">
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
</sec:authorize>

<%--Quick view--%>
<div id="itemCodeQuickView" class="quickview">
    <header class="quickview-header">
        <p><strong id="qViewTitle"></strong></p>
        <span class="delete" data-dismiss="quickview"></span>
    </header>
    <div class="quickview-body">
        <div class="quickview-block">
            <div id="qViewContent" class="tree ml-5 mt-5">
            </div>
        </div>
    </div>
    <footer class="quickview-footer">
    </footer>
</div>

