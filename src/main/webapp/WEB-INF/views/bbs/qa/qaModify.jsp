<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/bbs/qa/qa_modify.js" type="text/javascript"></script>

<input type="hidden" id="qaId" value="${qaId}"/>

<form id="qaDetailForm">
    <input type="hidden" id="qaNo" data-bind="true" data-id="qaNo"/>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="qaTitle">제목</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="qaTitle" class="input is-info" type="text" data-bind="true" data-id="qaTitle" maxlength="100" placeholder="최대 100자리 입력">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelCont" class="label" for="qaCont">내용</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div id="qaCont"></div>
            </div>
        </div>
    </div>
    <%--관리자만 가능--%>
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div class="columns">
            <div class="column is-1 is-vertical-center">
                <label id="labelAnswer" class="label" for="qaAnswer">답변</label>
            </div>
            <div class="column">
                <div class="control has-icons-left">
                    <div id="qaAnswer"></div>
                </div>
            </div>
        </div>
    </sec:authorize>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelModUptLoginId" class="label" for="modUptLoginId">등록자</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <input disabled id="modUptLoginId" class="input" type="text" data-bind="true" data-id="regLoginId">
                <span class="icon is-small is-left"><i class="fas fa-user-edit"></i></span>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelModUptDate" class="label" for="modUptDate">최근 수정일</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <input disabled id="modUptDate" class="input" type="text" data-bind="true" data-id="uptDate">
                <span class="icon is-small is-left"><i class="fas fa-clock"></i></span>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelSecret" class="label">비밀글</label>
        </div>
        <div class="column">
            <div class="field">
                <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret1" name="ckSecret" data-bind="true" data-id="ckSecret" value="0">
                <label for="ckSecret1">공개</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret2" name="ckSecret" data-bind="true" data-id="ckSecret" value="1">
                <label for="ckSecret2">비공개</label>
            </div>
        </div>
    </div>
</form>

<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnMod" onclick="main.modifyQa()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
            <span>수정</span>
        </button>
    </div>
    <div id="removeDiv" class="ml-3">
        <button id="btnRm" onclick="main.removeQa()" class="button is-danger is-small">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
            <span>삭제</span>
        </button>
    </div>
    <div class="ml-3">
        <button onclick="main.goToQa()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
