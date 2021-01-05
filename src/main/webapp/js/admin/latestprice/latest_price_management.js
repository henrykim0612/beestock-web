const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedProfileType: 1, // 기본은 국내
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
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/admin/latest-price-management">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-dollar-sign"></i></span>';
    html += '      <span>Daily 주가 수동 업로드</span>';
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

    // 코드 트리뷰
    const quickView = function(anchor, col, row) {
      anchor.setAttribute('data-show', 'quickview');
      anchor.setAttribute('data-target', 'itemCodeQuickView');
      anchor.setAttribute('data-target', 'itemCodeQuickView');
      const key = global.selectedProfileType === 1 ? 'itemCode' : 'symbol';
      // 종목명 퀵뷰
      anchor.addEventListener('click', function() {
        const len = global['gridData'].length;
        for (let i = 0; i < len; i++) {
          const row = global['gridData'][i];
          if (row[key] === row[key]) {
            setQuickViewTitle(row);
            appendQuickViewContent(row);
          }
        }
      })
    }

    const colModel = global.selectedProfileType === 1
      ? [
        {id: 'rowNum', name: 'NO', isSort: true, align: 'center', isStrong: true},
        {id: 'itemCode', name: '종목코드', isSort: true, isExcel: true, align: 'center'},
        {id: 'currPrice', name: '현재가', isSort: true, isExcel: true, align: 'center', isCurrency: true}
      ]
      : [
        {id: 'rowNum', name: 'NO', isSort: true, align: 'center', isStrong: true},
        {id: 'symbol', name: '종목코드', isSort: true, isExcel: true, align: 'center'},
        {id: 'latestPrice', name: '현재가', isSort: true, isExcel: true, align: 'center', isCurrency: true}
      ];

    let body = schFilter != null ? schFilter : {};
    body.pageSize = 100;

    const props = {
      url: global.selectedProfileType === 1 ? '/api/v1/admin/stock/paging-in-stock-item-list' : '/api/v1/admin/stock/paging-out-stock-item-list',
      eId: 'dataGrid',
      pId: 'dataPagination',
      body: body,
      fileName: '종목코드 리스트',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: colModel,
      success: function(data, _this) {
        initQuickView();
        global['gridData'] = data['rowData'];
      }
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function initQuickView() {
    bulmaQuickview.attach(); // quickviews now contains an array of all Quickview instances
  }

  // 퀵뷰 타이틀 세팅
  function setQuickViewTitle(row) {
    document.getElementById('qViewTitle').innerText = row['itemName'];
  }

  // 퀵뷰 상세정보 생성
  function appendQuickViewContent(row) {
    // const entries = global.selectedProfileType === 1
    //   ? [
    //     {id: 'itemCode', name: '종목코드'},
    //     {id: 'itemName', name: '종목명'},
    //     {id: 'currPrice', name: '현재가', isCurrency: true}
    //   ] : [
    //     {id: 'symbol', name: '종목코드'},
    //     {id: 'itemName', name: '종목명'},
    //     {id: 'latestPrice', name: '현재가', isCurrency: true}
    //   ]
    // const len = entries.length;
    // const fragment = document.createDocumentFragment();
    // for (let i = 0; i < len; i++) {
    //   const entry = entries[i];
    //   const value = entry.isCurrency != null ? row[entry.id].toLocaleString() : row[entry.id];
    //   const p = document.createElement('p');
    //   p.classList.add('mb-4')
    //   p.innerText = entry.name + ' : ' + value;
    //   fragment.appendChild(p);
    // }
    // const cont = document.getElementById('qViewContent');
    // cmmUtils.clearChildNodes(cont);
    // cont.appendChild(fragment.cloneNode(true));
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
    if (global.selectedProfileType === 1) { // 국내
      resetUploadModal();
      cmmUtils.showModal('uploadModal');
    } else {
      cmmUtils.showWarningModal('구현 준비중', '미완성 상태입니다.');
    }

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

  function uploadStockItem() {
    if (verifyUploadForm()) {
      const msg = '업로드를 시작합니다. 동일한 날짜가 기존에 있다면 새롭게 저장됩니다.';
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        const formData = new FormData();
        for (let i = 0; i < global.fileArr.length; i++) {
          const fileObj = global.fileArr[i];
          if (fileObj.isRemoved == null || !fileObj.isRemoved) {
            formData.append('file' + i, fileObj.file);
          }
        }
        cmmUtils.postData({
          url: '/api/v1/admin/stock/upload-in-stock-item',
          headers: {},
          isMultipartFile: true,
          body: formData,
          isPageLoader: true
        }).then(function (response) {
          cmmUtils.verifyResponse(response);
          if (response === 1) {
            cmmUtils.showToast({message: '업로드 되었습니다.'});
            resetUploadModal();
          } else {
            console.log(response);
            cmmUtils.goToErrorPage(response);
          }
        }).catch(function (err) {
          cmmUtils.goToErrorPage(err);
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
        if (!cmmUtils.checkYYYYMMDDPattern(fileName.split('.')[0])) {
          cmmUtils.showIpModal('파일명', fileName + '파일명을 확인해주세요.');
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

  return {
    test: function() {
      return global.selectedProfileType;
    },
    init: init,
    findStockItem: findStockItem,
    downloadExcel: downloadExcel,
    showUploadModal: showUploadModal,
    hideUploadModal: hideUploadModal,
    uploadStockItem: uploadStockItem,
    removeFileTag: removeFileTag,
    reloadGrid: reloadGrid
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findStockItem);
});