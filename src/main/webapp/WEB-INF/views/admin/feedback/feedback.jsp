<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/feedback/feedback.js" type="text/javascript"></script>

<div class="flex-row justify-content-start">
    <div class="field has-addons">
        <p class="control has-icons-left">
            <span class="select">
                <select id="schType">
                    <option value="regLoginId">아이디</option>
                    <option value="userNm">이름</option>
                </select>
            </span>
            <span class="icon is-left"><i class="fas fa-filter"></i></span>
        </p>
        <p class="control">
            <input id="inputSearch" class="input input-search" type="text" maxlength="50" placeHolder="아이디 또는 이름 입력">
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
        <table id="feedbackGrid" class="table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
    </div>
    <nav id="feedbackGridPager" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
</div>

<div id="contDetailModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('contDetailModal')"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <p>피드백 내용</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('contDetailModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="flex-row justify-content-start mt-3">
                    <textarea disabled id="contDetail" class="textarea"></textarea>
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('contDetailModal')">
                            <span class="icon has-text-danger"><i class="fas fa-times"></i></span>
                            <span>닫기</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>
