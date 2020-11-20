<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>

<div class="flex-col justify-content-center height700px is-fullwidth">
    <div class="flex-row justify-content-center">
        <div class="flex-row justify-content-center width-50per">
            <img src="${pageContext.request.contextPath}/resources/images/logo/app/logo-a-v-b-01.png" style="width: 50%;">
        </div>
        <div class="width-50per flex-col justify-content-center">
            <p class="title is-spaced has-text-danger-dark" style="font-size: 4rem;">500</p>
            <p class="subtitle is-3">서버와 통신도중 문제가 발생했습니다.</p>
            <div class="flex-row justify-content-start">
                <div class="buttons mt-5">
                    <button class="button is-dark" onclick="cmmUtils.goToPage('/home/dashboard')">
                        <span class="icon is-small"><i class="fas fa-home"></i></span>
                        <span>BeeStock 홈으로</span>
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
            <p>${err.requestUrl }</p>
            <p>${err.pageUrl }</p>
        </div>
    </div>
</sec:authorize>
