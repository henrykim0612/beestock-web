const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let global = {
    selectedTab: 'contIn', // 기본은 국내
    splitNum: 4,
    selectedIdeaId: null,
    ckEditModIdeaCont: undefined,
    modIdeaWordCount: 0
  }
  let ideaGrid = undefined;

  function init() {
    createBreadCrumb();
    initMyImage();
    addTabListener();
    initFavoriteProfiles();
    initIdeaGrid();
  }

  function createBreadCrumb() {
    const breadCrumbNav = document.getElementById('breadCrumbNav');
    let html = '';
    html += '<ul>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard.do">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
    html += '      <span>마이 페이지</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initMyImage() {
    cmmUtils.axiosGet({url: '/api/v1/login/my-image'}, function(response) {
      const src = cmmUtils.nvl(response.data)
        ? CONTEXT_PATH + '/common/image/' + response['data'] + '.do'
        : CONTEXT_PATH + '/resources/images/no-profile.png';
      const myImgFile = document.getElementById('myImage');
      myImgFile.setAttribute('src', src);
    });
  }

  function addTabListener() {
    const tabs = document.getElementsByName('tabs');
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.addEventListener('click', function () {
        resetTabs();
        this.classList.add('is-active');
        const contId = this.getAttribute('data-cont-id');
        global['selectedTab'] = contId;
        document.getElementById(contId).classList.remove('is-hidden');
        initFavoriteProfiles();
      })
    }
  }

  function resetTabs() {
    const tabs = document.getElementsByName('tabs');
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.classList.remove('is-active');
      document.getElementById(tab.getAttribute('data-cont-id')).classList.add('is-hidden');
    }
  }

  function initFavoriteProfiles() {
    cmmUtils.axiosPost({
      url: '/api/v1/login/favorite-profile',
      body: {
        profileType: global['selectedTab'] === 'contIn' ? 1 : 2 // 1: 국내, 2: 해외
      }
    }, function (response) {
      cmmProfileCard.appendCards(response, global['selectedTab']);
    });
  }

  function initIdeaGrid() {

    const profileTitleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        const url = '/analysis/profile/details?profileType=' + row['profileType'] + '&profileId=' + row['profileId'];
        cmmUtils.goToPage(url);
      })
    }

    const ideaTitleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        showModIdeaModal(row['ideaId']);
      })
    }

    const props = {
      url: '/api/v1/analysis/profile/idea-list',
      body: {
        orderBy: [{column: 'uptDate', desc: true}],
        pageSize: 5 //  기본 5개로 설정
      },
      eId: 'ideaGrid',
      pId: 'ideaPagination',
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'ideaId', isHidden: true},
        {id: 'profileType', isHidden: true},
        {id: 'rowNum', name: 'No', isSort: true, isStrong: true},
        {id: 'profileTitle', name: '포트폴리오', width: '300px', isSort: true, align: 'left', isLink: true, userCustom: profileTitleAnchor},
        {id: 'ideaTitle', name: '아이디어 제목', width: '800px', isSort: true, isLink: true, userCustom: ideaTitleAnchor},
        {id: 'uptDate', name: '최근 수정일', width: '150px', isSort: true, align: 'center'}
      ]
    }
    ideaGrid = new COMPONENTS.DataGrid(props);
    initCKEditor();
  }

  function initCKEditor() {
    const modIdeaContWordCount = function(stats) {
      global.modIdeaWordCount = stats.characters;
    }
    if (!global['ckEditModIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#modIdeaCont', wordCount: modIdeaContWordCount}, function(editor) {
        global['ckEditModIdeaCont'] = editor;
      });
    }
  }

  function showModIdeaModal(ideaId) {
    global.selectedIdeaId = ideaId;
    const url = '/api/v1/analysis/profile/idea/' + ideaId;
    cmmUtils.axiosGet({url: url}, function(response) {
      clearModIdeaModal(response);
      cmmUtils.bindData('modIdeaForm', response);
      global.ckEditModIdeaCont.setData(response['ideaCont']);
      cmmUtils.showModal('modIdeaModal');
    });
  }

  function clearModIdeaModal(response) {
    document.getElementById('modIdeaTitle').value = '';
    global.ckEditModIdeaCont.setData('');
    document.getElementById('modCardTitle').innerText = response['ideaTitle'];
  }

  function goToModProfile() {
    const loginId = document.getElementById('loginId').value;
    const loginPwd = document.getElementById('ipPwd').value;
    cmmUtils.axiosPost({
      url: '/api/v1/login/check-pwd',
      body: {
        loginId: loginId,
        loginPwd: loginPwd
      }
    }, function (response) {
      if (response) {
        cmmUtils.goToPage('/user/mod-account');
      } else {
        const helpPwd = document.getElementById('helpPwd');
        helpPwd.classList.remove('is-hidden');
      }
    });
  }

  function keyupIpPwd(e) {
    if (e.key === 'Enter') {
      goToModProfile();
    }
  }

  // 내 포트폴리오 사진 변경
  function onChangeImgFile(fis) {
    const str = fis.value;
    const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
    if (fileName) {
      if (cmmUtils.checkImageExtension(fileName)) {
        const file = document.getElementById('myImgFile').files[0];
        const checkedFiles = cmmUtils.verifySingleFileSize(file);
        if (checkedFiles.status) {
          const formData = new FormData();
          formData.append('myImgFile', file);
          cmmUtils.axiosPost({
            url: '/api/v1/login/update-my-image',
            isMultipartFile: true,
            body: formData
          }, function (response) {
            if (response.status === 'OK') {
              const myImage = document.getElementById('myImage');
              const src = CONTEXT_PATH + '/common/image/' + response['data'] + '.do';
              myImage.setAttribute('src', src);
            } else {
              cmmUtils.showErrModal();
            }
          });
        } else {
          cmmUtils.showIpModal('파일', checkedFiles.msg);
          return false;
        }
      } else {
        cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
      }
    }
  }

  function modifyIdea() {
    if (verifyModIdeaForm()) {
      const msg = '아이디어를 수정 하시겠습니까?';
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        const formData = new FormData();
        formData.append('ideaId', global.selectedIdeaId);
        formData.append('ideaTitle', document.getElementById('modIdeaTitle').value);
        formData.append('ideaCont', global.ckEditModIdeaCont.getData());

        const images = document.getElementById('modIdeaModal').querySelector('.ck-content').querySelectorAll('img');
        for (let i=0;i<images.length;i++) {
          const split = images[i].src.split('.')[0].split('/');
          const usedImageId = split[split.length - 1];
          formData.append('usedImageIds', usedImageId);
        }

        cmmUtils.axiosPost({
          url: '/api/v1/analysis/profile/update-idea',
          body: formData,
          loading: 'btnModIdea'
        }, function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '수정 되었습니다.'});
            closeModIdeaModal();
          } else {
            cmmUtils.showErrModal();
          }
        });
      });
    }
  }

  function removeIdea() {
    const msg = '아이디어를 삭제 하시겠습니까?';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, async function() {
      const response = await cmmUtils.awaitAxiosPost({
        url: '/api/v1/analysis/profile/remove-idea',
        body: {
          ideaId: global.selectedIdeaId
        }
      });

      if (response) {
        cmmUtils.showToast({message: '삭제 되었습니다.'});
        closeModIdeaModal();
      } else {
        cmmUtils.goToErrorPage(response);
      }
    });
  }


  function verifyModIdeaForm() {
    const modIdeaTitle = document.getElementById('modIdeaTitle').value;
    if (!modIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (global.modIdeaWordCount > 2000) {
      cmmUtils.showIpModal('문자수 초과', '아이디어 문자수는 최대 2000문자(현재:' + global.modIdeaWordCount + '문자)까지 가능합니다. ');
      return false;
    }
    return true;
  }

  async function closeModIdeaModal() {
    cmmUtils.closeModal('modIdeaModal');
    await cmmUtils.axiosPost({url: '/common/ckeditor5/unused-files'});
    reloadIdeaGrid();
  }

  function reloadIdeaGrid() {
    ideaGrid.reload();
  }

  // 회원탈퇴
  function withdrawal() {
    cmmUtils.axiosPost({
      url: '/api/v1/login/withdrawal',
      loading: 'btnWithdrawal'
    }, function (response) {
      if (response) {
        document.getElementById('spanLogout').click(); // 로그아웃
      } else {
        cmmUtils.goToErrorPage();
      }
    });
  }

  return {
    init: init,
    goToModProfile: goToModProfile,
    keyupIpPwd: keyupIpPwd,
    onChangeImgFile: onChangeImgFile,
    modifyIdea: modifyIdea,
    removeIdea: removeIdea,
    closeModIdeaModal: closeModIdeaModal,
    withdrawal: withdrawal
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd);
});