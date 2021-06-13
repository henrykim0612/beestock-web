<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/user/user_management.js" type="text/javascript"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="field has-addons">
            <p class="control has-icons-left">
                <span class="select">
                    <select id="selSearch">
                        <option value="userNm" selected>이름</option>
                        <option value="loginId">아이디</option>
                        <option value="userPhone">연락처</option>
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
   <span id="icoExcelDownload" class="icon has-text-success cursor" onclick="main.downloadExcel()">
        <i class="fas fa-lg fa-file-download"></i>
    </span>
</div>

<table id="dataGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
<nav id="dataPagination" class="pagination is-small" role="navigation" aria-label="pagination"></nav>

<%--권한변경 모달--%>
<div id="authModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card" style="width: 800px;">
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
                                <option value="ROLE_BASIC">베이직 사용자</option>
                                <option value="ROLE_STANDARD">스탠다드 사용자</option>
                                <option value="ROLE_PREMIUM">프리미엄 사용자</option>
                                <option value="ROLE_PREMIUM_PLUS">프리미엄 플러스 사용자</option>
                                <option value="ROLE_ADMIN">관리자</option>
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
                    <label class="label">만료일 선택</label>
                </div>
                <div class="column">
                    <div class="field">
                        <input class="is-checkradio" id="expDate1" value="" type="radio" name="expDate" checked="checked">
                        <label for="expDate1">유지</label>
                        <input class="is-checkradio" id="expDate2" value="1" type="radio" name="expDate">
                        <label for="expDate2">1달 연장</label>
                        <input class="is-checkradio" id="expDate3" value="3" type="radio" name="expDate">
                        <label for="expDate3">3달 연장</label>
                        <input class="is-checkradio" id="expDate4" value="12" type="radio" name="expDate">
                        <label for="expDate4">1년 연장</label>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnSaveAuth" onclick="main.saveAuth()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>변경</span>
            </button>
            <button onclick="main.closeChangeRoleModal('authModal')" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>