const COMPONENTS = BeeComponents('dataGrid', 'chart', function(box) {});
const main = (function() {

  let global = {
    profileId: null,
    selectedIdeaId: null,
    chart: undefined,
    ckEditNewIdeaCont: undefined,
    ckEditModIdeaCont: undefined,
    newFileArr: [], // uuid, file, isRemoved
    modFileArr: [] // uuid, fileId, fileSize, isRemoved
  };
  let ideaGrid = undefined;

  function init() {
    createBreadCrumb();
    global.profileId = document.getElementById('profileId').value;
    getProfileDetails();
    addSpanStarEvent();
    initInvestIdea();
    initTooltips();
    addFileEventListener();
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
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-chart-line"></i></span>';
    html += '      <span>프로필 분석</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function getProfileDetails() {
    const url = '/api/v1/analysis/profile/' + global.profileId;
    cmmUtils.getData({
      url: url
    }).then(setProfileHeader).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  // 프로필 헤더 생성
  function setProfileHeader(data) {
    // 프로필 이미지
    const profileImg = document.getElementById('profileImg');
    profileImg.src = CONTEXT_PATH + '/common/image/' + data['fileId'];
    // 타이틀
    document.getElementById('profileTitle').innerText = data['profileTitle'];
    // Information
    document.getElementById('profileSubtitle').innerText = data['profileSubtitle'];

    createStar(data['isFavorite']);
  }

  // 즐겨찾기 클릭 이벤트
  function addSpanStarEvent() {
    document.getElementById('spanStar').addEventListener('click', function() {
      const favoriteVal = parseInt(this.getAttribute('data-favorite')) === 1 ? 2 : 1;
      this.setAttribute('data-favorite', ''+favoriteVal);
      cmmUtils.postData({
        url: '/api/v1/analysis/profile/favorite',
        body: {
          profileId: global.profileId,
          isFavorite: favoriteVal
        },
      }).then(function (response) {
        cmmUtils.showToast({message: favoriteVal === 1 ? '즐겨찾기 되었습니다.' : '즐겨찾기가 해제되었습니다.'});
        createStar(favoriteVal);
      }).catch(function (err) {
        cmmUtils.showErrModal();
        console.log(err);
      });
    })
  }

  function createStar(favorite) {
    // 1: 즐겨찾기함, 2: 즐겨찾기 안함
    const span = document.getElementById('spanStar');
    span.setAttribute('data-favorite', favorite);
    cmmUtils.clearChildNodes(span);
    const icon = document.createElement('i');
    icon.classList.add(favorite === 1 ? 'fas' : 'far');
    icon.classList.add('fa-lg');
    icon.classList.add('fa-star');
    span.appendChild(icon);
  }

  // 투자 아이디어
  function initInvestIdea() {
    const ideaGridTable = document.getElementById('ideaGrid');
    if (ideaGridTable) {
      // 데이터 그리드
      const ideaAnchor = function(anchor, col, row) {
        anchor.setAttribute('data-custom', 'ideaAnchor');
        anchor.setAttribute('data-idea-id', row['ideaId']);
      }
      const props = {
        url: '/api/v1/analysis/profile/idea-list',
        body: {
          orderBy: [{column: 'uptDate', desc: true}],
          profileId: global.profileId
        },
        eId: 'ideaGrid',
        isThead: true,
        isTfoot: false,
        colModel: [
          {id: 'ideaId', isHidden: true},
          {id: 'ideaTitle', name: '아이디어 제목', width: '800px', isSort: true, isLink: true, userCustom: ideaAnchor},
          {id: 'uptDate', name: '최근 수정일', width: '150px', isSort: true, align: 'center'}
        ],
        success: function (data, _this) {
          addTitleAnchorEvent(data, _this);
        }
      }
      ideaGrid = new COMPONENTS.DataGrid(props);

      // 에디터
      initCKEditor();
    }

    function addTitleAnchorEvent(data, _this) {
      const eId = _this.props.eId;
      const tags = document.getElementById(eId).querySelectorAll('[data-custom=ideaAnchor]');
      for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener('click', function () {
          const ideaId = this.getAttribute('data-idea-id');
          showModIdeaModal(ideaId);
        })
      }
    }
  }

  function initTooltips() {
    tippy('#fileField', {
      content: '다중선택 가능',
      placement: 'top'
    });
  }

  function initCKEditor() {
    if (!global['ckEditNewIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#newIdeaCont'}, function(editor) {
        global['ckEditNewIdeaCont'] = editor;
      });
    }
    if (!global['ckEditModIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#modIdeaCont'}, function(editor) {
        global['ckEditModIdeaCont'] = editor;
      });
    }
  }

  function showModIdeaModal(ideaId) {
    global.selectedIdeaId = ideaId;
    const url = '/api/v1/analysis/profile/idea/' + ideaId;
    cmmUtils.getData({
      url: url
    }).then(function (response) {
      clearModIdeaModal(response);
      cmmUtils.bindData('modIdeaForm', response);
      global.ckEditModIdeaCont.setData(response['ideaCont']);
      appendModIdeaFiles(response);
      cmmUtils.showModal('modIdeaModal');
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function showNewIdeaModal() {
    clearNewIdeaModal();
    cmmUtils.showModal('newIdeaModal');
  }

  function clearNewIdeaModal() {
    document.getElementById('newIdeaTitle').value = '';
    global.ckEditNewIdeaCont.setData('');
    document.getElementById('newIdeaFile').value = '';
    cmmUtils.clearChildNodes(document.getElementById('newIdeaFileDiv'));
    global.newFileArr = [];
  }

  function clearModIdeaModal(response) {
    document.getElementById('modIdeaTitle').value = '';
    global.ckEditModIdeaCont.setData('');
    document.getElementById('modIdeaFile').value = '';
    cmmUtils.clearChildNodes(document.getElementById('modIdeaFileDiv'));
    document.getElementById('modCardTitle').innerText = response['ideaTitle'];
    global.newFileArr = [];
  }

  function closeNewIdeaModal() {
    cmmUtils.closeModal('newIdeaModal');
    reloadIdeaGrid();
  }
  
  function closeModIdeaModal() {
    cmmUtils.closeModal('modIdeaModal');
    reloadIdeaGrid();
  }

  function reloadIdeaGrid() {
    ideaGrid.reload();
  }

  // 파일태그 변경 이벤트
  function addFileEventListener() {
    // 입력모달 첨부파일
    document.getElementById('newIdeaFile').addEventListener('change', function() {
      if (this.files.length) {
        const newIdeaFileDiv = document.getElementById('newIdeaFileDiv');
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const uuid = cmmUtils.getUUID();
          global.newFileArr.push({uuid: uuid, file: file});
          fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
        }
        newIdeaFileDiv.appendChild(fragment.cloneNode(true));
        this.value = ''; // 리셋
      }
    })
    // 수정모달 첨부파일
    document.getElementById('modIdeaFile').addEventListener('change', function() {
      if (this.files.length) {
        const modIdeaFileDiv = document.getElementById('modIdeaFileDiv');
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const uuid = cmmUtils.getUUID();
          global.newFileArr.push({uuid: uuid, file: file});
          fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
        }
        modIdeaFileDiv.appendChild(fragment.cloneNode(true));
        this.value = ''; // 리셋
      }
    })
  }

  function appendModIdeaFiles(response) {
    if (response['ideaFiles'] != null && response['ideaFiles'].length) {
      global.modFileArr = [];
      const modIdeaFileDiv = document.getElementById('modIdeaFileDiv');
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < response['ideaFiles'].length; i++) {
        const file = response['ideaFiles'][i];
        const uuid = cmmUtils.getUUID();
        global.modFileArr.push({uuid: uuid, fileId: file['fileId'], fileSize: file['fileSize']});
        fragment.appendChild(appendFileTag({uuid: uuid, name: file['originalFileName'], fileId: file['fileId']}, true));
      }
      modIdeaFileDiv.appendChild(fragment.cloneNode(true));
      // 아이디어 다운로드 이벤트 추가
      const ideaFileAnchors = modIdeaFileDiv.querySelectorAll('[data-anchor=ideaFile]');
      for (let i = 0; i < ideaFileAnchors.length; i++) {
        ideaFileAnchors[i].addEventListener('click', function() {
          cmmUtils.downloadFile(this.getAttribute('data-file-id'));
        })
      }
    }
  }

  function appendFileTag(data, hasLink) {
    const button = document.createElement('button');
    button.classList.add('delete');
    button.classList.add('is-small');
    button.setAttribute('onclick', 'main.removeFileTag(\'' + data.uuid + '\')');
    const span = document.createElement('span');
    span.classList.add('tag');
    span.classList.add('is-warning');
    span.classList.add('is-light');
    span.classList.add('mr-3');
    span.setAttribute('data-key', data.uuid);
    if (hasLink) {
      const a = document.createElement('a');
      a.classList.add('is-link');
      a.innerText = data.name;
      a.setAttribute('data-anchor', 'ideaFile');
      a.setAttribute('data-file-id', data['fileId']);
      span.appendChild(a);
    } else {
      span.innerText = data.name;
    }
    span.appendChild(button);
    return span;
  }

  function removeFileTag(uuid) {
    const ideaFileDiv = global['modFileArr'].length
      ? document.getElementById('modIdeaFileDiv')
      : document.getElementById('newIdeaFileDiv');
    const spanTags = ideaFileDiv.querySelectorAll('span');
    for (let i = 0; i < spanTags.length; i++) {
      const span = spanTags[i];
      if (span.getAttribute('data-key') === uuid) {
        span.remove();
      }
    }
    removeNewFileArrIdx(uuid);
    if (global['modFileArr'].length) removeModFileArrInx(uuid);
  }

  function removeNewFileArrIdx(uuid) {
    for (let i = 0; i < global.newFileArr.length; i++) {
      const obj = global.newFileArr[i];
      if (uuid === obj.uuid) {
        obj.isRemoved = true;
      }
    }
  }

  function removeModFileArrInx(uuid) {
    for (let i = 0; i < global.modFileArr.length; i++) {
      const obj = global.modFileArr[i];
      if (uuid === obj.uuid) {
        obj.isRemoved = true;
      }
    }
  }

  function saveIdea() {
    if (verifyNewIdeaForm()) {
      const formData = new FormData();
      formData.append('profileId', global.profileId);
      formData.append('ideaTitle', document.getElementById('newIdeaTitle').value);
      formData.append('ideaCont', global.ckEditNewIdeaCont.getData());
      for (let i = 0; i < global.newFileArr.length; i++) {
        const fileObj = global.newFileArr[i];
        if (fileObj.isRemoved == null || !fileObj.isRemoved) {
          formData.append('file' + i, fileObj.file);
        }
      }
      cmmUtils.postData({
        url: '/api/v1/analysis/profile/insert-idea',
        headers: {},
        isMultipartFile: true,
        body: formData,
        loading: 'btnNewIdea'
      }).then(function (response) {
        if (response === 1) {
          cmmUtils.showToast({message: '저장 되었습니다.'});
          closeNewIdeaModal();
        } else {
          cmmUtils.showWarningModal('비정상적인 저장 데이터', '아이디어가 정상적으로 저장되지 않았습니다.<br/>관리자에게 문의하세요.');
        }
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnNewIdea'));
        cmmUtils.showErrModal();
        console.log(err);
      });
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
        for (let i = 0; i < global.newFileArr.length; i++) {
          const fileObj = global.newFileArr[i];
          if (fileObj.isRemoved == null || !fileObj.isRemoved) {
            formData.append('file' + i, fileObj.file);
          }
        }
        // 기존에 저장된 파일중 제거된 파일정보를 바디에 추가
        let strArr = [];
        for (let i = 0; i < global.modFileArr.length; i++) {
          const fileObj = global.modFileArr[i];
          if (fileObj.isRemoved != null || fileObj.isRemoved) {
            strArr.push(fileObj.fileId);
          }
        }
        if (strArr.length) {
          formData.append('modifiedFileStr', strArr.join(','));
        }
        cmmUtils.postData({
          url: '/api/v1/analysis/profile/update-idea',
          headers: {},
          isMultipartFile: true,
          body: formData,
          loading: 'btnModIdea'
        }).then(function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '수정 되었습니다.'});
            closeModIdeaModal();
          } else {
            cmmUtils.showWarningModal('비정상적인 저장 데이터', '아이디어가 정상적으로 저장되지 않았습니다.<br/>관리자에게 문의하세요.');
          }
        }).catch(function (err) {
          cmmUtils.hideLoadingElement(document.getElementById('btnModIdea'));
          cmmUtils.showErrModal();
          console.log(err);
        });
      });
    }
  }

  function verifyNewIdeaForm() {
    const newIdeaTitle = document.getElementById('newIdeaTitle').value;
    const checkedFiles = cmmUtils.verifyFileSize(global.newFileArr);
    if (!newIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (!checkedFiles.status) {
      cmmUtils.showIpModal('파일', checkedFiles.msg);
      return false;
    }
    return true;
  }

  function verifyModIdeaForm() {
    const modIdeaTitle = document.getElementById('modIdeaTitle').value;
    const checkedFiles = cmmUtils.verifyFileSize(global.newFileArr, getModFileSize());
    if (!modIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (!checkedFiles.status) {
      cmmUtils.showIpModal('파일', checkedFiles.msg);
      return false;
    }
    return true;
  }

  function getModFileSize() {
    let size = 0;
    if (global.modFileArr.length) {
      for (let i = 0; i < global.modFileArr.length; i++) {
        size = size + global.modFileArr[i].fileSize;
      }
    }
    return size;
  }

  return {
    getChart: function() { return global.chart; },
    getNewFiles: function() { return global.newFileArr; },
    getModFiles: function() { return global.modFileArr; },
    init: init,
    showIdeaModal: showNewIdeaModal,
    closeNewIdeaModal: closeNewIdeaModal,
    closeModIdeaModal: closeModIdeaModal,
    removeFileTag: removeFileTag,
    saveIdea: saveIdea,
    modifyIdea: modifyIdea
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});