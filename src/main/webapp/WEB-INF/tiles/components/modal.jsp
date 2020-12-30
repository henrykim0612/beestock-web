<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%--페이지 로더--%>
<div id="pageLoader" class="pageloader is-warning is-light"><span class="title">잠시만 기다려 주세요..</span></div>

<%--에러 입력관련 모달--%>
<div id="errModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="notification is-danger">
            <button class="delete" onclick="cmmUtils.closeModal('errModal')"></button>
            페이지에 에러가 발생했습니다. <br/>이용에 불편을 드려 죄송합니다.
        </div>
    </div>
</div>

<%--저장 모달--%>
<div id="saveModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-success">
            <div class="message-header">
                <p>완료</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('saveModal')"></button>
            </div>
            <div class="message-body">
                <div class="is-left mb-5">
                    저장 되었습니다.
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('saveModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>

<%--텍스트 입력관련 모달--%>
<div id="inputModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-warning">
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
                <p><span class="icon has-text-dark"><i class="fas fa-exclamation-triangle"></i></span>알림</p>
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

<div id="warningModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-warning">
            <div class="message-header">
                <p id="warningModalTitle"></p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('warningModal')"></button>
            </div>
            <div class="message-body">
                <div id="warningModalCont" class="is-left mb-5">
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('warningModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>

<div id="standardModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-link">
            <div class="message-header">
                <p>열람 제한 안내</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('standardModal')"></button>
            </div>
            <div class="message-body">
                <div class="is-left mb-5">
                    <p><strong>Standard</strong> 등급 이상의 구독자만 열람 가능합니다.</p>
                    <p>구독 등급을 올려 더욱 다양한 인사이트를 얻어 보세요.</p>
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">구독 화면으로</button>
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('standardModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>

<div id="premiumModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-danger">
            <div class="message-header">
                <p>화면 제한 안내</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('premiumModal')"></button>
            </div>
            <div class="message-body">
                <div class="is-left mb-5">
                    <p>해당 화면은<strong>Premium</strong> 등급 이상의 구독자만 이용이 가능합니다.</p>
                    <p>구독 등급을 올려 더욱 다양한 인사이트를 얻어 보세요.</p>
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">구독 화면으로</button>
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('premiumModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>

<div id="guideModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-link">
            <div class="message-header">
                <p>기능 제한 안내</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('standardModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="mb-3">
                    <p>가이드 내용 어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구어쩌구 저쩌구</p>
                </div>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <figure class="image">
                            <iframe class="has-ratio" width="400" height="300" src="https://www.youtube.com/embed/YE7VzlLtp-4" frameborder="0" allowfullscreen></iframe>
                        </figure>
                    </div>
                </nav>
                <nav class="level">
                    <div class="level-item has-text-centered">
                        <div class="buttons">
                            <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">구독 화면으로</button>
                            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('standardModal')">확인</button>
                        </div>
                    </div>
                </nav>
            </div>
        </article>
    </div>
</div>
