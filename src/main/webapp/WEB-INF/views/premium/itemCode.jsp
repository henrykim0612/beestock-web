<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/premium/item_code.js" type="text/javascript"></script>

<%--분기 슬라이더--%>
<div id="quarterSlider" class="swiper-container mt-3">
    <div id="quarterCont" class="swiper-wrapper height120px"></div>
    <!-- Add Arrows -->
    <div id="quarterNext" class="swiper-button-next"></div>
    <div id="quarterPrev" class="swiper-button-prev"></div>
    <!-- Add Pagination -->
    <div id="quarterPagination" class="swiper-pagination"></div>
</div>