const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedCodeId: null,
    selectedCodeLevel: null
  }

  function init() {

    const customAddChildCode = function(col, row) {
      return '<span data-tag="add" data-code-id="' + row['codeId'] + '" data-code-lv="' + row['codeLevel'] + '" class="tag is-primary is-light cursor">하위코드 등록</span>';
    }

    const customModCode = function(col, row) {
      return '<span data-tag="mod" data-code-id="' + row['codeId'] + '" class="tag is-danger is-light cursor">수정</span>';
    }

    const props = {
      url: '/api/v1/code/paging-code-list',
      body: {
        orderBy: [{column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      isThead: true,
      isTfoot: true,
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true},
        {id: 'codeId', name: '코드', isSort: true},
        {id: 'codeNm', name: '코드명', isSort: true},
        {id: 'description', name: '설명', isSort: true},
        {id: 'parentCodeId', name: '부모코드', isSort: true},
        {id: 'codeLevel', name: '코드레벨', isSort: true},
        {id: 'regDate', name: '등록일', isSort: true},
        {id: 'regLoginId', name: '등록자', isSort: true},
        {id: 'uptDate', name: '수정일', isSort: true},
        {id: 'uptLoginId', name: '수정자', isSort: true},
        {name: '', type: 'tag', userCustom: customAddChildCode},
        {name: '', type: 'tag', userCustom: customModCode}
      ],
      success: function(data, _this) {
        initQuickView();
        addModCodeEventListener(data, _this);
        addChildCodeEventListener(data, _this);
      }
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function initQuickView() {
    bulmaQuickview.attach(); // quickviews now contains an array of all Quickview instances
  }

  // 수정버튼 이벤트
  function addModCodeEventListener(data, _this) {
    const tableId = _this.props.eId;
    const tags = document.getElementById(tableId).querySelectorAll('[data-tag=mod]');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.addEventListener('click', function() {
        const codeId = this.getAttribute('data-code-id');
        const url = '/api/v1/code/' + codeId;
        cmmUtils.getData({
          url: url,
        }).then(function (response) {
          showModCodeModal(response);
        }).catch(function (err) {
          cmmUtils.showErrModal();
          console.log(err);
        });
      });
    }
  }

  // 하위코드 생성
  function addChildCodeEventListener(data, _this) {
    const tableId = _this.props.eId;
    const tags = document.getElementById(tableId).querySelectorAll('[data-tag=add]');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.addEventListener('click', function() {
        const codeId = this.getAttribute('data-code-id');
        const codeLevel = this.getAttribute('data-code-lv');
        showNewCodeModal(codeId, codeLevel);
      });
    }
  }

  function showNewCodeModal(parentCodeId, codeLevel) {
    const argLen = arguments.length;
    resetNewCodeForm();
    // 하위코드 등록으로 들어온 경우는 부모코드 존재
    document.getElementById('hidParentCodeId').value = argLen === 2 ? parentCodeId : '';
    document.getElementById('hidParentCodeLevel').value = argLen === 2 ? codeLevel : '';
    cmmUtils.showModal('newCodeModal');
  }

  function showModCodeModal(data) {
    global['selectedCodeId'] = data['codeId'];
    global['selectedCodeLevel'] = data['codeLevel'];
    cmmUtils.bindData('modCodeForm', data);
    cmmUtils.showModal('modCodeModal');
  }

  function resetNewCodeForm() {
    cmmUtils.clearClasses(['newCodeId', 'helpCodeId']);
    cmmUtils.appendHiddenClass(['icoCodeIdTriangle', 'icoCodeIdCheck', 'helpCodeId']);
    document.getElementById('newCodeForm').reset();
  }

  // 중복된 코드인지 검사
  function checkCodeId(_this) {
    cmmUtils.clearClasses(['newCodeId', 'helpCodeId']);
    if (_this.value) {
      const url = '/api/v1/code/is-existed/' + _this.value;
      cmmUtils.getData({
        url: url
      }).then(function (response) {
        if (response === 0) { // 새로운 코드
          cmmUtils.appendInfoClasses(['newCodeId', 'helpCodeId'], true);
          cmmUtils.removeHiddenClass(['icoCodeIdCheck']); // Check 아이콘 노출
          cmmUtils.appendHiddenClass(['icoCodeIdTriangle', 'helpCodeId']); // Triangle 과 Help 숨김
        } else { // 이미 존재하는 코드라면
          cmmUtils.appendInfoClasses(['newCodeId', 'helpCodeId'], false);
          cmmUtils.removeHiddenClass(['icoCodeIdTriangle', 'helpCodeId']); // Triangle 과 Help 노출
          cmmUtils.appendHiddenClass(['icoCodeIdCheck']); // Check 아이콘 숨김
        }
      }).catch(function (err) {
        cmmUtils.showErrModal();
        console.log(err);
      });
    } else {
      cmmUtils.appendHiddenClass(['helpCodeId']);
    }
  }

  // 코드등록
  function saveNewCode() {

    if (verifyNewCode()) {
      const codeId = document.getElementById('newCodeId');
      const codeNm = document.getElementById('newCodeNm');
      const description = document.getElementById('newDescription');
      const hidParentCodeId = document.getElementById('hidParentCodeId');
      const hidParentCodeLevel = document.getElementById('hidParentCodeLevel');
      let body = {
        codeId: codeId.value,
        codeNm: codeNm.value,
        description: description.value,
        codeLevel: 1
      };
      // 부모코드 존재시 포함
      if (hidParentCodeId.value) {
        body['parentCodeId'] = hidParentCodeId.value;
        body['codeLevel'] = parseInt(hidParentCodeLevel.value) + 1; // 부모코드의 다음 레벨로
      }
      cmmUtils.postData({
        url: '/api/v1/code/insert-new-code',
        body: body,
        loading: 'btnNewCode'
      }).then(function (response) {
        response ? closeNewCodeModal() : cmmUtils.showErrModal();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnNewCode'));
        cmmUtils.showErrModal();
        console.log(err);
      });
    }
  }

  function modifyCode() {
    const msg = '코드를 수정하시겠습니까?.'
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.postData({
        url: '/api/v1/code/update',
        body: {
          codeId: global['selectedCodeId'],
          codeNm: document.getElementById('labelModCodeNm').value,
          description: document.getElementById('modDescription').value
        },
        loading: 'btnNewCode'
      }).then(function (response) {
        closeModCodeModal();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnNewCode'));
        cmmUtils.showErrModal();
        console.log(err);
      });
    });
  }

  function removeCode() {
    const msg = '<strong>하위 코드까지 모두 삭제됩니다</strong>. 삭제 후 복구 할 수 없습니다.'
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.postData({
        url: '/api/v1/code/delete',
        body: {
          codeId: global['selectedCodeId'],
          codeLevel: global['selectedCodeLevel']
        },
        loading: 'btnModCode'
      }).then(function (response) {
        0 < response ? closeModCodeModal() : cmmUtils.showErrModal();
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnModCode'));
        cmmUtils.showErrModal();
        console.log(err);
      });
    });
  }

  function closeNewCodeModal() {
    cmmUtils.closeModal('newCodeModal');
    dataGrid.reload();
  }

  function closeModCodeModal() {
    cmmUtils.closeModal('modCodeModal');
    dataGrid.reload();
  }

  function verifyNewCode() {
    const codeId = document.getElementById('newCodeId');
    const codeNm = document.getElementById('newCodeNm');
    const helpCodeId = document.getElementById('helpCodeId');

    if (!codeId.value) {
      cmmUtils.showIpModal('코드 아이디');
      return false;
    }
    if (codeId.value.length < 5) {
      cmmUtils.showIpModal('코드 아이디', '코드 아이디를 5자리로 입력 해주세요.');
      return false;
    }
    if (!helpCodeId.classList.contains('is-hidden')) {
      cmmUtils.showIpModal('코드 아이디', '이미 사용중인 코드 아이디는 사용할 수 없습니다.');
      return false;
    }
    if (!codeNm.value) {
      cmmUtils.showIpModal('코드명');
      return false;
    }

    return true;
  }

  function changeSelSearch() {
    const inputSearch = document.getElementById('inputSearch');
    const placeholder = this.value + ' 검색';
    inputSearch.setAttribute('placeholder', placeholder);
  }

  function findCode(e) {
    if (e.key === 'Enter') {
      const key = document.getElementById('selSearch').value;
      const props = {};
      props[key] = this.value;
      dataGrid.reload(props);
    }
  }

  return {
    init: init,
    showNewCodeModal: showNewCodeModal,
    checkCodeId: checkCodeId,
    saveNewCode: saveNewCode,
    modifyCode: modifyCode,
    removeCode: removeCode,
    closeNewCodeModal: closeNewCodeModal,
    closeModCodeModal: closeModCodeModal,
    changeSelSearch: changeSelSearch,
    findCode: findCode,
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();

  // 검색조건 셀렉트박스 변경 이벤트
  document.getElementById('selSearch').addEventListener('change', main.changeSelSearch)
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findCode)
});