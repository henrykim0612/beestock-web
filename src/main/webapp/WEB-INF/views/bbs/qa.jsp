<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/bbs/qa.js"></script>

<div class="level-left mr-3">
    <div class="control has-icons-left mr-3">
        <div class="select is-rounded is-small">
            <select id="selSearch">
                <option value="qaTitle" selected>제목</option>
                <option value="qaCont">내용</option>
            </select>
        </div>
        <div class="icon is-small is-left">
            <i class="fas fa-search"></i>
        </div>
    </div>
    <div>
        <p class="control has-icons-left">
            <input id="inputSearch" class="input input-search is-small" type="text" placeholder="이름 검색">
            <span class="icon is-left">
                <i class="fas fa-search" aria-hidden="true"></i>
            </span>
        </p>
    </div>
    <sec:authorize access="isAuthenticated()">
        <div class="control ml-4">
            <div class="buttons">
                <button class="button is-primary is-small" onclick="main.goToQaForm()">Q&A 등록</button>
            </div>
        </div>
    </sec:authorize>
</div>
<%--테이블 그리드--%>
<div class="table-container mt-3">
    <table id="dataGrid" class="table is-striped is-hoverable is-fullwidth"></table>
</div>
<nav id="dataPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>

<%--게시글 수정 모달--%>
<div id="modQaModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card" style="width: 1000px;">
        <header class="modal-card-head">
            <p class="modal-card-title has-icons-left">
                <span class="icon has-text-info"><i class="fab fa-quora"></i></span>
                게시글 상세보기
            </p>
            <button class="delete" aria-label="close" onclick="main.closeModQaModal()"></button>
        </header>
        <section class="modal-card-body">
            <form id="modQaForm">
                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModBbsTitle" class="label" for="modBbsTitle">제목</label>
                    </div>
                    <div class="control width-85-p">
                        <input disabled id="modBbsTitle" class="input" type="text" data-bind="true" data-id="bbsTitle" maxlength="100" placeholder="최대 100자리 입력">
                    </div>
                </div>
                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModDescription" class="label" for="bbsCont">내용</label>
                    </div>
                    <div class="control has-icons-left width-85-p">
                        <textarea disabled id="bbsCont" class="textarea" data-bind="true" data-id="bbsCont" placeholder="1000자 내외로 작성" maxlength="1000"></textarea>
                    </div>
                </div>
                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModUptLoginId" class="label" for="modUptLoginId">수정자</label>
                    </div>
                    <div class="control has-icons-left width-85-p">
                        <input disabled id="modUptLoginId" class="input" type="text" data-bind="true" data-id="uptLoginId">
                        <span class="icon is-small is-left">
                            <i class="fas fa-user-edit"></i>
                        </span>
                    </div>
                </div>
                <div class="level-left mb-4">
                    <div class="mr-3 width-15-p">
                        <label id="labelModUptDate" class="label" for="modUptDate">수정일</label>
                    </div>
                    <div class="control has-icons-left width-85-p">
                        <input disabled id="modUptDate" class="input" type="text" data-bind="true" data-id="uptDate">
                        <span class="icon is-small is-left">
                            <i class="fas fa-clock"></i>
                        </span>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnModCode" onclick="main.modifyCode()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
                <span>수정</span>
            </button>
            <button id="btnRemoveCode" onclick="main.removeCode()" class="button is-danger">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
                <span>삭제</span>
            </button>
            <button onclick="main.closeModQaModal()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>

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
