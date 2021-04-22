const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let __grid = undefined;

  function init() {
    createBreadCrumb();
    focusSchWord();
    initGrid();
    addKeyupEvents();
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
    html += '    <a href="' + CONTEXT_PATH + '/admin/user-management.do">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-user-secret"></i></span>';
    html += '      <span>사용자 로그분석</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function addKeyupEvents() {
    document.getElementById('inputSearch').addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        initGrid();
      }
    })
  }


  const customProfileType = function(col, row) {
    // 1: 국내, 2: 해외
    return row['profileType'] === 1 ? '<span class="tag is-success is-light">국내</span>' : '<span class="tag is-warning is-light">해외</span>';
  }


  function initGrid() {

    let body = {
      orderBy: [{column: 'readDate', desc: true}],
      pageSize: 30
    };
    body[document.getElementById('schType').value] = document.getElementById('inputSearch').value;

    const props = {
      url: '/api/v1/admin/page/userlog',
      body: body,
      eId: 'logGrid',
      pId: 'logGridPager',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: true,
      colModel: [
        {id: 'rowNum', name: 'No', align: 'center'},
        {id: 'loginId', name: '아이디', isSort: true, align: 'center', width: '200px'},
        {id: 'userNm', name: '이름', isSort: true, align: 'center', width: '100px'},
        {id: 'profileType', name: '타입', isSort: true, align: 'center', type: 'custom', userCustom: customProfileType, width: '80px'},
        {id: 'profileTitle', name: '포트폴리오명', isSort: true, align: 'left', width: '280px'},
        {id: 'readDate', name: '포트 열람일', isSort: true, align: 'center', width: '200px'}
      ]
    }
    __grid = new COMPONENTS.DataGrid(props);
  }

  function focusSchWord() {
    document.getElementById('inputSearch').focus();
  }


  return {
    init: init,
    initGrid: initGrid
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
});
