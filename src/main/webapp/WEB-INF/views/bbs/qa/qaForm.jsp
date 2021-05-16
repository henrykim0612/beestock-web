<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/bbs/qa/qa_form.js" type="text/javascript"></script>

<form id="qaForm">
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="qaTitle">제목</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="qaTitle" class="input is-info" type="text" maxlength="100" placeholder="최대 100자리 입력">
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
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelSecret" class="label">비밀글</label>
        </div>
        <div class="column">
            <div class="field">
                <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret1" name="ckSecret" value="0" checked="checked">
                <label for="ckSecret1">공개</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="ckSecret2" name="ckSecret" value="1">
                <label for="ckSecret2">비공개</label>
            </div>
        </div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnIns" onclick="main.insertNewQa()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
            <span>등록</span>
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
