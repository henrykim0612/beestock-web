/**
 * Bulma.css 기반으로한 그리드 컴포넌트
 * 파라미터정보
 *
 *
   url: '/api/v1/code/paging-code-list',
   body: {
    orderBy: [{column: 'uptDate', desc: true}]
   },
   eId: 'dataGrid',
   pId: 'dataPagination',
   fileName: '코드리스트',
   isThead: true,
   isTfoot: false,
   colModel: [
   {id: 'rowNum', name: 'No', isSort: true, align: 'center'}...
   ],
   success: function(data, _this) {
     addCodeTreeViewEventListener(data, _this); ...
   }
 *
 *
 */
BeeComponents.modules.dataGrid = function(component) {

  component.DataGrid = function(_props) {
    // Set default properties
    if (_props['body'] == null) _props['body'] = {};
    const me = this;
    me.props = _props;
    me.init(_props);
    return {
      getProps: function() { return me.props; },
      reload: function (body) {
        arguments.length === 1 ? me.reload(me, body) : me.reload(me);
      },
      downloadExcel: function() { me.downloadExcel(me.props); },
      init: me.init
    }
  }

  component.DataGrid.prototype.init = function(props) {
    const me = this;
    const body = props['body'];
    body['curPage'] = body['curPage'] != null ? body['curPage'] : 1;

    cmmUtils.postData({
      url: props['url'],
      body: body
    }).then(function (response) {

      props['data'] = response; // 결과값을 추가함

      const table = document.getElementById(props['eId']);
      cmmUtils.clearChildNodes(table);
      // Table
      const fragment = document.createDocumentFragment();
      me.createThead(fragment, props);
      me.createTfoot(fragment, props);
      me.createTbody(fragment, props);
      table.appendChild(fragment);
      me.addTableEventListeners(table, props);

      // Pagination
      const paginationBar = document.getElementById(props['pId']);
      if (props['pId'] != null) {
        me.createPagination(props);
        me.addPaginationEventListeners(paginationBar, props);
      }

      // Callback
      if (props['success'] != null) {
        props['success'](response, me);
      }

    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  component.DataGrid.prototype.reload = function(me, body) {
    const argLen = arguments.length;
    const props = me.props;
    if (argLen === 2) {
      props.body = body
      props.curPage = 1; // 1페이지로 초기화
    }
    me.init(props);
  }

  component.DataGrid.prototype.createThead = function(fragment, props) {
    const colModel = props['colModel'];
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    for(let i=0;i<colModel.length;i++) {
      const col = colModel[i];
      if (col['isHidden'] == null || !col['isHidden']) {
        const th = document.createElement('th');
        const div = document.createElement('div');
        const text = col['name'] != null ? col['name'] : '';
        div.classList.add('has-text-centered');
        if (col['id'] != null) {
          div.setAttribute('data-ref-id', col['id']);
        }
        div.setAttribute('title', text);
        div.innerText = text;
        // Width
        if (col['width'] != null) {
          div.style.width = col['width'];
        }
        // Excel
        if (col['isExcel'] != null && col['isExcel']) {
          div.setAttribute('data-excel-header', 'true');
          div.setAttribute('data-excel-value', col['name']);
        }
        // Sorting 기능 추가
        this.createSortingIcons(col, div, props);
        th.appendChild(div);
        tr.appendChild(th);
      }
    }

    thead.appendChild(tr);
    fragment.appendChild(thead);
  }

  component.DataGrid.prototype.createTfoot = function(fragment, props) {
    if ( props['isTfoot'] != null && props['isTfoot'] ) {
      const colModel = props['colModel'];
      const tfoot = document.createElement('tfoot');
      const tr = document.createElement('tr');
      for (let i = 0; i < colModel.length; i++) {
        const col = colModel[i];
        if (col['isHidden'] == null || !col['isHidden']) {
          const th = document.createElement('th');
          const div = document.createElement('div');
          const text = col['name'] != null ? col['name'] : '';
          div.classList.add('has-text-centered');
          div.setAttribute('data-ref-id', col['id']);
          div.setAttribute('title', text);
          div.innerText = text;
          // Sorting 기능 추가
          this.createSortingIcons(col, div, props);
          th.appendChild(div);
          tr.appendChild(th);
        }
      }
      tfoot.appendChild(tr);
      fragment.appendChild(tfoot);
    }
  }

  /**
   * Options
    isStrong: true // 강조
    isExcel: true // 엑셀컬럼
    align: 'center', 'right', 'left' // 텍스트 정렬
    type:
      - 'custom': function(col, row)
    isLink: true
      - href: 'xxx'
      - userCustom: function(anchor, col, row)
    isSort: true // 오름차순, 내림차순 기능
   */
  component.DataGrid.prototype.createTbody = function(parentFragment, props) {
    const colModel = props['colModel'];
    const rowData = props['data']['rowData'] != null ? props['data']['rowData'] : props['data'];

    const fragment = document.createDocumentFragment();
    if (rowData.length) {
      for (let i = 0; i < rowData.length; i++) {
        const row = rowData[i];
        const tr = document.createElement('tr');
        for (let j = 0; j < colModel.length; j++) {

          const col = colModel[j];
          const thOrTd = col['isStrong'] != null && col['isStrong'] ? document.createElement('th') : document.createElement('td');
          const value = col['isCurrency'] != null ? row[col['id']].toLocaleString() : row[col['id']];
          // Hidden cell
          if (col['isHidden'] != null || col['isHidden']) {
            thOrTd.classList.add('is-hidden');
            thOrTd.setAttribute('data-key', row[col['id']]);
            if (col['attributes'] != null) {
              const attributes = col['attributes'];
              for (const name in attributes) {
                const attrName = 'data-' + name;
                thOrTd.setAttribute(attrName, row[attributes[name]]);
              }
            }
          }
          // Excel
          if (col['isExcel'] != null && col['isExcel']) {
            thOrTd.setAttribute('data-excel-body', 'true');
            thOrTd.setAttribute('data-excel-value', value);
          }
          // 텍스트 정렬
          if (col['align'] != null) {
            if (col['align'] === 'center') {
              thOrTd.classList.add('has-text-centered');
            }
            if (col['align'] === 'right') {
              thOrTd.classList.add('has-text-right');
            }
          }
          // 사용자 커스텀
          if (col['type'] != null) {
            // 태그타입
            if (col['type'] === 'custom') {
              const text = col['name'] != null ? row[col['name']] : '';
              col['userCustom'] != null ? thOrTd.innerHTML = col['userCustom'](col, row) : '<span class="tag is-dark">' + text + '</span>';
            }
          } else {
            // Link 타입
            if (col['isLink'] != null && col['isLink']) { // a태그 존재
              const a = document.createElement('a');
              if (col['href'] != null) {
                a.href = col['href'];
              }
              if (col['userCustom'] != null) {
                col['userCustom'](a, col, row);
              }
              a.innerHTML = value;
              thOrTd.appendChild(a);
              if (col['hasBadge'] != null && row[col['hasBadge']]) { // row[col['hasBadge']] 컬럼의 값이 1이 되면 뱃지 생성
                const span = document.createElement('span');
                span.setAttribute('data-badge', col['hasBadgeText'] != null ? col['hasBadgeText'] : '확인필요');
                span.classList.add('ml-5');
                span.classList.add('has-badge-rounded');
                span.classList.add('has-badge-small');
                if (col['hasBadgeInline'] != null && col['hasBadgeInline']) {
                  span.classList.add('has-badge-inline');
                }
                if (col['hasBadgeOutlined'] != null && col['hasBadgeOutlined']) {
                  span.classList.add('has-badge-outlined');
                }
                span.classList.add('has-badge-danger');
                thOrTd.appendChild(span);
              }
            } else {
              thOrTd.innerHTML = value;
            }
          }
          // tr에 추가
          tr.appendChild(thOrTd);
        }
        fragment.appendChild(tr);
      }
    } else {
      // 조회 결과가 없을경우
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      // th.classList.add('has-text-centered');
      th.innerText = '조회 결과가 없습니다.';
      th.colSpan = colModel.length;
      tr.append(th);
      fragment.appendChild(tr);
    }
    const tbody = document.createElement('tbody');
    tbody.appendChild(fragment.cloneNode(true));
    parentFragment.appendChild(tbody);
  }

  component.DataGrid.prototype.createPagination = function(props) {
    const pagination = document.getElementById(props['pId']);
    cmmUtils.clearChildNodes(pagination);

    const fragment = document.createDocumentFragment();
    this.createPreviousButton(props, fragment);
    this.createNextButton(props, fragment);

    const ul = document.createElement('ul');
    ul.classList.add('pagination-list');
    const data = props['data'];

    // First of page
    if (1 < data['curRange']) {
      this.createFirstPage(ul);
    }

    // Current range
    this.createCenterPage(ul, data);

    // End of page
    if (data['startPage'] !== data['pageCnt'] && data['rangeSize'] < data['pageCnt']) {
      this.createEndPage(ul, data);
    }

    fragment.appendChild(ul);
    this.createPagingSelectBox(fragment, props);
    pagination.appendChild(fragment.cloneNode(true));
  }

  component.DataGrid.prototype.createPagingSelectBox = function(fragment, props) {
    const selectDiv = document.createElement('div');
    selectDiv.classList.add('select');
    selectDiv.classList.add('is-rounded');
    selectDiv.classList.add('is-small');
    selectDiv.classList.add('mr-4');
    const select = document.createElement('select');
    select.setAttribute('data-custom', 'pageSel');
    const sizeArr = ['10', '20', '30', '50', '100', '200', '300', '500', '1000', '2000', '3000'];
    for (let i = 0; i < sizeArr.length; i++) {
      const option = document.createElement('option');
      const optionSize  = sizeArr[i];
      option.value = optionSize;
      option.innerText = optionSize;
      if (props['body']['pageSize'] != null && parseInt(props['body']['pageSize']) === parseInt(optionSize)) {
        option.setAttribute('selected', 'selected');
      }
      select.appendChild(option);
    }
    selectDiv.appendChild(select);

    const iconDiv = document.createElement('div');
    iconDiv.classList.add('icon');
    iconDiv.classList.add('is-small');
    iconDiv.classList.add('is-left');
    const i = document.createElement('i');
    i.classList.add('fas');
    i.classList.add('fa-list-ol');
    iconDiv.appendChild(i);

    const control = document.createElement('div');
    control.classList.add('control');
    control.classList.add('has-icons-left');
    control.appendChild(selectDiv);
    control.appendChild(iconDiv);
    fragment.appendChild(control);
  }

  component.DataGrid.prototype.createFirstPage = function(ul) {
    // <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
    const anchor = document.createElement('a');
    anchor.innerText = '1';
    anchor.classList.add('pagination-link');
    anchor.setAttribute('aria-label', 'Goto page 1')
    anchor.setAttribute('data-custom', 'pageAnchor');
    anchor.setAttribute('data-page', '1');
    const endLi = document.createElement('li');
    endLi.appendChild(anchor);
    ul.appendChild(endLi);

    // <li><span class="pagination-ellipsis">&hellip;</span></li>
    const dotSpan = document.createElement('span');
    dotSpan.classList.add('pagination-ellipsis');
    dotSpan.innerHTML = '&hellip;';
    const dotLi = document.createElement('li');
    dotLi.appendChild(dotSpan);
    ul.appendChild(dotLi);
  }

  component.DataGrid.prototype.createCenterPage = function(ul, data) {
    const startPage = data['startPage'];
    const endPage = data['endPage'];

    for (let i = startPage; i <= endPage; i++) {
      const anchor = document.createElement('a');
      anchor.classList.add('pagination-link');
      anchor.innerText = i;
      anchor.setAttribute('aria-label', 'Goto page ' + i);
      anchor.setAttribute('data-custom', 'pageAnchor');
      anchor.setAttribute('data-page', i);
      if (data['curPage'] === i) { // 현재페이지 표시
        anchor.classList.add('is-current');
        anchor.setAttribute('aria-current', 'page');
      }

      const li = document.createElement('li');
      li.appendChild(anchor);
      ul.appendChild(li);
    }
  }

  component.DataGrid.prototype.createEndPage = function(ul, data) {
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
    const anchor = document.createElement('a');
    anchor.innerText = pageCnt;
    anchor.classList.add('pagination-link');
    anchor.setAttribute('aria-label', 'Goto page' + pageCnt)
    anchor.setAttribute('data-custom', 'pageAnchor');
    anchor.setAttribute('data-page', pageCnt);
    const endLi = document.createElement('li');
    endLi.appendChild(anchor);
    ul.appendChild(endLi);
  }

  component.DataGrid.prototype.createPreviousButton = function(props, fragment) {
    const data = props['data'];
    if ( (props['isNextButton'] == null) || (props['isNextButton'] != null && props['isNextButton']) ) {
      if (data['curPage'] !== 1) {
        const button = document.createElement('button');
        button.classList.add('button');
        button.classList.add('pagination-previous');
        button.setAttribute('data-custom', 'pageAnchor');
        button.setAttribute('data-page', data['prevPage']);
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');
        iconSpan.classList.add('is-small');
        const i = document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-arrow-alt-circle-left');
        iconSpan.appendChild(i);
        const textSpan = document.createElement('span');
        textSpan.innerText = '이전';
        button.appendChild(iconSpan);
        button.appendChild(textSpan);
        fragment.appendChild(button);
      }
    }
  }

  component.DataGrid.prototype.createNextButton = function(props, fragment) {
    const data = props['data'];
    if ( (props['isNextButton'] == null) || (props['isNextButton'] != null && props['isNextButton']) ) {
      if (data['nextPage'] <= data['pageCnt']) {
        const button = document.createElement('button');
        button.classList.add('button');
        button.classList.add('pagination-next');
        button.setAttribute('data-custom', 'pageAnchor');
        button.setAttribute('data-page', data['nextPage']);
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');
        iconSpan.classList.add('is-small');
        const i = document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-arrow-alt-circle-right');
        iconSpan.appendChild(i);
        const textSpan = document.createElement('span');
        textSpan.innerText = '다음';
        button.appendChild(iconSpan);
        button.appendChild(textSpan);
        fragment.appendChild(button);
      }
    }
  }

  component.DataGrid.prototype.showAndHideIconAndInit = function(table, clickedThRefId, props) {
    const theadDivArr = table.querySelector('thead').querySelectorAll('[data-ref-id=' + clickedThRefId + ']');
    // Thead 정렬 아이콘 변경
    for (let i = 0; i < theadDivArr.length; i++) {
      this.changeIconClass(theadDivArr[i]);
    }
    // Tfoot 이 존재한다면 똑같이 정렬 아이콘 변경
    if (props['isTfoot'] != null && props['isTfoot']) {
      const tfootDivArr = table.querySelector('tfoot').querySelectorAll('[data-ref-id=' + clickedThRefId + ']');
      for (let i = 0; i < tfootDivArr.length; i++) {
        this.changeIconClass(tfootDivArr[i]);
      }
    }
  }

  component.DataGrid.prototype.updateOrderByParam = function(table) {
    const bodyData = this.props['body'];
    const theadDivArr = table.querySelector('thead').querySelectorAll('div');
    const newOrderBy = [];
    for (let i = 0; i < theadDivArr.length; i++) {
      const div = theadDivArr[i];
      if (div.hasAttribute('data-sort')) { // 정렬하겠다 선언한 컬럼만
        const dataSort = div.getAttribute('data-sort');
        const dataRefId = div.getAttribute('data-ref-id');
        if (dataSort === '1') { // 오름차순
          newOrderBy.push({column: dataRefId});
        }
        if (dataSort === '2') { // 내림차순
          newOrderBy.push({column: dataRefId, desc: true});
        }
      }
    }
    if (newOrderBy.length) {
      bodyData['orderBy'] = newOrderBy;
    } else {
      if (bodyData['orderBy'] != null) {
        delete bodyData['orderBy'];
      }
    }
  }

  component.DataGrid.prototype.changeIconClass = function(th) {
    const currentDataSort = th.getAttribute('data-sort');
    let changedDataSort;
    // Sorting 값 변경
    switch (currentDataSort) {
      case '0': changedDataSort = '1'; break; //오름차순으로 변경
      case '1':changedDataSort = '2'; break; // 내림차순으로 변경
      default: changedDataSort = '0'; break; // 정렬해제
    }
    th.setAttribute('data-sort', changedDataSort);
    // svg 아이콘 클래스 변경
    const svgArr = th.querySelectorAll('svg');
    for (let j = 0; j < svgArr.length; j++) {
      const svg = svgArr[j];
      changedDataSort === svg.getAttribute('data-sort')
        ? svg.classList.remove('is-hidden')
        : svg.classList.add('is-hidden');
    }
  }

  component.DataGrid.prototype.getDefaultDataSort = function(refId, props) {
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

  component.DataGrid.prototype.createSortingIcons = function(col, div, props) {
    if (col['isSort'] != null && col['isSort']) { // 정렬을 선언한 키값만 추가
      div.setAttribute('data-custom', 'sortingDiv');
      div.classList.add('hover');
      div.classList.add('cursor');
      const defaultDataSort = this.getDefaultDataSort(col['id'], props);
      div.setAttribute('data-sort', defaultDataSort);
      div.appendChild(cmmUtils.createIcon(['fas', 'fa-sort-alpha-up'], [{attrName: 'data-sort', value: '1'}], function(span) {
        span.classList.add('has-text-info'); // 파란색
        if (defaultDataSort !== '1') {
          span.classList.add('is-hidden');
        }
      }));
      div.appendChild(cmmUtils.createIcon(['fas', 'fa-sort-alpha-down'], [{attrName: 'data-sort', value: '2'}], function(span) {
        span.classList.add('has-text-info'); // 파란색
        if (defaultDataSort !== '2') {
          span.classList.add('is-hidden');
        }
      }));
    }
  }

  component.DataGrid.prototype.changeGridPage = function(page) {
    this.props['body']['curPage'] = page;
    this.init(this.props);
  }

  component.DataGrid.prototype.sortGrid = function(clickedThRefId) {
    const eId = this.props['eId'];
    const table = document.getElementById(eId);
    this.showAndHideIconAndInit(table, clickedThRefId, this.props);
    this.updateOrderByParam(table) // 전송데이터에 정렬값을 반영
    this.init(this.props);
  }

  component.DataGrid.prototype.addTableEventListeners = function(table, props) {
    const me = this;
    addSelectingTr();
    addSortingDiv();

    // Row 클릭시 하이라이트 이벤트
    function addSelectingTr() {
      const tbodyTrArr = table.querySelector('tbody').querySelectorAll('tr');
      if (tbodyTrArr.length) {
        // 선택한 Row 는 하이라이트
        for (let i = 0; i < tbodyTrArr.length; i++) {
          const tr = tbodyTrArr[i];
          tr.addEventListener('click', function() { // Tr 클릭시 라이라이트
            // 선택 초기화
            for (let j = 0; j < tbodyTrArr.length; j++) {
              tbodyTrArr[j].classList.remove('is-selected');
            }
            this.classList.add('is-selected');
          });
        }
      }
    }

    // Thead 또는 Tfoot 을 눌렀을경우 정렬 이벤트
    function addSortingDiv() {
      const divArr = table.querySelectorAll('div[data-custom=sortingDiv]');
      for (let i = 0; i < divArr.length; i++) {
        const div = divArr[i];
        div.addEventListener('click', function() {
          me.sortGrid(this.getAttribute('data-ref-id'));
        });
      }
    }
  }

  component.DataGrid.prototype.addPaginationEventListeners = function(paginationBar, props) {
    const me = this;
    addPageAnchor();
    addChangingPageSize();

    // 페이지 변경 이벤트
    function addPageAnchor() {
      const pageAnchors = paginationBar.querySelectorAll('[data-custom=pageAnchor]');
      for (let i = 0; i < pageAnchors.length; i++) {
        pageAnchors[i].addEventListener('click', function() {
          me.changeGridPage(this.getAttribute('data-page'));
        })
      }
    }

    // 페이지 사이즈수 변경 이벤트
    function addChangingPageSize() {
      const pageSelectBoxes = paginationBar.querySelectorAll('select[data-custom=pageSel]');
      for (let i = 0; i < pageSelectBoxes.length; i++) {
        const selectBox = pageSelectBoxes[i];
        selectBox.addEventListener('change', function() {
          me.props['body']['pageSize'] = this.value;
          me.init(me.props);
        })
      }
    }
  }

  // 엑셀 다운로드
  component.DataGrid.prototype.downloadExcel = function(props) {

    const table = document.getElementById(props['eId']);
    const form = document.createElement('form');
    form.action = CONTEXT_PATH + '/common/download-excel';
    form.method = 'POST';

    // Excel header
    const header = table.querySelector('thead').querySelectorAll('[data-excel-header]');
    for (let i = 0; i < header.length; i++) {
      appendInputTag('header', header[i].getAttribute('data-excel-value'), form);
    }
    // Excel body
    const bodyTr = table.querySelector('tbody').querySelectorAll('tr');
    for (let i = 0; i < bodyTr.length; i++) {
      const row = bodyTr[i];
      const excelCols = row.querySelectorAll('[data-excel-body=true]');
      for (let j = 0; j < excelCols.length; j++) {
        const name = 'body[' + i + ']';
        appendInputTag(name, cmmUtils.nvl(excelCols[j].getAttribute('data-excel-value')), form);
      }
    }
    // 파일명
    appendInputTag('fileName', props['fileName'] != null ? props['fileName'] : '엑셀파일', form);

    document.body.appendChild(form);
    form.submit();
    form.remove();

    function appendInputTag(name, value, form) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }
  }

}