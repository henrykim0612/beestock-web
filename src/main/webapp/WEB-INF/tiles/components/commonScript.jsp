<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%--Axios--%>
<script src="${pageContext.request.contextPath}/resources/vendors/axios/0.21.1/axios.min.js" type="text/javascript"></script>
<%--fontawesome--%>
<script src="${pageContext.request.contextPath}/resources/vendors/fontawesome/5.15.3/js/all.min.js" type="text/javascript"></script>
<%--Lodash--%>
<script src="${pageContext.request.contextPath}/resources/vendors/lodash/4.17.15/lodash.js" type="text/javascript"></script>
<%--Tippy--%>
<script src="${pageContext.request.contextPath}/resources/vendors/tippy/popper/2.9.2/popper.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/resources/vendors/tippy/6.3.1/tippy.min.js" type="text/javascript"></script>

<%--Bulma-Extensions--%>
<%--Calendar--%>
<script src="${pageContext.request.contextPath}/resources/vendors/bulma/bulma-extension/calendar/bulma-calendar.min.js" type="text/javascript"></script>
<%--Accordion--%>
<script src="${pageContext.request.contextPath}/resources/vendors/bulma/bulma-extension/accordion/bulma-accordion.min.js" type="text/javascript"></script>
<%--Carousel--%>
<script src="${pageContext.request.contextPath}/resources/vendors/bulma/bulma-extension/carousel/bulma-carousel.min.js" type="text/javascript"></script>
<%--Quick view--%>
<script src="${pageContext.request.contextPath}/resources/vendors/bulma/bulma-extension/quick-view/bulma-quickview.min.js" type="text/javascript"></script>
<%--Toast--%>
<script src="${pageContext.request.contextPath}/resources/vendors/bulma/bulma-extension/toast/bulma-toast.min.js" type="text/javascript"></script>

<%--CKEditor--%>
<script src="${pageContext.request.contextPath}/resources/vendors/ckeditor5/build/ckeditor.js" type="text/javascript"></script>
<%--ECharts--%>
<script src="${pageContext.request.contextPath}/resources/vendors/echarts/5.0.2/echarts.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/resources/vendors/echarts/theme/roma.js" type="text/javascript"></script>
<%--Swiper--%>
<script src="${pageContext.request.contextPath}/resources/vendors/swiper/swiper-bundle.min.js" type="text/javascript"></script>
<%--Clipboard--%>
<script src="${pageContext.request.contextPath}/resources/vendors/clipboard/2.0.6/clipboard.min.js" type="text/javascript"></script>
<%--Autocomplete--%>
<script src="${pageContext.request.contextPath}/resources/vendors/autocomplete/awesomplete.min.js" type="text/javascript"></script>
<%--Chroma.js--%>
<script src="${pageContext.request.contextPath}/resources/vendors/chroma-js/chroma.js" type="text/javascript"></script>

<%--common--%>
<script src="${pageContext.request.contextPath}/resources/vendors/jquery/3.6.0/jquery.min.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/resources/vendors/iamport/1.1.5/iamport.payment-1.1.5.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/common/custom_upload_adaptor.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/common/common_utils.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/common/common_confirm.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/common/bee_components/main.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/common/bee_components/data_grid.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/common/bee_components/chart.js" type="text/javascript"></script>
<script type="text/javascript">
  const CONTEXT_PATH = "${pageContext.request.contextPath}";
  const COMPANY_NAME = '허니비소프트';
  const GUIDE = [{
    name: 'bsp',
    src: CONTEXT_PATH + '/resources/images/guide/bsp/image.jpg',
    link: 'https://youtu.be/keYN8ic2j3g'
  }, {
    name: 'quantity',
    src: CONTEXT_PATH + '/resources/images/guide/quantity/image.jpg',
    link: 'https://www.youtube.com/watch?v=GxPp6W1XmmQ'
  }, {
    name: 'search',
    src: CONTEXT_PATH + '/resources/images/guide/search/image.jpg'
  }, {
    name: 'avgbsp',
    src: CONTEXT_PATH + '/resources/images/guide/avgbsp/image.jpg',
    link: 'https://youtu.be/RUxsX_YuSUc'
  }, {
    name: 'portfolio',
    src: CONTEXT_PATH + '/resources/images/guide/portfolio/image.jpg',
    link: 'https://youtu.be/2Ce9lwuoHUo'
  }, {
    name: 'rate',
    src: CONTEXT_PATH + '/resources/images/guide/rate/image.jpg',
    link: 'https://youtu.be/4N4IUL9ju2o'
  }];
</script>