<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%--에러 입력관련 모달--%>
<div id="errModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">에러</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('errModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>서버와 통신도중 문제가 발생했습니다. 다시 진행해주세요.</h2>
        </section>
    </div>
</div>

<%--텍스트 입력관련 모달--%>
<div id="inputModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p id="ipModalTitle" class="modal-card-title"></p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('inputModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2 id="ipModalH2"></h2>
        </section>
    </div>
</div>