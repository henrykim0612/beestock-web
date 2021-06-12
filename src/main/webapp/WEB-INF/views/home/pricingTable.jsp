<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/home/pricing_table.js" type="text/javascript"></script>

<div class="notification is-warning is-light">
    <p><span class="has-text-danger">﹡</span> 등급별로 제공하는 서비스 항목을 확인하시고, 본인에게 맞는 등급으로 <strong>업그레이드</strong> 해보세요.</p>
    <p><span class="has-text-danger">﹡</span> 현재 <strong>유료 회원</strong>이신 경우, <span class="has-text-link cursor" onclick="topMain.goToMyPage()">마이 페이지</span>(사이트 오른쪽 상단 사람 아이콘 클릭)에서 <strong>정기결제</strong>를 등록하여 편리하게 이용해보세요.</p>
</div>

<article class="message is-dark">
    <div class="message-body">
        <sec:authorize access="hasRole('ROLE_BASIC')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-primary">Basic</strong> 등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_STANDARD')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-info">Standard</strong> 등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_PREMIUM')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-warning">Premium</strong> 등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-danger">Premium Plus</strong> 등급을 이용하고 계십니다.</p>
        </sec:authorize>
    </div>
</article>

<div id="tabs" class="tabs is-boxed">
    <ul>
        <li class="is-active" data-cont-id="month1" data-month="1">
            <a>
                <span class="icon is-small"><i class="fas fa-calendar-day"></i></span>
                <span>1개월</span>
            </a>
        </li>
        <li data-cont-id="month3" data-month="3">
            <a>
                <span class="icon is-small"><i class="fas fa-calendar-week"></i></span>
                <span>3개월</span>
            </a>
        </li>
    </ul>
</div>


<div id="month1" class="pricing-table is-comparative">
    <div class="pricing-plan is-features">
        <div class="plan-header">Features</div>
        <div class="plan-price"><span class="plan-price-amount">&nbsp;</span></div>
        <div class="plan-items">
            <div class="plan-item">광고제거</div>
            <div class="plan-item">해외 포트폴리오</div>
            <div class="plan-item">해외 포트폴리오 종목별 시각화자료</div>
            <div class="plan-item">국내 포트폴리오</div>
            <div class="plan-item">국내 포트폴리오 종목별 시각화자료</div>
            <div class="plan-item">포트폴리오별 종목 검색</div>
        </div>
        <div class="plan-footer">
        </div>
    </div>

    <div class="pricing-plan">
        <div class="plan-header is-primary">Basic 등급</div>
        <div class="plan-price"><span class="plan-price-amount has-text-primary">무료</span></div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="has-text-danger">최근 8분기 자료만 공개</span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
        </div>
    </div>

    <div class="pricing-plan is-info">
        <div class="plan-header">Standard 등급</div>
        <div class="plan-price"><span id="standardPrice" class="plan-price-amount">9,500원</span>/월 (부가세 포함)</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
            <sec:authorize access="hasRole('ROLE_BASIC')">
                <button class="button is-fullwidth" onclick="main.upgrade('ROLE_STANDARD')">업그레이드하기</button>
            </sec:authorize>
            <sec:authorize access="hasAnyRole('ROLE_STANDARD', 'ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <button disabled class="button is-fullwidth">업그레이드하기</button>
            </sec:authorize>
        </div>
    </div>

    <div class="pricing-plan is-warning">
        <div class="plan-header">Premium 등급</div>
        <div class="plan-price"><span id="premiumPrice" class="plan-price-amount">14,500원</span>/월 (부가세 포함)</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
            <sec:authorize access="hasAnyRole('ROLE_BASIC', 'ROLE_STANDARD')">
                <button class="button is-fullwidth" onclick="main.upgrade('ROLE_PREMIUM')">업그레이드하기</button>
            </sec:authorize>
            <sec:authorize access="hasAnyRole('ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <button disabled class="button is-fullwidth">업그레이드하기</button>
            </sec:authorize>
        </div>
    </div>

    <div class="pricing-plan is-danger">
        <div class="plan-header">Premium plus 등급</div>
        <div class="plan-price"><span id="premiumPlusPrice" class="plan-price-amount">19,500원</span>/월 (부가세 포함)</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
        </div>
        <div class="plan-footer">
            <sec:authorize access="hasAnyRole('ROLE_BASIC', 'ROLE_STANDARD', 'ROLE_PREMIUM')">
                <button class="button is-fullwidth" onclick="main.upgrade('ROLE_PREMIUM_PLUS')">업그레이드하기</button>
            </sec:authorize>
            <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
                <button disabled class="button is-fullwidth">업그레이드하기</button>
            </sec:authorize>

        </div>
    </div>
