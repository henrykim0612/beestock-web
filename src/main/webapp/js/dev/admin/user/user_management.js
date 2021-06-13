const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedLoginId: ''
  }

  function init() {
    createBreadCrumb();
    cmmUtils.initCalendar();
    cmmUtils.setExcelTippy(['#icoExcelDownload']);
    initGrid()
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
    html += '      <span class="icon is-small"><i class="fas fa-cog"></i></span>';
    html += '      <span>사용자관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initGrid() {
    const customRoleNm = function(col, row) {
      const roleNm = row['roleNm'];
      let innerHtml = '';
      switch (roleNm) {
        case 'ROLE_ADMIN':
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-black cursor">관리자</span>';
          break;
        case 'ROLE_PREMIUM_PLUS':
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-danger cursor">프리미엄 플러스 사용자</span>';
          break;
        case 'ROLE_PREMIUM':
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-warning cursor">프리미엄 사용자</span>';
          break;
        case 'ROLE_STANDARD':
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-info cursor">스탠다드 사용자</span>';
          break;
        default:
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-primary cursor">일반사용자</span>';
          break;
      }
      return innerHtml;
    }

    const props = {
      url: '/api/v1/admin/paging-user-list',
      body: {
        orderBy: [{column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      fileName: '사용자리스트',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, isStrong: true, align: 'center'},
        {id: 'loginId', name: '아이디', isSort: true, isExcel: true, align: 'left'},
        {id: 'userNm', name: '이름', isSort: true, isExcel: true, align: 'center'},
        {id: 'userPhone', name: '연락처', isExcel: true, align: 'center'},
        {id: 'regDate', name: '회원가입 일자', isSort: true, isExcel: true, align: 'center'},
        {id: 'uptDate', name: '수정일자', isSort: true, isExcel: true, align: 'center'},
        {id: 'uptLoginId', name: '수정자', isSort: true, isExcel: true, align: 'center'},
        {id: 'expDate', name: '만료일', isSort: true, isExcel: true, align: 'center'},
        {id: 'roleNm', name: '권한', type: 'custom', userCustom: customRoleNm, isExcel: true, align: 'center'}
      ]
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function getDataGrid() {
    return dataGrid;
  }

  function findUser(e) {
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

  function changeSelAuth() {
    this.value !== 'ROLE_BASIC' ? cmmUtils.showElement('divExpDate') : cmmUtils.hideElement('divExpDate');
  }

  // 권한변경
  function saveAuth() {
    const roleNm = document.getElementById('modalSelAuth').value;
    const expDate = cmmUtils.getCheckedValues('expDate')[0];
    cmmUtils.axiosPost({
      url: '/api/v1/admin/change-role',
      body: {
        loginId: global['selectedLoginId'],
        roleNm: roleNm,
        expDate: expDate
      },
      loading: 'btnSaveAuth'
    }, function (response) {
      cmmUtils.closeModal('authModal');
      dataGrid.reload();
    });
  }

  function showAuthModal(_this) {
    const loginId = _this.getAttribute('data-login-id');
    global['selectedLoginId'] = loginId;
    const roleNm = _this.getAttribute('data-role-nm');
    document.getElementById('labelModalAuth').textContent = loginId;
    const selBox = document.getElementById('modalSelAuth');
    cmmUtils.hideElement('divExpDate'); // 만료일은 구독자를 선택했을 경우만 보임
    // cmmUtils.clearCalendarValue('expDate');
    for (let i = 0; i < selBox.length; i++) {
      const option = selBox[i];
      if (option.value === roleNm) {
        option.selected = true;
        if (roleNm !== 'ROLE_BASIC') {
          cmmUtils.showElement('divExpDate');
        }
      }
    }
    cmmUtils.showModal('authModal');
  }

  function closeChangeRoleModal() {
    cmmUtils.closeModal('authModal');
    dataGrid.reload();
  }

  function downloadExcel() {
    dataGrid.downloadExcel();
  }

  return {
    init: init,
    getDataGrid: getDataGrid,
    findUser: findUser,
    reloadGrid: reloadGrid,
    changeSelAuth: changeSelAuth,
    showAuthModal: showAuthModal,
    saveAuth: saveAuth,
    closeChangeRoleModal: closeChangeRoleModal,
    downloadExcel: downloadExcel
  }
}());

document.addEventListener("DOMContentLoaded", function() {
   main.init();
  // 권한변경 셀렉트박스 이벤트
  document.getElementById('modalSelAuth').addEventListener('change', main.changeSelAuth)
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findUser)
});