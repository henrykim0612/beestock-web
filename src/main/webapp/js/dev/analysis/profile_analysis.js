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
    selectedStackChartGridProfileId: null,
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
    paramQuarterDate: null,
    matchedQuarterSliderIdx: 0, // 다른 화면에서 링크되어 넘어왔을 경우에 이 값이 변경됨
    latestQuarterDate: null, // 해당 프로필의 가장 최신분기
    maxNegativeBsp: null,
    maxPositiveBsp: null,
    maxNegativeEarnRate: null,
    maxPositiveEarnRate: null,
    itemCodeAutoCompleteList: [],
    itemNameAutoCompleteList: [],
    bspName: null,
    width: {
      profileTitle: '250px', // 포트폴리오
      itemName: '250px', // 종목명
      itemCode: '100px', // 종목명
      viewWeight: '100px', // 비중
      quantity: '120px', // 보유수량
      buyingPrice: '120px', // 평균 매수가
      currPrice: '100px', // 현재가
      fluctRate: '100px', // 등락률
      earnRate: '150px', // 수익률
      buyingSellingPrice: '150px', //매수매도금액
      incsRate: '120px' // 증감률
    },
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        color: ['#3273DC', '#F14668']
      },
      // show: false,
      // pieces: [{
      //   value: 0,
      //   color: '#F14668'
      // },{
      //   gt: 0,
      //   lte: 1,
      //   color: '#F14668'
      // }, {
      //   gt: 1,
      //   color: '#F14668'
      // }],
      // outOfRange: {
      //   color: '#3273DC'
      // }
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
    ],
    timerObj: undefined,
    // 새로고침 타이머 관련
    resetTime: 120,
    timerCount: 120,
    refreshTimer: function() {

      global['isRunInterval'] = true;
      const rVal = global['timerCount'] % 60;
      const dVal = Math.floor(global['timerCount'] / 60);
      const minutes = rVal < 10 ? '0' + rVal : rVal;

      const text = dVal === 0
        ? minutes
        : dVal + ":" + minutes; // 남은 시간 계산

      document.getElementById('clockSpan').innerText = text;
      global['timerCount']--; // 1초씩 감소
      // 시간이 종료 되었으면
      if (global['timerCount'] < 0) {
        global['timerCount'] = global['resetTime']
        reloadTab();
      }
    }
  };
  let ideaGrid = undefined;
  let profileGrid = undefined;
  let newTransferGrid = undefined;
  let soldOutGrid = undefined;
  let buyingGrid = undefined;
  let sellingGrid = undefined;
  let profileBarChart = undefined;
  let profilePieChart = undefined;
  let leftItemCodeChart = undefined;
  let rightItemCodeChart = undefined;
  let clipboard = undefined;
  let stackChartGrid = undefined; // 왼쪽 차트모달 그리드
  let fundamentalChart = undefined;
  let benchmarkChart = undefined;
  let autoComplete = undefined;
  let treeMapChart = undefined;

  function init() {
    createBreadCrumb();
    setInitialValues();
    initTabs();
    setParamQuarterDate();
    getProfileDetails();
    initQuarterSlider();
    addSpanStarEvent();
    initInvestIdea();
    initTooltips();
    initAutoComplete();
    addTabEventListener();
    addBarChartSelectBoxListener();
    addPieChartSelectBoxListener();
    addStackChartSelectBoxListener();
    addSearchWordEventListener();
    setTooltips();
    if (global.selectedProfileType === '1') appendRightChartMsg(); // 국내인 경우 오른쪽 차트 팝업 안내문구 추가
    // setHelp();
    setSpinnerTitle();
    addSelectedLineChartFilterEvents();
  }
  
  function setInitialValues() {
    global.profileId = document.getElementById('profileId').value;
    global.selectedProfileType = document.getElementById('profileType').value;
    global.bspName = global.selectedProfileType === '1' ? '매수금액' : '매수 · 매도금액';
  }

  // 다른 화면에서 넘어왔을 경우에 값을 저장해둠
  function setParamQuarterDate() {
    const hiddenInput = document.getElementById('paramQuarterDate');
    if (!cmmUtils.isEmpty(hiddenInput.value)) {
      global.paramQuarterDate = hiddenInput.value;
    }
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
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-chart-line"></i></span>';
    html += '      <span>포트폴리오 분석</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initTabs() {
    if (document.getElementById('profileType').value === '1') {
      // 국내는 Benchmark 지수 탭이 없음
      document.getElementById('benchmarkTab').remove();
      document.getElementById('benchmarkCont').remove();
      document.getElementById('fundamentalTab').classList.add('is-active');
      document.getElementById('fundamentalCont').classList.remove('is-hidden');
    }
  }

  function initAutoComplete() {
    const element = document.getElementById("schWord");
    autoComplete = new Awesomplete(element);
  }


  function setTooltips() {
    if (document.getElementById('gridExcel')) cmmUtils.setExcelTippy(['#gridExcel']);
    if (document.getElementById('newTransferExcel')) cmmUtils.setExcelTippy(['#soldOutExcel']);
    if (document.getElementById('soldOutExcel')) cmmUtils.setExcelTippy(['#soldOutExcel']);
    cmmUtils.setTippy([{selector: '#switchRefreshLabel', content: '자동 새로고침하여 최신 현재가로 데이터를 재계산합니다.'}]);
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
    if (titleArr.length) {
      const len = titleArr.length;
      for (let i = 0; i < len; i++) {
        titleArr[i].innerHTML = '<span class="is-green mr-2">A</span><span>' + global.selectedQuarterDate + '</span>';
      }
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
    const limitQuarter = parseInt(document.getElementById('limitQuarter').value);
    for (let i = 0; i < len; i++) {
      // 첫번째 분기는 해당 프로필의 가장 최신 분기값이됨
      global.latestQuarterDate = response[0].quarterDate;
      // 비어있는 분기를 확인함
      createDummyQuarter(i, response, fragment);
      // 존재하는 분기생성
      createExistedQuarter(response[i], fragment, i, limitQuarter);
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
    if (0 < i) {
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
        button.classList.add('is-rounded');
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('icon');
        const icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add('fa-clock');
        iconSpan.appendChild(icon);
        const textSpan = document.createElement('span');
        textSpan.classList.add('quarter-slider__label');
        textSpan.innerText = '미공시'
        button.append(iconSpan);
        button.append(textSpan);
        slide.appendChild(button);
        fragment.appendChild(slide);
      }
    }
  }

  function createExistedQuarter(quarter, fragment, idx, limitQuarter) {
    // 슬라이드 생성
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    const button = document.createElement('button');

    // 게스트, 베이직 사용자는 제한된 분기밖에 이용할 수 없음
    if (limitQuarter !== -1 && (limitQuarter - 1) < idx) {
      button.disabled = true;
    }

    button.classList.add('button');
    // button.classList.add('is-small');
    button.classList.add('is-dark');
    button.classList.add('is-inverted');
    button.classList.add('is-small');
    button.classList.add('is-rounded');
    button.setAttribute('data-button', 'slide');
    button.setAttribute('data-key', quarter['quarterId']);
    button.setAttribute('data-quarter', quarter['quarterDate']);

    // 링크되어 넘어온 경우에는 바로 해당 분기를 볼 수 있도록 인덱스값을 저장해둠
    if (global.paramQuarterDate != null && global.paramQuarterDate === quarter['quarterDate']) {
      global.matchedQuarterSliderIdx = idx;
    }

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon');
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-clock');
    iconSpan.appendChild(icon);
    const textSpan = document.createElement('span');
    textSpan.classList.add('quarter-slider__label');
    textSpan.innerText = quarter['quarterDate'] + 'Q';
    button.append(iconSpan);
    button.append(textSpan);
    slide.appendChild(button);
    fragment.appendChild(slide);
  }


  function initSwiper() {
    const slider = new Swiper('#quarterSlider', {
      slidesPerView: 6,
      spaceBetween: 0,
      centeredSlides: false,
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

  function resetMinMaxValues() {
    global.maxNegativeBsp = null;
    global.maxPositiveBsp = null;
    global.maxNegativeEarnRate = null;
    global.maxPositiveEarnRate = null;
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

          resetMinMaxValues();
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
              showBottomTab();
            } else {
              // 이용할 수 없음
              cmmUtils.showModal('standardModal');
            }
          });
        });
      }
      // 최근 분기 데이터를 기본으로 보여주거나 링크되어 넘어온 데이터를 보여줌
      slideButtons[global.matchedQuarterSliderIdx].click();
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

  function showBottomTab() {
    switch (global.tabView) {
      case 'grid': initProfileGrid(); break;
      case 'newTransfer': initNewTransferGrid(); break;
      case 'soldOut': initSoldOutGrid(); break;
      case 'barChart': initBarChart(); break;
      case 'pieChart': initPieChart(); break;
      case 'buying': initBuyingGrid(); break;
      case 'selling': initSellingGrid(); break;
      case 'treeMap': initTreeMapChart(); break;
    }
  }

  function reloadTab() {
    switch (global.tabView) {
      case 'grid':profileGrid.reload(); break;
      case 'newTransfer': newTransferGrid.reload(); break;
      case 'soldOut': soldOutGrid.reload(); break;
      case 'barChart': initBarChart(); break;
      case 'pieChart': initPieChart(); break;
      case 'buying': buyingGrid.reload(); break;
      case 'selling': sellingGrid.reload(); break;
    }
  }

  // 수익률 막대 표
  function earnRate(col, row, thOrTd, props) {
    if (global.maxNegativeEarnRate == null) {
      const negativeValues = cmmUtils.getNegativeValues(props.rowData, 'earnRate');
      global.maxNegativeEarnRate = _.maxBy(cmmUtils.getAbsValues(negativeValues, 'earnRate'));
    }
    if (global.maxPositiveEarnRate == null) {
      const positiveValues = cmmUtils.getPositiveValues(props.rowData, 'earnRate');
      global.maxPositiveEarnRate = _.maxBy(cmmUtils.getAbsValues(positiveValues, 'earnRate'));
    }

    row['excelText'] = row['earnRate'] + '%'; // 엑셀전용
    const percent = parseInt(cmmUtils.getPercentage(row['earnRate'], row['earnRate'] < 0 ? global.maxNegativeEarnRate : global.maxPositiveEarnRate, true).toFixed(1));
    return cmmUtils.createAnalysisBar(percent, row['earnRate'] + '%');
  }

  // 보유수량
  function customQuantity(col, row, thOrTd, props) {
    const roleNm = props.data.roleNm;

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main')
    span.innerText = row['quantity'].toLocaleString();

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');

    if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {
      // 차트 아이콘
      chartDiv.innerHTML = '<div class="icon-text" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 0)"><span class="has-text-link pr-1"><i class="fas fa-chart-line"></i></span><span class="has-text-link">Chart</span></div>'
    } else {
      // 프리미엄 이상만 이용 가능함
      chartDiv.innerHTML = '<span class="icon cursor hover-sub has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span></div>';
    }

    div.appendChild(span);
    div.appendChild(chartDiv);
    return div;
  }

  // 평균 매수가
  function customBp(col, row, thOrTd, props) {

    const roleNm = props.data.roleNm;
    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main')
    span.innerText = global.selectedProfileType === '1' ? row['buyingPrice'].toLocaleString() : cmmUtils.addZeroStr(row['buyingPrice'].toLocaleString());

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');

    if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {
      // 차트 아이콘
      chartDiv.innerHTML = '<div class="icon-text" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 3)"><span class="has-text-link pr-1"><i class="fas fa-chart-line"></i></span><span class="has-text-link">Chart</span></div>'
    } else {
      // 프리미엄 이상만 이용 가능함
      chartDiv.innerHTML = '<span class="icon cursor hover-sub has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span></div>';
    }

    div.appendChild(span);
    div.appendChild(chartDiv);
    return div;
  }

  // 등락률
  function fluctRate(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');

    if (global.selectedQuarterDate === global.latestQuarterDate) {
      // 최근 분기에 대해서만 등락률을 표시함
      if (row['fluctRate'] === 0) {
        const span = document.createElement('span');
        span.innerText = '0%';
        div.appendChild(span);
        return div;
      } else {
        const span = document.createElement('span');
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('height-24-px');
        const fluctRate = parseFloat(row['fluctRate']);
        if (fluctRate < 0) { // 하향
          if (fluctRate < -15) {
            iconDiv.innerHTML = '<span class="icon cursor has-text-info"><i class="fas fa-long-arrow-alt-down"></i></span>'
          } else {
            iconDiv.innerHTML = '<span class="icon cursor has-text-info"><i class="fas fa-caret-down"></i></span>'
          }
          span.classList.add('has-text-info');
          span.innerText = row['fluctRate'] + '%';
        } else { // 상향
          if (fluctRate < 15) {
            iconDiv.innerHTML = '<span class="icon cursor has-text-danger"><i class="fas fa-caret-up"></i></span>'
          } else {
            iconDiv.innerHTML = '<span class="icon cursor has-text-danger"><i class="fas fa-long-arrow-alt-up"></i></span>'
          }
          span.classList.add('has-text-danger');
          span.innerText = cmmUtils.addZeroStr(fluctRate) + '%';
        }

        div.appendChild(iconDiv);
        div.appendChild(span);
        return div;
      }
    } else {
      const span = document.createElement('span');
      span.innerText = '0%';
      div.appendChild(span);
      return div;
    }
  }

  // 매수·금액 막대 표
  function buyingSellingPrice(col, row, thOrTd, props) {

    const roleNm = props.data.roleNm;

    // 매수매도금액은 프리미엄 사용자 이상부터 이용 가능
    if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {

      if (global.maxNegativeBsp == null) {
        const negativeValues = cmmUtils.getNegativeValues(props.rowData, 'buyingSellingPrice');
        global.maxNegativeBsp = _.maxBy(cmmUtils.getAbsValues(negativeValues, 'buyingSellingPrice'));
      }
      if (global.maxPositiveBsp == null) {
        const positiveValues = cmmUtils.getPositiveValues(props.rowData, 'buyingSellingPrice');
        global.maxPositiveBsp = _.maxBy(cmmUtils.getAbsValues(positiveValues, 'buyingSellingPrice'));
      }

      let percent = parseInt(cmmUtils.getPercentage(row['buyingSellingPrice'], row['buyingSellingPrice'] < 0 ? global.maxNegativeBsp : global.maxPositiveBsp, true).toFixed(1));
      let viewBsp = cmmUtils.roundCurrency(row['buyingSellingPrice'], 1000000, 1).toLocaleString();
      // 국내인 경우 마이너스 값들은 매도 금액에 해당하는데, 우리는 국내 매도금액을 계산 할 수 없으므로 0으로 처리해버림
      if (global.selectedProfileType === '1' && percent < 0) {
        percent = 0;
        viewBsp = '0';
      }
      const barDiv = cmmUtils.createAnalysisBar(percent,  viewBsp);

      // const barDiv = cmmUtils.createAnalysisBar(parseInt(percent),  v.toLocaleString());
      barDiv.classList.add('width-100-p');
      barDiv.classList.add('hover-main');

      const chartDiv = document.createElement('div');
      chartDiv.classList.add('flex-row');
      chartDiv.classList.add('justify-content-center');
      chartDiv.classList.add('hover-sub');
      chartDiv.classList.add('height-24-px');
      chartDiv.innerHTML = '<div class="icon-text" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 2)"><span class="has-text-link pr-1"><i class="fas fa-chart-line"></i></span><span class="has-text-link">Chart</span></div>'

      const resultDiv = document.createElement('div');
      resultDiv.classList.add('flex-row');
      resultDiv.classList.add('justify-content-center');
      resultDiv.classList.add('hover-parent');
      resultDiv.appendChild(barDiv);
      resultDiv.appendChild(chartDiv);
      return resultDiv;

    } else {

      // 이용 권한이 없으므로 잠금 표시됨
      const lockDiv = document.createElement('div');
      lockDiv.classList.add('flex-row');
      lockDiv.classList.add('justify-content-center');
      lockDiv.classList.add('height-24-px');
      lockDiv.innerHTML = '<span class="icon cursor has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span>'
      return lockDiv;

    }
  }

  // 증감율
  function incsRate(col, row, thOrTd, props) {
    const roleNm = props.data.roleNm;
    // 매수매도금액은 프리미엄 사용자 이상부터 이용 가능
    let html = '';
    let text = '';
    if (row['prevQuarterCnt'] === 0) {
      text = global.comparisonQuarter + ' 분기 전 데이터 없음';
      html = '<div class="flex-row justify-content-center"><span class="tag is-warning is-light"><strong>' + text + '</strong></span></div>';
    } else {
      if (row['itemStatus']) { // 전량매도 또는 신규편입
        if (row['itemStatus'] === 1) {
          html = '<div class="flex-row justify-content-center hover-parent"><span class="tag is-success is-light hover-main">신규편입</span><div class="flex-row" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><span class="icon cursor ml-1 hover-sub has-text-link"><i class="fas fa-chart-line"></i></span><span class="has-text-link hover-sub">Chart</span></div></div>';
        }
        if (row['itemStatus'] === 2) {
          html = '<div class="flex-row justify-content-center hover-parent"><span class="tag is-danger is-light hover-main">전량매도</span><div class="flex-row" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><span class="icon cursor ml-1 hover-sub has-text-link"><i class="fas fa-chart-line"></i></span><span class="has-text-link hover-sub">Chart</span></div></div>';
        }
      } else { // 해당없음~
        let rate = row['incsRate'];
        if (rate === 0 ) {
          text = '0%';
          html = '<div class="flex-row justify-content-center hover-parent"><span class="is-dark hover-main">' + text + '</span>';
        } else if (0 < rate) {
          text = rate + '%';
          html = '<div class="flex-row justify-content-center hover-parent"><span class="has-text-danger hover-main">' + text + '</span>';
        } else {
          text = rate + '%';
          html = '<div class="flex-row justify-content-center hover-parent"><span class="has-text-link hover-main">' + text + '</span>';
        }

        if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {
          // 차트 아이콘
          html = html + '<div class="flex-row" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 0)"><span class="icon cursor hover-sub has-text-link"><i class="fas fa-chart-line"></i></span><span class="has-text-link hover-sub">Chart</span><div></div>';
        } else {
          // 프리미엄 이상만 이용 가능함
          html = html + '<span class="icon cursor hover-sub has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span></div>';
        }
      }
    }
    row['excelText'] = text;
    return html;
  }

  function resetAutoComplete() {
    global.itemCodeAutoCompleteList = [];
    global.itemNameAutoCompleteList = [];
  }

  function makeAutoCompleteList(row) {
    global.itemCodeAutoCompleteList.push(row.itemCode);
    global.itemNameAutoCompleteList.push(row.itemName);
  }

  function setAutoCompleteList() {
    autoComplete.list = (getSearchType() === 1)
      ? global.itemNameAutoCompleteList
      : global.itemCodeAutoCompleteList;
  }

  // 종목명
  function titleAnchor(col, row) {

    makeAutoCompleteList(row);
    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-start');
    div.classList.add('hover-type1');

    const anchor = document.createElement('a');
    anchor.innerText = cmmUtils.convertDotText(row['itemName'], 14) + ' (' + row['itemCode'] + ')';
    anchor.classList.add('mr-3');
    anchor.addEventListener('click', async function() {
      global['selectedItemName'] = row['itemName'];
      global['selectedItemCode'] = row['itemCode'];
      document.getElementById('stackChartModalTitle').innerText = setLeftChartModalTitle();
      try {
        const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
        if (response.data) {
          cmmUtils.showModal('stackChartModal');
          initLeftItemCodeChart();
          initStackChartGrid();
        } else {
          // 이용할 수 없음
          cmmUtils.showModal('premiumModal');
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
      span.classList.add('has-tooltip-top');
      span.dataset.tooltip = 'Copied!';
    });
    // 툴팁 제거
    span.addEventListener('mouseout', function() {
      span.classList.remove('has-tooltip-top');
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

  // 평균 매수가 헤더
  function bpHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('bpHeader');
    div.innerText = '평균 매수가';
  }

  // 현재가 헤더
  function currPriceHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('currPriceHeader');
    div.innerText = '현재가';
  }

  // 매수, 매도금액 헤더
  function bspHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('bspHeader');
    div.innerText = global.bspName;
  }

  // xx 분기전 대비 보유수량 증감률 앞 추가 요소
  function incRateHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('sphDiv');
    div.innerHTML = getIncRateHeaderHtml();
  }

  function getIncRateHeaderHtml() {
    let html = '';
    html = html + '<div class="flex-row">';
    html = html + '  <div class="flex-col justify-content-center">';

    if (document.getElementById('authority') != null
      && document.getElementById('authority').value !== '[ROLE_BASIC]'
      && document.getElementById('authority').value !== '[ROLE_STANDARD]') {

      html = html + '    <p class="title is-6 cpTitle"><span class="is-orange mr-2">B</span><span>' + global['comparisonQuarterDate'] + '</span></p>';

    } else {

      html = html + '    <p class="title is-6 cpTitle"><span>' + global['comparisonQuarterDate'] + '</span></p>';

    }

    html = html + '  </div>';
    html = html + '</div>';
    return html;
  }

  function setGridTooltips() {
    if (document.getElementById('authority') != null
      && document.getElementById('authority').value !== '[ROLE_BASIC]'
      && document.getElementById('authority').value !== '[ROLE_STANDARD]') {

      cmmUtils.setTippy([{
        selector: '.sphDiv',
        content: '<span class="is-green mr-2">A</span>와 <span class="is-orange">B</span> 기간의 주식수량을 비교하여 증감율을 표시합니다.',
        allowHTML: true
      }]);
    }

    cmmUtils.setTippy([{
      selector: '.currPriceHeader',
      content: '장 중 ' + (global.resetTime / 60) + '분마다 최신 현재주가를 반영하여<br/>비중, 수익률이 재계산됩니다.<br/>※ 국내는 서비스 준비중 입니다.',
      allowHTML: true
    }]);
    cmmUtils.setTippy([{selector: '.bpHeader', content: '단위: 달러'}]);
    cmmUtils.setTippy([{selector: '.bspHeader', content: '단위: 백만달러'}]);
  }

  // 포트폴리오 그리드
  function initProfileGrid() {
    resetAutoComplete();
    // 비교 날짜를 우선적으로 가져옴
    getComparisonQuarter(function(response) {
      global['comparisonQuarterDate'] = (response.quarterDate !== undefined) ? response.quarterDate : '비교대상 없음';
      const body = {
        orderBy: [{column: 'viewWeight', desc: true}],
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate,
        profileType: global.selectedProfileType,
        isLatestQuarter: isLatestQuarterDate()
      }

      // 종목명 검색조건 추가
      if (document.getElementById('schWord').value) {
        body.schType = getSearchType();
        body.schWord = getSearchWord();
      }

      const props = {
        url: '/api/v1/analysis/profile/paging-quarter-info',
        body: body,
        eId: 'profileGrid',
        pId: 'profileGridPagination',
        isThead: true,
        isTfoot: false,
        isPageLoader: true,
        singleSorting: true,
        refreshHeader: false,
        fileName: global.selectedQuarterDate,
        colModel: [
          {id: 'itemCode', isHidden: true},
          {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
          {id: 'itemName', name: '종목명', width: global.width.itemName, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor, hasTooltip: {col: 'itemName', placement: 'right', valueOnly: true}},
          {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', toFixed: 1, isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: customQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: customBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, zeroRpad: global.selectedProfileType !== '1', userCustomHeader: currPriceHeader , isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'fluctRate', name: '등락률', width: global.width.fluctRate, isSort: true, align: 'center', type: 'node', userCustom: fluctRate, isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'buyingSellingPrice', name: global.bspName, width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: buyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}},
          {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: incRateHeader, userCustom: incsRate, isExcel: true, hasTooltip: {col: 'itemName'}}
        ],
        success: function (data, _this) {
          global['gridData'] = data;
          setAutoCompleteList();
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
            setGridTooltips();
            // Clipboard
            initClipboard();
          } else {
            const cpTitleArr = document.getElementsByClassName('cpTitle');
            const len = cpTitleArr.length;

            if (document.getElementById('authority') != null
              && document.getElementById('authority').value !== '[ROLE_BASIC]'
              && document.getElementById('authority').value !== '[ROLE_STANDARD]') {

              for (let i = 0; i < len; i++) {
                cpTitleArr[i].innerHTML = '<span class="is-orange mr-2">B</span><span>' + global['comparisonQuarterDate'] + '</span>';
              }

            }
          }
          global['isInitialedSpinner'] = true;
          runRefreshTimer();
        }
      }
      profileGrid = new COMPONENTS.DataGrid(props);
    });
  }

  // 신규편입 그리드
  function initNewTransferGrid() {
    // 증감율
    const newTransferIncsRate = function(col, row, thOrTd, props) {
      const roleNm = props.data.roleNm;
      let text = '';
      let html = '<div class="flex-row justify-content-center">';
      html = html + '<div class="flex-row justify-content-center hover-parent">';
      html = html + '<span class="tag is-success is-light hover-main">신규편입</span>';

      if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {
        // 차트 아이콘
        html = html + '<div class="flex-row" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><span class="icon cursor ml-1 has-text-link hover-sub"><i class="fas fa-chart-line"></i></span><span class="has-text-link hover-sub">Chart</span></div>';
      } else {
        // 프리미엄 이상만 이용 가능함
        html = html + '<span class="icon cursor hover-sub has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span>';
      }

      html = html + '</div>';
      html = html + '</div>';
      row['excelText'] = text;
      return html;
    }

    function newTransferSpinnerHeader(div, col, props) {
      div.classList.add('flex-row');
      div.classList.add('justify-content-center');
      div.classList.add('sphDiv');
      div.innerHTML = getIncRateHeaderHtml();
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
        isLatestQuarter: isLatestQuarterDate(),
        itemStatus: 1
      },
      eId: 'newTransferGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: false,
      fileName: global.selectedQuarterDate + '_신규편입',
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', width: global.width.itemName, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor, hasTooltip: {col: 'itemName'}},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', toFixed: 1, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: customQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: customBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', zeroRpad: global.selectedProfileType !== '1', userCustomHeader: currPriceHeader, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'fluctRate', name: '등락률', width: global.width.fluctRate, isSort: true, align: 'center', type: 'node', userCustom: fluctRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingSellingPrice', name: global.bspName, width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: buyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: newTransferSpinnerHeader, userCustom: newTransferIncsRate, isExcel: true, hasTooltip: {col: 'itemName'}}
      ],
      success: function (data, _this) {
        setGridTooltips();
        runRefreshTimer();
      }
    }
    newTransferGrid = new COMPONENTS.DataGrid(props);
  }

  // 전량매도 그리드
  function initSoldOutGrid() {
    // 증감율
    const soldOutIncRate = function(col, row, thOrTd, props) {
      const roleNm = props.data.roleNm;
      let text = '';
      let html = '<div class="flex-row justify-content-center">';
      html = html + '<div class="flex-row justify-content-center hover-parent">';
      html = html + '<span class="tag is-danger is-light hover-main">전량매도</span>';

      if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {
        // 차트 아이콘
        // html = html + '<span class="icon cursor ml-1 hover-sub" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><i class="fas fa-chart-line"></i></span>';
        html = html + '<div class="flex-row" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\')"><span class="icon cursor ml-1 has-text-link hover-sub"><i class="fas fa-chart-line"></i></span><span class="has-text-link hover-sub">Chart</span></div>';
      } else {
        // 프리미엄 이상만 이용 가능함
        html = html + '<span class="icon cursor hover-sub has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span>';
      }

      html = html + '</div>';
      html = html + '</div>';
      row['excelText'] = text;
      return html;
    }

    function soldOutSpinnerHeader(div, col, props) {
      div.classList.add('flex-row');
      div.classList.add('justify-content-center');
      div.classList.add('sphDiv');
      div.innerHTML = getIncRateHeaderHtml();
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
        isLatestQuarter: isLatestQuarterDate(),
        itemStatus: 2 // 전량매도
      },
      eId: 'soldOutGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: false,
      fileName: global.selectedQuarterDate + '_전량매도',
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', width: global.width.itemName, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor, hasTooltip: {col: 'itemName'}},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', toFixed: 1, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: customQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: customBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', zeroRpad: global.selectedProfileType !== '1', userCustomHeader: currPriceHeader, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingSellingPrice', name: global.bspName, width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: buyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: soldOutSpinnerHeader, userCustom: soldOutIncRate, isExcel: true, hasTooltip: {col: 'itemName'}}
      ],
      success: function (data, _this) {
        setGridTooltips();
        runRefreshTimer();
      }
    }
    soldOutGrid = new COMPONENTS.DataGrid(props);
  }

  // 매수금액 그리드
  function initBuyingGrid() {
    const body = {
      orderBy: [{column: 'buyingSellingPrice', desc: true}],
      quarterId: global.quarterId,
      profileId: global.profileId,
      comparisonQuarter: global.comparisonQuarter,
      selectedQuarterDate: global.selectedQuarterDate,
      profileType: global.selectedProfileType,
      isLatestQuarter: isLatestQuarterDate()
    }

    const props = {
      url: '/api/v1/analysis/profile/buying',
      body: body,
      eId: 'buyingGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: false,
      fileName: global.selectedQuarterDate,
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', width: global.width.itemName, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor, hasTooltip: {col: 'itemName', placement: 'right', valueOnly: true}},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', toFixed: 1, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: customQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: customBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, zeroRpad: global.selectedProfileType !== '1', userCustomHeader: currPriceHeader , isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'fluctRate', name: '등락률', width: global.width.fluctRate, isSort: true, align: 'center', type: 'node', userCustom: fluctRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingSellingPrice', name: global.bspName, width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: buyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: incRateHeader, userCustom: incsRate, isExcel: true, hasTooltip: {col: 'itemName'}}
      ],
      success: function (data, _this) {
        setGridTooltips();
        runRefreshTimer();
      }
    }
    buyingGrid = new COMPONENTS.DataGrid(props);
  }

  function initSellingGrid() {
    const body = {
      orderBy: [{column: 'buyingSellingPrice'}],
      quarterId: global.quarterId,
      profileId: global.profileId,
      comparisonQuarter: global.comparisonQuarter,
      selectedQuarterDate: global.selectedQuarterDate,
      profileType: global.selectedProfileType,
      isLatestQuarter: isLatestQuarterDate()
    }

    const props = {
      url: '/api/v1/analysis/profile/selling',
      body: body,
      eId: 'sellingGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: false,
      fileName: global.selectedQuarterDate,
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', width: global.width.itemName, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor, hasTooltip: {col: 'itemName', placement: 'right', valueOnly: true}},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', toFixed: 1, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: customQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: customBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, zeroRpad: global.selectedProfileType !== '1', userCustomHeader: currPriceHeader , isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'fluctRate', name: '등락률', width: global.width.fluctRate, isSort: true, align: 'center', type: 'node', userCustom: fluctRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingSellingPrice', name: global.bspName, width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: buyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'incsRate', name: global['comparisonQuarterDate'] + ' C%', width: global.width.incsRate, isSort: true, align: 'center', type: 'custom', userCustomHeader: incRateHeader, userCustom: incsRate, isExcel: true, hasTooltip: {col: 'itemName'}}
      ],
      success: function (data, _this) {
        setGridTooltips();
        runRefreshTimer();
      }
    }
    sellingGrid = new COMPONENTS.DataGrid(props);
  }

  // 왼쪽 차트모달 그리드 종목명
  function stackChartGridtitleAnchor(col, row) {
    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-start');
    const anchor = document.createElement('a');
    anchor.innerText = cmmUtils.convertDotText(row['profileTitle'], 20);
    anchor.addEventListener('click', function(e) {
      const url = '/analysis/profile/details?profileType=' + row['profileType'] + '&profileId=' + row['profileId'];
      cmmUtils.openNewTab(url); // 새탭으로
    });
    cmmUtils.initMiniProfileImg(anchor, row['profileId']);
    div.appendChild(anchor);
    return div;
  }

  // 왼쪽 차트모달 그리드 보유수량
  function stackChartGridQuantity(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main')
    span.innerText = row['quantity'].toLocaleString();

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');
    chartDiv.innerHTML = '<div class="icon-text" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 0, \'' + row['profileId'] + '\')"><span class="has-text-link pr-1"><i class="fas fa-chart-line"></i></span><span class="has-text-link">Chart</span></div>'

    div.appendChild(span);
    div.appendChild(chartDiv);
    return div;
  }

  // 왼쪽 차트모달 그리드 평균 매수가
  function stackChartGridBp(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main')
    span.innerText = row['buyingPrice'].toLocaleString();

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');
    chartDiv.innerHTML = '<div class="icon-text" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 3, \'' + row['profileId'] + '\')"><span class="has-text-link pr-1"><i class="fas fa-chart-line"></i></span><span class="has-text-link">Chart</span></div>'

    div.appendChild(span);
    div.appendChild(chartDiv);
    return div;
  }

  // 왼쪽 차트모달 그리드 매수매도금액
  function stackChartBuyingSellingPrice(col, row, thOrTd, props) {
    const roleNm = props.data.roleNm;
    // 매수매도금액은 프리미엄 사용자 이상부터 이용 가능
    if (roleNm === 'ROLE_ADMIN' || roleNm === 'ROLE_PREMIUM' || roleNm === 'ROLE_PREMIUM_PLUS') {

      // 100분율 처리
      const bspArr = props.rowData.map(function(p) {
        return parseInt(p.buyingSellingPrice); // 100만달러 단위
      });
      const maxValue = _.max(bspArr);
      const minValue = _.min(bspArr);

      // 비율 적용하여 결과값 생성
      let percent = 0;
      let v = parseInt(row.buyingSellingPrice); // 100만달러 단위
      if (0 < v) { // 0 보다 큰경우
        const rate = (maxValue / 100);
        percent = (v / rate).toFixed(3);
        percent = percent < 1 ? 1 : percent; // 0.xx 단위는 1로 처리
      } else if (v < 0) { // 0 보다 작은경우
        const rate = Math.abs((minValue / 100));
        percent = (v / rate).toFixed(3);
        percent = -1 < percent ? -1 : percent; // 0.xx 단위는 1로 처리
      }

      const barDiv = cmmUtils.createAnalysisBar(parseInt(percent),  cmmUtils.roundCurrency(v, 1000000, 1).toLocaleString());
      // const barDiv = cmmUtils.createAnalysisBar(parseInt(percent),  v.toLocaleString());
      barDiv.classList.add('width-100-p');
      barDiv.classList.add('hover-main');

      const chartDiv = document.createElement('div');
      chartDiv.classList.add('flex-row');
      chartDiv.classList.add('justify-content-center');
      chartDiv.classList.add('hover-sub');
      chartDiv.classList.add('height-24-px');
      chartDiv.innerHTML = '<div class="icon-text" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 2, \'' + row['profileId'] + '\')"><span class="has-text-link pr-1"><i class="fas fa-chart-line"></i></span><span class="has-text-link">Chart</span></div>'

      const resultDiv = document.createElement('div');
      resultDiv.classList.add('flex-row');
      resultDiv.classList.add('justify-content-center');
      resultDiv.classList.add('hover-parent');
      resultDiv.appendChild(barDiv);
      resultDiv.appendChild(chartDiv);
      return resultDiv;

    } else {

      // 이용 권한이 없으므로 잠금 표시됨
      const lockDiv = document.createElement('div');
      lockDiv.classList.add('flex-row');
      lockDiv.classList.add('justify-content-center');
      lockDiv.classList.add('height-24-px');
      lockDiv.innerHTML = '<span class="icon cursor has-text-grey" onclick="cmmUtils.showModal(\'premiumModal\')"><i class="fas fa-lock"></i></span>'
      return lockDiv;

    }
  }

  // 왼쪽 차트모달 그리드
  function initStackChartGrid() {
    const body = {
      orderBy: [{column: 'viewWeight', desc: true}],
      selectedQuarterDate: global.selectedQuarterDate,
      profileType: global.selectedProfileType,
      isLatestQuarter: isLatestQuarterDate(),
      schType: 2,
      schWord: global.selectedItemCode
    }

    const props = {
      url: '/api/v1/premium/itemcode',
      body: body,
      eId: 'stackChartGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: true,
      fileName: global.selectedQuarterDate,
      colModel: [
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'profileTitle', name: '포트폴리오', width: global.width.profileTitle, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: stackChartGridtitleAnchor},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: stackChartGridQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: stackChartGridBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', isCurrency: true, userCustomHeader: currPriceHeader , isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingSellingPrice', name: global.bspName, width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: stackChartBuyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}}
      ]
    }
    stackChartGrid = new COMPONENTS.DataGrid(props);
  }

  function setLeftChartModalTitle() {
    if (80 < global['selectedItemName'].length) {
      return global['selectedItemName'].substr(0, 80) + '...' + ' 보유수량 비교';
    } else {
      return global['selectedItemName'] + ' 보유수량 비교';
    }
  }

  function setRightChartModalTitle() {
    if (80 < global['selectedItemName'].length) {
      return global['selectedItemName'].substr(0, 80) + '...';
    } else {
      return global['selectedItemName'];
    }
  }


  // 종목명 클릭시
  async function showColLineChartModal(itemCode, itemName, filterIdx, profileId) {
    // filterIdx => 0: 보유수량, 1:시가평가액, 2:매수매도금액, 3: 평균매수가
    const args = arguments.length;
    try {
      const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
      if (response.data) {

        setSelectedLineChartFilter(2 < args ? filterIdx : 0); // 보유수량을 기본으로
        cmmUtils.showModal('colLineChartModal');
        global.selectedItemCode = itemCode;
        global.selectedItemName = itemName;
        document.getElementById('lineChartModalTitle').innerText = setRightChartModalTitle();
        if (profileId != null) { // 왼쪽 차트 모달 그리드에서 호출되었을 경우
          global.selectedStackChartGridProfileId = profileId;
        }
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
    removeRefreshTimer(); // 타이머 해제
    getLeftItemCodeChartInfo(function(response) {
      // 분기에 Q 값 표시
      response['categories'] = response['categories'].map(function(e) { return e + 'Q'; });

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
            left: '68%',
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              // magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            left: '8%',
            right: '23%',
            containLabel: true
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '80%',
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
            type: 'value'
          },
          series: cmmUtils.isEmpty(response['seriesList']) ? [] : createLeftChartSeries(response['seriesList'])
        }
      };

      if (!!leftItemCodeChart) {
        leftItemCodeChart.dispose();
        leftItemCodeChart = new COMPONENTS.Chart(props);
      } else {
        leftItemCodeChart = new COMPONENTS.Chart(props);
      }
    })
  }

  function createLeftChartSeries(dataArr) {
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
        emphasis: {
          focus: 'series'
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
      showSymbol: false,
      itemStyle: {
        color: '#e0e0e0'
      },
      lineStyle: {
        color: '#e0e0e0',
        type: 'solid' // 'dotted', 'solid'
      },
      data: lineData
    })
    return series;
  }

  function initRightItemCodeChart() {
    removeRefreshTimer();
    getRightItemCodeChartInfo(function(response) {
      // 미공시 데이터를 추가로 가공함
      const modifiedChartData = cmmUtils.addUnknownQuarters(response.categories, response.seriesList[0].data, global.selectedQuarterDate);

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
            left: '76%',
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
          series: createRightChartSeries(response.seriesList[0].name, modifiedChartData)
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

  function createRightChartSeries(name, modifiedChartData) {
    return [
      {
        name: name,
        type: 'line',
        label: {
          show: false,
          position: 'insideRight'
        },
        showSymbol: false,
        data: modifiedChartData.data,
        markArea: {
          itemStyle: {
            color: '#FFFBEB',
            opacity: 0.7
          },
          data: modifiedChartData.markArea
        }
      }
    ]
  }

  function closeStackChartModal() {
    runRefreshTimer();
    document.getElementById('selStackChartFilter')[0].selected = true;
    cmmUtils.closeModal('stackChartModal');
    cmmUtils.closeMiniProfileImg();
  }

  function closeColLineChartModal() {
    runRefreshTimer();
    document.getElementById('selLineChartFilter')[0].selected = true;
    global.selectedStackChartGridProfileId = null; // 왼쪽 차트 모달 그리드에서 선택했던 프로필 아이디 초기화
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
      isPageLoader: true,
      body: {
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate,
        profileType: global.selectedProfileType,
        isLatestQuarter: isLatestQuarterDate()
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
        profileId: global.selectedStackChartGridProfileId != null ? global.selectedStackChartGridProfileId : global.profileId,
        profileType: global.selectedProfileType,
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
          // color: global['defaultColorArr'],
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          roseType: setRoseType(),
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
              radius: ['20%', '60%'],
              label: {
                fontSize: 15,
                fontWeight: 'bold'
              },
              labelLine: {
                // lineStyle: {
                //   color: 'rgba(255, 255, 255, 0.3)'
                // },
                smooth: 0.2,
                length: 50,
                length2: 100
              },
              data: createData(response.rowData)
            }
          ]
        }
      }
      if (!!profilePieChart) {
        reloadPieChart(props.options);
      } else {
        profilePieChart = new COMPONENTS.Chart(props);
      }
      runRefreshTimer();
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

  function initTreeMapChart() {
    getQuarterInfo(function(response) {
      const props = {
        eId: 'profileTreeMapChart',
        options: {
          backgroundColor: {
            type: 'pattern',
            image: getWarterMarkImage(),
            repeat: 'repeat'
          },
          tooltip: {
            formatter: function (info) {
              const fullData = info.data.fullData;
              if (fullData) {
                if (isLatestQuarterDate()) {
                  return [
                    '<div class="tooltip-title">' + fullData.itemName + '</div>',
                    '<div class="tooltip-title">비중: ' + fullData.weight.toFixed(1) + '%</div>',
                    '<div class="tooltip-title">등락률: ' + fullData.fluctRate + '%</div>'
                  ].join('');
                } else {
                  return [
                    '<div class="tooltip-title">' + fullData.itemName + '</div>',
                    '<div class="tooltip-title">비중: ' + fullData.weight.toFixed(1) + '%</div>'
                  ].join('');
                }
              } else {
                return '';
              }
            }
          },
          grid: {
            left: '1%',
            right: '3%',
            // bottom: '1%',
            containLabel: true
          },
          series: getTreeMapSeries(response.rowData)
        }
      }
      if (!!treeMapChart) {
        treeMapChart.dispose();
      }
      treeMapChart= new COMPONENTS.Chart(props);
      runRefreshTimer();
    });
  }

  function getTreeMapSeries(rowData) {
    const negativeValues = cmmUtils.getNegativeValues(rowData, 'weight');
    const maxNegativeValue = _.maxBy(cmmUtils.getAbsValues(negativeValues, 'weight'));
    const positiveValues = cmmUtils.getPositiveValues(rowData, 'weight');
    const maxPositiveValue = _.maxBy(cmmUtils.getAbsValues(positiveValues, 'weight'));
    const data = rowData.map(function(v) {
      let color;
      let name;
      let fontColor;
      const fontSize = parseInt(cmmUtils.getPercentage(v['weight'], v['weight'] < 0 ? maxNegativeValue : maxPositiveValue));
      if (isLatestQuarterDate()) { // 최신 분기만 등락률을 가지고 있으므로 색상처리
        const fluctRate = v.fluctRate > 0 ? '+' + v.fluctRate : v.fluctRate;
        color = getTreeMapColor(v['fluctRate']);
        name = v.itemCode + '\n' + fluctRate + '%';
        fontColor = 'white';
      } else { // 최신 분기가 아니라면
        color = '#E9AB31';
        name = v.itemCode + '\n' + v.weight.toFixed(1) + '%';
        fontColor = '#262834';
      }
      return {
        name: name,
        value: v.weight,
        label: {
          color: fontColor,
          fontWeight: 'bold',
          fontSize: fontSize < 12
            ? 12
            : fontSize > 60 ? 60 : fontSize
        },
        itemStyle: {
          color: color
        },
        fullData: v
      };
    });
    return [{
      name: 'ALL',
      label: {
        show: true,
        formatter: "{b}",
        normal: {
          textStyle: {
            ellipsis: true
          }
        }
      },
      type: 'treemap',
      levels: [
        {
          itemStyle: {
            gapWidth: 3
          }
        }
      ],
      data: data
    }];
  }

  function getTreeMapColor(value) {
    const v = value < 0 ? Math.floor(Math.abs(value)) * -1 : Math.floor(Math.abs(value));
    if (-3 >= v) {
      return '#F01C2B';
    } else if (v === -2) {
      return '#B02B35';
    } else if (v === -1) {
      return '#76323D';
    } else if (v === 0) {
      return '#323543';
    } else if (v === 1) {
      return '#2A643D';
    } else if (v === 2) {
      return '#28913D';
    } else {
      return '#2EC548';
    }
  }

  function initBarChart() {
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
            right: '3%',
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
            right: '3%',
            // bottom: '1%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: global['selectedBarChartFilterText'],
            nameLocation: 'middle',
            nameGap: 30,
            boundaryGap: [0, 0.1],
            nameTextStyle: {
              fontWeight: 'bold'
            },
            axisLabel: {
              fontWeight: 'bold'
            }
          },
          yAxis: {
            type: 'category',
            data: chartData['xAxis'],
            nameTextStyle: {
              fontWeight: 'bold'
            },
            axisLabel: {
              fontWeight: 'bold'
            }
          },
          series: [
            {
              type: 'bar',
              // barWidth: '20px',
              // color: '#001852',
              label: {
                show: true,
                formatter: function (params) { // 3자리 콤마 설정
                  return lableFommater(params.value);
                },
                position: 'right',
                color: '#2f2f2f',
                fontWeight: 'bold'
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
      runRefreshTimer();
    })

    // 3자리 콤마 설정
    function lableFommater(data) {
      data = parseFloat(data);
      return data.toLocaleString();
    }

    // 데이터 가공
    function createData(response) {
      const sortedDataArr = _.orderBy(response.rowData, [global.selectedBarChartFilter], ['asc']);
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

  function addSearchWordEventListener() {
    document.getElementById('schType').addEventListener('change', function() {
      setAutoCompleteList();
      focusSchWord();
    });
  }

  function focusSchWord() {
    document.getElementById('schWord').focus();
  }

  function reloadBarChart (options) {
    profileBarChart.resize();
    profileBarChart.setOption(options);
  }

  function reloadPieChart(options) {
    profilePieChart.resize();
    profilePieChart.setOption(options);
  }

  function reloadTreeMapChart (options) {
    treeMapChart.resize();
    treeMapChart.setOption(options);
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
    // 참고자료 링크
    initProfileLink(data);
    // 소개 랑크
    initProfileInfoTab(data);
    // Fundamental 지수
    initFundamentalChart(data['profileId'], data['profileType'], data['profileTitle']);
    if (document.getElementById('benchmarkTab')) {
      initBenchmarkChart(data['profileId'], data['profileType'], data['profileTitle']);
    }
    // 즐겨찾기
    if ((data['isFavorite'])) {
      createStar(data['isFavorite']);
    }
  }

  // 포트폴리오 소개
  function initProfileInfo(data) {
    cmmUtils.createCKEditor({selector: '#profileInfo', isReadOnly: true, data: data['profileInfo']}, function(editor) {
      global['ckEditProfileInfo'] = editor;
    });
  }

  // 포트폴리오 참고자료 링크
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
        button.classList.add('analysis-media-button');
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
    if (cmmUtils.getRole()) {
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

  // Benchmark 지수 차트 생성
  async function initBenchmarkChart(profileId, profileType, profileTitle) {

    const response = await cmmUtils.awaitAxiosGet({
      url: '/api/v1/analysis/profile/benchmark',
      params: {
        profileId: profileId,
        profileType: profileType,
        profileTitle: profileTitle
      }
    });

    // 분기에 Q 값 표시
    response['categories'] = response['categories'].map(function(e) { return e + 'Q'; });

    const props = {
      eId: 'benchmarkChart',
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
        grid: {
          top: '10%',
          left: '3%',
          right: '3%',
          bottom: '7%',
          containLabel: true
        },
        legend: {
          data: response['legend']
        },
        xAxis:  {
          type: 'category',
          data: response['categories'],
          boundaryGap: false,
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis:  {
          type: 'value'
        },
        series: createBenchmarkSeries(response['seriesList'])
      }
    };

    benchmarkChart = new COMPONENTS.Chart(props);
  }


  // Fundamental 지수 차트 생성
  async function initFundamentalChart(profileId, profileType, profileTitle) {

    const response = await cmmUtils.awaitAxiosGet({
      url: '/api/v1/analysis/profile/fundamental',
      params: {
        profileId: profileId,
        profileType: profileType,
        profileTitle: profileTitle
      }
    });

    // 분기에 Q 값 표시
    response['categories'] = response['categories'].map(function(e) { return e + 'Q'; });

    const props = {
      eId: 'fundamentalChart',
      options: {
        title: {
          text: global.selectedProfileType === '1' ? '(단위: 백만원)' : '(단위: 백만달러)',
          textStyle: {
            fontSize: 11
          },
          top: 0,
          left: '88%'
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'shadow',
            axis: 'auto',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '3%',
          bottom: '7%',
          containLabel: true
        },
        legend: {
          show: false,
          data: response['legend']
        },
        xAxis:  {
          type: 'category',
          data: response['categories'],
          boundaryGap: false,
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis:  {
          type: 'value'
        },
        series: createBenchmarkSeries(response['seriesList'])
      }
    };

    fundamentalChart = new COMPONENTS.Chart(props);
  }

  function createBenchmarkSeries(dataArr) {
    let series = [];
    for (let i = 0; i < dataArr.length; i++) {
      const seriesData = dataArr[i];
      series.push({
        name: seriesData.name,
        type: 'line',
        label: {
          show: false,
          position: 'insideRight'
        },
        areaStyle: {
          opacity: 0.1
        },
        emphasis: {
          focus: 'series'
        },
        showSymbol: false,
        data: seriesData.data
      })
    }
    return series;
  }



  // 투자 아이디어
  function initInvestIdea() {

    if (cmmUtils.getRole() != null) {
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
        initAvailableFileSize();
      }
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

  function initProfileInfoTab(data) {
    document.getElementById('infoDiv').innerHTML = data.profileInfo;
  }

  async function initAvailableFileSize() {
    const usedFileSize = await cmmUtils.awaitAxiosGet({url: '/api/v1/analysis/file/used-size'})
    const convertedSize = cmmUtils.byteCalculation(usedFileSize);
    document.getElementById('usedFileSize').innerText = convertedSize;
    setMaxFileColor(convertedSize);
  }

  function setMaxFileColor(convertedSize) {
    if (convertedSize.indexOf('MB') !== -1) {
      const size = parseFloat(convertedSize.split(' ')[0]);
      if (950 < size) {
        document.getElementById('usedFileSize').classList.add('has-text-danger');
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

  async function closeNewIdeaModal() {
    cmmUtils.closeModal('newIdeaModal');
    await cmmUtils.axiosPost({url: '/common/ckeditor5/unused-files'});
    await initAvailableFileSize();
    reloadIdeaGrid();
  }
  
  async function closeModIdeaModal() {
    cmmUtils.closeModal('modIdeaModal');
    await cmmUtils.axiosPost({url: '/common/ckeditor5/unused-files'});
    await initAvailableFileSize();
    reloadIdeaGrid();
  }

  function reloadIdeaGrid() {
    ideaGrid.reload();
  }

  // 탭 이벤트
  function addTabEventListener() {

    // 상단탭
    const headerTabs = document.getElementById('headerTabs').querySelectorAll('.topTabs');
    for (let i = 0; i < headerTabs.length; i++) {
      // 탭 클릭 이벤트
      headerTabs[i].addEventListener('click', function() {
        resetActiveTab(headerTabs);
        // 선택 탭 활성화
        this.classList.add('is-active');
        document.getElementById(this.getAttribute('data-cont-id')).classList.remove('is-hidden');
      })
    }

    // 분석 탭
    const bottomTabs = document.getElementById('bottomTabs').querySelectorAll('.bottomTabs');
    for (let i = 0; i < bottomTabs.length; i++) {
      // 탭 클릭 이벤트
      bottomTabs[i].addEventListener('click', function() {
        resetActiveTab(bottomTabs);
        // 선택 탭 활성화
        this.classList.add('is-active');
        document.getElementById(this.getAttribute('data-cont-id')).classList.remove('is-hidden');
        setActiveBottomTabInfo(this);
        showBottomTab();
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

  function setActiveBottomTabInfo(el) {
    global.tabView = el.getAttribute('data-view');
  }

  function saveIdea() {
    if (verifyNewIdeaForm()) {
      const formData = new FormData();
      formData.append('profileId', global.profileId);
      formData.append('ideaTitle', document.getElementById('newIdeaTitle').value);
      formData.append('ideaCont', global.ckEditNewIdeaCont.getData());

      const images = document.getElementById('newIdeaModal').querySelector('.ck-content').querySelectorAll('img');
      for (let i=0;i<images.length;i++) {
        const split = images[i].src.split('.')[0].split('/');
        const usedImageId = split[split.length - 1];
        formData.append('usedImageIds', usedImageId);
      }

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

        const images = document.getElementById('modIdeaModal').querySelector('.ck-content').querySelectorAll('img');
        for (let i=0;i<images.length;i++) {
          const split = images[i].src.split('.')[0].split('/');
          const usedImageId = split[split.length - 1];
          formData.append('usedImageIds', usedImageId);
        }

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

  function removeIdea() {
    const msg = '아이디어를 삭제 하시겠습니까?';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, async function() {
      const response = await cmmUtils.awaitAxiosPost({
        url: '/api/v1/analysis/profile/remove-idea',
        body: {
          ideaId: global.selectedIdeaId
        }
      });

      if (response) {
        cmmUtils.showToast({message: '삭제 되었습니다.'});
        closeModIdeaModal();
      } else {
        cmmUtils.goToErrorPage(response);
      }
    });
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
  function runRefreshTimer() {
    // 현재는 해외만.. 국내는 새로고침이 의미가 없어서 제거
    if (global.selectedProfileType === '2') {
      removeRefreshTimer(); // 타이머 해제
      global['timerCount'] = global['resetTime'];
      global['timerObj'] = setInterval(global.refreshTimer,1000)
    } else {
      // 제거
      const timerDiv = document.getElementById('timerDiv');
      if (timerDiv) {
        timerDiv.remove();
      }
    }
  }

  function changeRefreshSwitch() {
    if (this.checked) {
      runRefreshTimer();
    } else {
      removeRefreshTimer(); // 타이머 해제
    }
  }

  // 타이머 해제
  function removeRefreshTimer() {
    clearInterval(global.timerObj); // 타이머 해제
  }

  function searchItemName(e) {
    initProfileGrid();
  }

  function searchInputKeyup(e) {
    if (e.key === 'Enter') {
      initProfileGrid();
    }
  }

  function getSearchType() {
    return parseInt(document.getElementById('schType').value);
  }

  function getSearchWord() {
    return document.getElementById('schWord').value;
  }

  // 호출할 분기가 최신 분가가 맞는지 리턴
  function isLatestQuarterDate() {
    return global.selectedQuarterDate === global.latestQuarterDate ? 1 : 0;
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
    removeIdea: removeIdea,
    goToLinkPop: goToLinkPop,
    searchInputKeyup: searchInputKeyup,
    searchItemName: searchItemName,
    changeRefreshSwitch: changeRefreshSwitch,

  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('schWord').addEventListener('keyup', main.searchInputKeyup);
  document.getElementById('switchRefresh').addEventListener('change', main.changeRefreshSwitch);
});
