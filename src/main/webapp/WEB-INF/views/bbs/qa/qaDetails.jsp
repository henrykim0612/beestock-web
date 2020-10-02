<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/bbs/qa/qa_details.js"></script>

<input type="hidden" id="qaId" value="${qaId}"/>
<form id="qaDetailForm">
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelTitle" class="label" for="qaTitle">제목</label>
        </div>
        <div class="control width-85-p">
            <input id="qaTitle" class="input is-info" type="text" data-bind="true" data-id="qaTitle" maxlength="100" placeholder="최대 100자리 입력">
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelCont" class="label" for="qaCont">내용</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <div id="qaCont"></div>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelAnswer" class="label" for="qaAnswer">답변</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <div id="qaAnswer"></div>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelModUptLoginId" class="label" for="modUptLoginId">등록자</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <input disabled id="modUptLoginId" class="input" type="text" data-bind="true" data-id="regLoginId">
            <span class="icon is-small is-left"><i class="fas fa-user-edit"></i></span>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelModUptDate" class="label" for="modUptDate">최근 수정일</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <input disabled id="modUptDate" class="input" type="text" data-bind="true" data-id="uptDate">
            <span class="icon is-small is-left"><i class="fas fa-clock"></i></span>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelSecret" class="label">비밀글</label>
        </div>
        <div class="field">
            <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret1" name="ckSecret" data-bind="true" data-id="ckSecret" value="0">
            <label for="ckSecret1">공개</label>
            <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret2" name="ckSecret" data-bind="true" data-id="ckSecret" value="1">
            <label for="ckSecret2">비공개</label>
        </div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnMod" onclick="main.modifyQa()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
            <span>수정</span>
        </button>
    </div>
    <div id="removeDiv" class="ml-3">
        <button id="btnRm" onclick="main.removeQa()" class="button is-danger">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
            <span>삭제</span>
        </button>
    </div>
    <div class="ml-3">
        <button onclick="main.goToQa()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
