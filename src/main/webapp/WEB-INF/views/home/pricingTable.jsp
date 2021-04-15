<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/pricing_table.js" type="text/javascript"></script>

<div class="notification is-warning is-light">
    <p><span class="has-text-danger">﹡</span> 등급별로 제공하는 서비스 항목을 확인하시고, 본인에게 맞는 등급으로 <strong>업그레이드</strong>하세요.</p>
    <p><span class="has-text-danger">﹡</span> 익월에도 동일한 등급으로 이용하시고 싶으신 경우, <span class="has-text-link cursor" onclick="topMain.goToMyPage()">마이 페이지</span>(사이트 오른쪽 상단 사람 아이콘 클릭) 화면의 결제 자동연장 서비스를 이용해주세요.</p>
</div>

<article class="message is-dark">
    <div class="message-body">
        <sec:authorize access="hasRole('ROLE_BASIC')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-primary">Basic</strong>등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_STANDARD')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-info">Standard</strong>등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_PREMIUM')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-warning">Premium</strong> 등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
            <p>현재 <strong><sec:authentication property="principal.userNm"/></strong>님은 <strong class="has-text-danger">Premium Plus</strong>등급을 이용하고 계십니다.</p>
        </sec:authorize>
    </div>
</article>

<div class="pricing-table is-comparative">

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
        <div class="plan-price"><span class="plan-price-amount has-text-primary">무료</span>/월 (부가세 별도)</div>
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
        <div class="plan-price"><span id="standardPrice" class="plan-price-amount">9,500원</span>/월 (부가세 별도)</div>
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
        <div class="plan-price"><span id="premiumPrice" class="plan-price-amount">14,500원</span>/월 (부가세 별도)</div>
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
        <div class="plan-price"><span id="premiumPlusPrice" class="plan-price-amount">19,500원</span>/월 (부가세 별도)</div>
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
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">결제완료</p>
            <button class="delete" aria-label="close" onclick="main.closeModal('sucModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>결제가 완료되었습니다.</h2>
            <p>이용에 감사드리며, 더 좋은 사이트로 보답 드리겠습니다.</p>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <button class="button is-warning is-small" onclick="cmmUtils.goToPage('/home/dashboard')">
                    <span class="icon"><i class="fas fa-home"></i></span>
                    <span>BeeStock 홈으로</span>
                </button>
            </div>
        </footer>
    </div>
</div>

