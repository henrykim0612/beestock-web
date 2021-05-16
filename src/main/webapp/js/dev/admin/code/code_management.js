const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let dataGrid;
  let global = {
    selectedCodeId: null,
    selectedCodeLevel: null
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
    html += '      <span>BEESTOCK</span>';
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
    html += '      <span class="icon is-small"><i class="fas fa-cog"></i></span>';
    html += '      <span>시스템 코드관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initGrid() {
    const modSpans = function(col, row) {
      const span1 = '<span data-custom="add" data-code-id="' + row['codeId'] + '" data-code-lv="' + row['codeLevel'] + '" class="tag is-primary is-light cursor">하위코드 등록</span>';
      const span2 = '<span data-custom="mod" data-code-id="' + row['codeId'] + '" class="tag is-danger is-light cursor ml-2">수정</span>';
      return span1 + span2;
    }

    // 코드 트리뷰
    const codeTreeView = function(anchor, col, row) {
      anchor.setAttribute('data-show', 'quickview');
      anchor.setAttribute('data-target', 'quickTreeView');
      anchor.setAttribute('data-custom', 'treeView');
      anchor.setAttribute('data-code-id', row['codeId']);
      anchor.setAttribute('data-code-lv', row['codeLevel']);
    }

    const props = {
      url: '/api/v1/code/paging-code-list',
      body: {
        orderBy: [{column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      fileName: '코드리스트',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: [
        {id: 'rowNum', name: 'No', isSort: true, align: 'center', isStrong: true},
        {id: 'codeId', name: '코드', isSort: true, isLink: true, align: 'center', width: '150px', userCustom: codeTreeView, isExcel: true},
        {type: 'custom', userCustom: modSpans, width: '150px'},
        {id: 'codeNm', name: '코드명', isSort: true, width: '300px', isExcel: true},
        {id: 'description', name: '설명', isSort: true, width: '500px', isExcel: true},
        {id: 'parentCodeId', name: '부모코드', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'codeLevel', name: '코드레벨', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'regDate', name: '등록일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'regLoginId', name: '등록자', isSort: true, align: 'center', width: '250px', isExcel: true},
        {id: 'uptDate', name: '수정일', isSort: true, align: 'center', width: '150px', isExcel: true},
        {id: 'uptLoginId', name: '수정자', isSort: true, align: 'center', width: '250px', isExcel: true}
      ],
      success: function(data, _this) {
        initQuickView();
        addModCodeEventListener(data, _this);
        addChildCodeEventListener(data, _this);
        addCodeTreeViewEventListener(data, _this);
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
    const tags = document.getElementById(tableId).querySelectorAll('[data-custom=mod]');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.addEventListener('click', function() {
        const codeId = this.getAttribute('data-code-id');
        const url = '/api/v1/code/' + codeId;
        cmmUtils.axiosGet({url: url}, function(response) {
          showModCodeModal(response);
        });
      });
    }
  }

  // 하위코드 생성
  function addChildCodeEventListener(data, _this) {
    const tableId = _this.props.eId;
    const tags = document.getElementById(tableId).querySelectorAll('[data-custom=add]');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.addEventListener('click', function() {
        const codeId = this.getAttribute('data-code-id');
        const codeLevel = this.getAttribute('data-code-lv');
        showNewCodeModal(codeId, codeLevel);
      });
    }
  }

  // 코드 트리뷰
  function addCodeTreeViewEventListener(data, _this) {
    const tableId = _this.props.eId;
    const tags = document.getElementById(tableId).querySelectorAll('[data-custom=treeView]');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      tag.addEventListener('click', function() {
        const codeId = this.getAttribute('data-code-id');
        const codeLevel = parseInt(this.getAttribute('data-code-lv')) + 1; // 선택한 코드의 다음레벨
        const url = '/api/v1/code/tree-view/' + codeId;
        cmmUtils.axiosGet({url: url}, function(response) {
          cmmUtils.clearChildNodes('treeViewContent');
          appendContent(response, codeLevel);
        });
      });
    }
    // 트리구조 생성
    function appendContent(treeDataArr, codeLevel) {
      const fragment = document.createDocumentFragment();
      if (treeDataArr.length) {
        for (let i = 0; i < treeDataArr.length; i++) {
          const treeData = treeDataArr[i];
          if (treeData['codeLevel'] === codeLevel) {
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.innerText = treeData['codeNm'];
            span.classList.add('tag');
            span.classList.add('is-primary');
            span.classList.add('is-light');
            li.appendChild(span);
            appendChildNodes(li, treeData['codeId'], treeDataArr);
            fragment.appendChild(li);
          }
        }
      } else {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.innerText = '하위코드 없음';
        span.classList.add('tag');
        span.classList.add('is-warning');
        span.classList.add('is-light');
        li.appendChild(span);
        fragment.appendChild(li);
      }
      document.getElementById('treeViewContent').appendChild(fragment.cloneNode(true));
    }
    // 재귀호출로 하위 노드까지 생성
    function appendChildNodes(pLi, codeId, treeDataArr) {
      for (let i = 0; i < treeDataArr.length; i++) {
        const treeData = treeDataArr[i];
        if (codeId === treeData['parentCodeId']) {
          const ul = document.createElement('ul');
          const cLi = document.createElement('li');
          const span = document.createElement('span');
          span.innerText = treeData['codeNm'];
          span.classList.add('tag');
          span.classList.add('is-primary');
          span.classList.add('is-light');
          cLi.appendChild(span);
          ul.appendChild(cLi);
          appendChildNodes(cLi, treeData['codeId'], treeDataArr);
          pLi.appendChild(ul);
        }
      }
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
      cmmUtils.axiosGet({url: url}, function(response) {
        if (response === 0) { // 새로운 코드
          cmmUtils.appendInfoClasses(['newCodeId', 'helpCodeId'], true);
          cmmUtils.removeHiddenClass(['icoCodeIdCheck']); // Check 아이콘 노출
          cmmUtils.appendHiddenClass(['icoCodeIdTriangle', 'helpCodeId']); // Triangle 과 Help 숨김
        } else { // 이미 존재하는 코드라면
          cmmUtils.appendInfoClasses(['newCodeId', 'helpCodeId'], false);
          cmmUtils.removeHiddenClass(['icoCodeIdTriangle', 'helpCodeId']); // Triangle 과 Help 노출
          cmmUtils.appendHiddenClass(['icoCodeIdCheck']); // Check 아이콘 숨김
        }
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

      cmmUtils.axiosPost({
        url: '/api/v1/code/insert',
        body: body,
        loading: 'btnNewCode'
      }, function (response) {
        response ? closeNewCodeModal() : cmmUtils.goToErrorPage(response);
      });
    }
  }

  function modifyCode() {
    const msg = '코드를 수정하시겠습니까?.'
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/code/update',
        body: {
          codeId: global['selectedCodeId'],
          codeNm: document.getElementById('modCodeNm').value,
          description: document.getElementById('modDescription').value
        },
        loading: 'btnNewCode'
      }, function (response) {
        closeModCodeModal();
      });
    });
  }

  function removeCode() {
    const msg = '<strong>하위 코드까지 모두 삭제됩니다</strong>. 삭제 후 복구 할 수 없습니다.'
    cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/code/delete',
        body: {
          codeId: global['selectedCodeId'],
          codeLevel: global['selectedCodeLevel']
        },
        loading: 'btnModCode'
      }, function (response) {
        0 < response ? closeModCodeModal() : cmmUtils.goToErrorPage(response);
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

  function findCode(e) {
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

  function downloadExcel() {
    dataGrid.downloadExcel();
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
    findCode: findCode,
    reloadGrid: reloadGrid,
    downloadExcel: downloadExcel
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findCode)
});