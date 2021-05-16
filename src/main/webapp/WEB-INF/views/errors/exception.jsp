<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>

<!DOCTYPE html>
<html>
<head>
    <title>BEESTOCK</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <%--Bulma Main--%>
    <script src="${pageContext.request.contextPath}/resources/vendors/fontawesome/5.3.1/fontawesome.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/vendors/bulma/0.9.1/css/bulma.css" type="text/css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/vendors/bulma/0.9.1/bulma-sass.css" type="text/css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/common/common.css" type="text/css">
</head>
<body>
<script src="${pageContext.request.contextPath}/${jsDir}/common/common_utils.js" type="text/javascript"></script>
<script type="text/javascript">
  const CONTEXT_PATH = "${pageContext.request.contextPath}";
</script>
<div class="container">
    <div class="flex-col justify-content-center height700px is-fullwidth">
        <div class="flex-row justify-content-center">
            <div class="flex-row justify-content-end width-50per mr-6">
                <img src="${pageContext.request.contextPath}/resources/images/logo/app/error.png" style="width: 250px;">
            </div>
            <div class="width-50per flex-col justify-content-center">
                <p class="title is-spaced has-text-danger" style="font-size: 4rem;">System error</p>
                <p class="subtitle is-5">Sorry, Please retry..</p>
                <div class="flex-row justify-content-start">
                    <div class="buttons mt-5">
                        <button class="button is-warning is-small" onclick="cmmUtils.goToPage('/home/dashboard')">
                            <span class="icon"><i class="fas fa-home"></i></span>
                            <span>홈으로</span>
                        </button>
                        <button class="button is-info is-small" onclick="cmmUtils.historyBack()">
                            <span class="icon"><i class="fas fa-history"></i></span>
                            <span>이전 화면으로</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <sec:authorize access="hasRole('ROLE_ADMIN')">
        <div class="flex-row justify-content-center">
            <div class="flex-col">
                <p>${err.exceptionName }</p>
                <p>${err.message }</p>
                <p>${err.responseText }</p>
            </div>
        </div>
    </sec:authorize>
</div>
</body>
</html>