</div>

<div id="month3" class="pricing-table is-comparative is-hidden">
    <div class="pricing-plan is-features">
        <div class="plan-header">Features</div>
        <div class="plan-price"><span class="plan-price-amount">&nbsp;</span></div>
        <div class="plan-items">
            <div class="plan-item">광고제거</div>
            <div class="plan-item">해외 포트폴리오</div>
            <div class="plan-item">해외 포트폴리오 종목별 시각화자료</div>
            <div class="plan-item">국내 포트폴리오</div>
            <div class="plan-item">국내 포트폴리오 종목별 시각화자료</div>
            <div class="plan-item">포트폴리오별 종목 검색</div>
        </div>
        <div class="plan-footer">
        </div>
    </div>

    <div class="pricing-plan">
        <div class="plan-header is-primary">Basic 등급</div>
        <div class="plan-price"><span class="plan-price-amount has-text-primary">무료</span></div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="has-text-danger">최근 8분기 자료만 공개</span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
        </div>
    </div>

    <div class="pricing-plan is-info">
        <div class="plan-header">Standard 등급</div>
        <div class="plan-price"><span id="standardPrice3" class="plan-price-amount">28,500원</span>/3개월 (부가세 포함)</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
            <sec:authorize access="hasRole('ROLE_BASIC')">
                <button class="button is-fullwidth" onclick="main.upgrade('ROLE_STANDARD')">업그레이드하기</button>
            </sec:authorize>
            <sec:authorize access="hasAnyRole('ROLE_STANDARD', 'ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <button disabled class="button is-fullwidth">업그레이드하기</button>
            </sec:authorize>
        </div>
    </div>

    <div class="pricing-plan is-warning">
        <div class="plan-header">Premium 등급</div>
        <div class="plan-price"><span id="premiumPrice3" class="plan-price-amount">43,500</span>/3개월 (부가세 포함)</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
            <sec:authorize access="hasAnyRole('ROLE_BASIC', 'ROLE_STANDARD')">
                <button class="button is-fullwidth" onclick="main.upgrade('ROLE_PREMIUM')">업그레이드하기</button>
            </sec:authorize>
            <sec:authorize access="hasAnyRole('ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <button disabled class="button is-fullwidth">업그레이드하기</button>
            </sec:authorize>
        </div>
    </div>

    <div class="pricing-plan is-danger">
        <div class="plan-header">Premium plus 등급</div>
        <div class="plan-price"><span id="premiumPlusPrice3" class="plan-price-amount">58,500</span>/3개월 (부가세 포함)</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
        </div>
        <div class="plan-footer">
            <sec:authorize access="hasAnyRole('ROLE_BASIC', 'ROLE_STANDARD', 'ROLE_PREMIUM')">
                <button class="button is-fullwidth" onclick="main.upgrade('ROLE_PREMIUM_PLUS')">업그레이드하기</button>
            </sec:authorize>
            <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
                <button disabled class="button is-fullwidth">업그레이드하기</button>
            </sec:authorize>

        </div>
    </div>
</div>


<div id="sucModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <article class="message">
            <div class="message-header">
                <p>가상계좌 채번완료</p>
                <button class="delete" aria-label="delete" onclick="cmmUtils.closeModal('sucModal')"></button>
            </div>
            <div class="message-body has-text-dark">
                <div class="flex-col mt-3">
                    <p>아래 채번된 가상계좌로 이체를 부탁드리며, 이체완료시 자동으로 등급이 업그레이드 됩니다.</p>
                    <p id="vbankName"></p>
                    <p id="vbankNum"></p>
                    <p class="has-text-danger mt-3">※ 이체결과는 마이페이지에서 확인 가능합니다.</p>
                </div>
                <div class="flex-row justify-content-center mt-5">
                    <div class="buttons">
                        <button class="button is-dark is-small" onclick="cmmUtils.closeModal('sucModal')">
                            <span class="icon has-text-success"><i class="fas fa-check"></i></span>
                            <span>확인</span>
                        </button>
                        <button class="button is-dark is-small" onclick="topMain.goToMyPage()">
                            <span class="icon has-text-warning"><i class="fas fa-user-alt"></i></span>
                            <span>마이페이지로 이동</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>


