const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let profileGrid;
  let quarterGrid;
  let quarterInfoGrid;
  let global = {
    selectedProfileId: null,
    selectedProfileTitle: null,
    selectedRowId: null,
    selectedQuarterId: null,
    selectedQuarterDate: null,
    selectedSelType: null,
    selectedFileName: null
  }

  function init() {
    createBreadCrumb();
    initGrid();
    initExcelTooltips();
  }

  function initExcelTooltips() {
    cmmUtils.setExcelTippy(['#icoProfileExcelDownload']);
    cmmUtils.setExcelTippy(['#icoQiExcelDownload']);
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
    html += '    <a href="' + CONTEXT_PATH + '/admin/quarter-management">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-database"></i></span>';
    html += '      <span>분기별 프로필 관리</span>';
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

    const customIsFree = function(col, row) {
      // 1: 유료, 2: 무료
      return row['isFree'] === 1 ? '<span class="tag is-danger is-light">유료</span>' : '<span class="tag is-success is-light">무료</span>';
    }

    const titleAnchor = function(anchor, col, row) {
      anchor.setAttribute('data-custom', 'titleAnchor');
      anchor.setAttribute('data-profile-id', row['profileId']);
    }

    const props = {
      url: '/api/v1/admin/profile/paging-profile-list',
      eId: 'dataGrid',
      pId: 'dataPagination',
      fileName: '프로필 리스트',
      isThead: true,
      isTfoot: false,
      isSelectable: true,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, align: 'center', isStrong: true},
        {id: 'profileId', isHidden: true, attributes: {title: 'profileTitle'}},
        {id: 'profileTitle', name: '프로필명', isSort: true, isExcel: true, width: '250px', isLink: true, userCustom: titleAnchor},
        {id: 'profileType', name: '타입', isSort: true, align: 'center', isExcel: true, type: 'custom', userCustom: customProfileType, width: '50px'},
        {id: 'isFree', name: '프로필공개', isSort: true, align: 'center', isExcel: true, type: 'custom', userCustom: customIsFree, width: '100px'},
        {id: 'regDate', name: '등록일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'regLoginId', name: '등록자', isSort: true, align: 'center', width: '250px', isExcel: true},
        {id: 'uptDate', name: '수정일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'uptLoginId', name: '수정자', isSort: true, align: 'center', width: '250px', isExcel: true}
      ],
      success: function(data, _this) {
        addTitleAnchorEvent(data, _this);
        addSelectedRows(data, _this);
      }
    }
    profileGrid = new COMPONENTS.DataGrid(props);
  }

  function addTitleAnchorEvent(data, _this) {
    const eId = _this.props.eId;
    const tags = document.getElementById(eId).querySelectorAll('[data-custom=titleAnchor]');
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener('click', function() {
        global['selectedProfileId'] = this.getAttribute('data-profile-id');
        showUploadModal();
      })
    }
  }

  // Table row event
  function addSelectedRows(data, _this) {
    const eId = _this.props.eId;
    const tbody = document.getElementById(eId).querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const createClickHandler = function(row) {
        return function() {
          const hiddenCell = row.getElementsByTagName("td")[0];
          const selectedRowId = hiddenCell.getAttribute('data-key');
          const selectedProfileTitle = hiddenCell.getAttribute('data-title');
          global['selectedRowId'] = selectedRowId;
          global['selectedProfileTitle'] = selectedProfileTitle;
          initQuarterGrid(selectedRowId);
        };
      };
      row.onclick = createClickHandler(row);
    }
  }

  function initQuarterGrid(rowId) {

    const titleAnchor = function(anchor, col, row) {
      anchor.setAttribute('data-custom', 'titleAnchor');
      anchor.setAttribute('data-quarter-id', row['quarterId']);
      anchor.setAttribute('data-quarter-date', row['quarterDate']);
    }

    const props = {
      url: '/api/v1/admin/quarter/paging-quarter-list',
      eId: 'quarterGrid',
      pId: 'quarterPagination',
      body: {
        orderBy: [{column: 'quarterDate', desc: true}],
        profileId: rowId
      },
      fileName: '프로필 분기 리스트',
      isThead: true,
      isTfoot: false,
      emptyRowMsg: '등록된 분기 정보가 없습니다.',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, align: 'center', isStrong: true},
        {id: 'quarterDate', name: '분기', isSort: true, align: 'center', isLink: true, userCustom: titleAnchor},
        {id: 'regDate', name: '등록일', isSort: true, align: 'center'},
        {id: 'regLoginId', name: '등록자', isSort: true, align: 'center'}
      ],
      success: function(data, _this) {
        addQuarterTitleAnchorEvent(data, _this);
      }
    }
    quarterGrid = new COMPONENTS.DataGrid(props);
  }

  function addQuarterTitleAnchorEvent(data, _this) {
    const eId = _this.props.eId;
    const tags = document.getElementById(eId).querySelectorAll('[data-custom=titleAnchor]');
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener('click', function() {
        global['selectedQuarterId'] = this.getAttribute('data-quarter-id');
        global['selectedQuarterDate'] = this.getAttribute('data-quarter-date');
        showQuarterInfoModal();

      })
    }
  }

  // 분기 상세 데이터 그리드
  function initQuarterInfoGrid() {
    const props = {
      url: '/api/v1/admin/quarter/quarter-info-list',
      eId: 'quarterInfoGrid',
      body: {quarterId: global['selectedQuarterId']},
      fileName: '프로필 분기 상세정보',
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'itemCode', name: '종목코드', isSort: true, align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', isSort: true, align: 'left', isExcel: true},
        {id: 'quantity', name: '수량', isSort: true, align: 'right', isCurrency: true, isExcel: true},
        {id: 'acqPrice', name: '취득가액', isSort: true, align: 'right', isCurrency: true, isExcel: true},
        {id: 'marketPrice', name: '시가평가액', isSort: true, align: 'right', isCurrency: true, isExcel: true}
      ]
    }
    quarterInfoGrid = new COMPONENTS.DataGrid(props);
  }

  function goToProfileForm() {
    cmmUtils.goToPage('/admin/profile-form')
  }

  function showUploadModal() {
    cmmUtils.showModal('uploadModal');
    resetUploadModal();
  }

  function showQuarterInfoModal() {
    document.getElementById('qiTitle').innerText = global['selectedProfileTitle'] + ' ' + global['selectedQuarterDate'];
    cmmUtils.showModal('quarterInfoModal');
    initQuarterInfoGrid();
  }

  function resetUploadModal() {
    document.getElementById('spanFileName').innerText = '';
    document.getElementById('quarterFile').value = '';
  }

  function hideUploadModal() {
    cmmUtils.closeModal('uploadModal');
    quarterGrid.reload();
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
    profileGrid.reload(props);
  }

  function findProfile(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  function changeFileInput(fis) {
    const str = fis.value;
    const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
    global['selectedFileName'] = fileName
    document.getElementById('spanFileName').innerText = fileName;
  }

  function uploadQuarter() {
    const fileName = global['selectedFileName'];
    if (verifyUploadForm()) {
      if (cmmUtils.checkExcelExtension(fileName)) {
        const msg = '업로드를 시작합니다. 동일한 분기가 있다면 삭제되고 새롭게 저장됩니다.'
        cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {

          const formData = new FormData();
          formData.append('file', document.getElementById('quarterFile').files[0]);
          formData.append('fileName', global['selectedFileName']);
          formData.append('profileId', global['selectedProfileId']);

          cmmUtils.postData({
            url: '/api/v1/admin/quarter/upload-quarter',
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

  function verifyUploadForm() {
    const spanFileName = document.getElementById('spanFileName').innerText;
    if (!spanFileName) {
      cmmUtils.showIpModal('파일', '파일을 선택해주세요.');
      return false;
    }
    if (!cmmUtils.checkQuarterPattern(spanFileName)) {
      cmmUtils.showIpModal('파일명', '분기 형식이 잘못되었습니다.(예시: 2020-[1~4] 4분기까지 가능');
      return false;
    }
    return true;
  }

  function downloadProfileExcel() {
    profileGrid.downloadExcel();
  }

  function downloadQuarterInfoExcel() {
    quarterInfoGrid.downloadExcel();
  }

  return {
    init: init,
    getGlobal: function() { return global; },
    goToProfileForm: goToProfileForm,
    changeSelType: changeSelType,
    findProfile: findProfile,
    reloadGrid: reloadGrid,
    changeFileInput: changeFileInput,
    uploadQuarter: uploadQuarter,
    downloadProfileExcel: downloadProfileExcel,
    downloadQuarterInfoExcel: downloadQuarterInfoExcel
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findProfile);
});