<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/user/user_management.js"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="control has-icons-left mr-3">
            <div class="select is-rounded">
                <select id="selSearch">
                    <option value="userNm" selected>이름</option>
                    <option value="loginId">Email</option>
                    <option value="userPhone">연락처</option>
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
</div>

<div class="has-text-right">
   <span id="icoExcelDownload" class="icon has-text-success cursor" onclick="main.downloadExcel()">
        <i class="fas fa-lg fa-file-download"></i>
    </span>
</div>

<table id="dataGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
<nav id="dataPagination" class="pagination is-rounded is-small" role="navigation" aria-label="pagination"></nav>

<%--권한변경 모달--%>
<div id="authModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">권한 변경</p>
            <button class="delete" aria-label="close" onclick="main.closeChangeRoleModal('authModal')"></button>
        </header>
        <section class="modal-card-body">
            <div class="columns">
                <div class="column is-5 has-text-centered mt-2">
                    <label id="labelModalAuth" class="label" for="modalSelAuth">Subject</label>
                </div>
                <div class="column">
                    <div class="control has-icons-left">
                        <div class="select">
                            <select id="modalSelAuth">
                                <option value="ROLE_ADMIN">관리자</option>
                                <option value="ROLE_SUBC">구독자</option>
                                <option value="ROLE_USER">일반사용자</option>
                            </select>
                        </div>
                        <div class="icon is-small is-left">
                            <i class="fas fa-user-circle"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div id="divExpDate" class="columns">
                <div class="column is-5 has-text-centered mt-2">
                    <label class="label" for="expDate">만료일 선택</label>
                </div>
                <div class="column">
                    <div class="control input-single-date">
                        <input id="expDate" type="date">
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnSaveAuth" onclick="main.saveAuth()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>변경</span>
            </button>
            <button onclick="main.closeChangeRoleModal('authModal')" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>