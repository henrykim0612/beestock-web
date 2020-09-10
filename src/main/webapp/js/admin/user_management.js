const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;

  function init() {
    const props = {
      url: '/api/v1/admin/user-list',
      body: {
        // orderBy: [{column: 'loginId'}, {column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      isThead: true,
      isTfoot: true,
      colModel: [
        {id: 'rowNum', name: 'No'},
        {id: 'loginId', name: '이메일', isSort: true},
        {id: 'userNm', name: '사용자/닉네임', isSort: true},
        {id: 'userPhone', name: '연락처'},
        {id: 'regDate', name: '회원가입 일자'},
        {id: 'uptDate', name: '수정일자', isSort: true}
      ]
    }
    const props2 = {
      url: '/api/v1/admin/user-list',
      body: {
        // orderBy: [{column: 'loginId'}, {column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid2',
      pId: 'dataPagination2',
      isThead: true,
      isTfoot: true,
      colModel: [
        {id: 'rowNum', name: 'No'},
        {id: 'loginId', name: '이메일', isSort: true},
        {id: 'userNm', name: '사용자/닉네임', isSort: true},
        {id: 'userPhone', name: '연락처'},
        {id: 'regDate', name: '회원가입 일자'},
        {id: 'uptDate', name: '수정일자', isSort: true}
      ]
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function getDataGrid() {
    return dataGrid;
  }

  return {
    init: init,
    getDataGrid: getDataGrid
  }
}());

document.addEventListener("DOMContentLoaded", function() {
   main.init();

  tippy('#icoExcelDownload', {
    content: 'Excel Download',
    placement: 'bottom'
  });

});