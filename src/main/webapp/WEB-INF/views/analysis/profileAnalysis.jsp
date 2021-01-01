<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/analysis/profile_analysis.js" type="text/javascript"></script>
<input type="hidden" id="profileId" value="${profileVo.profileId}"/>
<input type="hidden" id="profileType" value="${profileVo.profileType}"/>

<div class="flex-row justify-content-end mb-2">
    <div>
        <figure class="image is-32x32">
            <img id="bannerNSec" class="cursor" src="${pageContext.request.contextPath}/resources/images/banner/n-sec.png" onclick="cmmUtils.goToLinkPop('https://finance.naver.com')">
        </figure>
    </div>
    <div class="ml-2">
        <figure class="image is-32x32">
            <img id="bannerDart" class="cursor" src="${pageContext.request.contextPath}/resources/images/banner/dart.png" onclick="cmmUtils.goToLinkPop('http://dart.fss.or.kr/')">
        </figure>
    </div>
    <div class="ml-2">
        <figure class="image is-32x32">
            <img id="bannerConsensus" class="cursor" src="${pageContext.request.contextPath}/resources/images/banner/consensus.png" onclick="cmmUtils.goToLinkPop('http://consensus.hankyung.com/apps.analysis/analysis.list?&skinType=business')">
        </figure>
    </div>
</div>

<div class="tile is-ancestor">
    <div class="tile is-3 is-vertical is-parent">
        <div class="tile is-child box flex-col justify-content-center">
            <div class="card">
                <div class="card-image">
                    <figure class="image is-square">
                        <img id="profileImg" src="" alt="Placeholder image">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <span id="spanStar" class="icon has-text-warning cursor"></span>
                        </div>
                        <div class="media-content">
                            <p id="profileTitle" class="title is-6"></p>
                        </div>
                    </div>
                    <div id="profileSubtitle" class="content">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%--상단 탭--%>
    <div class="tile is-fullwidth is-vertical is-parent">
        <div class="tile is-child box">
            <div id="headerTabs" class="tabs">
                <ul>
                    <li id="introTab" name="tabs" class="is-active" data-view="grid" data-cont-id="introCont">
                        <a>
                            <span class="icon"><i class="fas fa-id-badge"></i></span>
                            <span>소개</span>
                        </a>
                    </li>
                    <li id="linkTab" name="tabs" data-view="grid" data-cont-id="linkCont">
                        <a>
                            <span class="icon"><i class="fas fa-link"></i></span>
                            <span>참고자료</span>
                        </a>
                    </li>
                    <li id="ideaTab" name="tabs" data-view="barChart" data-cont-id="ideaCont">
                        <a>
                            <span class="icon"><i class="fas fa-lightbulb"></i></span>
                            <span>투자 아이디어</span>
                        </a>
                    </li>
                </ul>
            </div>
            <%--소개 탭--%>
            <div id="introCont">
                <div class="columns">
                    <div class="column is-full">
                        <div id="profileInfo"></div>
                    </div>
                </div>
            </div>
            <%--참고링크 탭--%>
            <div id="linkCont" class="is-hidden">
                <div class="columns">
                    <div class="column is-full">
                        <div id="profileLinkDiv" class="flex-col justify-content-center">
                        </div>
                    </div>
                </div>
            </div>
            <%--아이디어 탭--%>
            <div id="ideaCont" class="is-hidden">
                <div class="columns is-flex-direction-row is-justify-content-flex-end">
                    <button id="btnMod" onclick="main.showIdeaModal()" class="button is-primary is-small mr-4">
                        <span class="icon is-small"><i class="fas fa-pencil-alt"></i></span>
                        <span>아이디어 추가</span>
                    </button>
                </div>
                <div class="columns">
                    <div class="column is-full height250px">
                        <div class="table-container mt-3">
                            <table id="ideaGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
                        </div>
                        <nav id="ideaPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%--분기 슬라이더--%>
<div id="quarterSlider" class="swiper-container mt-3">
    <div id="quarterCont" class="swiper-wrapper height120px"></div>
    <!-- Add Arrows -->
    <div id="quarterNext" class="swiper-button-next"></div>
    <div id="quarterPrev" class="swiper-button-prev"></div>
    <!-- Add Pagination -->
    <div id="quarterPagination" class="swiper-pagination"></div>
