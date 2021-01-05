const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedProfileId: null,
    selectedSelType: null
  }

  function init() {
    createBreadCrumb();
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
    html += '    <a href="' + CONTEXT_PATH + '/admin/code-management">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-address-card"></i></span>';
    html += '      <span>포트폴리오 관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initGrid() {

    const customProfileType = function(col, row) {
      // 1: 국내, 2: 해외
      return row['profileType'] === 1 ? '<span class="tag is-success is-light">국내</span>' : '<span class="tag is-warning is-light">해외</span>';
    }

    const titleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        global['selectedProfileId'] = row['profileId'];
        goToDetails();
      })
    }

    const props = {
      url: '/api/v1/admin/profile/paging-profile-list',
      eId: 'dataGrid',
      pId: 'dataPagination',
      body: {
        orderBy: [{column: 'uptDate', desc: true}],
      },
      fileName: '포트폴리오 리스트',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, align: 'center', isStrong: true},
        {id: 'profileTitle', name: '포트폴리오명', isSort: true, isExcel: true, width: '250px', isLink: true, userCustom: titleAnchor},
        {id: 'profileSubtitle', name: '보조명', isSort: true, isExcel: true, width: '250px'},
        {id: 'profileType', name: '타입', isSort: true, align: 'center', isExcel: true, type: 'custom', userCustom: customProfileType, width: '50px'},
        {id: 'regDate', name: '등록일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'regLoginId', name: '등록자', isSort: true, align: 'center', width: '250px', isExcel: true},
        {id: 'uptDate', name: '수정일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'uptLoginId', name: '수정자', isSort: true, align: 'center', width: '250px', isExcel: true}
      ]
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function goToProfileForm() {
    cmmUtils.goToPage('/admin/profile-form')
  }

  function goToDetails() {
    const url = '/admin/profile-details/' + global['selectedProfileId'];
    cmmUtils.goToPage(url);
  }

  function changeSelType(_this) {
    global['selectedSelType'] = _this.value;
    // reloadGrid();
  }

  function reloadGrid() {
    const props = {};
    const key = document.getElementById('selSearch').value;
    props[key] = document.getElementById('inputSearch').value;
    props['profileType'] = global['selectedSelType'];
    dataGrid.reload(props);
  }

  function findProfile(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  return {
    init: init,
    goToProfileForm: goToProfileForm,
    changeSelType: changeSelType,
    findProfile: findProfile,
    reloadGrid: reloadGrid
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findProfile);
});