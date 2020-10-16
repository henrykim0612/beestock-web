<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/quarter/quarter_management.js"></script>

<div class="level mr-3 mb-5">
    <div class="level-left">
        <div class="control has-icons-left mr-3">
            <div class="select is-rounded">
                <select id="selType" onchange="main.changeSelType(this)">
                    <option value="1">국내</option>
                    <option value="2">해외</option>
                </select>
            </div>
            <div class="icon is-small is-left">
                <i class="fas fa-globe-asia"></i>
            </div>
        </div>
        <div class="control has-icons-left mr-3">
            <div class="select is-rounded">
                <select id="selSearch">
                    <option value="profileTitle" selected>프로필명</option>
                    <option value="profileSubtitle">보조명</option>
                    <option value="profileInfo">설명</option>
                </select>
            </div>
            <div class="icon is-small is-left">
                <i class="fas fa-search"></i>
            </div>
        </div>
    </div>
</div>


