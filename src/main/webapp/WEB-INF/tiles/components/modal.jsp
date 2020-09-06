<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%--에러 입력관련 모달--%>
<div id="errModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="notification is-danger">
            <button class="delete" onclick="cmmUtils.closeModal('errModal')"></button>
            죄송합니다. 서버와 통신도중 문제가 발생했습니다. <br/>페이지를 다시 호출합니다.
        </div>
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