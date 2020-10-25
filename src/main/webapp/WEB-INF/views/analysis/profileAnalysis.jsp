<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/analysis/profile_analysis.js"></script>
<input type="hidden" id="profileId" value="${profileId}"/>

<div class="tile is-ancestor">
    <div class="tile is-3 is-vertical is-parent">
        <div class="tile is-child">
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img id="profileImg" src="" alt="Placeholder image">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <span id="spanStar" class="icon has-text-warning cursor"></span>
                        </div>
                        <div class="media-content">
                            <p id="profileTitle" class="title is-4"></p>
                        </div>
                    </div>
                    <div id="profileSubtitle" class="content">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="tile is-vertical is-parent">
        <div class="tile is-child box">
            <div class="columns">
                <div class="column is-full">
                    <p class="title">투자 아이디어</p>
                </div>
            </div>
            <div class="columns">
                <div class="column is-full">
                </div>
            </div>
        </div>
    </div>
</div>