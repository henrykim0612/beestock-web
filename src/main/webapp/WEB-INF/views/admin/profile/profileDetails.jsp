<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/admin/profile/profile_details.js"></script>

<input type="hidden" id="profileId" value="${profileId}"/>

<form id="profileDetailForm">
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="profileTitle">프로필명</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="profileTitle" class="input is-info" type="text" data-bind="true" data-id="profileTitle" maxlength="100" placeholder="최대 100자리 입력">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelSubtitle" class="label" for="profileSubtitle">보조명칭</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="profileSubtitle" class="input is-info" type="text" data-bind="true" data-id="profileSubtitle" maxlength="100" placeholder="최대 100자리 입력(미입력 가능)">
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
            <label id="labelSecret" class="label">국내/해외</label>
        </div>
        <div class="column">
            <div class="field">
                <input type="radio" class="is-checkradio is-primary is-circle" id="profileType1" name="profileType" value="1" data-bind="true" data-id="profileType">
                <label for="profileType1">국내</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="profileType2" name="profileType" value="2" data-bind="true" data-id="profileType">
                <label for="profileType2">해외</label>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelFileName" class="label" for="originalFileName">대표사진</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <a id="originalFileName" data-bind="true" data-id="originalFileName" data-link-id="fileId" onclick="main.downloadImg(this)"></a>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelImg" class="label" for="imgRefId"></label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <div class="file has-name is-primary is-fullwidth">
                    <label class="file-label">
                        <input class="file-input" type="file" id="imgRefId" name="imgRefId" onchange="main.changeFileInput(this)" accept=".jpg, .jpeg, .bmp, .png">
                        <span class="file-cta">
                            <span class="file-icon"><i class="fas fa-upload"></i></span>
                            <span class="file-label">대표사진 변경</span>
                        </span>
                        <span class="file-name" id="spanFileName"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelModUptLoginId" class="label" for="modUptLoginId">등록자</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <input disabled id="modUptLoginId" class="input" type="text" data-bind="true" data-id="regLoginId">
                <span class="icon is-small is-left"><i class="fas fa-user-edit"></i></span>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelModUptDate" class="label" for="modUptDate">최근 수정일</label>
        </div>
        <div class="column">
            <div class="control has-icons-left">
                <input disabled id="modUptDate" class="input" type="text" data-bind="true" data-id="uptDate">
                <span class="icon is-small is-left"><i class="fas fa-clock"></i></span>
            </div>
        </div>
    </div>
</form>

<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnMod" onclick="main.modifyProfile()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
            <span>수정</span>
        </button>
    </div>
    <div id="removeDiv" class="ml-3">
        <button id="btnRm" onclick="main.removeProfile()" class="button is-danger">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
            <span>삭제</span>
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
