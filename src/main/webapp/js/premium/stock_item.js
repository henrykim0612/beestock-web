const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedSchDate: null
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
    html += '    <a href="' + CONTEXT_PATH + '/premium/stock-item">';
    html += '      <span class="icon is-small"><i class="fas fa-puzzle-piece" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock 프리미엄</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
    html += '      <span>종목코드 현황</span>';
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
    const element = document.querySelector('#schRegDate');
    if (element) {
      element.bulmaCalendar.on('select', function(datepicker) {
        const value = datepicker.data.value();
        if (global['selectedSchDate'] !== value) {
          global['selectedSchDate'] = value;
          reloadGrid();
        }
      });
    }
  }

  function initGrid() {

    const props = {
      url: '/api/v1/stock/paging-stock-item-list',
      eId: 'dataGrid',
      pId: 'dataPagination',
      body: {
        pageSize: 3000
      },
      fileName: '종목코드 리스트',
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'rowNum', name: 'no', isSort: true, align: 'center'},
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
    props[key] = this.value;
    props['regDate'] = global['selectedSchDate'];
    dataGrid.reload(props);
  }

  function downloadExcel() {
    dataGrid.downloadExcel();
  }

  return {
    init: init,
    findStockItem: findStockItem,
    downloadExcel: downloadExcel
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findStockItem)
});