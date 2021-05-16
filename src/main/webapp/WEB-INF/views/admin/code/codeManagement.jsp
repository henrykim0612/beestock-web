<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/code/code_management.js" type="text/javascript"></script>
<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="field has-addons">
            <p class="control has-icons-left">
                <span class="select">
                    <select id="selSearch">
                        <option value="codeId" selected>코드</option>
                        <option value="codeNm">코드명</option>
                        <option value="description">설명</option>
                        <option value="parentCodeId">부모코드</option>
                        <option value="codeLevel">코드레벨</option>
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
                <button class="button is-primary is-small" onclick="main.showNewCodeModal()">
                    <span class="icon is-small"><i class="fas fa-plus-circle"></i></span>
                    <span>최상위 코드 등록</span>
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

<%--코드등록 모달--%>
<div id="newCodeModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">최상위 코드 등록</p>
            <button class="delete" aria-label="close" onclick="main.closeNewCodeModal()"></button>
        </header>
        <section class="modal-card-body">
            <form id="newCodeForm">
                <input type="hidden" id="hidParentCodeId">
                <input type="hidden" id="hidParentCodeLevel">
                <div class="columns">
                    <div class="column is-one-fifth mt-2 has-text-centered">
                        <label id="labelCodeId" class="label" for="newCodeId">코드 아이디</label>
                    </div>
                    <div class="column">
                        <div class="control">
                            <div class="field">
                                <div class="control has-icons-left has-icons-right">
                                    <input id="newCodeId" class="input" type="text" placeholder="5자리 입력" onblur="main.checkCodeId(this)" maxlength="5">
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-id-card"></i>
                                </span>
                                    <span class="icon is-small is-right">
                                    <i id="icoCodeIdCheck" class="fas fa-check is-hidden"></i>
                                    <i id="icoCodeIdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                                </span>
                                </div>
                                <p id="helpCodeId" class="help is-hidden">이미 사용중인 코드값입니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-one-fifth mt-2 has-text-centered">
                        <label id="labelCodeNm" class="label" for="newCodeNm">코드명</label>
                    </div>
                    <div class="column">
                        <div class="control">
                            <div class="control has-icons-left has-icons-right">
                                <input id="newCodeNm" class="input" type="text" maxlength="50" placeholder="최대 50자리 입력">
                                <span class="icon is-small is-left">
                                <i class="fas fa-cogs"></i>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-one-fifth mt-2 has-text-centered">
                        <label id="labelDescription" class="label" for="newDescription">설명</label>
                    </div>
                    <div class="column">
                        <div class="control has-icons-left">
                            <textarea id="newDescription" class="textarea" placeholder="500자 내외로 작성" maxlength="500"></textarea>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnNewCode" onclick="main.saveNewCode()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>등록</span>
            </button>
            <button onclick="main.closeNewCodeModal()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>

<%--코드 수정 모달--%>
<div id="modCodeModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">코드 수정</p>
            <button class="delete" aria-label="close" onclick="main.closeModCodeModal()"></button>
        </header>
        <section class="modal-card-body">
            <form id="modCodeForm">
                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModCodeId" class="label" for="modCodeId">코드 아이디</label>
                    </div>
                    <div class="control width-85-p">
                        <div class="field">
                            <div class="control has-icons-left has-icons-right">
                                <input disabled id="modCodeId" class="input" type="text" data-bind="true" data-id="codeId">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-id-card"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModCodeNm" class="label" for="modCodeNm">코드명</label>
                    </div>
                    <div class="control has-icons-left width-85-p">
                        <div class="control has-icons-left has-icons-right">
                            <input id="modCodeNm" class="input" type="text" data-bind="true" data-id="codeNm" maxlength="50" placeholder="최대 50자리 입력">
                            <span class="icon is-small is-left">
                                <i class="fas fa-cogs"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModDescription" class="label" for="modDescription">설명</label>
                    </div>
                    <div class="control has-icons-left width-85-p">
                        <textarea id="modDescription" class="textarea" data-bind="true" data-id="description" placeholder="500자 내외로 작성" maxlength="500"></textarea>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnModCode" onclick="main.modifyCode()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
                <span>수정</span>
            </button>
            <button id="btnRemoveCode" onclick="main.removeCode()" class="button is-danger is-small">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
                <span>삭제</span>
            </button>
            <button onclick="main.closeModCodeModal()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>

<%--Tree view--%>
<div id="quickTreeView" class="quickview">
    <header class="quickview-header">
        <p class="title">하위코드 트리</p>
        <span class="delete" data-dismiss="quickview"></span>
    </header>
    <div class="quickview-body">
        <div class="quickview-block">
            <ul id="treeViewContent" class="tree ml-5">
            </ul>
        </div>
    </div>
    <footer class="quickview-footer">
    </footer>
</div>
