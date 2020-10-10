<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/profile/profile_form.js"></script>

<form id="qaForm">
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="profileTitle">프로필명</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="profileTitle" class="input is-info" type="text" maxlength="100" placeholder="최대 100자리 입력">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelSubtitle" class="label" for="profileSubtitle">보조명칭</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="profileSubtitle" class="input is-info" type="text" maxlength="100" placeholder="최대 100자리 입력(미입력 가능)">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelCont" class="label" for="profileInfo">설명</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div id="profileInfo"></div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelImg" class="label" for="imgRefId">대표사진</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div class="file has-name is-primary is-fullwidth">
                    <label class="file-label">
                        <input class="file-input" type="file" id="imgRefId" name="imgRefId" onchange="main.changeFileInput(this)" accept=".jpg, .jpeg, .bmp, .png">
                        <span class="file-cta">
                            <span class="file-icon"><i class="fas fa-upload"></i></span>
                            <span class="file-label">사진 선택</span>
                        </span>
                        <span class="file-name" id="spanFileName"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelSecret" class="label">국내/해외</label>
        </div>
        <div class="column">
            <div class="field">
                <input type="radio" class="is-checkradio is-primary is-circle" id="profileType1" name="profileType" value="1" checked="checked">
                <label for="profileType1">국내</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="profileType2" name="profileType" value="2">
                <label for="profileType2">해외</label>
            </div>
        </div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnIns" onclick="main.insertProfile()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
            <span>등록</span>
        </button>
    </div>
    <div class="ml-3">
        <button onclick="main.goToProfile()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
