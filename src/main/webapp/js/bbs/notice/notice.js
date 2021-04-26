const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let global = {
    selectedNoticeId: null
  }
  let dataGrid;

  function init() {
    createBreadCrumb();
    initGrid();
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
    html += '    <a href="' + CONTEXT_PATH + '/bbs/notice.do">';
    html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
    html += '      <span>고객지원</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-bullhorn"></i></span>';
    html += '      <span>공지사항</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initGrid() {

    const pinned = function(col, row) {
      return row['ckPinnedNotice'] === 1
        ? '<span class="icon has-text-primary"><i class="fas fa-thumbtack"></i></span>'
        : '<span class="icon"><i class="fas fa-bell"></i></span>';
    }

    const dday = function(col, row) {
      if (row['dday'] === 99999) {
        return '<span class="tag is-success is-light">공지중</span>';
      } else {
        return 0 < row['dday']
          ? '<span class="tag is-danger is-light">D-' + row['dday'] + '</span>'
          : '<span class="tag is-danger is-light">기간만료</span>';
      }
    }

    const titleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        global['selectedNoticeId'] = row['noticeId'];
        goToDetails();
      })
    }

    // Guest 는 New 뱃지를 보여주지 않음
    const colModel = document.getElementById('loginId')
      ? [
        {id: 'rowNum', name: 'No', isSort: true, isStrong: true, align: 'center'},
        {name: '', type: 'custom', userCustom: pinned, width: '50px', align: 'center'},
        {name:'', type: 'custom', userCustom: dday, width: '50px', align: 'center'},
        {id: 'noticeTitle', name: '제목', isSort: true, isLink: true, userCustom: titleAnchor, hasBadge: 'isRead', hasBadgeText: 'New'},
        {id: 'regDate', name: '게시일',isSort: true, width: '120px', align: 'center'}
      ]
      : [
        {id: 'rowNum', name: 'No', isSort: true, isStrong: true, align: 'center'},
        {name: '', type: 'custom', userCustom: pinned, width: '50px', align: 'center'},
        {name:'', type: 'custom', userCustom: dday, width: '50px', align: 'center'},
        {id: 'noticeTitle', name: '제목', isSort: true, isLink: true, userCustom: titleAnchor},
        {id: 'regDate', name: '게시일',isSort: true, width: '120px', align: 'center'}
      ];

    const props = {
      url: '/api/v1/bbs/paging-notice-list',
      body: {
        orderBy: [{column: 'regDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: colModel
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  // 상세보기 화면으로 이동
  function goToDetails() {
    const url = '/bbs/notice/' + global['selectedNoticeId'];
    cmmUtils.goToPage(url);
  }

  function goToNoticeForm() {
    cmmUtils.goToPage('/bbs/notice-form')
  }

  function findNotice(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  function reloadGrid() {
    const key = document.getElementById('selSearch').value;
    const props = {};
    props[key] = document.getElementById('inputSearch').value;
    dataGrid.reload(props);
  }

  return {
    init: init,
    findNotice: findNotice,
    reloadGrid: reloadGrid,
    goToNoticeForm: goToNoticeForm
  }

}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findNotice);
});