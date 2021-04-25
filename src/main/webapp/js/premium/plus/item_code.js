const COMPONENTS = BeeComponents('dataGrid', 'chart', function(box) {});
const main = (function () {

  let global = {
    selectedQuarterDate: null,
    selectedProfileType: null,
    selectedProfileId: null,
    selectedItemName: null,
    selectedItemCode: null,
    maxNegativeBsp: null,
    maxPositiveBsp: null,
    maxNegativeEarnRate: null,
    maxPositiveEarnRate: null,
    width: {
      profileTitle: '250px', // 포트폴리오
      itemName: '200px', // 종목명
      viewWeight: '60px', // 비중
      quantity: '110px', // 보유수량
      buyingPrice: '100px', // 평균 매수가
      currPrice: '80px', // 현재가
      fluctRate: '80px', // 등락률
      earnRate: '140px', // 수익률
      buyingSellingPrice: '140px' //매수매도금액
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
    autocomplete: {
      instance: undefined,
      data: undefined
    }
  }
  let profileGrid;
  let rightItemCodeChart;
  let clipboard = undefined;

  function init() {
    createBreadCrumb();
    initAutoComplete();
    initFilterEventListeners();
    initQuarterSelbox();
    focusSchWord();
    addSelectedLineChartFilterEvents();
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
    html += '      <span class="icon is-small"><i class="fas fa-user-tie" aria-hidden="true"></i></span>';
    html += '      <span>Premium Plus</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-search-dollar"></i></span>';
    html += '      <span>종목검색</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  async function initAutoComplete() {
    global.autocomplete.data = await cmmUtils.awaitAxiosGet({url: '/api/v1/premium/autocomplete'});
    global.autocomplete.instance = new Awesomplete(document.getElementById('inputSearch'));
    global.autocomplete.instance.list = global.autocomplete.data.outStockItemNameList; // 기본은 해외종목명
  }

  function initFilterEventListeners() {
    document.getElementById('selType').addEventListener('change', changeAutocompleteList);
    document.getElementById('schType').addEventListener('change', changeAutocompleteList);
  }

  function changeAutocompleteList() {
    const filter1 = document.getElementById('selType').value;
    const filter2 = document.getElementById('schType').value;
    if (filter1 === '1') {
      // 국내
      global.autocomplete.instance.list = (filter2 === '1') ? global.autocomplete.data.inStockItemNameList : global.autocomplete.data.inStockItemCodeList;
    } else {
      // 해외
      global.autocomplete.instance.list = (filter2 === '1') ? global.autocomplete.data.outStockItemNameList : global.autocomplete.data.outStockItemCodeList;
    }
  }

  // 존재하는 분기 검색
  function initQuarterSelbox() {
    const url = '/api/v1/analysis/profile/quarter-all';
    cmmUtils.axiosGet({url: url}, createQuarterSelbox);
  }

  // 분기 셀렉트박스 생성
  function createQuarterSelbox(data) {
    const fragment = document.createDocumentFragment();
    data.forEach(function(e) {
      const option = document.createElement('option');
      option.value = e.quarterDate;
      option.innerText = e.quarterDate + 'Q';
      fragment.appendChild(option);
    });
    document.getElementById('selQuarter').appendChild(fragment);
  }

  // 종목명
  function titleAnchor(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-start');
    div.classList.add('hover-type1');

    const anchor = document.createElement('a');
    anchor.innerText = row['profileTitle'];
    anchor.classList.add('mr-3');
    anchor.addEventListener('click', function() {
      global['selectedProfileId'] = row['profileId'];
      const url = '/analysis/profile/details?profileType=' + row['profileType'] + '&profileId=' + row['profileId'] + '&quarterDate=' + global.selectedQuarterDate;
      cmmUtils.goToPage(url);
    });

    div.appendChild(anchor);
    return div;
  }

  // 종목명
  function itemName(col, row) {
    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-start');
    const span = document.createElement('span');
    span.innerText = cmmUtils.convertDotText(row['itemName'], 20);
    div.appendChild(span);
    return div;
  }

  // 보유수량
  function customQuantity(col, row) {

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
    chartDiv.innerHTML = '<span class="icon cursor" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', \''+ row['profileId'] +'\', 0)"><i class="fas fa-chart-line"></i></span>'

    div.appendChild(span);
    div.appendChild(chartDiv);
    return div;
  }

  // 평균 매수가
  function customBp(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main');
    span.innerText = global.selectedProfileType === 1 ? row['buyingPrice'].toLocaleString() : cmmUtils.addZeroStr(row['buyingPrice'].toLocaleString());

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');
    chartDiv.innerHTML = '<span class="icon cursor" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', \''+ row['profileId'] +'\', 3)"><i class="fas fa-chart-line"></i></span>'

    div.appendChild(span);
    div.appendChild(chartDiv);
    return div;
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

  // 등락률
  function fluctRate(col, row) {
    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    const span = document.createElement('span');
    span.innerText = '준비중';
    div.appendChild(span);
    return div;
  }

  // 매수, 매도금액 헤더
  function bspHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('bspHeader');
    div.innerText = '매수 · 매도금액';
  }

  // 매수금액 막대표
  function buyingSellingPrice(col, row, thOrTd, props) {

    if (global.maxNegativeBsp == null) {
      const negativeValues = cmmUtils.getNegativeValues(props.rowData, 'buyingSellingPrice');
      global.maxNegativeBsp = _.maxBy(cmmUtils.getAbsValues(negativeValues, 'buyingSellingPrice'));
    }
    if (global.maxPositiveBsp == null) {
      const positiveValues = cmmUtils.getPositiveValues(props.rowData, 'buyingSellingPrice');
      global.maxPositiveBsp = _.maxBy(cmmUtils.getAbsValues(positiveValues, 'buyingSellingPrice'));
    }

    const percent = parseInt(cmmUtils.getPercentage(row['buyingSellingPrice'], row['buyingSellingPrice'] < 0 ? global.maxNegativeBsp : global.maxPositiveBsp, true).toFixed(1));
    const barDiv = cmmUtils.createAnalysisBar(percent,  cmmUtils.roundCurrency(row['buyingSellingPrice'], 1000000, 1).toLocaleString());

    // const barDiv = cmmUtils.createAnalysisBar(parseInt(percent),  v.toLocaleString());
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

  function removeInitParagraph() {
    if (document.getElementById('initParagraph') != null) {
      document.getElementById('initParagraph').remove();
    }
  }

  function resetMinMaxValues() {
    global.maxNegativeBsp = null;
    global.maxPositiveBsp = null;
    global.maxNegativeEarnRate = null;
    global.maxPositiveEarnRate = null;
  }

  // 그리드 생성
  function initGrid() {
    resetMinMaxValues();
    removeInitParagraph();
    setQuarterDate();
    setProfileType();

    const body = {
      orderBy: [{column: 'viewWeight', desc: true}],
      selectedQuarterDate: global.selectedQuarterDate,
      profileType: global.selectedProfileType,
      isLatestQuarter: cmmUtils.isLatestQuarter(global.selectedQuarterDate),
    }
    const schWord = getSearchWord();
    if (schWord) {
      body.schType = getSearchType();
      body.schWord = schWord;
    }

    const props = {
      url: '/api/v1/premium/paging/itemcode',
      body: body,
      eId: 'profileGrid',
      pId: 'profileGridPagination',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: true,
      fileName: global.selectedQuarterDate,
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'profileTitle', name: '포트폴리오', width: global.width.profileTitle, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: titleAnchor},
        {id: 'itemName', name: '종목명', width: global.width.itemName, isSort: true, align: 'left', isExcel: true, type: 'node', userCustom: itemName, hasTooltip: {col: 'itemName', valueOnly: true}},
        {id: 'viewWeight', name: '비중', width: global.width.viewWeight, isSort: true, align: 'center', prefixText: '%', isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'quantity', name: '보유수량', width: global.width.quantity, isSort: true, align: 'right', isCurrency: true, type: 'node', userCustom: customQuantity, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingPrice', name: '평균 매수가', width: global.width.buyingPrice, isSort: true, align: 'right', userCustomHeader: bpHeader, type: 'node', userCustom: customBp, isCurrency: true, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'currPrice', name: '현재가', width: global.width.currPrice, isSort: true, align: 'right', zeroRpad: global.selectedProfileType !== 1, isCurrency: true, userCustomHeader: currPriceHeader , isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'buyingSellingPrice', name: '매수 · 매도금액', width: global.width.buyingSellingPrice, isSort: true, align: 'center', type: 'node', userCustomHeader: bspHeader, userCustom: buyingSellingPrice, isExcel: true, hasTooltip: {col: 'itemName'}},
        {id: 'earnRate', name: '수익률', width: global.width.earnRate, isSort: true, align: 'center', type: 'node', userCustom: earnRate, isExcel: true, hasTooltip: {col: 'itemName'}}
      ],
      success: function (data, _this) {
        setGridTooltips();
        // Clipboard
        initClipboard()
      }
    }
    profileGrid = new COMPONENTS.DataGrid(props);
  }

  function setGridTooltips() {
    cmmUtils.setTippy([{selector: '.bpHeader', content: '단위: 달러'}]);
    cmmUtils.setTippy([{selector: '.bspHeader', content: '단위: 백만달러'}]);
  }

  function initClipboard() {
    if (!!clipboard) clipboard.destroy();
    clipboard = new ClipboardJS('.has-clipboard');
  }


  async function showColLineChartModal(itemCode, itemName, profileId, filterIdx) {
    // filterIdx => 0: 보유수량, 1:시가평가액, 2:매수매도금액, 3: 평균매수가
    const args = arguments.length;
    try {
      const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
      console.log(response);
      if (response.data) {

        setSelectedLineChartFilter(filterIdx);
        cmmUtils.showModal('colLineChartModal');
        global.selectedItemCode = itemCode;
        global.selectedItemName = itemName;
        global.selectedProfileId = profileId;
        document.getElementById('lineChartModalTitle').innerText = setRightChartModalTitle();
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

  function initRightItemCodeChart() {
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

  function getRightItemCodeChartInfo(callback) {
    cmmUtils.axiosPost({
      url: '/api/v1/analysis/profile/line-chart/item-code',
      body: {
        selectedQuarterDate: global.selectedQuarterDate,
        profileId: global.selectedProfileId,
        profileType: global.selectedProfileType,
        itemCode: global.selectedItemCode,
        filterNum: getSelectedLineChartFilter()
      }
    }, callback);
  }

  function getSelectedLineChartFilter() {
    return parseInt(document.getElementById('selLineChartFilter').value);
  }

  function setSelectedLineChartFilter(idx) {
    document.getElementById('selLineChartFilter').options[idx].selected = true;
  }

  function setRightChartModalTitle() {
    if (80 < global['selectedItemName'].length) {
      return global['selectedItemName'].substr(0, 80) + '...';
    } else {
      return global['selectedItemName'];
    }
  }

  function getSearchType() {
    return parseInt(document.getElementById('schType').value);
  }

  function getSearchWord() {
    return document.getElementById('inputSearch').value;
  }

  function setQuarterDate() {
    global.selectedQuarterDate = document.getElementById('selQuarter').value;
  }

  function setProfileType() {
    global.selectedProfileType = parseInt(document.getElementById('selType').value);
  }

  function focusSchWord() {
    document.getElementById('inputSearch').focus();
  }

  function inputKeyup(e) {
    if (e.key === 'Enter') {
      initGrid();
    }
  }

  function closeColLineChartModal() {
    document.getElementById('selLineChartFilter')[0].selected = true;
    cmmUtils.closeModal('colLineChartModal');
  }

  // 오른쪽 차트모달 필터 이벤트
  function addSelectedLineChartFilterEvents() {
    document.getElementById('selLineChartFilter').addEventListener('change', function() {
      initRightItemCodeChart();
    });
  }

  return {
    init: init,
    initGrid: initGrid,
    showColLineChartModal: showColLineChartModal,
    closeColLineChartModal: closeColLineChartModal,
    inputKeyup: inputKeyup
  }

}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
  document.getElementById('inputSearch').addEventListener('keyup', main.inputKeyup)
});