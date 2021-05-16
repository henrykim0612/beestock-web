<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/bbs/qa/qa_details.js" type="text/javascript"></script>

<input type="hidden" id="qaId" value="${qaId}"/>

<ul class="steps is-narrow is-medium is-centered has-content-centered">
    <li class="steps-segment">
         <span class="steps-marker">
          <span class="icon">
            <i class="fas fa-question"></i>
          </span>
        </span>
        <div class="steps-content">
            <p class="heading">등록완료</p>
        </div>
    </li>
    <li id="step2" class="steps-segment is-active has-gaps">
        <span class="steps-marker">
          <span class="icon">
            <i class="far fa-comment-dots"></i>
          </span>
        </span>
        <div class="steps-content">
            <p class="heading">미답변</p>
        </div>
    </li>
    <li id="step3" class="steps-segment">
        <span id="step3Span" class="steps-marker is-hollow">
          <span class="icon">
            <i class="fa fa-check"></i>
          </span>
        </span>
        <div class="steps-content">
            <p class="heading">답변완료</p>
        </div>
    </li>
</ul>

<form id="qaDetailForm">
    <h1 class="title is-4">질문내용</h1>
    <div class="box mb-6">
        <h2 id="qaTitle" class="subtitle" data-bind="true" data-id="qaTitle"></h2>
        <div id="qaCont" data-bind="true" data-id="qaCont"></div>
    </div>
    <h1 class="title is-4">관리자의 답변</h1>
    <div class="box">
        <div id="qaAnswer" data-bind="true" data-id="qaAnswer"></div>
    </div>
</form>

<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnMod" onclick="main.goToModify()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
            <span>수정</span>
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