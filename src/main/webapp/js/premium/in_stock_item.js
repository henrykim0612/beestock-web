const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedSchDate: null,
    selectedFileName: null,
    fileArr: [], // uuid, fileId, fileSize, isRemoved
  }

  function init() {
    createBreadCrumb();
    cmmUtils.initCalendar();
    setDefaultDate();
    addSchDateEvent();
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
    html += '    <a href="' + CONTEXT_PATH + '/premium/in-stock-item">';
    html += '      <span class="icon is-small"><i class="fas fa-search-dollar" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock 프리미엄</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-dollar-sign"></i></span>';
    html += '      <span>국내 종목코드 현황</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function setDefaultDate() {
    const today = cmmUtils.getToday();
    global['selectedSchDate'] = today;
    cmmUtils.setCalendarValue('schRegDate', today); // 오늘날짜로 기본 세팅
  }

  function addSchDateEvent() {
    const element = document.getElementById('schRegDate');
    if (element) {
      element.bulmaCalendar.on('select', function(datepicker) {
        const value = datepicker.data.value();
        if (global['selectedSchDate'] !== value) {
          global['selectedSchDate'] = value;
          // reloadGrid();
        }
      });
    }
  }

  function initGrid() {

    const props = {
      url: '/api/v1/premium/stock/paging-in-stock-item-list',
      eId: 'dataGrid',
      pId: 'dataPagination',
      body: {
        pageSize: 100,
        itemDate: cmmUtils.getCalendarValue('schRegDate')
      },
      fileName: '종목코드 리스트',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'NO', isSort: true, align: 'center', isStrong: true},
        {id: 'itemDate', name: '날짜', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'itemCode', name: '종목코드', isSort: true, width: '150px', isExcel: true, align: 'center'},
        {id: 'itemName', name: '종목명', isSort: true, width: '200px', isExcel: true, align: 'left'},
        {id: 'currPrice', name: '현재가', isSort: true, width: '180px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'contrast', name: '대비', isSort: true, width: '180px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'fluctRate', name: '등락률', isSort: true, width: '100px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'transVol', name: '거래량', isSort: true, width: '180px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'transAmount', name: '거래대금', isSort: true, width: '250px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'marketPrice', name: '시가', isSort: true, width: '180px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'highPrice', name: '고가', isSort: true, width: '180px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'lowPrice', name: '저가', isSort: true, width: '180px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'marketCap', name: '시가총액', isSort: true, width: '250px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'marketCapWeight', name: '시가총액비중(%)', isSort: true, width: '150px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'stockNumber', name: '상장주식수', isSort: true, width: '200px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'stockNumberFr', name: '외국인 보유주식수', isSort: true, width: '200px', isExcel: true, align: 'center', isCurrency: true},
        {id: 'frRatio', name: '외국인 지분율(%)', isSort: true, width: '150px', isExcel: true, align: 'center', isCurrency: true}
      ]
    }
    dataGrid = new COMPONENTS.DataGrid(props);
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
    const key = document.getElementById('selSearch').value;
    const props = {};
    props[key] = document.getElementById('inputSearch').value;
    props['itemDate'] = global['selectedSchDate'];
    dataGrid.reload(props);
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
          url: '/api/v1/premium/stock/upload-in-stock-item',
          headers: {},
          isMultipartFile: true,
          body: formData,
          isPageLoader: true
        }).then(function (response) {
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
    getGlobal: function() { return global; },
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