const COMPONENTS = BeeComponents('dataGrid', 'chart', function(box) {});
const main = (function() {

  let global = {
    profileId: null,
    profileTitle: null,
    selectedIdeaId: null,
    chart: undefined,
    ckEditNewIdeaCont: undefined,
    newIdeaWordCount: 0,
    ckEditModIdeaCont: undefined,
    modIdeaWordCount: 0,
    ckEditProfileInfo: undefined,
    quarterId: null,
    comparisonQuarter: 1, // 기본은 1분기전
    comparisonQuarterDate: null,
    selectedQuarterDate: null,
    selectedBarChartFilter: 'marketPrice',
    selectedBarChartFilterText: '시가평가액',
    selectedItemName: null,
    selectedItemCode: null,
    leftItemCodeChartData: undefined,
    rightItemCodeChartData: undefined,
    sortedDataArr: [],
    tabView: 'grid', // 엑티브된 탭정보를 가지고있는 변수(초기 설정은 그리드)
    isInitiatedSpinner: false,
    linkArrDelimiter: '#,#', // 참고자료 링크 배열 구분자
    linkInfoDelimiter: '#^#', // 참고자료 링크 정보 구분자
    gridData: undefined,
    selectedProfileType: null,
    isInitialedSpinner: false, // 스피너 생성 되었는지 확인
    width: {
      itemNameType1: '250px',
      itemNameType2: '350px',
      viewWeight: '60px', // 비중
      quantity: '110px', // 보유수량
      buyingPrice: '100px', // 평균 매수가
      currPrice: '80px', // 현재가
      earnRate: '170px', // 수익률
      buyingSellingPrice: '170px', //매수매도금액
      incsRate: '120px' // 증감률
    },
    visualMap: {
      show: false,
      pieces: [{
        gt: 0,
        lte: 1,
        color: '#3273DC'
      }, {
        gt: 1,
        color: '#3273DC'
      }],
      outOfRange: {
        color: '#F14668'
      }
    },
    defaultColorArr: [
      '#d43d51',
      '#e68a49',
      '#e5b95d',
      '#bfc669',
      '#5ba268',
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#7caf67',
      '#9a60b4',
      '#9dbb66',
      '#ea7ccc',
      '#e6a250',
      '#fa4d56',
      '#8a3ffc',
      '#e37248',
      '#33b1ff',
      '#00876c',
      '#dd584b',
      '#007d79',
      '#ff7eb6',
      '#e2cf6f',
      '#6fdc8c',
      '#4589ff',
      '#d12771',
      '#39956a',
      '#d2a106',
      '#08bdba',
      '#bae6ff',
      '#ba4e00',
      '#d4bbff'
    ]

  };
  let ideaGrid = undefined;
  let profileGrid = undefined;
  let soldOutGrid = undefined;
  let newTransferGrid = undefined;
  let profileBarChart = undefined;
  let profilePieChart = undefined;
  let leftItemCodeChart = undefined;
  let rightItemCodeChart = undefined;
  let clipboard = undefined;

  function init() {
    createBreadCrumb();
    global.profileId = document.getElementById('profileId').value;
    global.selectedProfileType = document.getElementById('profileType').value;
    getProfileDetails();
    initQuarterSlider();
    addSpanStarEvent();
    initInvestIdea();
    initTooltips();
    addTabEventListener();
    addBarChartSelectBoxListener();
    addPieChartSelectBoxListener();
    addStackChartSelectBoxListener();
    setTooltips();
    if (global.selectedProfileType === '1') appendRightChartMsg(); // 국내인 경우 오른쪽 차트 팝업 안내문구 추가
    // setHelp();
    setSpinnerTitle();
    addSelectedLineChartFilterEvents();
    addRefreshEvent();
  }

  function createBreadCrumb() {
    const breadCrumbNav = document.getElementById('breadCrumbNav');
    let html = '';
    html += '<ul>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/home/dashboard.do">';
    html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
    html += '      <span>BeeStock</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-chart-line"></i></span>';
    html += '      <span>포트폴리오 분석</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function setTooltips() {
    cmmUtils.setTippy([{selector: '#refreshSwitchLabel', content: '활성화시 10분 간격으로 데이터를 새로고침하며<br/>최신 현재가를 반영하여 재계산합니다.', placement: 'right', allowHTML: true}]);
    if (document.getElementById('gridExcel')) cmmUtils.setExcelTippy(['#gridExcel']);
    if (document.getElementById('newTransferExcel')) cmmUtils.setExcelTippy(['#soldOutExcel']);
    if (document.getElementById('soldOutExcel')) cmmUtils.setExcelTippy(['#soldOutExcel']);
  }


  function setHelp() {
    const msg = '테이블표에서 Shift 키를 누른 후 마우스를 스크롤하면 횡스크롤이 가능합니다.';
    cmmUtils.setTippy([
      {selector: '#tab1Help', content: msg, placement: 'right'},
      {selector: '#tab2Help', content: msg, placement: 'right'},
      {selector: '#tab3Help', content: msg, placement: 'right'}
    ]);
  }

  function setSpinnerTitle() {
    const titleArr = document.getElementsByName('spinnerTitle');
    const len = titleArr.length;
    for (let i = 0; i < len; i++) {
      titleArr[i].innerHTML = '<span class="is-green mr-2">A</span><span>' + global.selectedQuarterDate + '</span>';
    }
  }

  function getProfileDetails() {
    const url = '/api/v1/analysis/profile/' + global.profileId;
    cmmUtils.axiosGet({url: url}, setProfileHeader);
  }

  // 분기 슬라이더 생성
  function initQuarterSlider() {
    const url = '/api/v1/analysis/profile/quarter-all/' + global.profileId;
    cmmUtils.axiosGet({url: url}, function(response) {
      clearQuarterCont();
      createQuarterSlider(response);
    });
  }

  function clearQuarterCont() {
    const quarterCont = document.getElementById('quarterCont');
    cmmUtils.clearChildNodes(quarterCont);
  }

  function createQuarterSlider(response) {
    const fragment = document.createDocumentFragment();
    const len = response.length;
    for (let i = 0; i < len; i++) {
      // 비어있는 분기를 확인함
      createDummyQuarter(i, response, fragment);
      // 존재하는 분기생성
      createExistedQuarter(response[i], fragment);
    }
    const quarterCont = document.getElementById('quarterCont');
    quarterCont.appendChild(fragment);
    addSlideButtonEvents(quarterCont);
    initSwiper();
  }

  function createDummyQuarter(i, response, fragment) {
    let isExisted = true;
    let loopNum;
    // 비어있는(미공시된) 분기를 체크하여 더미를 생성해줌
    if (i === 0) {
      if (response[i]['quarterDate'] !== cmmUtils.getLatestQuarter()) {
        // 최근 분기가 없음
        isExisted = false;
        loopNum = 1;
      }
    } else {
      if (response[i - 1]['quarterDate'] !== cmmUtils.getFrontQuarter(response[i]['quarterDate'])) {
        isExisted = false;
        loopNum = cmmUtils.getUnknownQuartersReverse(response[i - 1]['quarterDate'], response[i]['quarterDate']).length;
      }
    }
    // 미존재시 더미 분기 생성
    if (!isExisted) {
      for (let i = 0; i < loopNum; i++) {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        const button = document.createElement('button');
        button.classList.add('button');
        // button.classList.add('is-small');
        button.disabled = true;
        button.classList.add('is-danger');
        button.classList.add('is-inverted');
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');
        const icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-clock');
        iconSpan.appendChild(icon);
        const textSpan = document.createElement('span');
        textSpan.innerText = '미공시'
        button.append(iconSpan);
        button.append(textSpan);
        slide.appendChild(button);
        fragment.appendChild(slide);
      }
    }
  }

  function createExistedQuarter(quarter, fragment) {
    // 슬라이드 생성
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    const button = document.createElement('button');
    button.classList.add('button');
    // button.classList.add('is-small');
    button.classList.add('is-dark');
    button.classList.add('is-inverted');
    button.setAttribute('data-button', 'slide');
    button.setAttribute('data-key', quarter['quarterId']);
    button.setAttribute('data-quarter', quarter['quarterDate']);
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon');
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-clock');
    iconSpan.appendChild(icon);
    const textSpan = document.createElement('span');
    textSpan.innerText = quarter['quarterDate'];
    button.append(iconSpan);
    button.append(textSpan);
    slide.appendChild(button);
    fragment.appendChild(slide);
  }


  function initSwiper() {
    const slider = new Swiper('#quarterSlider', {
      slidesPerView: 7,
      centeredSlides: false,
      spaceBetween: 0,
      loop: false,
      grabCursor: true,
      navigation: {
        nextEl: '#quarterNext',
        prevEl: '#quarterPrev'
      },
      pagination: {
        el: '#quarterPagination',
        clickable: true
      }
    });
  }

  // 분기 버튼 이벤트 생성
  function addSlideButtonEvents(el) {
    const slideButtons = el.querySelectorAll('[data-button=slide]');
    if (slideButtons.length) {
      for (let i = 0; i < slideButtons.length; i++) {
        // 선택한 분기 클릭 이벤트
        slideButtons[i].addEventListener('click', function() {
          const that = this;
          global.quarterId = that.getAttribute('data-key');
          global.selectedQuarterDate = that.getAttribute('data-quarter');

          // 이벤트를 사용할 권한이 있는지 확인
          cmmUtils.axiosPost({
            url: '/api/v1/analysis/profile/is-available-event',
            body: {
              eventNum: 1, // 슬라이드 타임라인 이벤트 번호
              profileId: global.profileId,
              quarterDate: global.selectedQuarterDate
            }
          }, function (isAvailable) {
            if (isAvailable) {
              setSpinnerTitle();
              resetButtons(slideButtons);
              activeButton(that);
              showTab();
            } else {
              // 이용할 수 없음
              cmmUtils.showModal('standardModal');
            }
          });
        });
      }
      // 최근 분기 데이터를 기본으로 보여줌
      slideButtons[0].click();
    }

    // Clear button css
    function resetButtons(el) {
      for (let i = 0; i < el.length; i++) {
        el[i].classList.add('is-inverted');
      }
    }
    // Active button
    function activeButton(el) {
      el.classList.remove('is-inverted');
    }
  }

  function showTab() {
    switch (global.tabView) {
      case 'grid': initProfileGrid(); break;
      case 'barChart': initBarChart(); break;
      case 'soldOut': initSoldOutGrid(); break;
      case 'newTransfer': initNewTransferGrid(); break;
      case 'pieChart': initPieChart(); break;
    }
  }

  // 수익률 막대 표
  function earnRate(col, row) {
    row['excelText'] = row['earnRate'] + '%'; // 엑셀전용
    return cmmUtils.createAnalysisBar(row['earnRate']);
  }

  // 매수·금액 막대 표
  function buyingSellingPrice(col, row, thOrTd, props) {
    // 100분율 처리
    const bspArr = props.rowData.map(function(p) {
      return parseInt(p.buyingSellingPrice);
    });
    const maxValue = _.max(bspArr);
    const minValue = _.min(bspArr);

    // 비율 적용하여 결과값 생성
    let percent = 0;
    let v = parseInt(row.buyingSellingPrice);
    if (0 < v) { // 0 보다 큰경우
      const rate = (maxValue / 100);
      percent = (v / rate).toFixed(3);
      percent = percent < 1 ? 1 : percent; // 0.xx 단위는 1로 처리
    } else if (v < 0) { // 0 보다 작은경우
      const rate = Math.abs((minValue / 100));
      percent = (v / rate).toFixed(3);
      percent = -1 < percent ? -1 : percent; // 0.xx 단위는 1로 처리
    }

    const barDiv = cmmUtils.createAnalysisBar(parseInt(percent), v.toLocaleString());
    barDiv.classList.add('width-100-p');
    barDiv.classList.add('hover-main');

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('flex-row');
    chartDiv.classList.add('justify-content-center');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');
    chartDiv.innerHTML = '<span class="icon cursor" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 2)"><i class="fas fa-chart-line"></i></span>'

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('flex-row');
    resultDiv.classList.add('justify-content-center');
    resultDiv.classList.add('hover-parent');
    resultDiv.appendChild(barDiv);
    resultDiv.appendChild(chartDiv);
    return resultDiv;
  }

  // 증감율
  function incsRate(col, row) {
    let html = '';
    let text = '';
    if (row['prevQuarterCnt'] === 0) {
      text = global.comparisonQuarter + ' 분기 전 데이터 없음';
      html = '<div class="flex-row justify-content-center"><span class="tag is-warning is-light"><strong>' + text + '</strong></span></div>';
    } else {
      if (row['itemStatus']) { // 전량매도 또는 신규편입
        if (row['itemStatus'] === 1) {
          html = '<div class="flex-row justify-content-center hover-parent"><span class="tag is-success is-light hover-main">신규편입</span><span class="icon cursor ml-1 hover-sub" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><i class="fas fa-chart-line"></i></span></div>';
        }
        if (row['itemStatus'] === 2) {
          html = '<div class="flex-row justify-content-center hover-parent"><span class="tag is-danger is-light hover-main">전량매도</span><span class="icon cursor ml-1 hover-sub" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><i class="fas fa-chart-line"></i></span></div>';
        }
      } else { // 해당없음~
        let rate = row['incsRate'];
        if (rate === 0 ) {
          text = '0%';
          html = '<div class="flex-row justify-content-center hover-parent"><span class="is-dark hover-main">' + text + '</span>';
        } else if (0 < rate) {
          text = rate + '%';
          html = '<div class="flex-row justify-content-center hover-parent"><span class="has-text-link hover-main">' + text + '</span>';
        } else {
          text = rate + '%';
          html = '<div class="flex-row justify-content-center hover-parent"><span class="has-text-danger hover-main">' + text + '</span>';
        }
        // 차트 아이콘
        html = html + '<span class="icon cursor hover-sub" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 0)"><i class="fas fa-chart-line"></i></span></div>';
      }
    }
    row['excelText'] = text;
    return html;
  }

  // 종목명
  function titleAnchor(anchor, col, row) {
    showLeftChartModal(anchor, row);
  }
  function titleAnchor2(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-start');
    div.classList.add('hover-type1');

    const anchor = document.createElement('a');
    anchor.innerText = row['itemName'];
    anchor.classList.add('mr-3');
    anchor.addEventListener('click', async function() {
      global['selectedItemName'] = row['itemName'];
      global['selectedItemCode'] = row['itemCode'];

      document.getElementById('stackChartModalTitle').innerText = global['selectedItemName'] + ' 보유수량 비교';
      try {
        const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
        if (response.data) {
          cmmUtils.showModal('stackChartModal');
          initLeftItemCodeChart();
        } else {
          // 이용할 수 없음
          cmmUtils.showGuideModal({color: 'is-danger', header: 'Premium 등급 이상 전용화면'});
        }
      } catch (err) {
        console.error(err);
        cmmUtils.goToErrorPage(err);
      }
    });

    const span = document.createElement('span');
    span.classList.add('icon');
    span.classList.add('cursor');
    span.classList.add('has-clipboard');
    span.classList.add('hover-sub');
    span.dataset.clipboardText = row['itemName'] + '(' + row['itemCode'] + ')';
    span.dataset.clipboardAction = 'copy';
    // 클립보드 저장 툴팁 생성
    span.addEventListener('click', function() {
      span.classList.add('has-tooltip-right');
      span.dataset.tooltip = 'Copied!';
    });
    // 툴팁 제거
    span.addEventListener('mouseout', function() {
      span.classList.remove('has-tooltip-right');
      delete span.dataset.tooltip;
    });
    const i = document.createElement('i');
    i.classList.add('fas');
    i.classList.add('fa-clipboard');
    span.appendChild(i);

    div.appendChild(anchor);
    div.appendChild(span);
    return div;
  }

  // 비교 날짜를 우선적으로 가져옴
  function getComparisonQuarter(callback) {
    cmmUtils.axiosPost({
      url: '/api/v1/analysis/profile/comparison-q',
      body: {
        profileId: global.profileId,
        selectedQuarterDate: global.selectedQuarterDate,
        comparisonQuarter: global.comparisonQuarter
      }
    }, callback);
  }

  // xx 분기전 대비 보유수량 증감률 앞 추가 요소
  function incRateHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.id = 'sphDiv1';
    let html = '';
    html = html + '<div class="flex-row">';
    html = html + '  <div class="flex-col justify-content-center">';
    html = html + '    <p class="title is-6 cpTitle"><span class="is-orange mr-2">B</span><span>' + global['comparisonQuarterDate'] + '</span></p>';
    html = html + '  </div>';
    html = html + '</div>';
    div.innerHTML = html;
  }

  function spinnerHeader(col, props) {
    const div = document.createElement('div');
    div.classList.add('spinnerDiv');
    div.classList.add('flex-row');
    let html = '';
    html = html + '  <div>';
    html = html + '    <button class="button is-small spinner-minus">';
    html = html + '      <span class="icon is-small"><i class="fas fa-minus"></i></span>';
    html = html + '    </button>';
    html = html + '  </div>';
    html = html + '  <div class="control">';
    html = html + '    <input class="spinner input is-small spinner-count" type="text" value="1" maxLength="3" data-idx="0"/>';
    html = html + '  </div>';
    html = html + '  <div>';
    html = html + '    <button class="button is-small spinner-plus">';
    html = html + '      <span class="icon is-small"><i class="fas fa-plus"></i></span>';
    html = html + '    </button>';
    html = html + '  </div>';
    div.innerHTML = html;
    return div;
  }

  // 포트폴리오 그리드
  function initProfileGrid() {
    // 비교 날짜를 우선적으로 가져옴
    getComparisonQuarter(function(response) {

      global['comparisonQuarterDate'] = response.quarterDate;
      const body = {
        orderBy: [{column: 'viewWeight', desc: true}],
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate,
        profileType: global.selectedProfileType
      }
      // 페이징 사이즈
      const pagenation = document.getElementById('profileGridPagination').querySelector('[data-custom=pageSel]');
      body.pageSize = pagenation != null ? pagenation.value : 100;
      // 종목명 검색조건 추가
      if (document.getElementById('schItemName').value) {
        body.itemName = document.getElementById('schItemName').value;
      }

      const props = {
        url: '/api/v1/analysis/profile/paging-quarter-info',
        body: body,
        eId: 'profileGrid',
        pId: 'profileGridPagination',
        isThead: true,
        isTfoot: false,
        isPageLoader: false,
        singleSorting: true,
        refreshHeader: false,
        fileName: global.selectedQuarterDate,
        colModel: [
          {id: 'itemCode', isHidden: true},
          {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
          // {id: 'itemName', name: '종목명', width: global.selectedProfileType === '1' ? global.width.itemNameType1 : global.width.itemNameType2, isSort: true, align: 'left', isExcel: true, isLink: true, userCustom: titleAnchor},
          {id: 'itemName', name: '종목명', width: global.selectedProfileType === '1' ? global.width.itemNameType1 : global.width.itemNameType2, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor2},
          {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', isExcel: true, hasTooltip: 'itemName'},
          {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
          {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
          {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
          {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: 'itemName'},
          {id: 'buyingSellingPrice', name: '매수 · 매도금액', width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustom: buyingSellingPrice, isExcel: true, hasTooltip: 'itemName'},
          {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: incRateHeader, userCustom: incsRate, isExcel: true, hasTooltip: 'itemName'}
        ],
        success: function (data, _this) {

          global['gridData'] = data;
          if (!global['isInitialedSpinner']) {
            // 분기 스피너 생성
            cmmUtils.initSpinner(function(counter, idx) {
              // 카운트 변경시 재호출
              global['comparisonQuarter'] = counter;
              switch (idx) {
                case '0': initProfileGrid(); break;
                case '1': initNewTransferGrid(); break;
                case '2': initSoldOutGrid(); break;
              }
            });
            // Table tooptip
            cmmUtils.setTippy([{selector: '#sphDiv1', content: '<span class="is-green mr-2">A</span>와 <span class="is-orange">B</span> 기간의 주식수량을 비교하여 증감율을 표시합니다.', allowHTML: true}]);
            // Clipboard
            initClipboard();
          } else {
            const cpTitleArr = document.getElementsByClassName('cpTitle');
            const len = cpTitleArr.length;
            for (let i = 0; i < len; i++) {
              cpTitleArr[i].innerHTML = '<span class="is-orange mr-2">B</span><span>' + global['comparisonQuarterDate'] + '</span>';
            }
          }
          global['isInitialedSpinner'] = true;
        }
      }
      profileGrid = new COMPONENTS.DataGrid(props);
    });
  }

  // 신규편입 그리드
  function initNewTransferGrid() {
    // 증감율
    const newTransferIncsRate = function(col, row) {
      let text = '';
      let html = '<div class="flex-row align-content-center">';
      html = html + '<span class="tag is-success is-light">신규편입</span>';
      html = html + '<span class="icon cursor ml-1" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><i class="fas fa-chart-line"></i></span>';
      html = html + '<div/>';
      row['excelText'] = text;
      return html;
    }

    function newTransferSpinnerHeader(div, col, props) {
      div.classList.add('flex-row');
      div.classList.add('justify-content-center');
      div.id = 'sphDiv2';
      let html = '';
      html = html + '<div class="flex-row">';
      html = html + '  <div class="flex-col justify-content-center">';
      html = html + '    <p class="title is-6 cpTitle">' + global['comparisonQuarterDate'] + ' C%</p>';
      html = html + '  </div>';
      html = html + '</div>';
      div.innerHTML = html;
    }

    const props = {
      url: '/api/v1/analysis/profile/quarter-info',
      body: {
        orderBy: [{column: 'viewWeight', desc: true}],
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate,
        profileType: global.selectedProfileType,
        itemStatus: 1
      },
      eId: 'newTransferGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: false,
      singleSorting: true,
      refreshHeader: false,
      fileName: global.selectedQuarterDate + '_신규편입',
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', width: global.selectedProfileType === '1' ? global.width.itemNameType1 : global.width.itemNameType2, isSort: true, align: 'left', isExcel: true, isLink: true, userCustom: titleAnchor},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', isExcel: true, hasTooltip: 'itemName'},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: 'itemName'},
        {id: 'buyingSellingPrice', name: '매수 · 매도금액', width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustom: buyingSellingPrice, isExcel: true, hasTooltip: 'itemName'},
        {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: newTransferSpinnerHeader, userCustom: newTransferIncsRate, isExcel: true, hasTooltip: 'itemName'}
      ],
      success: function (data, _this) {
        cmmUtils.setTippy({selector: '#sphDiv2', content: 'C%: Change percent(대상기간의 보유수량 증감률)'});
      }
    }
    newTransferGrid = new COMPONENTS.DataGrid(props);
  }

  // 전량매도 그리드
  function initSoldOutGrid() {
    // 증감율
    const soldOutIncRate = function(col, row) {
      let text = '';
      let html = '<div class="flex-row align-content-center">';
      html = html + '<span class="tag is-danger is-light">전량매도</span>';
      html = html + '<span class="icon cursor ml-1" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><i class="fas fa-chart-line"></i></span>';
      html = html + '</div>';
      row['excelText'] = text;
      return html;
    }

    function soldOutSpinnerHeader(div, col, props) {
      div.classList.add('flex-row');
      div.classList.add('justify-content-center');
      div.id = 'sphDiv3';
      let html = '';
      html = html + '<div class="flex-row">';
      html = html + '  <div class="flex-col justify-content-center">';
      html = html + '    <p class="title is-6 cpTitle">' + global['comparisonQuarterDate'] + ' C%</p>';
      html = html + '  </div>';
      html = html + '</div>';
      div.innerHTML = html;
    }

    const props = {
      url: '/api/v1/analysis/profile/quarter-info',
      body: {
        orderBy: [{column: 'itemName'}],
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate,
        profileType: global.selectedProfileType,
        itemStatus: 2 // 전량매도
      },
      eId: 'soldOutGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: false,
      singleSorting: true,
      refreshHeader: false,
      fileName: global.selectedQuarterDate + '_전량매도',
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', width: global.selectedProfileType === '1' ? global.width.itemNameType1 : global.width.itemNameType2, isSort: true, align: 'left', isExcel: true, isLink: true, userCustom: titleAnchor},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', isExcel: true, hasTooltip: 'itemName'},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, isExcel: true, hasTooltip: 'itemName'},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: 'itemName'},
        {id: 'buyingSellingPrice', name: '매수 · 매도금액', width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustom: buyingSellingPrice, isExcel: true, hasTooltip: 'itemName'},
        {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: soldOutSpinnerHeader, userCustom: soldOutIncRate, isExcel: true, hasTooltip: 'itemName'}
      ],
      success: function (data, _this) {
        cmmUtils.setTippy({selector: '#sphDiv3', content: 'C%: Change percent(대상기간의 보유수량 증감률)'});
      }
    }
    soldOutGrid = new COMPONENTS.DataGrid(props);
  }

  // 종목명 클릭시
  function showLeftChartModal(anchor, row) {
    anchor.addEventListener('click', async function() {
      global['selectedItemName'] = row['itemName'];
      global['selectedItemCode'] = row['itemCode'];

      document.getElementById('stackChartModalTitle').innerText = global['selectedItemName'] + ' 보유수량 비교';
      try {
        const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
        if (response.data) {
          cmmUtils.showModal('stackChartModal');
          initLeftItemCodeChart();
        } else {
          // 이용할 수 없음
          cmmUtils.showGuideModal({color: 'is-danger', header: 'Premium 등급 이상 전용화면'});
        }
      } catch (err) {
        console.error(err);
        cmmUtils.goToErrorPage(err);
      }
    })
  }

  async function showColLineChartModal(itemCode, itemName, filterIdx) {
    // filterIdx => 0: 보유수량, 1:시가평가액, 2:매수매도금액, 3: 평균매수가
    const args = arguments.length;
    try {
      const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
      if (response.data) {

        setSelectedLineChartFilter(args === 3 ? filterIdx : 0); // 보유수량을 기본으로
        document.getElementById('lineChartModalTitle').innerText = itemName;
        cmmUtils.showModal('colLineChartModal');
        global.selectedItemCode = itemCode;
        global.selectedItemName = itemName;
        initRightItemCodeChart();

      } else {
        // 이용할 수 없음
        cmmUtils.showGuideModal({color: 'is-danger', header: 'Premium 등급 이상 전용화면'});
      }
    } catch (err) {
      console.error(err);
      cmmUtils.goToErrorPage(err);
    }
  }

  // 왼쪽 종목코드 클릭 차트
  function initLeftItemCodeChart() {

    getLeftItemCodeChartInfo(function(response) {
      if (!response['legend'].length) {
        cmmUtils.showWarningModal('즐겨찾기 없음', '즐겨찾기한 포트폴리오가 없습니다.');
        leftItemCodeChart.dispose();
        return false;
      }
      global['leftItemCodeChartData'] = response;
      const props = {
        eId: 'leftItemCodeChart',
        options: {
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
              type: 'cross',
              axis: 'auto',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            show: true,
            left: '85%',
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            left: '2%',
            right: '28%',
            containLabel: true
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '75%',
            right: '1%',
            top: '9%',
            bottom: '5%',
            data: cmmUtils.isEmpty(response['legend']) ? [] : response['legend']
          },
          xAxis:  {
            type: 'category',
            data: cmmUtils.isEmpty(response['categories']) ? [global.selectedQuarterDate + '이전데이터 없음'] : response['categories'],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis:  {
            type: 'value',
          },
          visualMap: global.visualMap,
          series: cmmUtils.isEmpty(response['seriesList']) ? [] : createSeriesArr(response['seriesList'])
        }
      };

      if (!!leftItemCodeChart) {
        leftItemCodeChart.dispose();
        leftItemCodeChart = new COMPONENTS.Chart(props);
      } else {
        leftItemCodeChart = new COMPONENTS.Chart(props);
      }
    })

    function createSeriesArr(dataArr) {
      let series = [];
      let lineData = [];
      for (let i = 0; i < dataArr[0].data.length; i++) {
        lineData[i] = 0; //초기화
      }
      for (let i = 0; i < dataArr.length; i++) {
        const seriesData = dataArr[i];
        series.push({
          name: seriesData.name,
          type: 'bar',
          stack: 'stack',
          barWidth: '20px',
          label: {
            show: false,
            position: 'insideRight'
          },
          data: seriesData.data
        })

        // 라인차트 데이터
        for (let j = 0; j < lineData.length; j++) {
          lineData[j] = lineData[j] + seriesData.data[j] // 누적
        }
      }
      // 라인차트 추가
      series.push({
        name: '합계',
        type: 'line',
        lineStyle: {
          type: 'dashed' // 'dotted', 'solid'
        },
        data: lineData
      })
      return series;
    }
  }

  function initRightItemCodeChart() {
    getRightItemCodeChartInfo(function(response) {
      // 미공시 데이터를 추가로 가공함
      const modifiedChartData = cmmUtils.addUnknownQuarters(response.categories, response.seriesList[0].data);

      global['rightItemCodeChartData'] = response;
      const props = {
        eId: 'rightItemCodeChart',
        options: {
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
              type: 'cross',
              axis: 'auto',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          animationDuration: 500,
          grid: {
            containLabel: true
          },
          xAxis:  {
            type: 'category',
            data: modifiedChartData['quarters'],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis:  {
            type: 'value',
          },
          visualMap: global.visualMap,
          series: createSeriesArr(response.seriesList[0].name, modifiedChartData)
        }
      };
      if (!!rightItemCodeChart) {
        rightItemCodeChart.dispose();
        rightItemCodeChart = new COMPONENTS.Chart(props);
      } else {
        rightItemCodeChart = new COMPONENTS.Chart(props);
      }
    })
  }

  function createSeriesArr(name, modifiedChartData) {
    return [
      {
        name: name,
        type: 'line',
        barWidth: '20px',
        label: {
          show: false,
          position: 'insideRight'
        },
        data: modifiedChartData.data,
        markArea: {
          silent: true,
          itemStyle: {
            color: '#E6E6E6',
            opacity: 0.7
          },
          data: modifiedChartData.markArea
        }
      }
    ]
  }

  function closeStackChartModal() {
    document.getElementById('selStackChartFilter')[0].selected = true;
    cmmUtils.closeModal('stackChartModal');
  }

  function closeColLineChartModal() {
    document.getElementById('selLineChartFilter')[0].selected = true;
    cmmUtils.closeModal('colLineChartModal');
  }

  function getSelectedStackChartFilter() {
    return parseInt(document.getElementById('selStackChartFilter').value);
  }

  function setSelectedLineChartFilter(idx) {
    document.getElementById('selLineChartFilter').options[idx].selected = true;
  }

  function getSelectedLineChartFilter() {
    return parseInt(document.getElementById('selLineChartFilter').value);
  }

  // 오른쪽 차트모달 필터 이벤트
  function addSelectedLineChartFilterEvents() {
    document.getElementById('selLineChartFilter').addEventListener('change', function() {
      initRightItemCodeChart();
    });
  }

  // 분기 분석 정보 반환
  function getQuarterInfo(callback) {
    cmmUtils.axiosPost({
      url: '/api/v1/analysis/profile/quarter-info',
      body: {
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate,
        profileType: global.selectedProfileType
      }
    }, callback);
  }

  // 종목코드 스택차트 데이터 반환
  function getLeftItemCodeChartInfo(callback) {
    cmmUtils.axiosPost({
      url: '/api/v1/analysis/profile/stack-chart/item-code',
      body: {
        selectedQuarterDate: global.selectedQuarterDate,
        itemCode: global.selectedItemCode,
        profileTitle: global.profileTitle,
        filterNum: getSelectedStackChartFilter()
      }
    }, callback);
  }

  // 포트폴리오 분석 오른쪽 그리드 차트
  function getRightItemCodeChartInfo(callback) {
    cmmUtils.axiosPost({
      url: '/api/v1/analysis/profile/line-chart/item-code',
      body: {
        selectedQuarterDate: global.selectedQuarterDate,
        profileId: global.profileId,
        itemCode: global.selectedItemCode,
        filterNum: getSelectedLineChartFilter()
      }
    }, callback);
  }


  function setRoseType() {
    const value = document.getElementById('selPieChartFilter').value;
    return value === '' ? false : value;
  }

  function getWarterMarkImage() {
    const waterMarkText = 'BEESTOCK';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 100;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.08;
    ctx.font = '20px Microsoft Yahei';
    ctx.translate(50, 50);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(waterMarkText, 0, 0);
    return canvas;
  }

  // 포트폴리오 비중 파이차트
  function initPieChart() {
    getQuarterInfo(function(response) {
      const props = {
        eId: 'profilePieChart',
        options: {
          backgroundColor: {
            type: 'pattern',
            image: getWarterMarkImage(),
            repeat: 'repeat'
          },
          color: global['defaultColorArr'],
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          roseType: setRoseType(),
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
              radius: ['20%', '70%'],
              data: createData(response)
            }
          ]
        }
      }
      if (!!profilePieChart) {
        reloadPieChart(props.options);
      } else {
        profilePieChart = new COMPONENTS.Chart(props);
      }
    });

    function createData(response) {
      let result = [];
      response.forEach(function (e, i) {
        if (e.viewWeight >= 1) {
          result.push({name: setName(e.itemName, e.viewWeight), value: e.viewWeight});
        }
      });
      // 1% 미만의 종목코드는 기타로 분류함
      const etcVal = _.sumBy(response, function (o) {
        return o.viewWeight < 1 ? o.viewWeight : false;
      });
      result.push({name: setName('기타', etcVal), value: etcVal.toFixed(1)});
      return result;
    }
    function setName(itemName, value) {
      return itemName + '(' + value.toFixed(1) + '%)';
    }
  }

  function initBarChart() {

    // 3자리 콤마 설정
    function lableFommater(data) {
      data = parseFloat(data);
      return data.toLocaleString();
    }

    getQuarterInfo(function(response) {
      const chartData = createData(response);
      const props = {
        eId: 'profileBarChart',
        options: {
          backgroundColor: {
            type: 'pattern',
            image: getWarterMarkImage(),
            repeat: 'repeat'
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              magicType: {type: ['line', 'bar']}
              // saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '1%',
            // right: '5%',
            // bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: global['selectedBarChartFilterText'],
            nameLocation: 'middle',
            nameGap: 30,
            boundaryGap: [0, 0.1]
          },
          yAxis: {
            type: 'category',
            data: chartData['xAxis']
          },
          series: [
            {
              type: 'bar',
              barWidth: '20px',
              color: '#3273DC',
              label: {
                show: true,
                formatter: function (params) { // 3자리 콤마 설정
                  return lableFommater(params.value);
                },
                position: 'right',
                color: '#2f2f2f'
              },
              data: chartData['yAxis']
            }
          ]
        }
      }
      if (!!profileBarChart) {
        reloadBarChart(props.options);
      } else {
        profileBarChart = new COMPONENTS.Chart(props);
      }
    })

    // 데이터 가공
    function createData(dataArr) {
      const sortedDataArr = _.orderBy(dataArr, [global.selectedBarChartFilter], ['asc']);
      global['sortedDataArr'] = sortedDataArr;
      let result = {xAxis: [], yAxis: []};
      const rank = document.getElementById('selBarChartRank').value;
      if (rank) {
        pushBarChartData(result, sortedDataArr, rank);
      } else {
        pushBarChartData(result, sortedDataArr)
      }
      return result;
    }
  }

  function pushBarChartData(result, data, limitSize) {
    // 위에서 정렬을 Acsending 으로 한 이유는 먼저 그려지는 객체가 화면에서는 가장 아래로 배치됨
    const argLen = arguments.length;
    const dataLen = data.length;
    const startIdx = argLen === 3 ? limitSize < dataLen ? (dataLen - limitSize) : 0 : 0;
    for (let i = startIdx; i < dataLen; i++) {
      const row = data[i];
      result['xAxis'].push(row['itemName']);
      result['yAxis'].push(row[global.selectedBarChartFilter]);
    }
    setBarChartSize(argLen === 3 ? limitSize : dataLen);
  }

  function setBarChartSize(size) {
    document.getElementById('profileBarChart').style.height = (35 * size) + 'px';
  }

  // Bar 필터 이벤트
  function addBarChartSelectBoxListener() {

    document.getElementById('selBarChartRank').addEventListener('change', function() {
      let chartData = {xAxis: [], yAxis: []};
      if (this.value) {
        pushBarChartData(chartData, global['sortedDataArr'], parseInt(this.value));
      } else {
        pushBarChartData(chartData, global['sortedDataArr']);
      }
      reloadBarChart({
        yAxis: {data: chartData['xAxis']},
        series: [{data: chartData['yAxis']}]
      })
    });

    document.getElementById('selBarChartFilter').addEventListener('change', function() {
      global['selectedBarChartFilter'] = this.value;
      global['selectedBarChartFilterText'] = this.options[this.selectedIndex].text;
      initBarChart();
    })
  }

  // Pie 차트 필터 이벤트
  function addPieChartSelectBoxListener() {
    document.getElementById('selPieChartFilter').addEventListener('change', function() {
      reloadPieChart({roseType: setRoseType()});
    });
  }

  function addStackChartSelectBoxListener() {
    document.getElementById('selStackChartFilter').addEventListener('change', initLeftItemCodeChart);
  }

  function reloadBarChart (options) {
    profileBarChart.resize();
    profileBarChart.setOption(options);
  }

  function reloadPieChart(options) {
    profilePieChart.resize();
    profilePieChart.setOption(options);
  }

  // 포트폴리오 헤더 생성
  function setProfileHeader(data) {
    // 포트폴리오 이미지
    const profileImg = document.getElementById('profileImg');
    profileImg.src = CONTEXT_PATH + '/common/image/' + data['fileId'] + '.do';
    // 타이틀
    const profileTitle = data['profileTitle'];
    document.getElementById('profileTitle').innerText = profileTitle;
    document.getElementById('selStackChartFilter')[0].innerText = profileTitle;
    global['profileTitle'] = profileTitle;
    // Information
    document.getElementById('profileSubtitle').innerText = data['profileSubtitle'];
    // initProfileInfo(data);
    initProfileLink(data);
    // 즐겨찾기
    createStar(data['isFavorite']);
  }

  // 포트폴리오 소개
  function initProfileInfo(data) {
    cmmUtils.createCKEditor({selector: '#profileInfo', isReadOnly: true, data: data['profileInfo']}, function(editor) {
      global['ckEditProfileInfo'] = editor;
    });
  }

  // 포트폴리오 링크
  function initProfileLink(data) {
    const profileLinkDiv = document.getElementById('profileLinkDiv');
    if (data['profileLink']) {
      const profileLinkArr = data['profileLink'].split(global['linkArrDelimiter']);
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < profileLinkArr.length; i++) {
        const profileInfo = profileLinkArr[i].split(global['linkInfoDelimiter']);
        const div = document.createElement('div');
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('button');
        // button.classList.add('is-small');
        button.classList.add('is-white');
        button.appendChild(createLinkIcon(profileInfo[0]));
        button.setAttribute('onclick', 'main.goToLinkPop(\'' + profileInfo[2] + '\')');
        const span = document.createElement('span');
        span.innerText = profileInfo[1];
        button.appendChild(span);
        div.appendChild(button);
        fragment.appendChild(div);
      }
      profileLinkDiv.appendChild(fragment.cloneNode(true));
    } else {
      profileLinkDiv.innerHTML = '<p>참고자료가 없습니다.</p>'
    }
  }

  function createLinkIcon(type) {
    const span = document.createElement('span');
    span.classList.add('icon');
    span.classList.add('is-small');
    span.classList.add('mr-3');
    const colorClass = type === '1' ? 'has-text-danger' : type === '2' ? 'has-text-info' : 'has-text-dark'
    span.classList.add(colorClass);
    const icon = document.createElement('i');
    icon.classList.add('fa-lg');
    switch (type) {
      case '1':
        icon.classList.add('fab');
        icon.classList.add('fa-youtube');
        break;
      case '2':
        icon.classList.add('fas');
        icon.classList.add('fa-video');
        break;
      case '3':
        icon.classList.add('far');
        icon.classList.add('fa-newspaper');
        break;
    }
    span.appendChild(icon);
    return span;
  }

  // 즐겨찾기 클릭 이벤트
  function addSpanStarEvent() {
    document.getElementById('spanStar').addEventListener('click', function() {
      const favoriteVal = parseInt(this.getAttribute('data-favorite')) === 1 ? 2 : 1;
      this.setAttribute('data-favorite', ''+favoriteVal);
      cmmUtils.axiosPost({
        url: '/api/v1/analysis/profile/favorite',
        body: {
          profileId: global.profileId,
          isFavorite: favoriteVal
        }
      }, function (response) {
        cmmUtils.showToast({message: favoriteVal === 1 ? '즐겨찾기 되었습니다.' : '즐겨찾기가 해제되었습니다.'});
        createStar(favoriteVal);
      });
    })
  }

  // 즐겨찾기
  function createStar(favorite) {
    // 1: 즐겨찾기함, 2: 즐겨찾기 안함
    const span = document.getElementById('spanStar');
    span.setAttribute('data-favorite', favorite);
    cmmUtils.clearChildNodes(span);
    const icon = document.createElement('i');
    icon.classList.add(favorite === 1 ? 'fas' : 'far');
    icon.classList.add('fa-lg');
    icon.classList.add('fa-star');
    span.appendChild(icon);
  }

  // 투자 아이디어
  function initInvestIdea() {
    const ideaGridTable = document.getElementById('ideaGrid');
    if (ideaGridTable) {
      // 데이터 그리드
      const ideaAnchor = function(anchor, col, row) {
        anchor.setAttribute('data-custom', 'ideaAnchor');
        anchor.setAttribute('data-idea-id', row['ideaId']);
      }
      const props = {
        url: '/api/v1/analysis/profile/idea-list',
        body: {
          orderBy: [{column: 'uptDate', desc: true}],
          profileId: global.profileId,
          pageSize: 5 //  기본 5개로 설정
        },
        eId: 'ideaGrid',
        pId: 'ideaPagination',
        isThead: true,
        isTfoot: false,
        showPageSelectBox: false,
        colModel: [
          {id: 'ideaId', isHidden: true},
          {id: 'ideaTitle', name: '아이디어 제목', width: '800px', isSort: true, isLink: true, userCustom: ideaAnchor},
          {id: 'uptDate', name: '최근 수정일', width: '150px', isSort: true, align: 'center'}
        ],
        emptyRowMsg: '아이디어가 없습니다.',
        success: function (data, _this) {
          addTitleAnchorEvent(data, _this);
        }
      }
      ideaGrid = new COMPONENTS.DataGrid(props);

      // 에디터
      initCKEditor();
    }

    function addTitleAnchorEvent(data, _this) {
      const eId = _this.props.eId;
      const tags = document.getElementById(eId).querySelectorAll('[data-custom=ideaAnchor]');
      for (let i = 0; i < tags.length; i++) {
        tags[i].addEventListener('click', function () {
          const ideaId = this.getAttribute('data-idea-id');
          showModIdeaModal(ideaId);
        })
      }
    }
  }

  function initTooltips() {
    const arr = [
      {selector: '#fileField', content: '다중선택 가능'},
      {selector: '#bannerNSec', content: '네이버증권'},
      {selector: '#bannerDart', content: 'DART'},
      {selector: '#bannerConsensus', content: '한경컨센서스'},
    ]
    cmmUtils.setTippy(arr);
  }

  function initCKEditor() {

    const newIdeaContWordCount = function(stats) {
      global.newIdeaWordCount = stats.characters;
    }

    const modIdeaContWordCount = function(stats) {
      global.modIdeaWordCount = stats.characters;
    }

    if (!global['ckEditNewIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#newIdeaCont', wordCount: newIdeaContWordCount}, function(editor) {
        global['ckEditNewIdeaCont'] = editor;
      });
    }
    if (!global['ckEditModIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#modIdeaCont', wordCount: modIdeaContWordCount}, function(editor) {
        global['ckEditModIdeaCont'] = editor;
      });
    }
  }

  function showModIdeaModal(ideaId) {
    global.selectedIdeaId = ideaId;
    const url = '/api/v1/analysis/profile/idea/' + ideaId;
    cmmUtils.axiosGet({url: url}, function(response) {
      clearModIdeaModal(response);
      cmmUtils.bindData('modIdeaForm', response);
      global.ckEditModIdeaCont.setData(response['ideaCont']);
      cmmUtils.showModal('modIdeaModal');
    });
  }

  function showNewIdeaModal() {
    clearNewIdeaModal();
    cmmUtils.showModal('newIdeaModal');
  }

  function clearNewIdeaModal() {
    document.getElementById('newIdeaTitle').value = '';
    global.ckEditNewIdeaCont.setData('');
  }

  function clearModIdeaModal(response) {
    document.getElementById('modIdeaTitle').value = '';
    global.ckEditModIdeaCont.setData('');
    document.getElementById('modCardTitle').innerText = response['ideaTitle'];
  }

  function closeNewIdeaModal() {
    cmmUtils.closeModal('newIdeaModal');
    reloadIdeaGrid();
  }
  
  function closeModIdeaModal() {
    cmmUtils.closeModal('modIdeaModal');
    reloadIdeaGrid();
  }

  function reloadIdeaGrid() {
    ideaGrid.reload();
  }

  // 탭 이벤트
  function addTabEventListener() {

    const headerTabs = document.getElementById('headerTabs').querySelectorAll('[name=tabs]');
    for (let i = 0; i < headerTabs.length; i++) {
      // 탭 클릭 이벤트
      headerTabs[i].addEventListener('click', function() {
        resetActiveTab(headerTabs);
        // 선택 탭 활성화
        this.classList.add('is-active');
        document.getElementById(this.getAttribute('data-cont-id')).classList.remove('is-hidden');
        setActiveTabInfo(this);
        showTab();
      })
    }

    const bottomTabs = document.getElementById('bottomTabs').querySelectorAll('[name=tabs]');
    for (let i = 0; i < bottomTabs.length; i++) {
      // 탭 클릭 이벤트
      bottomTabs[i].addEventListener('click', function() {
        resetActiveTab(bottomTabs);
        // 선택 탭 활성화
        this.classList.add('is-active');
        document.getElementById(this.getAttribute('data-cont-id')).classList.remove('is-hidden');
        setActiveTabInfo(this);
        showTab();
      })
    }

    // 탭 초기화
    function resetActiveTab(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        tab.classList.remove('is-active');
        document.getElementById(tab.getAttribute('data-cont-id')).classList.add('is-hidden');
      }
    }
  }

  function setActiveTabInfo(el) {
    global.tabView = el.getAttribute('data-view');
  }

  function saveIdea() {
    if (verifyNewIdeaForm()) {
      const formData = new FormData();
      formData.append('profileId', global.profileId);
      formData.append('ideaTitle', document.getElementById('newIdeaTitle').value);
      formData.append('ideaCont', global.ckEditNewIdeaCont.getData());

      cmmUtils.axiosPost({
        url: '/api/v1/analysis/profile/insert-idea',
        body: formData,
        loading: 'btnNewIdea'
      }, function (response) {
        if (response === 1) {
          cmmUtils.showToast({message: '저장 되었습니다.'});
          closeNewIdeaModal();
        } else {
          cmmUtils.goToErrorPage(response);
        }
      });
    }
  }

  function modifyIdea() {
    if (verifyModIdeaForm()) {
      const msg = '아이디어를 수정 하시겠습니까?';
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        const formData = new FormData();
        formData.append('ideaId', global.selectedIdeaId);
        formData.append('ideaTitle', document.getElementById('modIdeaTitle').value);
        formData.append('ideaCont', global.ckEditModIdeaCont.getData());

        cmmUtils.axiosPost({
          url: '/api/v1/analysis/profile/update-idea',
          body: formData,
          loading: 'btnModIdea'
        }, function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '수정 되었습니다.'});
            closeModIdeaModal();
          } else {
            cmmUtils.goToErrorPage(response);
          }
        });
      });
    }
  }

  function verifyNewIdeaForm() {
    const newIdeaTitle = document.getElementById('newIdeaTitle').value;
    if (!newIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (global.newIdeaWordCount > 2000) {
      cmmUtils.showIpModal('문자수 초과', '아이디어 문자수는 최대 2000문자(현재:' + global.newIdeaWordCount + '문자)까지 가능합니다. ');
      return false;
    }
    return true;
  }

  function verifyModIdeaForm() {
    const modIdeaTitle = document.getElementById('modIdeaTitle').value;
    if (!modIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (global.modIdeaWordCount > 2000) {
      cmmUtils.showIpModal('문자수 초과', '아이디어 문자수는 최대 2000문자(현재:' + global.modIdeaWordCount + '문자)까지 가능합니다. ');
      return false;
    }
    return true;
  }

  function downloadProfileGrid(type) {
    switch (type) {
      case 1: profileGrid.downloadExcel(); break;
      case 2: newTransferGrid.downloadExcel(); break;
      case 3: soldOutGrid.downloadExcel(); break;
    }
  }

  // 포트폴리오 참고링크 팝업
  function goToLinkPop(url) {
    window.open(url, '', "width=500,height=600");
  }

  // 국내인 경우 오른쪽 차트 안내문구 추가
  function appendRightChartMsg() {
    const p = document.createElement('p');
    p.innerHTML = '※ 국내자료는 <strong>액면분할</strong>, <strong>무상증자</strong> 등에 대한 <strong>수정수량</strong>을 제공하지 않습니다. 주식 <strong>보유수량</strong>이 급격하게 증가했다면 해당이슈에 대해 검토하십시오.';
    document.getElementById('rightChartMsgBody').appendChild(p);
  }

  function initClipboard() {
    if (!!clipboard) clipboard.destroy();
    clipboard = new ClipboardJS('.has-clipboard');
  }

  // 일정 간격으로 새로고침
  function addRefreshEvent() {
    // 최초 레이블 표기
    setCurrentTimeLabel();
    setInterval(function() {
      if (document.getElementById('refreshSwitch').checked) { // 활성화시에만
        setCurrentTimeLabel();
        showTab();
      }
    }, (60 * 1000)) // 10분 간격
  }

  function setCurrentTimeLabel() {
    const label = document.getElementById('refreshSwitchLabel');
    label.innerText = '새로고침 시간: ' + cmmUtils.getCurrentTime();
  }

  function searchItemName() {
    initProfileGrid();
  }

  return {
    getChart: function() { return global.chart; },
    init: init,
    showIdeaModal: showNewIdeaModal,
    showColLineChartModal: showColLineChartModal,
    closeNewIdeaModal: closeNewIdeaModal,
    closeModIdeaModal: closeModIdeaModal,
    closeStackChartModal: closeStackChartModal,
    closeColLineChartModal: closeColLineChartModal,
    downloadProfileGrid: downloadProfileGrid,
    saveIdea: saveIdea,
    modifyIdea: modifyIdea,
    goToLinkPop: goToLinkPop,
    searchItemName: searchItemName
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('schItemName').addEventListener('keyup', main.searchItemName);
});
