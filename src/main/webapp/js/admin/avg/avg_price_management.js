const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let detailGrid;
  let global = {
    selectedProfileType: 1, // 기본은 국내
    selectedQuarterDate: null,
    selectedFileName: null,
    gridData: undefined,
    fileArr: [], // uuid, fileId, fileSize, isRemoved
  }

  function init() {
    createBreadCrumb();
    addProfileTypeEventListener();
    cmmUtils.setExcelTippy(['#icoExcelDownload']);
    initGrid();
    addFileEventListener();
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
    html += '    <a href="' + CONTEXT_PATH + '/admin/latest-price-management.do">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-dollar-sign"></i></span>';
    html += '      <span>평균주가 수동 업로드</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  // 국내/해외 라디오 버튼
  function addProfileTypeEventListener() {
    const radioButtons = document.getElementsByName('profileType');
    const size = radioButtons.length;
    for (let i = 0; i < size; i++) {
      radioButtons[i].addEventListener('click', function() {
        global.selectedProfileType = parseInt(this.value);
        initGrid();
      })
    }
  }

  function initGrid(schFilter) {

    let body = schFilter != null ? schFilter : {};
    body.pageSize = 100;

    const titleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        global['selectedQuarterDate'] = row['quarterDate'];
        showDetailModal();
      })
    }

    const props = {
      url: '/api/v1/admin/avg-price/quarter',
      eId: 'dataGrid',
      fileName: '평균주가',
      body: {
        orderBy: [{column: 'quarterDate', desc: true}],
        profileType: global.selectedProfileType
      },
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'quarterDate', name: '분기', isSort: true, isExcel: true, align: 'center', isLink: true, userCustom: titleAnchor}
      ],
      success: function(data, _this) {
        global['gridData'] = data['rowData'];
      }
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }
  
  // 상세정보 모달
  function showDetailModal() {
    document.getElementById('detailTitle').innerText = global['selectedQuarterDate'];
    cmmUtils.showModal('detailModal');
    initDetailGrid();
  }

  // 상세보기 그리드
  function initDetailGrid() {
    const props = {
      url: '/api/v1/admin/avg-price/detail',
      eId: 'detailDataGrid',
      fileName: '평균주가',
      body: {
        orderBy: [{column: 'quarterDate', desc: true}],
        profileType: global['selectedProfileType'],
        quarterDate: global['selectedQuarterDate']
      },
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'quarterDate', name: '분기', isSort: true, isExcel: true, align: 'center'},
        {id: 'itemCode', name: '종목코드', isSort: true, isExcel: true, align: 'center'},
        {id: 'avgPrice', name: '평균주가', isSort: true, isExcel: true, align: 'right', isCurrency: true},
        {id: 'uptDate', name: '업로드일', isSort: true, isExcel: true, align: 'center'}
      ],
      success: function(data, _this) {
        global['gridData'] = data['rowData'];
      }
    }
    detailGrid = new COMPONENTS.DataGrid(props);
  }

  function addFileEventListener() {
    document.getElementById('uploadFile').addEventListener('change', function() {
      if (this.files.length) {
        const uploadFileDiv = document.getElementById('uploadFileDiv');
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const uuid = cmmUtils.getUUID();
          global.fileArr.push({uuid: uuid, file: file});
          fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
        }
        uploadFileDiv.appendChild(fragment.cloneNode(true));
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
    const fileDiv = document.getElementById('uploadFileDiv');
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

  function findStockItem(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  function reloadGrid() {
    const key = document.getElementById('selSearch').value === '1'
      ? global.selectedProfileType === 1 ? 'symbol' : 'itemCode'
      : document.getElementById('selSearch').value;
    const props = {};
    props[key] = document.getElementById('inputSearch').value;
    initGrid(props);
  }

  function downloadExcel() {
    dataGrid.downloadExcel();
  }

  function showUploadModal() {
    resetUploadModal();
    cmmUtils.showModal('uploadModal');
  }

  function hideUploadModal() {
    cmmUtils.closeModal('uploadModal');
    dataGrid.reload();
  }

  function resetUploadModal() {
    document.getElementById('uploadFile').value = '';
    cmmUtils.clearChildNodes(document.getElementById('uploadFileDiv'));
    global.fileArr = [];
  }

  function uploadData() {
    if (verifyUploadForm()) {
      const msg = '업로드를 시작합니다. 동일한 날짜가 기존에 있다면 새롭게 저장됩니다.';
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        const formData = new FormData();
        formData.append('profileType', cmmUtils.getCheckedValues('uploadType')[0]);
        for (let i = 0; i < global.fileArr.length; i++) {
          const fileObj = global.fileArr[i];
          if (fileObj.isRemoved == null || !fileObj.isRemoved) {
            formData.append('file' + i, fileObj.file);
          }
        }

        cmmUtils.axiosPost({
          url: '/api/v1/admin/avg-price/upload',
          body: formData,
          isPageLoader: true
        }, function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '업로드 되었습니다.'});
            resetUploadModal();
          } else {
            console.log(response);
            cmmUtils.goToErrorPage(response);
          }
        });
      });
    }
  }

  function verifyUploadForm() {
    let uploadSize = 0;
    for (let i = 0; i < global.fileArr.length; i++) {
      const fileObj = global.fileArr[i];
      if (fileObj.isRemoved == null || !fileObj.isRemoved) {
        uploadSize++;
        const fileName = fileObj.file.name;
        if (!cmmUtils.checkExcelExtension(fileName)) {
          cmmUtils.showIpModal('파일 확장자', fileName + '파일의 확장자를 확인해주세요(.xlsx 확장자만 업로드 가능합니다).');
          return false;
        }
        if (!cmmUtils.checkQuarterExcelFilePattern(fileName)) {
          cmmUtils.showIpModal('파일명', fileName + '파일은 업로드 파일 형식이 아닙니다.(예시: 2020-[1~4].xlsx');
          return false;
        }
      }
    }
    if (!uploadSize) {
      cmmUtils.showIpModal('파일', '파일을 선택해주세요.');
      return false;
    }
    return true;
  }

  // 해외 종목코드 동기화
  function syncSymbols() {
    cmmConfirm.show({msg: '동기화를 진행 하시겠습니까?', color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/admin/stock/sync-symbols',
        loading: 'btnSyncSymbol'
      }, function (response) {
        cmmUtils.showToast(response ? {message: '동기화 성공'} : {message: '동기화 실패', type: 'is-danger is-light'});
      });
    });
  }

  return {
    test: function() {
      return global.selectedProfileType;
    },
    init: init,
    findStockItem: findStockItem,
    downloadExcel: downloadExcel,
    showUploadModal: showUploadModal,
    syncSymbols: syncSymbols,
    hideUploadModal: hideUploadModal,
    uploadData: uploadData,
    removeFileTag: removeFileTag,
    reloadGrid: reloadGrid
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  // document.getElementById('inputSearch').addEventListener('keyup', main.findStockItem);
});