const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let __grid = undefined;

  function init() {
    createBreadCrumb();
    focusSchWord();
    initGrid();
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

  function initGrid() {

    let body = {orderBy: [{column: 'readDate', desc: true}]};
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
        {id: 'loginId', name: '아이디', isSort: true, align: 'left'},
        {id: 'userNm', name: '이름', isSort: true, align: 'left'},
        {id: 'profileTitle', name: '포트폴리오명', isSort: true, align: 'left'},
        {id: 'readDate', name: '포트 열람일', isSort: true, align: 'center'}
      ]
    }
    __grid = new COMPONENTS.DataGrid(props);
  }

  function focusSchWord() {
    document.getElementById('inputSearch').focus();
  }


  return {
    init: init
  }
}());

document.addEventListener('DOMContentLoaded', function() {
  main.init();
});
