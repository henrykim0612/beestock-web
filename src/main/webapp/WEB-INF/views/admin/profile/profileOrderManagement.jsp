<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/profile/profile_order_management.js" type="text/javascript"></script>

<div class="buttons" style="position: fixed; top: 200px;">
    <button id="btnSave" class="button is-success is-small" onclick="main.save()">
        <span class="icon"><i class="fas fa-check"></i></span>
        <span>저장</span>
    </button>
    <button class="button is-small" onclick="main.moveUp()">
        <span class="icon"><i class="far fa-arrow-alt-circle-up"></i></span>
        <span>위로</span>
    </button>
    <button class="button is-small" onclick="main.moveDown()">
        <span class="icon"><i class="far fa-arrow-alt-circle-down"></i></span>
        <span>아래로</span>
    </button>
</div>

<div class="flex-row justify-content-center is-fullwidth mt-5">
    <div class="flex-col justify-content-center width-20per"></div>
    <%--국내--%>
    <div class="flex-col justify-content-center width-40per">
        <div class="flex-row justify-content-center mb-3">
            <h1 class="subtitle">국내</h1>
        </div>
    </div>
    <%--국외--%>
    <div class="flex-col justify-content-center width-40per">
        <div class="flex-row justify-content-center mb-3">
            <h1 class="subtitle">국외</h1>
        </div>
    </div>
</div>
<%--프로필 리스트--%>
<div class="flex-row justify-content-center is-fullwidth mt-5">
    <div class="flex-col justify-content-center width-20per"></div>
    <%--국내--%>
    <div class="flex-col justify-content-start width-40per">
        <div id="inDiv" class="flex-col justify-content-center"></div>
    </div>
    <%--해외--%>
    <div class="flex-col justify-content-start width-40per">
        <div id="outDiv" class="flex-col justify-content-center"></div>
    </div>
</div>


