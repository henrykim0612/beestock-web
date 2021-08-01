<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>

<%--페이지 로더--%>
<div id="pageLoader" class="showbox is-hidden">
    <div class="pageLoader">
        <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
        </svg>
    </div>
</div>


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

<div id="customErrModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="notification is-danger">
            <button class="delete" onclick="cmmUtils.closeModal('customErrModal')"></button>
            <p id="customErrMsg"></p>
        </div>
    </div>
</div>

<%--저장 모달--%>
<div id="saveModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <div class="icon-text">
                    <span class="icon has-text-success"><i class="fas fa-check-square"></i></span>
                    <span>Success</span>
                </div>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('saveModal')"></button>
            </div>
            <div class="message-body">
                <div class="is-left mb-5">
                    저장 되었습니다.
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('saveModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<%--텍스트 입력관련 모달--%>
<div id="inputModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <p id="ipModalTitle"></p>
                <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('inputModal')"></button>
            </div>
            <div class="message-body">
                <div id="ipModalContent" class="is-left mb-5"></div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('inputModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
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
                <div class="icon-text">
                    <span class="icon has-text-black"><i class="fas fa-exclamation-triangle"></i></span>
                    <span>Warning</span>
                </div>
                <button class="delete" aria-label="delete" onclick="cmmConfirm.closeModal()"></button>
            </div>
            <div class="message-body">
                <div id="confirmTextDiv" class="is-left mb-5">
                    코드를 삭제합니다. 삭제 후 복구 할 수 없습니다.
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmConfirm.confirm()">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                        <button class="button is-dark is-small" onclick="cmmConfirm.closeModal()">
                            <span class="icon has-text-danger"><i class="fas fa-times"></i></span>
                            <span>취소</span>
                        </button>
                    </div>
                </div>
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
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('warningModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<div id="standardModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-info">
            <div class="message-header">
                <div class="icon-text">
                    <span class="icon"><i class="fas fa-ban"></i></span>
                    <span>Standard 등급 이상 전용화면</span>
                </div>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('standardModal')"></button>
            </div>
            <div class="message-body">
                <div class="is-left mb-5">
                    <p><strong>Standard</strong> 등급 이상의 이용자만 열람 가능합니다.</p>
                    <p>등급을 올려 더욱 다양한 인사이트를 얻어 보세요.</p>
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">
                            <span class="icon has-text-warning"><i class="fas fa-level-up-alt"></i></span>
                            <span>등급 업그레이드</span>
                        </button>
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('standardModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<div id="premiumModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-warning">
            <div class="message-header">
                <div class="icon-text">
                    <span class="icon"><i class="fas fa-ban"></i></span>
                    <span>Premium 등급 이상 전용화면</span>
                </div>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('premiumModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="is-left mb-5">
                    <p><strong>Premium</strong> 등급 이상의 이용자만 열람 가능합니다.</p>
                    <p>등급을 올려 더욱 다양한 인사이트를 얻어 보세요.</p>
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.openNewTab('/home/guide')">
                            <span class="icon has-text-primary"><i class="fas fa-book"></i></span>
                            <span>가이드 보기</span>
                        </button>
                        <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">
                            <span class="icon has-text-warning"><i class="fas fa-level-up-alt"></i></span>
                            <span>등급 업그레이드</span>
                        </button>
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('premiumModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<div id="premiumPlusModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message is-danger">
            <div class="message-header">
                <div class="icon-text">
                    <span class="icon"><i class="fas fa-ban"></i></span>
                    <span>Premium Plus 등급 전용화면</span>
                </div>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('premiumPlusModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="is-left mb-5">
                    <p><strong>Premium Plus</strong> 등급 이상의 이용자만 열람 가능합니다.</p>
                    <p>등급을 올려 더욱 다양한 인사이트를 얻어 보세요.</p>
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">
                            <span class="icon has-text-warning"><i class="fas fa-level-up-alt"></i></span>
                            <span>등급 업그레이드</span>
                        </button>
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('premiumPlusModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<div id="guideModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article id="guideArticle" class="message">
            <div class="message-header">
                <p id="guideHeader"></p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('guideModal')"></button>
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
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button name="btnModalLogin" class="button is-dark is-small" onclick="cmmUtils.goToLoginHome()">
                            <span class="icon has-text-warning"><i class="fas fa-sign-in-alt"></i></span>
                            <span>로그인 화면으로</span>
                        </button>
                        <sec:authorize access="isAuthenticated()">
                            <button class="button is-dark is-small" onclick="cmmUtils.goToPage('/home/pricing-table')">
                                <span class="icon has-text-warning"><i class="fas fa-book-reader"></i></span>
                                <span>구독 화면으로</span>
                            </button>
                        </sec:authorize>
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('guideModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<%--휴먼계정 해제 모달--%>
<div id="unlockUserModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <div class="icon-text">
                    <span class="icon has-text-success"><i class="fas fa-unlock-alt"></i></span>
                    <span>휴먼계정 해제완료</span>
                </div>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('unlockUserModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="is-left mb-5">
                    <p><strong>휴먼계정</strong>에서 해제되었습니다.</p>
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('unlockUserModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<%--피드백 모달--%>
<div id="feedbackModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('feedbackModal')"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <p>피드백 보내기</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('feedbackModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="flex-row justify-content-start">
                    <div class="select is-small">
                        <select id="feedbackSelBox">
                            <option value="FB001">데이터 오류신고</option>
                            <option value="FB002">신규 포트폴리오 요청</option>
                            <option value="FB003">기타</option>
                        </select>
                    </div>
                </div>
                <div class="flex-row justify-content-start mt-3">
                    <textarea id="feedbackContent" class="textarea" placeholder="내용 입력" maxlength="4000"></textarea>
                </div>
                <div class="flex-row justify-content-end mt-3">
                    <div class="buttons">
                        <button id="btnFeedback" class="button is-dark is-small" onclick="topMain.sendFeedback()">
                            <span class="icon has-text-link"><i class="fas fa-paper-plane"></i></span>
                            <span>전송</span>
                        </button>
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('feedbackModal')">
                            <span class="icon has-text-danger"><i class="fas fa-times"></i></span>
                            <span>닫기</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>

<div id="feedbackSuccessModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('feedbackSuccessModal')"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <p>피드백 전송완료</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('feedbackSuccessModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="flex-row justify-content-start mt-3">
                    <p>소중한 의견 감사합니다. 더 좋은 사이트가 되도록 노력하겠습니다.</p>
                </div>
                <div class="flex-row justify-content-center mt-3">
                    <button class="button is-dark is-small" onclick="cmmUtils.closeModal('feedbackSuccessModal')">
                        <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                        <span>확인</span>
                    </button>
                </div>
            </div>
        </article>
    </div>
</div>

<div id="autopaySuccessModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('autopaySuccessModal')"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <p>정기결제 등륵완료</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('autopaySuccessModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="flex-row justify-content-start mt-3">
                    <p>결제 정기결제 등록이 완료되었습니다.</p>
                </div>
                <div class="flex-row justify-content-center mt-3">
                    <button class="button is-dark is-small" onclick="cmmUtils.closeModal('autopaySuccessModal')">
                        <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                        <span>확인</span>
                    </button>
                </div>
            </div>
        </article>
    </div>
</div>


<div id="upgradeModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">등급 업그레이드 알림</p>
            <button class="delete" aria-label="close" onclick="topMain.closeUpgradeModal()"></button>
        </header>
        <section class="modal-card-body">
            <h2 id="upgradeCont">스탠다드 등급으로 업그레이드 되었습니다.</h2>
            <p>서비스 이용에 감사드리며, 더 좋은 서비스로 보답드리겠습니다.</p>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <button class="button is-dark is-small" onclick="topMain.closeUpgradeModal()">
                    <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                    <strong>확인</strong>
                </button>
            </div>
        </footer>
    </div>
</div>

