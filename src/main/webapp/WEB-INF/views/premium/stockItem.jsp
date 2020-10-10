<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/premium/stock_item.js"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
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
    </div>
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div class="level-right">
            <div class="control ml-4">
                <div class="buttons">
                    <button class="button is-primary" onclick="main.showUploadModal()">종목코드 업로드</button>
                </div>
            </div>
        </div>
    </sec:authorize>
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

<%--업로드 모달--%>
<sec:authorize access="hasRole('ROLE_ADMIN')">
    <div id="uploadModal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">종목코드 업로드</p>
                <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('uploadModal');"></button>
            </header>
            <section class="modal-card-body">
                <form method="post" enctype="multipart/form-data" id="fileUploadForm">
                    <div class="level">
                        <div class="level-left mb-4">
                            <div class="file has-name is-primary is-fullwidth">
                                <label class="file-label">
                                    <input class="file-input" type="file" id="stockItemFile" name="stockItemFile" onchange="main.changeFileInput(this)" accept=".xlsx">
                                    <span class="file-cta">
                                      <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                      </span>
                                      <span class="file-label">
                                        엑셀파일 선택
                                      </span>
                                    </span>
                                    <span class="file-name" id="spanFileName">
                                      Screen Shot 2017-07-29 at 15.54.25.png
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            <footer class="modal-card-foot justify-content-center">
                <button id="btnSaveAuth" onclick="main.uploadStockItem()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                    <span>업로드</span>
                </button>
                <button onclick="cmmUtils.closeModal('uploadModal');" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                    <span>닫기</span>
                </button>
            </footer>
        </div>
    </div>
</sec:authorize>