<div id="paymentModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card" style="width: 800px; height: 800px;">
        <header class="modal-card-head">
            <p class="modal-card-title">약관 동의</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('paymentModal')"></button>
        </header>
        <section class="modal-card-body">

            <div class="notification is-warning is-light mb-0">
                <a href="#" onclick="main.goToGuide()" style="text-decoration: none; color: #3273dc;">[서비스 내용 보기]</a> 자료를 확인하였습니까?
            </div>
            <div class="flex-row justify-content-end align-items-center mt-2">
                <div>
                    <input class="is-checkradio is-block is-warning" id="chkNoti1" type="checkbox" name="chkNoti">
                    <label for="chkNoti1">확인했습니다</label>
                </div>
            </div>

            <div class="notification is-warning is-light mb-0 mt-5 premiumPlusOnly">
                국내, 국외자료 차이점을 확인하였습니까? <a href="#" onclick="main.goToDifference()" style="text-decoration: none; color: #3273dc;">[내용보기]</a>
            </div>
            <div class="flex-row justify-content-end align-items-center mt-2 premiumPlusOnly">
                <div>
                    <input class="is-checkradio is-block is-warning" id="chkNoti2" type="checkbox" name="chkNoti">
                    <label for="chkNoti2">확인했습니다</label>
                </div>
            </div>

            <div class="notification is-warning is-light mb-0 mt-5">
                이 상품은 법령에 의거해서 환불이 불가한 상품입니다(단, 결제 후 서비스 사용이력이 없다면 환불 가능합니다).<br/>
                <a href="#" onclick="main.goToStatute()" style="text-decoration: none; color: #3273dc;">[관련법령 보기]</a>
                <a href="#" onclick="main.goToSummaryArt()" class="ml-2" style="text-decoration: none; color: #3273dc;">[요약자료 보기]</a>
                <a href="#" onclick="main.goToArticle()" class="ml-2" style="text-decoration: none; color: #3273dc;">[관련기사 보기]</a>
            </div>
            <div class="flex-row justify-content-end align-items-center mt-2">
                <div>
                    <input class="is-checkradio is-block is-warning" id="chkNoti3" type="checkbox" name="chkNoti">
                    <label for="chkNoti3">확인했습니다</label>
                </div>
            </div>

            <div class="notification is-warning is-light mb-0 mt-5">
                <sec:authentication property="principal.userNm"/>님은 웹 사이트 <a href="#" onclick="cmmUtils.showModal('footerModal1')" style="text-decoration: none; color: #3273dc;">[이용약관]</a> 을 읽었으며 이에 동의합니다.
            </div>
            <div class="flex-row justify-content-end align-items-center mt-2">
                <div>
                    <input class="is-checkradio is-block is-warning" id="chkNoti4" type="checkbox" name="chkNoti">
                    <label for="chkNoti4">확인했습니다</label>
                </div>
            </div>

        </section>
        <footer class="modal-card-foot flex-row justify-content-end">
            <div class="buttons">
                <button id="btnPayment" disabled class="button is-dark is-small" onclick="main.payment()">
                    <span class="icon has-text-warning"><i class="far fa-credit-card"></i></span>
                    <span>결제하기</span>
                </button>
                <button class="button is-dark is-small" onclick="cmmUtils.closeModal('paymentModal')">
                    <span class="icon has-text-danger"><i class="fas fa-times"></i></span>
                    <span>취소</span>
                </button>
            </div>
        </footer>
    </div>
</div>


<div id="summaryArtModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('summaryArtModal')"></div>
    <div class="modal-content" style="width: 1200px; height: 350px;">
        <p class="image">
            <img src="${pageContext.request.contextPath}/resources/images/guide/summary/image.jpg" alt="">
        </p>
    </div>
    <button class="modal-close is-large" aria-label="close" onclick="cmmUtils.closeModal('summaryArtModal')"></button>
</div>

<div id="articleModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('articleModal')"></div>
    <div class="modal-content">
        <p class="image">
            <img src="${pageContext.request.contextPath}/resources/images/guide/article/image.jpg" alt="">
        </p>
    </div>
    <button class="modal-close is-large" aria-label="close" onclick="cmmUtils.closeModal('articleModal')"></button>
</div>

<div id="differenceModal" class="modal">
    <div class="modal-background" onclick="cmmUtils.closeModal('differenceModal')"></div>
    <div class="modal-content">
        <p class="image">
            <img src="${pageContext.request.contextPath}/resources/images/guide/difference/image.jpg" alt="">
        </p>
    </div>
    <button class="modal-close is-large" aria-label="close" onclick="cmmUtils.closeModal('differenceModal')"></button>
</div>


