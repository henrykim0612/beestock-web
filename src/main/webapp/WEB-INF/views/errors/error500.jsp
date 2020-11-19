<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri = "http://www.springframework.org/security/tags" prefix = "sec" %>

<div class="flex-col">
    <p>${err.exceptionName }</p>
    <p>${err.message }</p>
    <p>${err.requestUrl }</p>
    <p>${err.pageUrl }</p>
</div>