</div>

<%--분석탭--%>
<div id="bottomTabs" class="tabs mt-5">
    <ul>
        <li id="gridTab" name="tabs" class="is-active" data-view="grid" data-cont-id="gridCont">
            <a>
                <span class="icon"><i class="fas fa-table"></i></span>
                <span>전체</span>
            </a>
        </li>
        <li id="newTransferTab" name="tabs" data-view="newTransfer" data-cont-id="newTransferGridCont">
            <a>
                <span class="icon has-text-success"><i class="fas fa-plus-circle"></i></span>
                <span>신규편입</span>
            </a>
        </li>
        <li id="soldOutTab" name="tabs" data-view="soldOut" data-cont-id="soldOutGridCont">
            <a>
                <span class="icon has-text-danger"><i class="fas fa-minus-circle"></i></span>
                <span>전량매도</span>
            </a>
        </li>
        <li id="barTab" name="tabs" data-view="barChart" data-cont-id="barCont">
            <a>
                <span class="icon has-text-link"><i class="fas fa-chart-bar"></i></span>
                <span>막대차트</span>
            </a>
        </li>
    </ul>
</div>

<%--그리드 탭--%>
<div id="gridCont">
    <div class="flex-row">
        <div class="flex-row width-100per justify-content-end">
            <%--엑셀 다운로드--%>
            <sec:authorize access="hasAnyRole('ROLE_SUBC', 'ROLE_ADMIN')">
                <div class="flex-col justify-content-end">
                    <span id="gridExcel" class="icon has-text-success cursor" onclick="main.downloadProfileGrid(1)"><i class="fas fa-lg fa-file-download"></i></span>
                </div>
            </sec:authorize>
        </div>
    </div>
    <table id="profileGrid" class="mt-3 table is-narrow is-hoverable is-fullwidth"></table>
</div>

<%--신규편입 탭--%>
<div id="newTransferGridCont" class="is-hidden">
    <div class="flex-row">
        <div class="flex-row width-100per justify-content-end">
            <%--엑셀 다운로드--%>
            <sec:authorize access="hasAnyRole('ROLE_SUBC', 'ROLE_ADMIN')">
                <div class="flex-col justify-content-end">
                    <span id="newTransferExcel" class="icon has-text-success cursor" onclick="main.downloadProfileGrid(2)"><i class="fas fa-lg fa-file-download"></i></span>
                </div>
            </sec:authorize>
        </div>
    </div>
    <table id="newTransferGrid" class="mt-3 table is-narrow is-hoverable is-fullwidth"></table>
</div>

<%--전량매도 탭--%>
<div id="soldOutGridCont" class="is-hidden">
    <div class="flex-row">
        <div class="flex-row width-100per justify-content-end">
            <%--엑셀 다운로드--%>
            <sec:authorize access="hasAnyRole('ROLE_SUBC', 'ROLE_ADMIN')">
                <div class="flex-col justify-content-end">
                    <span id="soldOutExcel" class="icon has-text-success cursor" onclick="main.downloadProfileGrid(3)"><i class="fas fa-lg fa-file-download"></i></span>
                </div>
            </sec:authorize>
        </div>
    </div>
    <table id="soldOutGrid" class="mt-3 table is-narrow is-hoverable is-fullwidth"></table>
</div>

