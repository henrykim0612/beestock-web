const main = (function() {

  let global = {
    profileId: null,
    selectedFileName: null,
    ckEditProfileInfo: undefined,
    linkArrDelimiter: '#,#', // 링크 배열 구분자
    linkInfoDelimiter: '#^#' // 링크 정보 구분자
  }

  function init() {
    global['profileId'] = document.getElementById('profileId').value;
    createBreadCrumb();
    drawDetails();
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
    html += '      <span>프로필 상세</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function drawDetails() {
    const profileId = global['profileId'];
    const url = '/api/v1/admin/profile/' + profileId;
    cmmUtils.getData({
      url: url,
    }).then(function (response) {
      cmmUtils.bindData('profileDetailForm', response);
      initCKEditor(response);
      setPreviewModal(response);
      initLinkColumns(response);
    }).catch(function (err) {
      cmmUtils.goToErrorPage(err);
    });
  }

  function initCKEditor(response) {
    // 관리자가 아니고 본인의 글이 아니라면 ReadOnly
    if (!global['ckEditProfileInfo']) {
      cmmUtils.createCKEditor({selector: '#profileInfo', data: response['profileInfo']}, function(editor) {
        global['ckEditProfileInfo'] = editor;
      });
    }
  }

  function setPreviewModal(response) {
    const previewImg = document.getElementById('previewImg');
    const src = CONTEXT_PATH + '/common/image/' + response['fileId'];
    previewImg.setAttribute('src', src);
    document.getElementById('previewTitle').innerText = cmmUtils.nvl(response['profileTitle']);
    document.getElementById('previewSubtitle').innerText = cmmUtils.nvl(response['profileSubtitle']);
  }

  // 목록으로 돌아가기
  function goToProfile() {
    cmmUtils.goToPage('/admin/profile-management');
  }

  function modifyProfile() {
    if (verifyInputValues()) {
      const msg = '프로필을 수정합니다. 오타 또는 누락된것은 없는지 확인하세요.';
      const fileName = global['selectedFileName'];
      if (fileName) { // 이미지까지 수정한경우
        if (cmmUtils.checkImageExtension(fileName)) {
          cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
            cmmUtils.postData({
              url: '/api/v1/admin/profile/update-profile-all',
              body: getFormData(),
              isMultipartFile: true,
              headers: {},
              loading: 'btnMod'
            }).then(function (response) {
              if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐
              cmmUtils.showModal('saveModal');
              if (0 < response) {
                init();
              }
            }).catch(function (err) {
              cmmUtils.goToErrorPage(err);
            });
          });
        } else {
          cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
        }
      } else { // 이미지는 제외하고 수정한 경우
        cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
          cmmUtils.postData({
            url: '/api/v1/admin/profile/update-profile',
            body: getParameters(),
            loading: 'btnMod'
          }).then(function (response) {
            if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐
            cmmUtils.showModal('saveModal');
            if (0 < response) {
              init();
            }
          }).catch(function (err) {
            cmmUtils.goToErrorPage(err);
          });
        });
      }
    }
  }

  // 이미지는 제외하고 수정한 경우
  function getParameters() {
    return {
      profileId: global['profileId'],
      profileTitle: document.getElementById('profileTitle').value,
      profileSubtitle: document.getElementById('profileSubtitle').value,
      profileInfo: global['ckEditProfileInfo'].getData(),
      profileType: cmmUtils.getCheckedValues('profileType')[0],
      isFree: cmmUtils.getCheckedValues('isFree')[0],
      profileLink: createLinkStr()
    }
  }

  // 이미지까지 수정한 경우
  function getFormData() {
    const formData = new FormData();
    formData.append('profileId', global['profileId']);
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
    const argLen = arguments.length;
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
      if (argLen === 1) {
        formData.append('profileLink', resultArr.join(global['linkArrDelimiter']));
      } else {
        return resultArr.join(global['linkArrDelimiter']);
      }
    }
  }

  function removeProfile() {
    const msg = '해당 프로필을 삭제합니다. 프로필의 분기 데이터까지 모두 제거됩니다.';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.postData({
        url: '/api/v1/admin/profile/delete-profile',
        body: {
          profileId: global['profileId']
        },
        loading: 'btnRm'
      }).then(function (response) {
        if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐
        0 < response ? goToProfile() : cmmUtils.goToErrorPage(response);
      }).catch(function (err) {
        cmmUtils.goToErrorPage(err);
      });
    });
  }

  function verifyInputValues() {
    const profileTitle = document.getElementById('profileTitle').value;
    if (!profileTitle) {
      cmmUtils.showIpModal('프로필명');
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

  function downloadImg(_this) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = CONTEXT_PATH + '/common/download-file';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'fileId';
    input.value = _this.getAttribute('data-link-value');
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  function changeFileInput(fis) {
    const str = fis.value;
    const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
    global['selectedFileName'] = fileName
    document.getElementById('spanFileName').innerText = fileName;
  }

  // 기등록한 링크 추가
  function initLinkColumns(response) {
    const profileLinkStr = response['profileLink'];
    if (profileLinkStr) {
      const profileLinks = profileLinkStr.split(global['linkArrDelimiter']);
      for (let i = 0; i < profileLinks.length; i++) {
        const profileInfo = profileLinks[i].split(global['linkInfoDelimiter']);
        appendLinkColumn({linkType: profileInfo[0], linkName: profileInfo[1], linkUrl: profileInfo[2]});
      }
    }
  }

  // 링크 추가
  function appendLinkColumn(linkInfo) {
    const uuid = cmmUtils.getUUID();
    const argLen = arguments.length;
    let html = '';
    html = html + '<div class="columns">';
    html = html + '  <div class="column has-text-right is-3">';
    html = html + '    <button type="button" class="button ml-3" onclick="main.removeLinkColumn(\'' + uuid + '\')">';
    html = html + '      <span class="icon is-small has-text-danger"><i class="fas fa-minus"></i></span>';
    html = html + '      <span>링크 삭제</span>';
    html = html + '    </button>';
    html = html + '    <div class="select">';
    html = html + '      <select name="linkType">';
    if (argLen === 1) {
      const option1 = linkInfo.linkType === '1' ? '<option value="1" selected>유튜브</option>' : '<option value="1">유튜브</option>';
      const option2 = linkInfo.linkType === '2' ? '<option value="2" selected>일반영상</option>' : '<option value="2">일반영상</option>';
      const option3 = linkInfo.linkType === '3' ? '<option value="3" selected>기사</option>' : '<option value="3">기사</option>';
      html = html + option1;
      html = html + option2;
      html = html + option3;
    } else {
      html = html + '<option value="1" selected>유튜브</option>';
      html = html + '<option value="2">일반영상</option>';
      html = html + '<option value="3">기사</option>';
    }
    html = html + '      </select>';
    html = html + '    </div>';
    html = html + '  </div>';
    html = html + '  <div class="column is-3">';
    html = html + '    <div class="control">';
    if (argLen === 1) {
      html = html + '      <input class="input is-info" type="text" name="linkName" value="' + linkInfo.linkName + '" placeholder="링크명 입력">';
    } else {
      html = html + '      <input class="input is-info" type="text" name="linkName" placeholder="URL 입력">';
    }
    html = html + '    </div>';
    html = html + '  </div>';
    html = html + '  <div class="column is-fullwidth">';
    html = html + '    <div class="control">';
    if (argLen === 1) {
      html = html + '      <input class="input is-info" type="text" name="linkUrl" value="' + linkInfo.linkUrl + '" placeholder="URL 입력">';
    } else {
      html = html + '      <input class="input is-info" type="text" name="linkUrl" placeholder="URL 입력">';
    }
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
    getGlobal: function() {
      return global;
    },
    goToProfile: goToProfile,
    modifyProfile: modifyProfile,
    removeProfile: removeProfile,
    downloadImg: downloadImg,
    changeFileInput: changeFileInput,
    appendLinkColumn: appendLinkColumn,
    removeLinkColumn: removeLinkColumn
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});