const main = (function() {

  let global = {
    ckEditProfileInfo: undefined,
    selectedFileName: null
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
            cmmUtils.hideLoadingElement(document.getElementById('btnIns'));
            cmmUtils.showErrModal();
            console.log(err);
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
    return formData;
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

  return {
    init: init,
    goToProfile: goToProfile,
    insertProfile: insertProfile,
    changeFileInput: changeFileInput
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});