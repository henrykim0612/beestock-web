<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/premium/plus/item_code_detail_popup.js" type="text/javascript"></script>

<input type="hidden" id="selectedQuarterDate" value="${selectedQuarterDate}"/>
<input type="hidden" id="profileType" value="${profileType}"/>
<input type="hidden" id="profileId" value="${profileId}"/>
<input type="hidden" id="itemCode" value="${itemCode}"/>
<input type="hidden" id="itemName" value="${itemName}"/>
<input type="hidden" id="schType" value="${schType}"/>

<%--라인차트 모달--%>
<div class="box">
    <div class="flex-col justify-content-start">
        <div class="flex-row justify-content-center mb-3">
            <p class="title is-4">${itemName}</p>
        </div>
        <div class="flex-row justify-content-center height500px">
            <div class="table-container overflowY-auto">
                <table id="detailGrid" class="table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
            </div>
        </div>
    </div>
</div>

<div id="colLineChartModal" class="modal">
    <div class="modal-background" onclick="main.closeColLineChartModal()"></div>
    <div class="modal-content width1200px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="lineChartModalTitle"></p>
            <button class="delete" aria-label="close" onclick="main.closeColLineChartModal()"></button>
        </header>
        <section class="modal-card-body">
            <div class="flex-row justify-content-start">
                <div class="field">
                    <div class="control has-icons-left">
                        <div class="select is-small">
                            <select id="selLineChartFilter">
                                <option value="0" selected>보유수량</option>
                                <option value="1">시가평가액</option>
                                <c:if test="${profileType eq '1'}">
                                    <option value="2">매수금액</option>
                                </c:if>
                                <c:if test="${profileType eq '2'}">
                                    <option value="2">매수·매도금액</option>
                                </c:if>
                                <option value="3">평균매수가</option>
                            </select>
                        </div>
                        <div class="icon is-small is-left">
                            <i class="fas fa-filter"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-row justify-content-center">
                <div id="rightItemCodeChart" class="width1500px height600px"></div>
            </div>
            <div class="flex-row justify-content-center">
                <article class="message is-warning">
                    <div id="rightChartMsgBody" class="message-body">
                        <p>※ <strong>미공시</strong>로 표기된 것은 제출된 운용보고서가 <strong>비공개</strong>된 것입니다. 위 차트 상에는 전량매도로 보일 수 있으나, <strong>알수없음</strong>으로 보는 것이 맞습니다.</p>
                    </div>
                </article>
            </div>
        </section>
    </div>
</div>

<figure class="image is-128x128 is-hidden" id="miniProfileImg">
    <img src="https://bulma.io/images/placeholders/128x128.png">
</figure>