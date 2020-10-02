<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>
<script src="${pageContext.request.contextPath}/js/bbs/notice/notice_details.js"></script>

<input type="hidden" id="noticeId" value="${noticeId}"/>
<form id="noticeDetailForm">
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelTitle" class="label" for="noticeTitle">제목</label>
        </div>
        <div class="control width-85-p">
            <input id="noticeTitle" class="input is-info" type="text" data-bind="true" data-id="noticeTitle" maxlength="100" placeholder="최대 100자리 입력">
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelCont" class="label" for="noticeCont">내용</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <div id="noticeCont"></div>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelAlarmStDate" class="label" for="alarmStDate">공지 시작일</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <div class="control input-single-date">
                <input id="alarmStDate" type="date" data-bind="true" data-id="alarmStDate" data-type="date">
            </div>
        </div>
    </div>
    <div class="level-left mb-4">
        <div class="mr-3 width-7-p">
            <label id="labelAlarmEdDate" class="label" for="alarmEdDate">공지 종료일</label>
        </div>
        <div class="control has-icons-left width-85-p">
            <div class="control input-single-date">
                <input id="alarmEdDate" type="date" data-bind="true" data-id="alarmEdDate" data-type="date">
            </div>
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
            <label id="labelSecret" class="label">공지글 고정</label>
        </div>
        <div class="field">
            <input type="radio" class="is-checkradio is-primary is-circle" id="ckPinnedNotice1" name="ckPinnedNotice" data-bind="true" data-id="ckPinnedNotice" value="0">
            <label for="ckPinnedNotice1">미고정</label>
            <input type="radio" class="is-checkradio is-primary is-circle" id="ckPinnedNotice2" name="ckPinnedNotice" data-bind="true" data-id="ckPinnedNotice" value="1">
            <label for="ckPinnedNotice2">고정</label>
        </div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div id="uptDiv">
            <button id="btnMod" onclick="main.modifyNotice()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
                <span>수정</span>
            </button>
        </div>
        <div id="removeDiv" class="ml-3">
            <button id="btnRm" onclick="main.removeNotice()" class="button is-danger">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
                <span>삭제</span>
            </button>
        </div>
    </sec:authorize>
    <div class="ml-3">
        <button onclick="main.goToNotice()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
