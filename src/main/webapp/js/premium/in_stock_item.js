const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedSchDate: null,
    selectedFileName: null
  }

  function init() {
    createBreadCrumb();
    cmmUtils.initCalendar();
    setDefaultDate();
    addSchDateEvent();
    cmmUtils.setExcelTippy(['#icoExcelDownload']);
    initGrid();
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
        regDate: cmmUtils.getCalendarValue('schRegDate')
      },
      fileName: '종목코드 리스트',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'NO', isSort: true, align: 'center', isStrong: true},
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

  function findStockItem(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  function reloadGrid() {
    const key = document.getElementById('selSearch').value;
    const props = {};
    props[key] = document.getElementById('inputSearch').value;
    props['regDate'] = global['selectedSchDate'];
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
    document.getElementById('spanFileName').innerText = '';
    document.getElementById('stockItemFile').value = '';
  }

  function uploadStockItem() {
    const fileName = global['selectedFileName'];
    if (verifyUploadForm()) {
      if (cmmUtils.checkExcelExtension(fileName)) {
        const msg = '업로드를 시작합니다. 오늘 업로드한 이전 데이터는 삭제 됩니다.'
        cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {

          const formData = new FormData();
          formData.append('file', document.getElementById('stockItemFile').files[0]);

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
              cmmUtils.showWarningModal('비정상적인 저장 데이터', '엑셀에 들어있는 행과 저장된 행이 일치하지 않았습니다.<br/>관리자에게 문의하세요.');
            }
          }).catch(function (err) {
            cmmUtils.showErrModal();
            console.log(err);
          });
        });
      } else {
        cmmUtils.showIpModal('파일 확장자', '엑셀 형식(.xlsx) 파일 형식만 가능합니다.');
      }
    }
  }

  function changeFileInput(fis) {
    const str = fis.value;
    const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
    global['selectedFileName'] = fileName
    document.getElementById('spanFileName').innerText = fileName;
  }

  function verifyUploadForm() {
    const spanFileName = document.getElementById('spanFileName').innerText;
    if (!spanFileName) {
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
    changeFileInput: changeFileInput,
    reloadGrid: reloadGrid
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findStockItem);
});