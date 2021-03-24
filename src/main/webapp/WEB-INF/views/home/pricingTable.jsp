<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/pricing_table.js" type="text/javascript"></script>

<article class="message is-dark">
    <div class="message-body">
        <p>등급을 올려 더 많은 포트폴리오와 정리된 시각화 화면으로 시간을 절약하십시오.</p>
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
            <div class="plan-item">해외 포트폴리오 시각화자료 팝업</div>
            <div class="plan-item">국내 포트폴리오</div>
            <div class="plan-item">국내 포트폴리오 시각화자료 팝업</div>
            <div class="plan-item">포트폴리오별 종목 검색</div>
        </div>
        <div class="plan-footer">
        </div>
    </div>

    <div class="pricing-plan">
        <div class="plan-header is-primary">Basic 등급</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>무료</span>/월</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon-text has-text-success is-small"><span class="icon"><i class="fas fa-check"></i></span><span class="has-text-danger">최근 8분기 자료만 공개</span></span></div>
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
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>9,500원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">결제하기</button>
        </div>
    </div>

    <div class="pricing-plan is-warning">
        <div class="plan-header">Premium 등급</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>14,500원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
            <div class="plan-item"><span class="icon has-text-danger is-small"><i class="fas fa-times"></i></span></div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">결제하기</button>
        </div>
    </div>

    <div class="pricing-plan is-danger">
        <div class="plan-header">Premium plus 등급</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>19,500원</span>/월</div>
        <div class="plan-items">
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
            <div class="plan-item"><span class="icon has-text-success is-small"><i class="fas fa-check"></i></span></div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">결제하기</button>
        </div>
    </div>
</div>

<button class="button" onclick="main.showPayment()">Button</button>
