const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedLoginId: ''
  }

  function init() {
    initCalendar();
    createBreadCrumb();
    initGrid()
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
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
    html += '      <span>사용자관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initCalendar() {
    bulmaCalendar.attach('[type="date"]', {
      type: 'date',
      color: 'info',
      dateFormat: 'YYYY-MM-DD',
      displayMode: 'dialog',
      showHeader: false,
      showClearButton: false
    });
  }

  function initGrid() {
    const customRoleNm = function(col, row) {
      const roleNm = row['roleNm'];
      let innerHtml = '';
      switch (roleNm) {
        case 'ROLE_ADMIN':
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-warning is-light cursor">관리자</span>';
          break;
        case 'ROLE_SUBC':
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-success is-light cursor">구독자</span>';
          break;
        default:
          innerHtml = '<span onclick="main.showAuthModal(this)" data-role-nm="' + roleNm + '" data-login-id="' + row['loginId'] + '" class="tag is-info is-light cursor">일반사용자</span>';
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
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true},
        {id: 'loginId', name: '이메일', isSort: true, isExcel: true},
        {id: 'userNm', name: '사용자/닉네임', isSort: true, isExcel: true},
        {id: 'userPhone', name: '연락처', isExcel: true},
        {id: 'regDate', name: '회원가입 일자', isSort: true, isExcel: true},
        {id: 'regLoginId', name: '등록자', isSort: true, isExcel: true},
        {id: 'uptDate', name: '수정일자', isSort: true, isExcel: true},
        {id: 'uptLoginId', name: '수정자', isSort: true, isExcel: true},
        {id: 'expDate', name: '만료일', isSort: true, isExcel: true},
        {id: 'roleNm', name: '권한', type: 'custom', userCustom: customRoleNm, isSort: true, isExcel: true}
      ]
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function getDataGrid() {
    return dataGrid;
  }

  function findUser(e) {
    if (e.key === 'Enter') {
      const key = document.getElementById('selSearch').value;
      const props = {};
      props[key] = this.value;
      dataGrid.reload(props);
    }
  }

  function changeSelSearch() {
    const inputSearch = document.getElementById('inputSearch');
    const placeholder = this.value + ' 검색';
    inputSearch.setAttribute('placeholder', placeholder);
  }

  function changeSelAuth() {
    this.value === 'ROLE_SUBC' ? cmmUtils.showElement('divExpDate') : cmmUtils.hideElement('divExpDate');
  }

  // 권한변경
  function saveAuth() {
    const roleNm = document.getElementById('modalSelAuth').value;
    const expDate = document.getElementById('expDate').value;
    cmmUtils.postData({
      url: '/api/v1/admin/change-role',
      body: {
        loginId: global['selectedLoginId'],
        roleNm: roleNm,
        expDate: expDate
      },
      loading: 'btnSaveAuth'
    }).then(function (response) {
      if (response === -401) cmmUtils.goToLoginHome(); // 세션 끊어짐
      cmmUtils.closeModal('authModal');
      dataGrid.reload();
    }).catch(function (err) {
      cmmUtils.hideLoadingElement(document.getElementById('btnSaveAuth'));
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function showAuthModal(_this) {
    const loginId = _this.getAttribute('data-login-id');
    global['selectedLoginId'] = loginId;
    const roleNm = _this.getAttribute('data-role-nm');
    document.getElementById('labelModalAuth').textContent = loginId;
    const selBox = document.getElementById('modalSelAuth');
    cmmUtils.hideElement('divExpDate'); // 만료일은 구독자를 선택했을 경우만 보임
    for (let i = 0; i < selBox.length; i++) {
      const option = selBox[i];
      if (option.value === roleNm) {
        option.selected = true;
        if (roleNm === 'ROLE_SUBC') {
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

  return {
    init: init,
    getDataGrid: getDataGrid,
    findUser: findUser,
    changeSelSearch: changeSelSearch,
    changeSelAuth: changeSelAuth,
    showAuthModal: showAuthModal,
    saveAuth: saveAuth,
    closeChangeRoleModal: closeChangeRoleModal
  }
}());

document.addEventListener("DOMContentLoaded", function() {

   main.init();

  tippy('#icoExcelDownload', {
    content: 'Excel Download',
    placement: 'bottom'
  });

  // 검색조건 셀렉트박스 변경 이벤트
  document.getElementById('selSearch').addEventListener('change', main.changeSelSearch)
  // 권한변경 셀렉트박스 이벤트
  document.getElementById('modalSelAuth').addEventListener('change', main.changeSelAuth)
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findUser)
});