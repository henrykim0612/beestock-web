const COMPONENTS = BeeComponents('dataGrid', 'chart', function(box) {});
const main = (function () {

  let global = {
    selectedQuarterDate: null,
    selectedProfileId: null,
    profileType: null,
    selectedItemCode: null,
    selectedItemName: null,
    schType: null,
    bspName: null,
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
      min: 0,
      max: 1,
      inRange: {
        color: ['#3273DC', '#F14668']
      }
    },
  }
  let rightItemCodeChart = undefined;
  let grid = undefined;

  function init() {
    setInitialValues();
    initGrid();
  }

  function setInitialValues() {
    global.selectedQuarterDate = document.getElementById('selectedQuarterDate').value;
    global.selectedProfileId = document.getElementById('profileId').value;
    global.profileType = document.getElementById('profileType').value;
    global.selectedItemCode = document.getElementById('itemCode').value;
    global.selectedItemName = document.getElementById('itemName').value;
    global.schType = document.getElementById('schType').value;
    global.bspName = global.profileType === '1' ? '매수금액' : '매수 · 매도금액';
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

  function stackChartGridQuantity(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    // div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main')
    span.innerText = row['quantity'].toLocaleString();

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');
    chartDiv.innerHTML = '<span class="icon cursor" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 0, \'' + row['profileId'] + '\')"><i class="fas fa-chart-line"></i></span>'

    div.appendChild(span);
    // div.appendChild(chartDiv);
    return div;
  }

  function bpHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('bpHeader');
    div.innerText = '평균 매수가';
  }

  function stackChartGridBp(col, row) {

    const div = document.createElement('div');
    div.classList.add('flex-row');
    div.classList.add('justify-content-end');
    // div.classList.add('hover-parent');

    const span = document.createElement('span');
    span.classList.add('hover-main')
    span.innerText = row['buyingPrice'].toLocaleString();

    const chartDiv = document.createElement('div');
    chartDiv.classList.add('hover-sub');
    chartDiv.classList.add('height-24-px');
    chartDiv.innerHTML = '<span class="icon cursor" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 3, \'' + row['profileId'] + '\')"><i class="fas fa-chart-line"></i></span>'

    div.appendChild(span);
    // div.appendChild(chartDiv);
    return div;
  }

  function currPriceHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('currPriceHeader');
    div.innerText = '현재가';
  }

  function bspHeader(div, col, props) {
    div.classList.add('flex-row');
    div.classList.add('justify-content-center');
    div.classList.add('bspHeader');
    div.innerText = global.bspName;
  }

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
      // barDiv.classList.add('hover-main');

      const chartDiv = document.createElement('div');
      chartDiv.classList.add('flex-row');
      chartDiv.classList.add('justify-content-center');
      chartDiv.classList.add('hover-sub');
      chartDiv.classList.add('height-24-px');
      chartDiv.innerHTML = '<span class="icon cursor" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\', \'' + row['itemName'] + '\', 2, \'' + row['profileId'] + '\')"><i class="fas fa-chart-line"></i></span>'

      const resultDiv = document.createElement('div');
      resultDiv.classList.add('flex-row');
      resultDiv.classList.add('justify-content-center');
      resultDiv.classList.add('hover-parent');
      resultDiv.appendChild(barDiv);
      // resultDiv.appendChild(chartDiv);
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

  function initGrid() {
    const body = {
      orderBy: [{column: 'viewWeight', desc: true}],
      selectedQuarterDate: global.selectedQuarterDate,
      profileType: global.profileType,
      schType: global.schType,
      schWord: global.schType === '1' ? global.selectedItemName : global.selectedItemCode
    }
    const props = {
      url: '/api/v1/premium/itemcode',
      body: body,
      eId: 'detailGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: true,
      singleSorting: true,
      refreshHeader: true,
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
    grid = new COMPONENTS.DataGrid(props);
  }

  async function showColLineChartModal(itemCode, itemName, filterIdx, profileId) {
    // filterIdx => 0: 보유수량, 1:시가평가액, 2:매수매도금액, 3: 평균매수가
    const args = arguments.length;
    try {
      const response = await axios.post(CONTEXT_PATH + '/api/v1/analysis/profile/is-available-event.do', {eventNum: 2});
      console.log(response);
      if (response.data) {

        setSelectedLineChartFilter(2 < args ? filterIdx : 0); // 보유수량을 기본으로
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

  function setRightChartModalTitle() {
    if (80 < global['selectedItemName'].length) {
      return global['selectedItemName'].substr(0, 80) + '...';
    } else {
      return global['selectedItemName'];
    }
  }

  function setSelectedLineChartFilter(idx) {
    document.getElementById('selLineChartFilter').options[idx].selected = true;
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
          itemStyle: {
            color: '#FFFBEB',
            opacity: 0.7
          },
          data: modifiedChartData.markArea
        }
      }
    ]
  }

  function closeColLineChartModal() {
    document.getElementById('selLineChartFilter')[0].selected = true;
    cmmUtils.closeModal('colLineChartModal');
  }


  return {
    init: init,
    showColLineChartModal: showColLineChartModal,
    closeColLineChartModal: closeColLineChartModal
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});