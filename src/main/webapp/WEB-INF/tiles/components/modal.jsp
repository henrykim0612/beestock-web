<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%--에러 입력관련 모달--%>
<div id="errModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="notification is-danger">
            <button class="delete" onclick="cmmUtils.closeModal('errModal')"></button>
            죄송합니다. 서버와 통신도중 문제가 발생했습니다. <br/>페이지를 다시 호출해주세요.
        </div>
    </div>
</div>

<%--텍스트 입력관련 모달--%>
<div id="inputModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-danger">
            <div class="message-header">
                <p id="ipModalTitle"></p>
                <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('inputModal')"></button>
            </div>
            <div class="message-body">
                <div id="ipModalContent" class="is-left mb-5"></div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('inputModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>

<%--Confirm modal--%>
<div id="confirmModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article id="confirmArticle" class="message is-warning">
            <div class="message-header">
                <p>경고</p>
                <button class="delete" aria-label="delete" onclick="cmmConfirm.closeModal()"></button>
            </div>
            <div class="message-body">
                <div id="confirmTextDiv" class="is-left mb-5">
                    코드를 삭제합니다. 삭제 후 복구 할 수 없습니다.
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmConfirm.confirm()">확인</button>
                            <button class="button is-dark is-small" onclick="cmmConfirm.closeModal()">취소</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>