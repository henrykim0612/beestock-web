<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/premium/item_code.js" type="text/javascript"></script>

<div class="flex-row justify-content-start">
    <div class="field has-addons">
        <p class="control has-icons-left">
            <span class="select">
                <select id="selQuarter">
                </select>
            </span>
            <span class="icon is-left"><i class="far fa-calendar-alt"></i></span>
        </p>
        <p class="control has-icons-left">
            <span class="select">
                <select id="selType">
                    <option selected value="1">국내</option>
                    <option value="2">해외</option>
                </select>
            </span>
            <span class="icon is-left"><i class="fas fa-filter"></i></span>
        </p>
        <p class="control has-icons-left">
            <span class="select">
                <select id="selCond">
                    <option selected value="itemName">종목명</option>
                    <option value="itemCode">종목코드</option>
                </select>
            </span>
            <span class="icon is-left"><i class="fas fa-filter"></i></span>
        </p>
        <p class="control">
            <input id="inputSearch" class="input input-search" type="text" placeHolder="키보드 Enter 키 입력시 검색됩니다">
        </p>
        <p class="control">
            <button id="btnSearch" class="button is-dark" onclick="main.initGrid()">
                <span class="icon is-small"><i class="fas fa-search"></i></span>
                <span>검색</span>
            </button>
        </p>
    </div>
</div>

<div class="table-container">
    <table id="profileGrid" class="mt-3 table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
</div>
<nav id="profileGridPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
