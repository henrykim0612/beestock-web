<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/bbs/qa/qa.js"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="field has-addons">
            <p class="control has-icons-left">
                <span class="select">
                   <select id="selSearch">
                        <option value="qaTitle" selected>제목</option>
                        <option value="qaCont">내용</option>
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
    <sec:authorize access="isAuthenticated()">
        <div class="level-right">
            <div class="control ml-4">
                <div class="buttons">
                    <button class="button is-primary" onclick="main.goToQaForm()">
                        <span class="icon is-small"><i class="fas fa-plus-circle"></i></span>
                        <span>Q&A 등록</span>
                    </button>
                </div>
            </div>
        </div>
    </sec:authorize>
</div>

<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>

<%--비밀글 모달--%>
<div id="secretQaModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-primary">
            <div class="message-header">
                <p>비밀글</p>
                <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('secretQaModal')"></button>
            </div>
            <div class="message-body">
                <div class="is-left mb-5">
                    해당글은 등록자만 확인 가능합니다.
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('secretQaModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>

<%--비밀번호 확인 모달--%>
<div id="confirmPwdModal" class="modal is-small">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">패스워드 확인</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('confirmPwdModal')"></button>
        </header>
        <section class="modal-card-body">
            <nav class="level">
                <div class="level-left">
                    <div class="is-vcentered">
                        <label class="label mr-3">Password</label>
                    </div>
                    <div class="control has-icons-left">
                        <input id="ipPwd" class="input" type="password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </div>
                </div>
            </nav>
            <nav class="level">
                <div class="level-left">
                    <p id="helpPwd" class="help is-danger is-hidden">패스워드가 일치하지 않습니다.</p>
                </div>
            </nav>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" onclick="main.checkPwd()"><strong>확인</strong></a>
            </div>
        </footer>
    </div>
</div>
