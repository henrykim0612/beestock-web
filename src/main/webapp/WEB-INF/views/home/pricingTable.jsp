<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/home/pricing_table.js" type="text/javascript"></script>

<article class="message is-dark">
    <div class="message-body">
        정기적인 <strong>BeeStock</strong> 구독으로 더 많은 포트폴리오와 자료들을 확인하십시오.
    </div>
</article>

<div class="pricing-table">
    <div class="pricing-plan">
        <div class="plan-header">Basic</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>20</span>/month</div>
        <div class="plan-items">
            <div class="plan-item">20GB Storage</div>
            <div class="plan-item">100 Domains</div>
            <div class="plan-item">-</div>
            <div class="plan-item">-</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth" disabled="disabled">Current plan</button>
        </div>
    </div>

    <div class="pricing-plan is-link">
        <div class="plan-header">Standard</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>40</span>/month</div>
        <div class="plan-items">
            <div class="plan-item">20GB Storage</div>
            <div class="plan-item">25 Domains</div>
            <div class="plan-item">1TB Bandwidth</div>
            <div class="plan-item">-</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">Choose</button>
        </div>
    </div>

    <div class="pricing-plan is-danger">
        <div class="plan-header">Premium</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>60</span>/month</div>
        <div class="plan-items">
            <div class="plan-item">200GB Storage</div>
            <div class="plan-item">50 Domains</div>
            <div class="plan-item">1TB Bandwidth</div>
            <div class="plan-item">100 Email Boxes</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">Choose</button>
        </div>
    </div>

    <div class="pricing-plan is-warning">
        <div class="plan-header">Premium plus</div>
        <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">$</span>100</span>/month</div>
        <div class="plan-items">
            <div class="plan-item">2TB Storage</div>
            <div class="plan-item">100 Domains</div>
            <div class="plan-item">1TB Bandwidth</div>
            <div class="plan-item">1000 Email Boxes</div>
        </div>
        <div class="plan-footer">
            <button class="button is-fullwidth">Choose</button>
        </div>
    </div>
</div>