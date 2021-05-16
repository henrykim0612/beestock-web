<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/profile/profile_form.js" type="text/javascript"></script>

<form id="qaForm">
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="profileTitle">명칭</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="profileTitle" class="input is-info" type="text" maxlength="100" placeholder="최대 100자리 입력">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelFilerId" class="label" for="filerId">고유번호</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="filerId" class="input is-info" type="text" maxlength="10" placeholder="해외인 경우 filer_id 컬럼 값 입력">
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
            <label id="labelTooltip" class="label" for="profileSubtitle">툴팁 명칭</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="tooltipTxt" class="input is-info" type="text" maxlength="200" placeholder="툴팁으로 사용될 텍스트. 최대 200자리 입력(미입력 가능)">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label class="label" for="bcmkStQuarterDate">시점 값</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="bcmkStQuarterDate" class="input is-info" type="text" maxlength="6" placeholder="YYYY-1~4">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelCont" class="label" for="profileInfo">설명</label>
        </div>
        <div class="column">
            <div class="control">
                <div id="profileInfo"></div>
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <button type="button" class="button is-small" onclick="main.appendLinkColumn()">
                <span class="icon is-small has-text-success"><i class="fas fa-plus"></i></span>
                <span>링크 추가</span>
            </button>
        </div>
        <div class="column is-fullwidth">
            <div id="linkDiv" class="flex-col">
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
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelPublic" class="label">공개</label>
        </div>
        <div class="column">
            <div class="field">
                <input type="radio" class="is-checkradio is-primary is-circle" id="isPublic1" name="isPublic" value="1">
                <label for="isPublic1">공개</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="isPublic2" name="isPublic" value="0" checked="checked">
                <label for="isPublic2">비공개</label>
            </div>
        </div>
    </div>
</form>
<div class="flex-row justify-content-center mt-6">
    <div id="uptDiv">
        <button id="btnIns" onclick="main.insertProfile()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
            <span>등록</span>
        </button>
    </div>
    <div class="ml-3">
        <button onclick="main.goToProfile()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-arrow-alt-circle-left"></i>
                </span>
            <span>목록으로</span>
        </button>
    </div>
</div>
