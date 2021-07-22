const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let profileGrid;
  let quarterGrid;
  let quarterInfoGrid;
  let global = {
    selectedProfileId: null,
    selectedProfileTitle: null,
    selectedRowId: null,
    selectedQuarterId: null,
    selectedQuarterDate: null,
    selectedSelType: null,
    selectedFileName: null,
    fileArr: [], // uuid, fileId, fileSize, isRemoved
  }

  function init() {
    createBreadCrumb();
    initGrid();
    initExcelTooltips();
    addFileEventListener();
  }

  function initExcelTooltips() {
    cmmUtils.setExcelTippy(['#icoProfileExcelDownload']);
    cmmUtils.setExcelTippy(['#icoQiExcelDownload']);
  }

  function createBreadCrumb() {
    const breadCrumbNav = document.getElementById('breadCrumbNav');
    let html = '';
    html += '<ul>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard.do">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BEESTOCK</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/admin/quarter-management.do">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-database"></i></span>';
    html += '      <span>포트폴리오 분기 수동 업로드</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initGrid() {

    const customProfileType = function(col, row) {
      // 1: 국내, 2: 해외
      return row['profileType'] === 1 ? '<span class="tag is-success is-light">국내</span>' : '<span class="tag is-warning is-light">해외</span>';
    }

    const titleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        global['selectedProfileId'] = row['profileId'];
        showUploadModal();
      })
    }

    const props = {
      url: '/api/v1/admin/profile/paging-profile-list',
      body: {
        pageSize: 20
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      fileName: '포트폴리오 리스트',
      isThead: true,
      isTfoot: false,
      isSelectable: true,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, align: 'center', isStrong: true},
        {id: 'profileId', isHidden: true, attributes: {title: 'profileTitle'}},
        {id: 'profileTitle', name: '포트폴리오명', isSort: true, isExcel: true, width: '350px', isLink: true, userCustom: titleAnchor},
        {id: 'profileType', name: '타입', isSort: true, align: 'center', isExcel: true, type: 'custom', userCustom: customProfileType, width: '50px'},
        {id: 'regDate', name: '등록일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'uptDate', name: '수정일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'uptLoginId', name: '수정자', isSort: true, align: 'center', width: '250px', isExcel: true}
      ],
      success: function(data, _this) {
        addSelectedRows(data, _this);
      }
    }
    profileGrid = new COMPONENTS.DataGrid(props);
  }

  // Table row event
  function addSelectedRows(data, _this) {
    const eId = _this.props.eId;
    const tbody = document.getElementById(eId).querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const createClickHandler = function(row) {
        return function() {
          const hiddenCell = row.getElementsByTagName("td")[0];
          const selectedRowId = hiddenCell.getAttribute('data-key');
          const selectedProfileTitle = hiddenCell.getAttribute('data-title');
          global['selectedRowId'] = selectedRowId;
          global['selectedProfileTitle'] = selectedProfileTitle;
          initQuarterGrid(selectedRowId);
        };
      };
      row.onclick = createClickHandler(row);
    }
  }

  function initQuarterGrid(rowId) {

    const titleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        global['selectedQuarterId'] = row['quarterId'];
        global['selectedQuarterDate'] = row['quarterDate'];
        showQuarterInfoModal();
      })
    }

    const props = {
      url: '/api/v1/admin/quarter/paging-quarter-list',
      eId: 'quarterGrid',
      pId: 'quarterPagination',
      body: {
        orderBy: [{column: 'quarterDate', desc: true}],
        profileId: rowId,
        pageSize: 20
      },
      fileName: '포트폴리오 분기 리스트',
      isThead: true,
      isTfoot: false,
      emptyRowMsg: '등록된 분기 정보가 없습니다.',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, align: 'center', isStrong: true},
        {id: 'quarterDate', name: '분기', isSort: true, align: 'center', isLink: true, userCustom: titleAnchor},
        {id: 'regDate', name: '등록일', isSort: true, align: 'center'},
        {id: 'regLoginId', name: '등록자', isSort: true, align: 'center'}
      ]
    }
    quarterGrid = new COMPONENTS.DataGrid(props);
  }

  // 분기 상세 데이터 그리드
  function initQuarterInfoGrid() {
    const props = {
      url: '/api/v1/admin/quarter/quarter-info-list',
      eId: 'quarterInfoGrid',
      body: {quarterId: global['selectedQuarterId']},
      fileName: '포트폴리오 분기 상세정보',
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'itemCode', name: '종목코드', isSort: true, align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', isSort: true, align: 'left', isExcel: true},
        {id: 'quantity', name: '수량', isSort: true, align: 'center', isCurrency: true, isExcel: true},
        {id: 'acqPrice', name: '취득가액', isSort: true, align: 'center', isCurrency: true, isExcel: true},
        {id: 'marketPrice', name: '시가평가액', isSort: true, align: 'center', isCurrency: true, isExcel: true}
      ]
    }
    quarterInfoGrid = new COMPONENTS.DataGrid(props);
  }

  function goToProfileForm() {
    cmmUtils.goToPage('/admin/profile-form')
  }

  function showUploadModal() {
    cmmUtils.showModal('uploadModal');
    resetUploadModal();
  }

  function showQuarterInfoModal() {
    document.getElementById('qiTitle').innerText = global['selectedProfileTitle'] + ' ' + global['selectedQuarterDate'];
    cmmUtils.showModal('quarterInfoModal');
    initQuarterInfoGrid();
  }

  function resetUploadModal() {
    document.getElementById('quarterFile').value = '';
    cmmUtils.clearChildNodes(document.getElementById('quarterFileDiv'));
    global.fileArr = [];
  }

  function hideUploadModal() {
    cmmUtils.closeModal('uploadModal');
    quarterGrid.reload();
  }

  function changeSelType(_this) {
    global['selectedSelType'] = _this.value;
    // reloadGrid();
  }

  function reloadGrid() {
    const props = {};
    const key = document.getElementById('selSearch').value;
    props[key] = document.getElementById('inputSearch').value;
    props['profileType'] = global['selectedSelType'];
    profileGrid.reload(props);
  }

  function findProfile(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  function addFileEventListener() {
    document.getElementById('quarterFile').addEventListener('change', function() {
      if (this.files.length) {
        const quarterFileDiv = document.getElementById('quarterFileDiv');
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const uuid = cmmUtils.getUUID();
          global.fileArr.push({uuid: uuid, file: file});
          fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
        }
        quarterFileDiv.appendChild(fragment.cloneNode(true));
      }
    })
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
    const fileDiv = document.getElementById('quarterFileDiv');
    const spanTags = fileDiv.querySelectorAll('span');
    for (let i = 0; i < spanTags.length; i++) {
      const span = spanTags[i];
      if (span.getAttribute('data-key') === uuid) {
        span.remove();
      }
    }
    removeFileArrIdx(uuid);
  }

  function removeFileArrIdx(uuid) {
    for (let i = 0; i < global.fileArr.length; i++) {
      const obj = global.fileArr[i];
      if (uuid === obj.uuid) {
        obj.isRemoved = true;
      }
    }
  }

  function uploadQuarter() {
    if (verifyUploadForm()) {
      const msg = '업로드를 시작합니다. 동일한 분기가 있다면 새롭게 저장됩니다.'
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        const formData = new FormData();
        formData.append('profileId', global['selectedProfileId']);
        for (let i = 0; i < global.fileArr.length; i++) {
          const fileObj = global.fileArr[i];
          if (fileObj.isRemoved == null || !fileObj.isRemoved) {
            formData.append('file' + i, fileObj.file);
          }
        }
        cmmUtils.axiosPost({
          url: '/api/v1/admin/quarter/upload-quarter',
          body: formData,
          isPageLoader: true
        }, function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '업로드 되었습니다.'});
            resetUploadModal();
          } else {
            cmmUtils.goToErrorPage(response);
          }
        });
      });
    }
  }

  function verifyUploadForm() {
    if (!global.fileArr.length) {
      cmmUtils.showIpModal('파일', '파일을 선택해주세요.');
      return false;
    }
    for (let i = 0; i < global.fileArr.length; i++) {
      const fileObj = global.fileArr[i];
      if (fileObj.isRemoved == null || !fileObj.isRemoved) {
        const fileName = fileObj.file.name;
        if (!cmmUtils.checkQuarterExcelFilePattern(fileName)) {
          cmmUtils.showIpModal('파일명', fileName + '파일은 업로드 파일 형식이 아닙니다.(예시: 2020-[1~4].xlsx');
          return false;
        }
      }
    }
    return true;
  }

  function downloadProfileExcel() {
    profileGrid.downloadExcel();
  }

  function downloadQuarterInfoExcel() {
    quarterInfoGrid.downloadExcel();
  }

  // 분기 삭제
  function removeQuarterInfo() {
    cmmConfirm.show({msg: '해당 분기를 제거하시겠습니까?', color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/admin/quarter/delete-quarter',
        body: {quarterId: global['selectedQuarterId']},
        loading: 'btnRm'
      }, function (response) {
        if (0 < response) {
          cmmUtils.closeModal('quarterInfoModal');
          initQuarterGrid(global['selectedRowId']);
          cmmUtils.showToast({message: '삭제되었습니다.'});
        }
      });
    })
  }

  return {
    init: init,
    goToProfileForm: goToProfileForm,
    changeSelType: changeSelType,
    findProfile: findProfile,
    reloadGrid: reloadGrid,
    uploadQuarter: uploadQuarter,
    downloadProfileExcel: downloadProfileExcel,
    downloadQuarterInfoExcel: downloadQuarterInfoExcel,
    removeFileTag: removeFileTag,
    hideUploadModal: hideUploadModal,
    removeQuarterInfo: removeQuarterInfo
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findProfile);
});