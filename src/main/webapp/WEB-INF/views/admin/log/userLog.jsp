<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/log/user_log.js" type="text/javascript"></script>

<div class="flex-row justify-content-start">
    <div class="field has-addons">
        <p class="control has-icons-left">
            <span class="select">
                <select id="schType">
                    <option value="loginId">아이디</option>
                    <option value="userNm">이름</option>
                </select>
            </span>
            <span class="icon is-left"><i class="fas fa-filter"></i></span>
        </p>
        <p class="control">
            <input id="inputSearch" class="input input-search" type="text" maxlength="50" placeHolder="종목명 또는 종목코드 입력">
        </p>
        <p class="control">
            <button id="btnSearch" class="button is-dark" onclick="main.initGrid()">
                <span class="icon is-small"><i class="fas fa-search"></i></span>
                <span>검색</span>
            </button>
        </p>
    </div>
</div>

<div class="box mt-3">
    <div class="table-container">
        <table id="logGrid" class="table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
    </div>
    <nav id="logGridPager" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
</div>