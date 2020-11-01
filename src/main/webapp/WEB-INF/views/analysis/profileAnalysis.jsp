<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/analysis/profile_analysis.js"></script>
<input type="hidden" id="profileId" value="${profileId}"/>

<div class="tile is-ancestor">
    <div class="tile is-3 is-vertical is-parent">
        <div class="tile is-child">
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
                            <p id="profileTitle" class="title is-4"></p>
                        </div>
                    </div>
                    <div id="profileSubtitle" class="content">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="tile is-vertical is-parent">
        <div class="tile is-child box">
            <div class="columns">
                <div class="column is-full">
                    <p class="subtitle"><strong>투자 아이디어</strong></p>
                </div>
            </div>
            <sec:authorize access="hasRole('ROLE_USER')">
                <div class="columns mt-6">
                    <div class="column is-full">
                        <article class="message is-warning">
                            <div class="message-body">
                                <strong>구독자</strong>만 이용 가능합니다.<br/>
                                투자 아이디어, 느낀점 등을 기록하고 지속적으로 점검 해보세요.<br/>
                                나중에 큰 자산이 될 것입니다.
                            </div>
                        </article>
                    </div>
                </div>
            </sec:authorize>
            <sec:authorize access="hasAnyRole('ROLE_SUBC', 'ROLE_ADMIN')">
                <div class="columns is-flex-direction-row is-justify-content-flex-end">
                    <button id="btnMod" onclick="main.showIdeaModal()" class="button is-primary is-small mr-4">
                        <span class="icon is-small"><i class="fas fa-pencil-alt"></i></span>
                        <span>아이디어 추가</span>
                    </button>
                </div>
                <div class="columns mt-3">
                    <div class="column is-full height215px is-scrollable">
                        <table id="ideaGrid" class="table is-striped is-narrow is-hoverable is-fullwidth"></table>
                    </div>
                </div>
            </sec:authorize>
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
<div id="tabDiv" class="tabs mt-5">
    <ul>
        <li id="gridTab" name="tabs" class="is-active" data-view="grid" data-cont-id="gridCont">
            <a>
                <span class="icon is-small"><i class="fas fa-table"></i></span>
                <span>그리드</span>
            </a>
        </li>
        <li id="barTab" name="tabs" data-view="barChart" data-cont-id="barCont">
            <a>
                <span class="icon is-small"><i class="far fa-chart-bar"></i></span>
                <span>막대차트</span>
            </a>
        </li>
    </ul>
</div>

<div id="gridCont">
    <div class="control has-icons-left mr-3">
        <div class="select">
            <select id="selQuarter">
                <option value="itemCode" selected>1분기전</option>
                <option value="itemName">2분기전</option>
                <option value="itemName">3분기전</option>
                <option value="itemName">4분기전</option>
            </select>
        </div>
        <div class="icon is-small is-left">
            <i class="fas fa-history"></i>
        </div>
    </div>
    <div class="table-container mt-3">
        <table id="dataGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
    </div>
    <nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
</div>
<div id="barCont" class="is-hidden"></div>


<%--아이디어 등록 모달--%>
<div id="newIdeaModal" class="modal is-mobile">
    <div class="modal-background"></div>
    <div class="modal-card width1200px">
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
                    <label class="label" for="newIdeaCont">내용</label>
                </div>
                <div class="column">
                    <div class="control has-icons-left">
                        <div id="newIdeaCont"></div>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column is-1 is-vertical-center">
                    <div class="field" id="fileField">
                        <div class="file is-white">
                            <label class="file-label">
                                <input class="file-input" type="file" multiple id="newIdeaFile">
                                <span class="file-cta">
                                    <span class="file-icon"><i class="fas fa-file-signature"></i></span>
                                    <span class="file-label">첨부</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="columns">
                        <div class="column" id="newIdeaFileDiv">
                        </div>
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
<div id="modIdeaModal" class="modal is-mobile">
    <div class="modal-background"></div>
    <div class="modal-card width1200px">
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
                        <label class="label" for="modIdeaCont">내용</label>
                    </div>
                    <div class="column">
                        <div class="control has-icons-left">
                            <div id="modIdeaCont"></div>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-1 is-vertical-center">
                        <div class="field" id="modFileField">
                            <div class="file is-white">
                                <label class="file-label">
                                    <input class="file-input" type="file" multiple id="modIdeaFile">
                                    <span class="file-cta">
                                    <span class="file-icon"><i class="fas fa-file-signature"></i></span>
                                    <span class="file-label">첨부</span>
                                </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="columns">
                            <div class="column" id="modIdeaFileDiv">
                            </div>
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
