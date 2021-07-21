/**
 * Bulma.css 기반으로한 그리드 컴포넌트
 */
BeeComponents.modules.dataGrid = function(component) {

  let listeners = {};

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
    me.resetListeners();
    const body = props['body'];
    body['curPage'] = body['curPage'] != null ? body['curPage'] : 1;

    // 페이징 사이즈
    if (props['pId'] != null) {
      const pagenation = document.getElementById(props['pId']).querySelector('[data-custom=pageSel]');
      if (body['pageSize'] == null) {
        body['pageSize'] = pagenation != null ? pagenation.value : 100;
      }
    }

    if (props['loading'] != null) {
      cmmUtils.showLoadingElement(document.getElementById(props['loading']));
    }
    if (props['isPageLoader'] != null && props['isPageLoader']) {
      cmmUtils.showPageLoader();
    }

    cmmUtils.axiosPost({
      url: props['url'],
      body: body
    }, function (response) {

      props['data'] = response; // 결과값을 추가함
      props['rowData'] = props['data']['rowData'] != null ? props['data']['rowData'] : props['data'];

      const table = document.getElementById(props['eId']);
      const tbody = table.querySelector('tbody');
      const fragment = document.createDocumentFragment();

      // 헤더를 초기화 하는 경우
      if (props['refreshHeader'] != null && props['refreshHeader']) {
        cmmUtils.clearChildNodes(table);
        me.createThead(fragment, props);
        me.createTfoot(fragment, props);
        me.createTbody(fragment, props); // Tbody 생성(Tbody 새롭게 생성)
      } else {
        cmmUtils.clearChildNodes(tbody ? tbody : table);
        if (!tbody) {
          me.createThead(fragment, props);
          me.createTfoot(fragment, props);
        }
        me.createTbody(fragment, props, tbody); // Tbody 생성(기존에 있던 Tbody에)
      }

      // 마지막으로 테이블에 추가
      table.appendChild(fragment);

      // 테이블 이벤트 추가
      me.addTableEventListeners(table, props, tbody);

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

      if (props['loading'] != null) cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
      if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.hidePageLoader();

    });

  }

  // 기존에 저장된 소팅 이벤트를 초기화한다(재생성 하면서 이벤트는 다시 생성됨).
  component.DataGrid.prototype.resetListeners = function() {
    if (!cmmUtils.isEmptyObject(listeners)) {
      const divArr = document.querySelectorAll('div[data-custom=sortingDiv]');
      divArr.forEach(function(e) {
        e.removeEventListener('click', listeners[e.dataset.key]);
      });
      listeners = {};
    }
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
    const maxLen = colModel.length;

    for (let i = 0; i < maxLen; i++) {
      const col = colModel[i];
      if (col['isHidden'] == null || !col['isHidden']) {
        const th = document.createElement('th');
        const div = document.createElement('div');
        div.classList.add('flex-row');
        div.classList.add('justify-content-center');

        // Excel
        if (col['isExcel'] != null && col['isExcel']) {
          div.setAttribute('data-excel-header', 'true');
          div.setAttribute('data-excel-value', col['name']);
        }

        // Width
        if (col['id'] != null && col['id'] === 'rowNum') {
          th.style.width = '60px';
          // div.style.width = '60px';
        } else {
          if (col['width'] != null) {
            th.style.minWidth = col['width'];
            // div.style.width = col['width'];
          }
        }

        div.classList.add('has-text-centered');
        if (col['id'] != null) {
          div.setAttribute('data-ref-id', col['id']);
        }
        div.setAttribute('title', col['name'] != null ? col['name'] : '');

        if (col['userCustomHeader'] != null) {
          col['userCustomHeader'](div, col, props);
        } else {
          div.innerText = col['name'] != null ? col['name'] : '';
        }

        // Sorting 기능 추가
        this.createSortingIcons(col, div, props);

        // 앞에 추가적인 커스텀 요소가 있을 경우
        if (col['frontHeader'] != null) {
          const parentDiv = document.createElement('div');
          parentDiv.classList.add('flex-row');
          parentDiv.classList.add('justify-content-center');
          parentDiv.appendChild(col['frontHeader'](col, props));
          parentDiv.appendChild(div);
          th.appendChild(parentDiv);
        } else {
          th.appendChild(div);
        }

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
      const maxLen = colModel.length;

      for (let i = 0; i < maxLen; i++) {
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
          if (col['id'] != null && col['id'] === 'rowNum') {
            th.style.width = '60px';
          }
          if (col['width'] != null) {
            th.style.width = col['width'];
            div.style.width = col['width'];
          }

          // 앞에 추가적인 커스텀 요소가 있을 경우
          if (col['frontHeader'] != null) {
            const parentDiv = document.createElement('div');
            parentDiv.classList.add('flex-row');
            parentDiv.classList.add('justify-content-center');
            parentDiv.appendChild(col['frontHeader'](col, props));
            parentDiv.appendChild(div);
            th.appendChild(parentDiv);
          } else {
            th.appendChild(div);
          }
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
  component.DataGrid.prototype.createTbody = function(parentFragment, props, tbody) {

    const colModel = props['colModel'];
    const rowData = props['rowData'];
    const tbodyFragment = document.createDocumentFragment();
    const maxLen = rowData.length;

    if (maxLen) {
      for (let i = 0; i < maxLen; i++) {
        const row = rowData[i];
        const tr = document.createElement('tr');
        const maxColLen = colModel.length;
        for (let j = 0; j < maxColLen; j++) {

          const col = colModel[j];
          const thOrTd = col['isStrong'] != null && col['isStrong'] ? document.createElement('th') : document.createElement('td');
          let value = col['isCurrency'] != null ? row[col['id']].toLocaleString() : row[col['id']];
          if (col['zeroRpad'] != null && col['zeroRpad']) {
            value = cmmUtils.addZeroStr(value);
          }

          if (col['toFixed'] != null) {
            value = value.toFixed(col['toFixed']);
          }

          if (col['dotText'] != null) {
            value = cmmUtils.convertDotText(value, col['dotText'])
          }

          value = col['prefixText'] != null ? value + col['prefixText'] : value;
          row['excelText'] = null; // 엑센전용으로 변경할 경우 사용

          // Tooltip
          if (col['hasTooltip'] != null) {
            if (col.hasTooltip.valueOnly != null && col.hasTooltip.valueOnly) {
              thOrTd.dataset.tooltip = row[col.hasTooltip.col];
            } else {
              thOrTd.dataset.tooltip = row[col.hasTooltip.col] + ' ' + col['name'];
            }
            if (col.hasTooltip.placement != null) {
              thOrTd.classList.add('has-tooltip-' + col.hasTooltip.placement);
            } else {
              thOrTd.classList.add('has-tooltip-left');
            }
          }

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
              thOrTd.innerHTML = col['userCustom'] != null ? col['userCustom'](col, row, thOrTd, props) : '<span class="tag is-dark">' + value + '</span>';
            }
            if (col['type'] === 'node') {
              if (col['userCustom'] != null) {
                thOrTd.appendChild(col['userCustom'](col, row, thOrTd, props));
              } else {
                thOrTd.innerHTML = '<span class="tag is-dark">' + value + '</span>';
              }
            }
          } else {
            // Link 타입
            if (col['isLink'] != null && col['isLink']) { // a태그 존재
              const a = document.createElement('a');
              if (col['href'] != null) {
                a.href = col['href'];
              }
              if (col['userCustom'] != null) {
                col['userCustom'](a, col, row, props);
              }
              a.innerHTML = value;
              thOrTd.appendChild(a);
              // 뱃지 생성
              if (col['hasBadge'] != null && row[col['hasBadge']]) { // row[col['hasBadge']] 컬럼의 값이 1이 되면 뱃지 생성
                const button = document.createElement('button');
                button.classList.add('button');
                button.classList.add('is-small');
                button.classList.add('is-ghost');
                // 뱃지 추가
                const span = document.createElement('span');
                span.classList.add('badge');
                span.classList.add('is-top');
                span.classList.add('is-primary');
                span.innerText = col['hasBadgeText'];
                if (col['hasBadgeOutlined'] != null && col['hasBadgeOutlined']) {
                  span.classList.add('is-outlined');
                }
                button.appendChild(span);
                thOrTd.appendChild(button);
              }
            } else {
              thOrTd.innerHTML = value;
            }
          }
          // Excel
          if (col['isExcel'] != null && col['isExcel']) {
            thOrTd.setAttribute('data-excel-body', 'true');
            thOrTd.setAttribute('data-excel-value', row['excelText'] ? row['excelText'] : value);
          }
          // tr에 추가
          tr.appendChild(thOrTd);
        }
        tbodyFragment.appendChild(tr);
      }
    } else {
      // 조회 결과가 없을경우
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      // th.classList.add('has-text-centered');
      th.innerText = props['emptyRowMsg'] != null ? props['emptyRowMsg'] : '조회 결과가 없습니다.';
      th.colSpan = colModel.length;
      tr.append(th);
      tbodyFragment.appendChild(tr);
    }
    if (!tbody) {
      const newTbody = document.createElement('tbody');
      newTbody.appendChild(tbodyFragment);
      parentFragment.appendChild(newTbody);
    } else {
      tbody.appendChild(tbodyFragment);
      parentFragment.appendChild(tbody);
    }
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
    if (props['showPageSelectBox'] == null || props['showPageSelectBox']) this.createPagingSelectBox(fragment, props);
    pagination.appendChild(fragment.cloneNode(true));
  }

  component.DataGrid.prototype.createPagingSelectBox = function(fragment, props) {
    const selectDiv = document.createElement('div');
    selectDiv.classList.add('select');
    selectDiv.classList.add('is-small');
    selectDiv.classList.add('mr-4');
    const select = document.createElement('select');
    select.setAttribute('data-custom', 'pageSel');
    const sizeArr = ['10', '20', '30', '50', '100', '200', '300', '500'];
    const maxLen = sizeArr.length;

    for (let i = 0; i < maxLen; i++) {
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

  component.DataGrid.prototype.createNextButton = function(props, fragment) {
    const data = props['data'];
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

  component.DataGrid.prototype.showAndHideIconAndInit = function(table, clickedThRefId, props) {
    const theadDivArr = table.querySelector('thead').querySelectorAll('[data-ref-id=' + clickedThRefId + ']');
    const maxLen = theadDivArr.length;
    // Thead 정렬 아이콘 변경
    for (let i = 0; i < maxLen; i++) {
      this.changeIconClass(theadDivArr[i], table, props);
    }
  }

  component.DataGrid.prototype.updateOrderByParam = function(table, props) {
    const theadDivArr = table.querySelector('thead').querySelectorAll('div');
    const newOrderBy = [];
    const maxLen = theadDivArr.length;

    for (let i = 0; i < maxLen; i++) {
      const div = theadDivArr[i];
      if (div.hasAttribute('data-sort')) { // 정렬하겠다 선언한 컬럼만
        const dataSort = div.getAttribute('data-sort');
        const dataRefId = div.getAttribute('data-ref-id');
        if (dataSort === '1') { // 내림차순2
          newOrderBy.push({column: dataRefId, desc: true});
        }
        if (dataSort === '2') { // 오름차순
          newOrderBy.push({column: dataRefId});
        }
      }
    }
    if (newOrderBy.length) {
      props.body.orderBy = newOrderBy;
    } else {
      if (props.body.orderBy != null) {
        delete props.body.orderBy;
      }
    }
  }

  // 정렬 아이콘 변경
  component.DataGrid.prototype.changeIconClass = function(selectedTh, table, props) {

    // 싱글 정렬을 활성화했을 경우에는 이전 정렬을 모두 초기화
    if (props['singleSorting'] != null && props['singleSorting']) resetSortingClasses(table, selectedTh);

    const currentDataSort = selectedTh.getAttribute('data-sort');
    let changedDataSort;
    // Sorting 값 변경
    switch (currentDataSort) {
      case '0': changedDataSort = '1'; break; // 내림차순으로 변경
      case '1':changedDataSort = '2'; break; // 오름차순으로 변경
      default: changedDataSort = '0'; break; // 정렬해제
    }
    selectedTh.setAttribute('data-sort', changedDataSort);

    // svg 아이콘 클래스 변경
    const svgArr = selectedTh.querySelectorAll('svg');
    const maxLen = svgArr.length;
    for (let j = 0; j < maxLen; j++) {
      const svg = svgArr[j];
      if (svg.classList.contains('sortingIcon')) {
        changedDataSort === svg.dataset.sort ? svg.classList.remove('is-hidden') : svg.classList.add('is-hidden');
      }
    }

    // 정렬 초기화
    function resetSortingClasses(table, selectedTh) {
      // 정렬 값 초기화
      const sortingDiv = table.querySelectorAll('[data-custom=sortingDiv]');
      let divLen = sortingDiv.length;
      for (let i = 0; i < divLen; i++) {
        const div = sortingDiv[i];
        if (div.dataset.refId !== selectedTh.dataset.refId) { // 클릭한 th 가 아닌것만 초기화
          div.dataset.sort = '0'; // 초기화
        }
      }
      // 아이콘 초기화
      const svgArr = table.querySelectorAll('svg');
      const svgLen = svgArr.length;
      for (let i = 0; i < svgLen; i++) {
        const svg = svgArr[i];
        if (svg.dataset.sort !== undefined) {
          svgArr[i].classList.add('is-hidden');
        }
      }
    }
  }

  component.DataGrid.prototype.getDefaultDataSort = function(refId, props) {
    // 정렬값이 존재할 경우만 처리
    if (props['body'] != null && props['body']['orderBy'] != null) {
      const orderBy = props['body']['orderBy'];
      let isExisted = false;
      const maxLen =  orderBy.length;

      for (let i = 0; i < maxLen; i++) {
        const sortObj = orderBy[i];
        if (refId === sortObj.column) {
          isExisted = true;
          return sortObj['desc'] != null && sortObj['desc'] ? '1' : '2'; // 1 -> Descending, 2 -> Ascending
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
      div.setAttribute('data-key', cmmUtils.getUUID());
      div.classList.add('hover');
      div.classList.add('cursor');
      const defaultDataSort = this.getDefaultDataSort(col['id'], props);
      div.setAttribute('data-sort', defaultDataSort);
      // 내림차순
      div.appendChild(cmmUtils.createIcon(['fas', 'fa-sort-alpha-up', 'sortingIcon'], [{attrName: 'data-sort', value: '2'}], function(span) {
        span.classList.add('has-text-info'); // 파란색
        if (defaultDataSort !== '2') {
          span.classList.add('is-hidden');
        }
      }));
      // 오름차순순
      div.appendChild(cmmUtils.createIcon(['fas', 'fa-sort-alpha-down', 'sortingIcon'], [{attrName: 'data-sort', value: '1'}], function(span) {
        span.classList.add('has-text-info'); // 파란색
        if (defaultDataSort !== '1') {
          span.classList.add('is-hidden');
        }
      }));
    }
  }

  component.DataGrid.prototype.changeGridPage = function(page, props) {
    props['body']['curPage'] = page;
    this.init(props);
  }

  component.DataGrid.prototype.sortGrid = function(clickedThRefId, props) {
    const eId = props['eId'];
    const table = document.getElementById(eId);
    this.showAndHideIconAndInit(table, clickedThRefId, props);
    this.updateOrderByParam(table, props) // 전송데이터에 정렬값을 반영
    this.init(props);
  }

  component.DataGrid.prototype.addTableEventListeners = function(table, props, tbody) {

    const me = this;
    // Row 클릭시 하이라이트 이벤트
    const tbodyTrArr = table.querySelector('tbody').querySelectorAll('tr');
    const tbodyTrLen = tbodyTrArr.length;

    if (tbodyTrLen) {
      // 선택한 Row 는 하이라이트
      for (let i = 0; i < tbodyTrLen; i++) {
        const tr = tbodyTrArr[i];
        tr.addEventListener('click', function() { // Tr 클릭시 라이라이트
          // 선택 초기화
          for (let j = 0; j < tbodyTrLen; j++) {
            tbodyTrArr[j].classList.remove('is-selected');
          }
          this.classList.add('is-selected');
        });
      }
    }

    // Thead 또는 Tfoot 을 눌렀을경우 정렬 이벤트
    const divArr = table.querySelectorAll('div[data-custom=sortingDiv]');
    const divLen = divArr.length;
    for (let i = 0; i < divLen; i++) {
      const div = divArr[i];
      const refId = div.getAttribute('data-ref-id');
      const key = div.getAttribute('data-key');
      // init 할때 이벤트 리스터는 모두 제거하고 새로 추가하는 방식으로
      (function outerfunction(refId, props) {
        const listener = function(e) {
          me.sortGrid(refId, props);
        }
        div.addEventListener("click", listener);
        listeners[key] = listener;
      })(refId, props);
    }

  }

  component.DataGrid.prototype.addPaginationEventListeners = function(paginationBar, props) {
    const me = this;
    addPageAnchor();
    if (props['showPageSelectBox'] == null || props['showPageSelectBox']) addChangingPageSize();

    // 페이지 변경 이벤트
    function addPageAnchor() {
      const pageAnchors = paginationBar.querySelectorAll('[data-custom=pageAnchor]');
      const pageAnchorLen = pageAnchors.length;
      for (let i = 0; i < pageAnchorLen; i++) {
        pageAnchors[i].addEventListener('click', function() {
          me.changeGridPage(this.getAttribute('data-page'), me.props);
        })
      }
    }

    // 페이지 사이즈수 변경 이벤트
    function addChangingPageSize() {
      const pageSelectBoxes = paginationBar.querySelectorAll('select[data-custom=pageSel]');
      const pageSelBoxLen = pageSelectBoxes.length;
      for (let i = 0; i < pageSelBoxLen; i++) {
        const selectBox = pageSelectBoxes[i];
        selectBox.addEventListener('change', function() {
          me.props['body']['pageSize'] = this.value;
          me.props['body']['curPage'] = 1;
          me.init(me.props);
        })
      }
    }
  }

  // 엑셀 다운로드
  component.DataGrid.prototype.downloadExcel = function(props) {

    const table = document.getElementById(props['eId']);
    const form = document.createElement('form');
    form.action = CONTEXT_PATH + '/common/download-excel.do';
    form.method = 'POST';

    // Excel header
    const header = table.querySelector('thead').querySelectorAll('[data-excel-header]');
    const headerLen = header.length;
    for (let i = 0; i < headerLen; i++) {
      appendInputTag('header', header[i].getAttribute('data-excel-value'), form);
    }
    // Excel body
    const bodyTr = table.querySelector('tbody').querySelectorAll('tr');
    const trLen = bodyTr.length
    for (let i = 0; i < trLen; i++) {
      const row = bodyTr[i];
      const excelCols = row.querySelectorAll('[data-excel-body=true]');
      const colLen = excelCols.length;
      for (let j = 0; j < colLen; j++) {
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