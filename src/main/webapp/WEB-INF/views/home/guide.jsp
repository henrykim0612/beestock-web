<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/home/guide.js" type="text/javascript"></script>

<h1 class="title is-4">유료서비스 등급별 추가기능 사용 가이드</h1>
<div id="tabs" class="tabs is-boxed pt-4">
    <ul>
        <li class="is-active" data-cont-id="t1">
            <a>
                <span class="icon has-text-warning is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
                <span>매수•매도 금액</span>
            </a>

        </li>
        <li data-cont-id="t2">
            <a>
                <span class="icon has-text-warning is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
                <span>보유수량 차트</span>
            </a>
        </li>
        <li data-cont-id="t3">
            <a>
                <span class="icon has-text-warning is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
                <span>평균매수가 차트</span>
            </a>
        </li>
        <li data-cont-id="t4">
            <a>
                <span class="icon has-text-warning is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
                <span>동일 종목코드를 보유한 포트폴리오 차트</span>
            </a>
        </li>
        <li data-cont-id="t5">
            <a>
                <span class="icon has-text-warning is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
                <span>QoQ 주식수량 증감률</span>
            </a>
        </li>
        <li data-cont-id="t6">
            <a>
                <span class="icon has-text-warning is-small"><i class="fas fa-info-circle" aria-hidden="true"></i></span>
                <span>종목검색</span>
            </a>
        </li>
    </ul>
</div>

<%--매수매도금액--%>
<div data-name="tabContent" id="t1">
    <div class="columns">
        <div class="column is-full">
            <div class="flex-col justify-content-center">
                <figure class="image is-16by9">
                    <iframe class="has-ratio" width="640" height="360" src="https://www.youtube.com/embed/keYN8ic2j3g" frameborder="0" allowfullscreen></iframe>
                </figure>
                <figure class="image">
                    <img src="${pageContext.request.contextPath}/resources/images/guide/bsp/image.jpg">
                </figure>
            </div>
        </div>
    </div>
</div>

<%--보유수량 차트--%>
<div class="is-hidden" data-name="tabContent" id="t2">
    <div class="columns">
        <div class="column is-full">
            <div class="flex-col justify-content-center">
                <figure class="image is-16by9">
                    <iframe class="has-ratio" width="640" height="360" src="https://www.youtube.com/embed/GxPp6W1XmmQ" frameborder="0" allowfullscreen></iframe>
                </figure>
                <figure class="image">
                    <img src="${pageContext.request.contextPath}/resources/images/guide/quantity/image.jpg">
                </figure>
            </div>
        </div>
    </div>
</div>

<%--평균매수가 차트--%>
<div class="is-hidden" data-name="tabContent" id="t3">
    <div class="columns">
        <div class="column is-full">
            <div class="flex-col justify-content-center">
                <figure class="image is-16by9">
                    <iframe class="has-ratio" width="640" height="360" src="https://www.youtube.com/embed/RUxsX_YuSUc" frameborder="0" allowfullscreen></iframe>
                </figure>
                <figure class="image">
                    <img src="${pageContext.request.contextPath}/resources/images/guide/avgbsp/image.jpg">
                </figure>
            </div>
        </div>
    </div>
</div>

<%--동일 종목코드를 보유한 포트폴리오 차트--%>
<div class="is-hidden" data-name="tabContent" id="t4">
    <div class="columns">
        <div class="column is-full">
            <div class="flex-col justify-content-center">
                <figure class="image is-16by9">
                    <iframe class="has-ratio" width="640" height="360" src="https://www.youtube.com/embed/2Ce9lwuoHUo" frameborder="0" allowfullscreen></iframe>
                </figure>
                <figure class="image">
                    <img src="${pageContext.request.contextPath}/resources/images/guide/portfolio/image.jpg">
                </figure>
            </div>
        </div>
    </div>
</div>

<%--QoQ 주식수량 증감--%>
<div class="is-hidden" data-name="tabContent" id="t5">
    <div class="columns">
        <div class="column is-full">
            <div class="flex-col justify-content-center">
                <figure class="image is-16by9">
                    <iframe class="has-ratio" width="640" height="360" src="https://www.youtube.com/embed/4N4IUL9ju2o" frameborder="0" allowfullscreen></iframe>
                </figure>
                <figure class="image">
                    <img src="${pageContext.request.contextPath}/resources/images/guide/rate/image.jpg">
                </figure>
            </div>
        </div>
    </div>
</div>

<%--종목검색--%>
<div class="is-hidden" data-name="tabContent" id="t6">
    <div class="columns">
        <div class="column is-full">
            <div class="flex-col justify-content-center">
                <figure class="image">
                    <img src="${pageContext.request.contextPath}/resources/images/guide/search/image.jpeg">
                </figure>
            </div>
        </div>
    </div>
</div