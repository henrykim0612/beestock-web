<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/pricing_table.js" type="text/javascript"></script>

<article class="message is-dark">
    <div class="message-body">
        <p><strong>BEESTOCK</strong> 구독으로 더 많은 포트폴리오와 자료들을 확인하십시오.</p>
        <sec:authorize access="hasRole('ROLE_BASIC')">
            <p>현재 <sec:authentication property="principal.userNm"/>은 <strong>Basic</strong>등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_STANDARD')">
            <p>현재 <sec:authentication property="principal.userNm"/>은 <strong>Standard</strong>등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_PREMIUM')">
            <p>현재 <sec:authentication property="principal.userNm"/>은 <strong>Premium</strong> 등급을 이용하고 계십니다.</p>
        </sec:authorize>
        <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
            <p>현재 <sec:authentication property="principal.userNm"/>은 <strong>Premium Plus</strong>등급을 이용하고 계십니다.</p>
        </sec:authorize>
    </div>
</article>

<div class="pricing-table">
    <div class="pricing-plan">
        <div class="plan-header is-primary">Basic(무료이용자)</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>무료</span>/월</div>
        <div class="plan-items">
            <div class="plan-item">광고포함</div>
            <div class="plan-item">해외 포트폴리오 최근 8분기 자료공개</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth" disabled="disabled">무료</button>
        </div>
    </div>

    <div class="pricing-plan is-info">
        <div class="plan-header">Standard</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>9,500원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item">광고제거</div>
            <div class="plan-item">해외 포트폴리오 모든분기 자료공개</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">결제하기</button>
        </div>
    </div>

    <div class="pricing-plan is-warning">
        <div class="plan-header">Premium</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>14,500원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item">광고제거</div>
            <div class="plan-item">해외 포트폴리오 모든분기 자료공개</div>
            <div class="plan-item">해외 포트폴리오 분기자료 시각화 팝업기능</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">결제하기</button>
        </div>
    </div>

    <div class="pricing-plan is-danger is-active">
        <div class="plan-header">Premium plus</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>19,500원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item">광고제거</div>
            <div class="plan-item">해외 포트폴리오 모든분기 자료공개</div>
            <div class="plan-item">해외 포트폴리오 분기자료 시각화 팝업기능</div>
            <div class="plan-item">국내 포트폴리오 모든분기 자료공개</div>
            <div class="plan-item">국내 포트폴리오 분기자료 시각화 팝업기능</div>
            <div class="plan-item">포트폴리오별 종목 검색기능</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">결제하기</button>
        </div>
    </div>
</div>

<button class="button" onclick="main.showPayment()">Button</button>
