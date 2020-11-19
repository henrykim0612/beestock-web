const main = (function() {

  let global = {
    selectedFileName: null,
    ckEditProfileInfo: undefined,
    linkArrDelimiter: '#,#', // 링크 배열 구분자
    linkInfoDelimiter: '#^#' // 링크 정보 구분자
  }

  function init() {
    createBreadCrumb();
    initCKEditor();
  }

  function initCKEditor() {
    cmmUtils.createCKEditor({selector: '#profileInfo'}, function(editor) {
      global['ckEditProfileInfo'] = editor;
    });
  }

  function createBreadCrumb() {
    const breadCrumbNav = document.getElementById('breadCrumbNav');
    let html = '';
    html += '<ul>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/admin/code-management">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/admin/profile-management">';
    html += '      <span class="icon is-small"><i class="fas fa-address-card"></i></span>';
    html += '      <span>프로필 관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-address-card"></i></span>';
    html += '      <span>프로필 등록</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function insertProfile() {
    if (verifyInputValues()) {
      const fileName = global['selectedFileName'];
      if (cmmUtils.checkImageExtension(fileName)) {
        const msg = '새로운 프로필 등록을 시작합니다.';
        cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
          cmmUtils.postData({
            url: '/api/v1/admin/profile/insert-profile',
            isMultipartFile: true,
            headers: {},
            body: getParameters(),
            loading: 'btnIns'
          }).then(function (response) {
            if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐, 해킹의심
            goToProfile();
          }).catch(function (err) {
            cmmUtils.goToErrorPage(err);
          });
        });
      } else {
        cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
      }
    }
  }

  function verifyInputValues() {
    const profileTitle = document.getElementById('profileTitle').value;
    const imgRefId = document.getElementById('imgRefId').value;
    if (!profileTitle) {
      cmmUtils.showIpModal('프로필명');
      return false;
    }
    if (!imgRefId) {
      cmmUtils.showIpModal('대표사진', '대표사진을 선택해주세요.');
      return false;
    }
    // 링크 검증
    const linkNames = document.getElementsByName('linkName');
    if (linkNames.length) {
      for (let i = 0; i < linkNames.length; i++) {
        if (!linkNames[i].value) {
          cmmUtils.showIpModal('링크명', '링크명을 입력해주세요.');
          return false;
        }
      }
    }
    const linkUrls = document.getElementsByName('linkUrl');
    if (linkUrls.length) {
      for (let i = 0; i < linkUrls.length; i++) {
        if (!linkUrls[i].value) {
          cmmUtils.showIpModal('링크 URL', 'URL을 입력해주세요.');
          return false;
        }
      }
    }
    return true;
  }

  function getParameters() {
    const formData = new FormData();
    formData.append('imgRefId', document.getElementById('imgRefId').files[0]);
    formData.append('profileTitle', document.getElementById('profileTitle').value);
    formData.append('profileSubtitle', document.getElementById('profileSubtitle').value);
    formData.append('profileInfo', global['ckEditProfileInfo'].getData());
    formData.append('profileType', cmmUtils.getCheckedValues('profileType')[0]);
    formData.append('isFree', cmmUtils.getCheckedValues('isFree')[0]);
    createLinkStr(formData);
    return formData;
  }

  // 프로필 참고링크 String 생성
  function createLinkStr(formData) {
    const linkTypes = document.getElementsByName('linkType');
    const linkNames = document.getElementsByName('linkName');
    const linkUrls = document.getElementsByName('linkUrl');
    let resultArr = [];
    if (linkTypes.length) {
      for (let i = 0; i < linkTypes.length; i++) {
        const linkType = linkTypes[i].value;
        const linkName = linkNames[i].value;
        const linkUrl = linkUrls[i].value;
        resultArr.push(linkType + global['linkInfoDelimiter'] + linkName + global['linkInfoDelimiter'] + linkUrl); // 구분자는 #^#
      }
    }
    if (resultArr.length) {
      formData.append('profileLink', resultArr.join(global['linkArrDelimiter']));
    }
  }

  // 목록으로 돌아가기
  function goToProfile() {
    cmmUtils.goToPage('/admin/profile-management');
  }

  function changeFileInput(fis) {
    const str = fis.value;
    const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
    global['selectedFileName'] = fileName
    document.getElementById('spanFileName').innerText = fileName;
  }

  // 링크 추가
  function appendLinkColumn() {
    const uuid = cmmUtils.getUUID();
    let html = '';
    html = html + '<div class="columns">';
    html = html + '  <div class="column has-text-right is-3">';
    html = html + '    <button type="button" class="button ml-3" onclick="main.removeLinkColumn(\'' + uuid + '\')">';
    html = html + '      <span class="icon is-small has-text-danger"><i class="fas fa-minus"></i></span>';
    html = html + '      <span>링크 삭제</span>';
    html = html + '    </button>';
    html = html + '    <div class="select">';
    html = html + '      <select name="linkType">';
    html = html + '        <option value="1" selected>유튜브</option>';
    html = html + '        <option value="2">일반영상</option>';
    html = html + '        <option value="3">기사</option>';
    html = html + '      </select>';
    html = html + '    </div>';
    html = html + '  </div>';
    html = html + '  <div class="column is-3">';
    html = html + '    <div class="control">';
    html = html + '      <input class="input is-info" type="text" name="linkName" placeholder="링크명 입력">';
    html = html + '    </div>';
    html = html + '  </div>';
    html = html + '  <div class="column is-fullwidth">';
    html = html + '    <div class="control">';
    html = html + '      <input class="input is-info" type="text" name="linkUrl" placeholder="URL 입력">';
    html = html + '    </div>';
    html = html + '  </div>';
    html = html + '</div>';
    const div = document.createElement('div');
    div.id = uuid;
    div.innerHTML = html;
    document.getElementById('linkDiv').appendChild(div);
  }

  // 링크 삭제
  function removeLinkColumn(uuid) {
    document.getElementById(uuid).remove();
  }

  return {
    init: init,
    goToProfile: goToProfile,
    insertProfile: insertProfile,
    changeFileInput: changeFileInput,
    appendLinkColumn: appendLinkColumn,
    removeLinkColumn: removeLinkColumn

  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});