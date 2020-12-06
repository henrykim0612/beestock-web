<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/pricing_table.js"></script>

<article class="message is-dark">
    <div class="message-body">
        정기적인 <strong>BeeStock</strong> 구독으로 더 많은 포트폴리오와 자료들을 확인하십시오.
    </div>
</article>

<div class="pricing-table is-comparative">
    <div class="pricing-plan is-features">
        <div class="plan-header">공개 항목</div>
        <div class="plan-price"><span class="plan-price-amount">&nbsp;</span></div>
        <div class="plan-items">
            <div class="plan-item">국내 포트폴리오</div>
            <div class="plan-item">해외 포트폴리오</div>
            <div class="plan-item">자료 엑셀 다운로드</div>
            <div class="plan-item">포트폴리오별 개인 저장공간</div>
            <div class="plan-item">프리미엄 전용 화면</div>
        </div>
        <div class="plan-footer">

        </div>
    </div>
    <div class="pricing-plan">
        <div class="plan-header">일반 사용자</div>
        <div class="plan-price"><span class="plan-price-amount">무료</span></div>
        <div class="plan-items">
            <div class="plan-item" data-feature="Storage">무료 포트폴리오만 공개</div>
            <div class="plan-item" data-feature="Domains">무료 포트폴리오만 공개</div>
            <div class="plan-item has-text-danger" data-feature="Bandwidth">이용 불가</div>
            <div class="plan-item has-text-danger" data-feature="Bandwidth">이용 불가</div>
            <div class="plan-item has-text-danger" data-feature="Bandwidth">비공개</div>
        </div>
        <div class="plan-footer">
        </div>
    </div>
    <div class="pricing-plan is-warning">
        <div class="plan-header">1달 구독자</div>
        <div class="plan-price"><span class="plan-price-amount">3만원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item" data-feature="Storage">모두 공개</div>
            <div class="plan-item" data-feature="Domains">모두 공개</div>
            <div class="plan-item" data-feature="Domains">이용 가능</div>
            <div class="plan-item" data-feature="Domains">이용 가능</div>
            <div class="plan-item" data-feature="Bandwidth">모두 공개</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">1달 구독</button>
        </div>
    </div>
    <div class="pricing-plan is-danger">
        <div class="plan-header">1년 구독자</div>
        <div class="plan-price"><span class="plan-price-amount">30만원</span>/년</div>
        <div class="plan-items">
            <div class="plan-item" data-feature="Storage">모두 공개</div>
            <div class="plan-item" data-feature="Domains">모두 공개</div>
            <div class="plan-item" data-feature="Domains">이용 가능</div>
            <div class="plan-item" data-feature="Domains">이용 가능</div>
            <div class="plan-item" data-feature="Bandwidth">모두 공개</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">1년 구독</button>
        </div>
    </div>
</div>
