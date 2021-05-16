<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/profile/profile_details.js" type="text/javascript"></script>

<input type="hidden" id="profileId" value="${profileId}"/>

<form id="profileDetailForm">
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelTitle" class="label" for="profileTitle">명칭</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="profileTitle" class="input is-info" type="text" data-bind="true" data-id="profileTitle" maxlength="100" placeholder="최대 100자리 입력">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelFilerId" class="label" for="filerId">고유번호</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="filerId" class="input is-info" type="text" data-bind="true" data-id="filerId" maxlength="10" placeholder="해외인 경우 filer_id 컬럼 값 입력">
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
            <label id="labelTooltip" class="label" for="profileSubtitle">툴팁 명칭</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="tooltipTxt" class="input is-info" type="text" maxlength="200" placeholder="툴팁으로 사용될 텍스트. 최대 200자리 입력(미입력 가능)" data-bind="true" data-id="tooltipTxt">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label class="label" for="bcmkStQuarterDate">시점 값</label>
        </div>
        <div class="column">
            <div class="control">
                <input id="bcmkStQuarterDate" class="input is-info" type="text" maxlength="6" placeholder="YYYY-1~4" data-bind="true" data-id="bcmkStQuarterDate">
            </div>
        </div>
    </div>
    <div class="columns">
        <div class="column is-1 is-vertical-center">
            <label id="labelCont" class="label" for="profileInfo">설명</label>
        </div>
        <div class="column">
            <div id="profileInfo"></div>
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
            <label id="labelFileName" class="label" for="originalFileName">대표사진</label>
        </div>
        <div class="column">
            <div class="control">
                <a id="originalFileName" data-bind="true" data-id="originalFileName" data-link-id="fileId" onclick="main.downloadImg(this)"></a>
                <a onclick="cmmUtils.showModal('previewModal')" class="ml-3 button is-warning is-light is-small">
                <span class="icon is-small">
                  <i class="fas fa-eye"></i>
                </span>
                    <span>미리보기</span>
                </a>
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
            <label id="labelPublic" class="label">공개</label>
        </div>
        <div class="column">
            <div class="field">
                <input type="radio" class="is-checkradio is-primary is-circle" id="isPublic1" name="isPublic" value="1" data-bind="true" data-id="isPublic">
                <label for="isPublic1">공개</label>
                <input type="radio" class="is-checkradio is-primary is-circle" id="isPublic2" name="isPublic" value="0" data-bind="true" data-id="isPublic">
                <label for="isPublic2">비공개</label>
                <span class="has-text-danger subtitle is-7">* 벤치마크 데이터가 없으면 공개할 수 없음</span>
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
        <button id="btnMod" onclick="main.modifyProfile()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
            <span>수정</span>
        </button>
    </div>
    <div id="removeDiv" class="ml-3">
        <button id="btnRm" onclick="main.removeProfile()" class="button is-danger is-small">
                <span class="icon is-small">
                  <i class="fas fa-trash-alt"></i>
                </span>
            <span>삭제</span>
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

<div id="previewModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="card profile-card">
            <div class="card-image">
                <figure class="image is-2by1">
                    <img id="previewImg" src="" alt="No image">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                    </div>
                    <div class="media-content has-text-centered">
                        <p id="previewTitle" class="title is-4"></p>
                        <p id="previewSubtitle" class="subtitle is-6"></p>
                    </div>
                </div>
                <div class="content">
                </div>
            </div>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" onclick="cmmUtils.closeModal('previewModal')"></button>
</div>