<%--차트 탭--%>
<div id="barCont" class="is-hidden">
    <div class="flex-row">
        <div class="field">
            <div class="control has-icons-left">
                <div class="select is-small">
                    <select id="selBarChartRank">
                        <option value="" selected>전체</option>
                        <option value="10">상위 10</option>
                        <option value="20">상위 20</option>
                        <option value="30">상위 30</option>
                        <option value="40">상위 40</option>
                        <option value="50">상위 50</option>
                        <option value="60">상위 60</option>
                        <option value="70">상위 70</option>
                        <option value="80">상위 80</option>
                        <option value="90">상위 90</option>
                        <option value="100">상위 100</option>
                    </select>
                </div>
                <div class="icon is-small is-left">
                    <i class="fas fa-flag-checkered"></i>
                </div>
            </div>
        </div>
        <div class="field ml-3">
            <div class="control has-icons-left">
                <div class="select is-small">
                    <select id="selBarChartFilter">
                        <option value="marketPrice" selected>시가평가액</option>
                        <option value="viewWeight">비중(%)</option>
                        <option value="quantity">보유수량</option>
                    </select>
                </div>
                <div class="icon is-small is-left">
                    <i class="fas fa-filter"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-row justify-content-start">
        <div id="profileBarChart" class="is-fullwidth" style="width: 1400px;"></div>
    </div>
</div>

<%--아이디어 등록 모달--%>
<div id="newIdeaModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card width1300px">
        <header class="modal-card-head">
            <p class="modal-card-title">아이디어 등록</p>
            <button class="delete" aria-label="close" onclick="main.closeNewIdeaModal()"></button>
        </header>
        <section class="modal-card-body">
            <div class="columns">
                <div class="column is-1 is-vertical-center">
                    <label class="label" for="newIdeaTitle">제목</label>
                </div>
                <div class="column">
                    <div class="control">
                        <input id="newIdeaTitle" class="input is-info" type="text" maxlength="30" placeholder="최대 30자리 입력">
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column is-1 is-vertical-center">
                    <label class="label" for="newIdeaCont">아이디어</label>
                </div>
                <div class="column">
                    <div class="control has-icons-left">
                        <div id="newIdeaCont"></div>
                    </div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnNewIdea" onclick="main.saveIdea()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>등록</span>
            </button>
            <button onclick="main.closeNewIdeaModal()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>

<%--아이디어 수정모달--%>
<div id="modIdeaModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card width1300px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="modCardTitle">투자 아이디어</p>
            <button class="delete" aria-label="close" onclick="main.closeModIdeaModal()"></button>
        </header>
        <section class="modal-card-body">
            <form id="modIdeaForm">
                <div class="columns">
                    <div class="column is-1 is-vertical-center">
                        <label class="label" for="modIdeaTitle">제목</label>
                    </div>
                    <div class="column">
                        <div class="control">
                            <input id="modIdeaTitle" class="input is-info" type="text" maxlength="30" placeholder="최대 30자리 입력" data-bind="true" data-id="ideaTitle">
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-1 is-vertical-center">
                        <label class="label" for="modIdeaCont">아이디어</label>
                    </div>
                    <div class="column">
                        <div class="control has-icons-left">
                            <div id="modIdeaCont"></div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnModIdea" onclick="main.modifyIdea()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>수정</span>
            </button>
            <button onclick="main.closeModIdeaModal()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>

<%--라인차트 모달--%>
<div id="stackChartModal" class="modal">
    <div class="modal-background" onclick="main.closeStackChartModal()"></div>
    <div class="modal-content width1200px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="stackChartModalTitle"></p>
            <button class="delete" aria-label="close" onclick="main.closeStackChartModal()"></button>
        </header>
        <section class="modal-card-body">
            <div class="flex-col justify-content-start">
                <div class="flex-row justify-content-start">
                    <div class="field">
                        <div class="control has-icons-left">
                            <div class="select is-small">
                                <select id="selStackChartFilter">
                                    <option value="0" selected></option>
                                    <option value="1">즐겨찾기한 포트폴리오</option>
                                </select>
                            </div>
                            <div class="icon is-small is-left">
                                <i class="fas fa-filter"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-row justify-content-center">
                    <div id="leftItemCodeChart" class="is-fullwidth" style="width: 1200px; height: 500px;"></div>
                </div>
            </div>
        </section>
    </div>
</div>

<%--증감률 열의 차트 모달--%>
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
                                    <option value="0" selected>보유수량</option>
                                </select>
                            </div>
                            <div class="icon is-small is-left">
                                <i class="fas fa-filter"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-row justify-content-center">
                    <div id="rightItemCodeChart" class="is-fullwidth" style="width: 1200px; height: 500px;"></div>
                </div>
            </div>
        </section>
    </div>
</div>