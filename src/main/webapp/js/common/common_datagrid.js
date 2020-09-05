/**
 * Bulma.css 기반으로한 그리드 컴포넌트
 * 파라미터정보
   url: '/api/v1/admin/user-list',
   body: {},
   eId: 'dataGrid',
   pId: 'dataPagination',
   isNextButton: true,
   isTfoot: true,
   colModel: [
     {id: 'rowNum', name: 'No', isStrong: true},
     {id: 'loginId', name: '이메일'},
     {id: 'userNm', name: '사용자/닉네임'},
     {id: 'userPhone', name: '연락처'},
     {id: 'regDate', name: '회원가입 일자'},
     {id: 'uptDate', name: '정보수정 일자'}
   ],
   acdCols: ['loginId', 'userNm'],
   descCols: ['regDate', 'uptDate']
 *
 *
 */
const cmmDataGrid = (function () {

  let _props;

  function init(props) {

    _props = props;
    const body = props['body'];
    body['curPage'] = body['curPage'] != null ? body['curPage'] : 1;

    cmmUtils.postData({
      url: props['url'],
      body: body
    }).then(function (response) {

      console.log(response);
      props['data'] = response; // 결과값을 추가함

      const table = document.getElementById(props['eId']);
      cmmUtils.clearChildNodes(table);

      // Table
      const fragment = document.createDocumentFragment();
      createThead(fragment, props);
      createTfoot(fragment, props);
      createTbody(fragment, props);
      table.appendChild(fragment);
      // Pagination
      createPagination(props);

    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function createThead(fragment, props) {

    const colModel = props['colModel'];
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    for(let i=0;i<colModel.length;i++) {

      const col = colModel[i];
      const th = document.createElement('th');
      const abbr = document.createElement('abbr');
      abbr.setAttribute('data-ref-id', col['id']);
      abbr.setAttribute('title', col['name']);
      abbr.innerText = col['name'];
      // Sorting 기능 추가
      createSortingIcons(col, abbr, props);
      th.appendChild(abbr);
      tr.appendChild(th);
    }

    thead.appendChild(tr);
    fragment.appendChild(thead);
  }

  function createTfoot(fragment, props) {
    if ( (props['isTfoot'] == null) || (props['isTfoot'] != null && props['isTfoot']) ) {
      const colModel = props['colModel'];
      const tfoot = document.createElement('tfoot');
      const tr = document.createElement('tr');
      for (let i = 0; i < colModel.length; i++) {
        const col = colModel[i];
        const th = document.createElement('th');
        const abbr = document.createElement('abbr');
        abbr.setAttribute('data-ref-id', col['id']);
        abbr.setAttribute('title', col['name']);
        abbr.innerText = col['name'];
        // Sorting 기능 추가
        createSortingIcons(col, abbr, props);
        th.appendChild(abbr);
        tr.appendChild(th);
      }
      tfoot.appendChild(tr);
      fragment.appendChild(tfoot);
    }
  }

  function createTbody(parentFragment, props) {

    const colModel = props['colModel'];
    const rowData = props['data']['rowData'];

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < rowData.length; i++) {
      const row = rowData[i];
      const tr = document.createElement('tr');
      // Thead 순서로 생성
      for (let j = 0; j < colModel.length; j++) {
        const col = colModel[j];
        const thOrTd = col['isStrong'] != null && col['isStrong'] ? document.createElement('th') : document.createElement('td');
        if (col['isLink'] != null) { // a태그 존재
          const a = document.createElement('a');
          a.href = col['isLink'];
          a.innerHTML = row[col['id']];
          thOrTd.appendChild(a);
        } else {
          thOrTd.innerHTML = row[col['id']];
        }
        // tr에 추가
        tr.appendChild(thOrTd);
      }
      fragment.appendChild(tr);
    }
    const tbody = document.createElement('tbody');
    tbody.appendChild(fragment.cloneNode(true));
    parentFragment.appendChild(tbody);
  }

  function createPagination(props) {

    const pagination = document.getElementById(props['pId']);
    cmmUtils.clearChildNodes(pagination);

    const fragment = document.createDocumentFragment();
    createPreviousButton(props, fragment);
    createNextButton(props, fragment);

    const ul = document.createElement('ul');
    ul.classList.add('pagination-list');
    const data = props['data'];

    // First of page
    if (1 < data['curRange']) {
      createFirstPage(ul);
    }

    // Current range
    createCenterPage(ul, data);

    // End of page
    if (data['startPage'] !== data['pageCnt'] && data['rangeSize'] < data['pageCnt']) {
      createEndPage(ul, data);
    }

    fragment.appendChild(ul);
    pagination.appendChild(fragment.cloneNode(true));
  }

  function createFirstPage(ul) {

    // <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
    const endAnchor = document.createElement('a');
    endAnchor.innerText = '1';
    endAnchor.classList.add('pagination-link');
    endAnchor.setAttribute('aria-label', 'Goto page 1')
    endAnchor.href = '#';
    endAnchor.setAttribute('onclick', 'cmmDataGrid.movePages('+ 1 +')');
    const endLi = document.createElement('li');
    endLi.appendChild(endAnchor);
    ul.appendChild(endLi);

    // <li><span class="pagination-ellipsis">&hellip;</span></li>
    const dotSpan = document.createElement('span');
    dotSpan.classList.add('pagination-ellipsis');
    dotSpan.innerHTML = '&hellip;';
    const dotLi = document.createElement('li');
    dotLi.appendChild(dotSpan);
    ul.appendChild(dotLi);
  }

  function createCenterPage(ul, data) {

    const startPage = data['startPage'];
    const endPage = data['endPage'];

    for (let i = startPage; i <= endPage; i++) {
      const a = document.createElement('a');
      a.classList.add('pagination-link');
      a.innerText = i;
      a.setAttribute('aria-label', 'Goto page ' + i);
      if (data['curPage'] === i) { // 현재페이지 표시
        a.classList.add('is-current');
        a.setAttribute('aria-current', 'page');
      }
      a.href = '#';
      a.setAttribute('onclick', 'cmmDataGrid.movePages('+ i +')');

      const li = document.createElement('li');
      li.appendChild(a);
      ul.appendChild(li);
    }
  }

  function createEndPage(ul, data) {

    const pageCnt = data['pageCnt'];

    // endPage 를 넘어가는 구간 생성
    // <li><span class="pagination-ellipsis">&hellip;</span></li>
    const dotSpan = document.createElement('span');
    dotSpan.classList.add('pagination-ellipsis');
    dotSpan.innerHTML = '&hellip;';
    const dotLi = document.createElement('li');
    dotLi.appendChild(dotSpan);
    ul.appendChild(dotLi);
    // <li><a class="pagination-link" aria-label="Goto page 86">86</a></li>
    const endAnchor = document.createElement('a');
    endAnchor.innerText = pageCnt;
    endAnchor.classList.add('pagination-link');
    endAnchor.setAttribute('aria-label', 'Goto page' + pageCnt)
    endAnchor.href = '#';
    endAnchor.setAttribute('onclick', 'cmmDataGrid.movePages('+ pageCnt +')');
    const endLi = document.createElement('li');
    endLi.appendChild(endAnchor);
    ul.appendChild(endLi);
  }

  function createPreviousButton(props, fragment) {
    const data = props['data'];
    if ( (props['isNextButton'] == null) || (props['isNextButton'] != null && props['isNextButton']) ) {
      if (data['curPage'] !== 1) {
        const previous = document.createElement('a');
        previous.classList.add('pagination-previous');
        previous.innerText = 'Previous';
        previous.setAttribute('onclick', 'cmmDataGrid.movePages(' + data['prevPage'] + ')');
        fragment.appendChild(previous);
      }
    }
  }

  function createNextButton(props, fragment) {
    const data = props['data'];
    if ( (props['isNextButton'] == null) || (props['isNextButton'] != null && props['isNextButton']) ) {
      if (data['nextPage'] <= data['pageCnt']) {
        const next = document.createElement('a');
        next.classList.add('pagination-next');
        next.innerText = 'Next page';
        next.setAttribute('onclick', 'cmmDataGrid.movePages(' + data['nextPage'] + ')');
        fragment.appendChild(next);
      }
    }
  }

  function showAndHideIconAndInit(table, clickedThRefId, props) {

    const tfootAbbrArr = table.querySelector('thead').querySelectorAll('[data-ref-id=' + clickedThRefId + ']');
    const orderBy = [];

    // Thead 정렬 아이콘 변경
    for (let i = 0; i < tfootAbbrArr.length; i++) {
      changeIconClass(tfootAbbrArr[i], true, orderBy);
    }

    // Tfoot 이 존재한다면 똑같이 정렬 아이콘 변경
    if (props['isTfoot'] != null && props['isTfoot']) {
      const tfootAbbrArr = table.querySelector('tfoot').querySelectorAll('[data-ref-id=' + clickedThRefId + ']');
      for (let i = 0; i < tfootAbbrArr.length; i++) {
        changeIconClass(tfootAbbrArr[i], false);
      }
    }

    // 전송할 정렬값을 변경
    if (orderBy.length) {
      _props['body']['orderBy'] = orderBy;
    } else {
      delete _props['body']['orderBy'];
    }
    // 그리드 재호출
    // init(_props);
  }

  function changeIconClass(abbr, isThead, orderBy) {

    const dataRefId = abbr.getAttribute('data-ref-id');
    const currentDataSort = abbr.getAttribute('data-sort');
    let changedDataSort;

    // Sorting 값 변경
    switch (currentDataSort) {
      case '0':
        changedDataSort = '1';
        abbr.setAttribute('data-sort', changedDataSort); //오름차순으로 변경
        pushOrderBy(orderBy, dataRefId, false, isThead);
        break;
      case '1':
        changedDataSort = '2';
        abbr.setAttribute('data-sort', changedDataSort); // 내림차순으로 변경
        pushOrderBy(orderBy, dataRefId, true, isThead);
        break;
      default:
        changedDataSort = '0'
        abbr.setAttribute('data-sort', changedDataSort); // 정렬없음
        break;
    }

    // svg 아이콘 클래스 변경
    const svgArr = abbr.querySelectorAll('svg');
    for (let j = 0; j < svgArr.length; j++) {
      const svg = svgArr[j];
      changedDataSort === svg.getAttribute('data-sort')
        ? svg.classList.remove('is-hidden')
        : svg.classList.add('is-hidden');
    }


    // 정렬값에 Push
    function pushOrderBy(orderBy, dataRefId, isDesc, isThead) {
      if (isThead) { // Thead 만, Tfoot 은 있어도 중복되므로 제외
        isDesc ? orderBy.push({column: dataRefId, desc: true}) : orderBy.push({column: dataRefId});
      }
    }
  }


  function getDefaultDataSort(refId, props) {
    // 정렬값이 존재할 경우만 처리
    if (props['body'] != null && props['body']['orderBy'] != null) {
      const orderBy = props['body']['orderBy'];
      let isExisted = false;
      for (let i = 0; i < orderBy.length; i++) {
        const sortObj = orderBy[i];
        if (refId === sortObj.column) {
          isExisted = true;
          return sortObj['desc'] != null && sortObj['desc'] ? '2' : '1'; // 1 -> Ascending, 2 -> Descending
        }
      }
      if (!isExisted) return '0';
    } else  {
      return '0';
    }
  }

  function createSortingIcons(col, abbr, props) {
    if (col['isSort'] != null && col['isSort']) { // 정렬을 선언한 키값만 추가
      const defaultDataSort = getDefaultDataSort(col['id'], props);
      abbr.setAttribute('data-sort', defaultDataSort);
      abbr.appendChild(cmmUtils.createIcon(['fas', 'fa-sort-up'], [{attrName: 'data-sort', value: '1'}], function(span) {
        if (defaultDataSort !== '1') {
          span.classList.add('is-hidden');
        }
      }));
      abbr.appendChild(cmmUtils.createIcon(['fas', 'fa-sort-down'], [{attrName: 'data-sort', value: '2'}], function(span) {
        if (defaultDataSort !== '2') {
          span.classList.add('is-hidden');
        }
      }));
      // Thead 또는 Tfoot 을 눌렀을경우 정렬 이벤트
      abbr.addEventListener('click', function() {
        sortGrid(col['id'], props);
      });
    }
  }

  function movePages(page) {
    _props['body']['curPage'] = page;
    init(_props);
  }

  function sortGrid(clickedThRefId, props) {
    const eId = props['eId'];
    const table = document.getElementById(eId);
    showAndHideIconAndInit(table, clickedThRefId, props);
  }

  return {
    init: init,
    movePages: movePages,
    getProps: function() {
      return _props;
    }
  }
})();