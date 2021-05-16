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
    html += '      <span class="icon is-small"><i class="fas fa-paper-plane"></i></span>';
    html += '      <span>피드백 확인</span>';
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

  function initGrid() {

    let body = {
      orderBy: [{column: 'regDate', desc: true}],
      pageSize: 30
    };
    body[document.getElementById('schType').value] = document.getElementById('inputSearch').value;

    const customFeedbackCont = function(col, row, thOrTd, props) {
      const div = document.createElement('div');
      div.classList.add('flex-row');
      const anchor = document.createElement('a');
      anchor.innerText = cmmUtils.convertDotText(row['feedbackCont'], 20);
      anchor.addEventListener('click', function() {
        showContent(row['feedbackCont']);
      });
      div.appendChild(anchor);
      return div;
    }

    const props = {
      url: '/api/v1/feedback/list',
      body: body,
      eId: 'feedbackGrid',
      pId: 'feedbackGridPager',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: true,
      colModel: [
        {id: 'rowNum', name: 'No', align: 'center'},
        {id: 'regLoginId', name: '아이디', isSort: true, align: 'center', width: '200px'},
        {id: 'userNm', name: '이름', isSort: true, align: 'center', width: '100px'},
        {id: 'regDate', name: '전송일', isSort: true, align: 'center', width: '100px'},
        {id: 'feedbackTypeName', name: '피드백 타입', align: 'center', width: '100px'},
        {id: 'feedbackCont', name: '내용', type: 'node', userCustom: customFeedbackCont, align: 'left', width: '400px'}
      ]
    }
    __grid = new COMPONENTS.DataGrid(props);
  }

  function showContent(text) {
    document.getElementById('contDetail').value = text;
    cmmUtils.showModal('contDetailModal');
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
