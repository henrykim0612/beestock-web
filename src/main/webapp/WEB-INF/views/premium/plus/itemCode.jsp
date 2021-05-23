<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/premium/plus/item_code.js" type="text/javascript"></script>

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
                    <option value="1">국내</option>
                    <option selected value="2">해외</option>
                </select>
            </span>
            <span class="icon is-left"><i class="fas fa-globe"></i></span>
        </p>
        <p class="control has-icons-left">
            <span class="select">
                <select id="schType">
                    <option value="1">종목명</option>
                    <option value="2">종목코드</option>
                </select>
            </span>
            <span class="icon is-left"><i class="fas fa-filter"></i></span>
        </p>
        <p class="control">
            <input id="inputSearch" class="input input-search" type="text" maxlength="200" placeHolder="종목명 또는 종목코드 입력">
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
    <p id="initParagraph" class="has-text-grey-light">종목을 검색하세요.</p>
    <div class="table-container">
        <table id="profileGrid" class="table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
    </div>
    <nav id="profileGridPagination" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
</div>

<div id="colLineChartModal" class="modal">
    <div class="modal-background" onclick="main.closeColLineChartModal()"></div>
    <div class="modal-content width1200px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="lineChartModalTitle"></p>
            <button class="delete" aria-label="close" onclick="main.closeColLineChartModal()"></button>
        </header>
        <section class="modal-card-body">
            <div class="flex-row justify-content-start">
                <div class="field">
                    <div class="control has-icons-left">
                        <div class="select is-small">
                            <select id="selLineChartFilter">
                            </select>
                        </div>
                        <div class="icon is-small is-left">
                            <i class="fas fa-filter"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-row justify-content-center">
                <div id="rightItemCodeChart" class="width1500px height600px"></div>
            </div>
            <div class="flex-row justify-content-center">
                <article class="message is-warning">
                    <div id="rightChartMsgBody" class="message-body">
                        <p>※ <strong>미공시</strong>로 표기된 것은 제출된 운용보고서가 <strong>비공개</strong>된 것입니다. 위 차트 상에는 전량매도로 보일 수 있으나, <strong>알수없음</strong>으로 보는 것이 맞습니다.</p>
                    </div>
                </article>
            </div>
        </section>
    </div>
</div>

<figure class="image is-128x128 is-hidden" id="miniProfileImg">
    <img src="https://bulma.io/images/placeholders/128x128.png">
</figure>

