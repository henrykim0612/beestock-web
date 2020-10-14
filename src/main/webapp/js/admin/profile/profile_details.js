const main = (function() {

  let global = {
    profileId: null,
    selectedFileName: null,
    ckEditProfileInfo: undefined,
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
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function initCKEditor(response) {
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
      if (fileName) {
        // 이미지까지 수정한경우
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
              cmmUtils.hideLoadingElement(document.getElementById('btnMod'));
              cmmUtils.showErrModal();
              console.log(err);
            });
          });
        } else {
          cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
        }
      } else {
        cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
          // 이미지는 제외하고 수정한 경우
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
            cmmUtils.hideLoadingElement(document.getElementById('btnMod'));
            cmmUtils.showErrModal();
            console.log(err);
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
      profileType: cmmUtils.getCheckedValues('profileType')[0]
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
    return formData;
  }

  function removeProfile() {
    const msg = '해당 프로필을 삭제합니다. 삭제 후 복구할 수 없습니다.';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.postData({
        url: '/api/v1/admin/profile/delete-profile',
        body: {
          profileId: global['profileId']
        },
        loading: 'btnRm'
      }).then(function (response) {
        if (response === -401) return cmmUtils.goToLoginHome(); // 세션 끊어짐
        0 < response ? goToProfile() : cmmUtils.showErrModal();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnRm'));
        cmmUtils.showErrModal();
        console.log(err);
      });
    });
  }

  function verifyInputValues() {
    const profileTitle = document.getElementById('profileTitle').value;
    if (!profileTitle) {
      cmmUtils.showIpModal('프로필명');
      return false;
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

  return {
    init: init,
    getGlobal: function() {
      return global;
    },
    goToProfile: goToProfile,
    modifyProfile: modifyProfile,
    removeProfile: removeProfile,
    downloadImg: downloadImg,
    changeFileInput: changeFileInput
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});