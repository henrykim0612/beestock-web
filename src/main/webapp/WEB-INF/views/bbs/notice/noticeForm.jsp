<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/bbs/notice/notice_form.js" type="text/javascript"></script>

<form id="noticeForm">
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="noticeTitle">제목</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="noticeTitle" class="input is-info" type="text" maxlength="100" placeholder="최대 100자리 입력">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelCont" class="label" for="noticeCont">내용</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div id="noticeCont"></div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelAlarmStDate" class="label" for="alarmStDate">공지 시작일</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div class="control input-single-date">
                    <input id="alarmStDate" type="date">
                </div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelAlarmEdDate" class="label" for="alarmEdDate">공지 종료일</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div class="control input-single-date">
                    <input id="alarmEdDate" type="date">
                </div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelSecret" class="label">공지글 고정</label>
        </div>
        <div class="column">
            <div class="field">
                <input checked type="radio" class="is-checkradio is-primary is-circle" id="ckPinnedNotice1" name="ckPinnedNotice" value="0">
                <label for="ckPinnedNotice1">미고정</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="ckPinnedNotice2" name="ckPinnedNotice" value="1">
                <label for="ckPinnedNotice2">고정</label>
            </div>
        </div>
    </div>
</form>

<div class="flex-row justify-content-center mt-6">
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div>
            <button id="btnIns" onclick="main.insertNotice()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>등록</span>
            </button>
        </div>
    </sec:authorize>
    <div class="ml-3">
        <button onclick="main.goToNotice()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
