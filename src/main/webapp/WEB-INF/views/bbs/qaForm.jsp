<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/bbs/qa_form.js"></script>

<form id="qaForm">
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelTitle" class="label" for="qaTitle">제목</label>
        </div>
        <div class="control width-85-p">
            <input id="qaTitle" class="input is-info" type="text" maxlength="100" placeholder="최대 100자리 입력">
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelCont" class="label" for="qaCont">내용</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <textarea id="qaCont" class="textarea is-info" placeholder="1000자 내외로 작성" maxlength="1000"></textarea>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelSecret" class="label">비밀글</label>
        </div>
        <div class="field">
            <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret1" name="ckSecret" value="0" checked="checked">
            <label for="ckSecret1">공개</label>
            <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret2" name="ckSecret" value="1">
            <label for="ckSecret2">비공개</label>
        </div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnIns" onclick="main.insertNewQa()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
            <span>등록</span>
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
