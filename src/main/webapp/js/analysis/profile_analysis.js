const COMPONENTS = BeeComponents('dataGrid', 'chart', function(box) {});
const main = (function() {

  let global = {
    profileId: null,
    profileTitle: null,
    selectedIdeaId: null,
    chart: undefined,
    ckEditNewIdeaCont: undefined,
    ckEditModIdeaCont: undefined,
    newFileArr: [], // uuid, file, isRemoved
    modFileArr: [], // uuid, fileId, fileSize, isRemoved
    quarterId: null,
    comparisonQuarter: 1, // 기본은 1분기전
    selectedQuarterDate: null,
    selectedBarChartFilter: 'marketPrice',
    selectedBarChartFilterText: '시가평가액',
    selectedItemName: null,
    selectedItemCode: null,
    itemCodeStackChartData: undefined,
    itemCodeLineChartData: undefined,
    sortedDataArr: [],
    tabView: 'grid', // 엑티브된 탭정보를 가지고있는 변수(초기 설정은 그리드)
    isInitiatedSpinner: false,
  };
  let ideaGrid = undefined;
  let profileGrid = undefined;
  let profileBarChart = undefined;
  let itemCodeStackChart = undefined;
  let itemCodeLineChart = undefined;

  function init() {
    createBreadCrumb();
    global.profileId = document.getElementById('profileId').value;
    getProfileDetails();
    initQuarterSlider();
    addSpanStarEvent();
    initInvestIdea();
    initTooltips();
    addFileEventListener();
    addTabEventListener();
    addBarChartSelectBoxListener();
    addStackChartSelectBoxListener();
    if (document.getElementById('icoExcelDownload')) cmmUtils.setExcelTippy(['#icoExcelDownload']);
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
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-chart-line"></i></span>';
    html += '      <span>프로필 분석</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function getProfileDetails() {
    const url = '/api/v1/analysis/profile/' + global.profileId;
    cmmUtils.getData({
      url: url
    }).then(setProfileHeader).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  // 분기 슬라이더 생성
  function initQuarterSlider() {
    const url = '/api/v1/analysis/profile/quarter-all/' + global.profileId;
    cmmUtils.getData({
      url: url,
    }).then(function(response) {
      clearQuarterCont();
      createQuarterSlider(response);
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function clearQuarterCont() {
    const quarterCont = document.getElementById('quarterCont');
    cmmUtils.clearChildNodes(quarterCont);
  }

  function createQuarterSlider(response) {
    // <div class="swiper-slide"><button class="button is-link is-inverted is-small"><span class="icon"><i class="fas fa-clock"></i></span><span>2020-2분기</span></button></div>
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < response.length; i++) {
      const quarter = response[i];
      // 슬라이드 생성
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      const button = document.createElement('button');
      button.classList.add('button');
      button.classList.add('is-small');
      button.classList.add('is-link');
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
    const quarterCont = document.getElementById('quarterCont');
    quarterCont.appendChild(fragment.cloneNode(true));
    addSlideButtonEvents(quarterCont);
    initSwiper();
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
          resetButtons(slideButtons);
          activeButton(this);
          global.quarterId = this.getAttribute('data-key');
          global.selectedQuarterDate = this.getAttribute('data-quarter');
          showTab();
        });
      }
      // 기본 1분기 전 데이터를 보여줌
      slideButtons[1].click();
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
    }
  }

  // 프로필 그리드
  function initProfileGrid() {

    // 수익률 막대 표
    const earnRate = function(col, row) {
      row['excelText'] = row['earnRate'] + '%'; // 엑셀전용
      return cmmUtils.createAnalysisBar(row['earnRate']);
    }

    // xx 분기전 대비 보유수량 증감률 앞 추가 요소
    const addingFrontHeader = function(col, props) {
      const div = document.createElement('div');
      div.classList.add('flex-row');
      div.classList.add('justify-content-center');
      div.classList.add('mr-3');
      let html = '';
      html = html + "<div class='ctrl'>";
      html = html + "  <div class='ctrl__button ctrl__button--decrement'>&ndash;</div>";
      html = html + "  <div class='ctrl__counter'>";
      html = html + "    <input class='ctrl__counter-input' maxlength='10' type='text' value='1'>";
      html = html + "      <div class='ctrl__counter-num'>1</div>";
      html = html + "  </div>";
      html = html + "  <div class='ctrl__button ctrl__button--increment'>+</div>";
      html = html + "</div>";
      div.innerHTML = html;
      return div;
    }

    // 증감율
    const incsRate = function(col, row) {
      let html = '';
      let text = '';
      if (row['prevQuarterCnt'] === 0) {
        text = global.comparisonQuarter + ' 분기 전 데이터 없음';
        html = '<span class="tag is-warning is-light"><strong>' + text + '</strong></span>'
      } else {
        if (row['itemStatus']) { // 전량매도 또는 신규편입
          if (row['itemStatus'] === 1) {
            html = '<span class="tag is-success is-light">신규편입</span>'
          }
          if (row['itemStatus'] === 2) {
            html = '<span class="tag is-danger is-light">전량매도</span>'
          }
        } else { // 해당없음~
          let rate = row['incsRate'];
          if (rate === 0 ) {
            text = '0%';
            html = '<span class="is-dark">' + text + '</span>'
          } else if (0 < rate) {
            text = rate + '%';
            html = '<span class="has-text-link">' + text + '</span>'
          } else {
            text = rate + '%';
            html = '<span class="has-text-danger">' + text + '</span>'
          }
          // 차트 아이콘
          html = html + '<span class="icon cursor ml-3" onclick="main.showColLineChartModal(\'' + row['itemCode'] + '\')"><i class="fas fa-chart-line"></i></span>';
        }
      }

      row['excelText'] = text;
      return html;
    }

    // 종목명
    const titleAnchor = function(anchor, col, row) {
      anchor.setAttribute('data-custom', 'titleAnchor');
      anchor.setAttribute('data-key', row['itemCode']);
      anchor.setAttribute('data-name', row['itemName']);
    }

    const props = {
      url: '/api/v1/analysis/profile/quarter-info',
      body: {
        orderBy: [{column: 'viewWeight', desc: true}],
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate
      },
      eId: 'profileGrid',
      isThead: true,
      isTfoot: false,
      isPageLoader: false,
      fileName: global.selectedQuarterDate,
      colModel: [
        {id: 'itemCode', isHidden: true},
        {id: 'rowNum', name: 'No', align: 'center', isExcel: true},
        {id: 'itemName', name: '종목명', isSort: true, align: 'left', isExcel: true, isLink: true, userCustom: titleAnchor},
        {id: 'viewWeight', name: '비중', isSort: true, align: 'center', prefixText: '%', isExcel: true},
        {id: 'quantity', name: '보유수량', isSort: true, align: 'right', isCurrency: true, isExcel: true},
        {id: 'buyingPrice', name: '매수가', isSort: true, align: 'right', isCurrency: true, isExcel: true},
        {id: 'currPrice', name: '현재가', isSort: true, align: 'right', isCurrency: true, isExcel: true},
        {id: 'earnRate', name: '수익률', isSort: true, align: 'center', width: '170px', type: 'node', userCustom: earnRate, isExcel: true},
        {id: 'incsRate', name: '분기전 대비 보유수량 증감률', isSort: true, align: 'center', addingFrontHeader: addingFrontHeader, type: 'custom', userCustom: incsRate, isExcel: true}
      ],
      success: function (data, _this) {
        if (!global['isInitiatedSpinner']) { // 최초에만 한번 초기화
          initSpinner();
        }
        itemNameAnchorEvent(data, _this);
      }
    }
    profileGrid = new COMPONENTS.DataGrid(props);
  }

  // 종목명 클릭시
  function itemNameAnchorEvent(data, _this) {
    const eId = _this.props.eId;
    const tags = document.getElementById(eId).querySelectorAll('[data-custom=titleAnchor]');
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener('click', function() {
        global['selectedItemName'] = this.getAttribute('data-name');
        global['selectedItemCode'] = this.getAttribute('data-key');
        showStackChartModal();
      })
    }
  }

  function showStackChartModal() {
    document.getElementById('stackChartModalTitle').innerText = global['selectedItemName'] + ' 보유수량 비교';
    cmmUtils.showModal('stackChartModal');
    initItemCodeStackChart();
  }

  function initItemCodeStackChart() {
    getItemCodeStackChartInfo(function(response) {
      global['itemCodeStackChartData'] = response;
      const props = {
        eId: 'itemCodeChart',
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
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
            right: '15%',
            containLabel: true
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '86%',
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
          series: cmmUtils.isEmpty(response['seriesList']) ? [] : createSeriesArr(response['seriesList'])
        }
      };

      if (!!itemCodeStackChart) {
        itemCodeStackChart.dispose();
        itemCodeStackChart = new COMPONENTS.Chart(props);
      } else {
        itemCodeStackChart = new COMPONENTS.Chart(props);
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
            show: true,
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

  function showColLineChartModal(itemCode) {
    cmmUtils.showModal('colLineChartModal');
    global.selectedItemCode = itemCode;
    initItemCodeLineChart();
  }

  function initItemCodeLineChart() {
    getItemCodeLineChartInfo(function(response) {
      global['itemCodeLineChartData'] = response;
      const props = {
        eId: 'itemCodeLineChart',
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
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
          grid: {
            containLabel: true
          },
          xAxis:  {
            type: 'category',
            data: response['categories'],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis:  {
            type: 'value',
          },
          series: createSeriesArr(response['seriesList'])
        }
      };
      if (!!itemCodeLineChart) {
        itemCodeLineChart.dispose();
        itemCodeLineChart = new COMPONENTS.Chart(props);
      } else {
        itemCodeLineChart = new COMPONENTS.Chart(props);
      }
    })

    function createSeriesArr(data) {
      let series = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        series.push({
          type: 'line',
          symbolSize: 7,
          name: row.name,
          data: row.data
        })
      }
      return series;
    }
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

  function getSelectedLineChartFilter() {
    return parseInt(document.getElementById('selLineChartFilter').value);
  }
  

  // 분기 분석 정보 반환
  function getQuarterInfo(callback) {
    cmmUtils.postData({
      url: '/api/v1/analysis/profile/quarter-info',
      body: {
        quarterId: global.quarterId,
        profileId: global.profileId,
        comparisonQuarter: global.comparisonQuarter,
        selectedQuarterDate: global.selectedQuarterDate
      }
    }).then(callback).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  // 종목코드 스택차트 데이터 반환
  function getItemCodeStackChartInfo(callback) {
    cmmUtils.postData({
      url: '/api/v1/analysis/profile/stack-chart/item-code',
      body: {
        selectedQuarterDate: global.selectedQuarterDate,
        itemCode: global.selectedItemCode,
        profileTitle: global.profileTitle,
        filterNum: getSelectedStackChartFilter(),
      }
    }).then(callback).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }
  
  function getItemCodeLineChartInfo(callback) {
    cmmUtils.postData({
      url: '/api/v1/analysis/profile/line-chart/item-code',
      body: {
        selectedQuarterDate: global.selectedQuarterDate,
        profileId: global.profileId,
        itemCode: global.selectedItemCode,
        filterNum: getSelectedLineChartFilter(),
      }
    }).then(callback).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  // 프로필 차트
  function initBarChart() {
    getQuarterInfo(function(response) {
      const chartData = createData(response);
      const props = {
        eId: 'profileBarChart',
        options: {
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
              color: '#276cda',
              label: {
                show: true,
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

  function initRadarChart() {
    getQuarterInfo(function(response) {

    })
  }

  function pushBarChartData(result, data, limitSize) {
    const argLen = arguments.length;
    const dataLen = data.length;
    for (let i = argLen === 3 ? (dataLen - limitSize) : 0; i < dataLen; i++) {
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

  function addStackChartSelectBoxListener() {
    document.getElementById('selStackChartFilter').addEventListener('change', initItemCodeStackChart);
  }

  function reloadBarChart (options) {
    profileBarChart.resize();
    profileBarChart.setOption(options);
  }

  // 프로필 헤더 생성
  function setProfileHeader(data) {
    // 프로필 이미지
    const profileImg = document.getElementById('profileImg');
    profileImg.src = CONTEXT_PATH + '/common/image/' + data['fileId'];
    // 타이틀
    const profileTitle = data['profileTitle'];
    document.getElementById('profileTitle').innerText = profileTitle;
    document.getElementById('selStackChartFilter')[2].innerText = profileTitle;
    global['profileTitle'] = profileTitle;

    // Information
    document.getElementById('profileSubtitle').innerText = data['profileSubtitle'];

    createStar(data['isFavorite']);
  }

  // 즐겨찾기 클릭 이벤트
  function addSpanStarEvent() {
    document.getElementById('spanStar').addEventListener('click', function() {
      const favoriteVal = parseInt(this.getAttribute('data-favorite')) === 1 ? 2 : 1;
      this.setAttribute('data-favorite', ''+favoriteVal);
      cmmUtils.postData({
        url: '/api/v1/analysis/profile/favorite',
        body: {
          profileId: global.profileId,
          isFavorite: favoriteVal
        },
      }).then(function (response) {
        cmmUtils.showToast({message: favoriteVal === 1 ? '즐겨찾기 되었습니다.' : '즐겨찾기가 해제되었습니다.'});
        createStar(favoriteVal);
      }).catch(function (err) {
        cmmUtils.showErrModal();
        console.log(err);
      });
    })
  }

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
          profileId: global.profileId
        },
        eId: 'ideaGrid',
        isThead: true,
        isTfoot: false,
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
    tippy('#fileField', {
      content: '다중선택 가능',
      placement: 'top'
    });
  }

  function initCKEditor() {
    if (!global['ckEditNewIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#newIdeaCont'}, function(editor) {
        global['ckEditNewIdeaCont'] = editor;
      });
    }
    if (!global['ckEditModIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#modIdeaCont'}, function(editor) {
        global['ckEditModIdeaCont'] = editor;
      });
    }
  }

  function showModIdeaModal(ideaId) {
    global.selectedIdeaId = ideaId;
    const url = '/api/v1/analysis/profile/idea/' + ideaId;
    cmmUtils.getData({
      url: url
    }).then(function (response) {
      clearModIdeaModal(response);
      cmmUtils.bindData('modIdeaForm', response);
      global.ckEditModIdeaCont.setData(response['ideaCont']);
      appendModIdeaFiles(response);
      cmmUtils.showModal('modIdeaModal');
    }).catch(function (err) {
      cmmUtils.showErrModal();
      console.log(err);
    });
  }

  function showNewIdeaModal() {
    clearNewIdeaModal();
    cmmUtils.showModal('newIdeaModal');
  }

  function clearNewIdeaModal() {
    document.getElementById('newIdeaTitle').value = '';
    global.ckEditNewIdeaCont.setData('');
    document.getElementById('newIdeaFile').value = '';
    cmmUtils.clearChildNodes(document.getElementById('newIdeaFileDiv'));
    global.newFileArr = [];
  }

  function clearModIdeaModal(response) {
    document.getElementById('modIdeaTitle').value = '';
    global.ckEditModIdeaCont.setData('');
    document.getElementById('modIdeaFile').value = '';
    cmmUtils.clearChildNodes(document.getElementById('modIdeaFileDiv'));
    document.getElementById('modCardTitle').innerText = response['ideaTitle'];
    global.newFileArr = [];
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

  // 파일태그 변경 이벤트
  function addFileEventListener() {
    // 입력모달 첨부파일
    document.getElementById('newIdeaFile').addEventListener('change', function() {
      if (this.files.length) {
        const newIdeaFileDiv = document.getElementById('newIdeaFileDiv');
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const uuid = cmmUtils.getUUID();
          global.newFileArr.push({uuid: uuid, file: file});
          fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
        }
        newIdeaFileDiv.appendChild(fragment.cloneNode(true));
        //this.value = ''; // 리셋
      }
    })
    // 수정모달 첨부파일
    document.getElementById('modIdeaFile').addEventListener('change', function() {
      if (this.files.length) {
        const modIdeaFileDiv = document.getElementById('modIdeaFileDiv');
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          const uuid = cmmUtils.getUUID();
          global.newFileArr.push({uuid: uuid, file: file});
          fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
        }
        modIdeaFileDiv.appendChild(fragment.cloneNode(true));
        this.value = ''; // 리셋
      }
    })
  }

  // 탭 이벤트
  function addTabEventListener() {
    const tabs = document.getElementById('tabDiv').querySelectorAll('[name=tabs]');
    for (let i = 0; i < tabs.length; i++) {
      // 탭 클릭 이벤트
      tabs[i].addEventListener('click', function() {
        resetActiveTab(tabs);
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

  function initSpinner() {
    const callback = function(counter) {
      global['comparisonQuarter'] = counter;
      // 그리드 다시 로드
      initProfileGrid();
    }
    cmmUtils.initInputSpinner({counter: 1, limitCounter: 1, callback: callback});
    global['isInitiatedSpinner'] = true;
  }

  function setActiveTabInfo(el) {
    global.tabView = el.getAttribute('data-view');
  }

  function appendModIdeaFiles(response) {
    if (response['ideaFiles'] != null && response['ideaFiles'].length) {
      global.modFileArr = [];
      const modIdeaFileDiv = document.getElementById('modIdeaFileDiv');
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < response['ideaFiles'].length; i++) {
        const file = response['ideaFiles'][i];
        const uuid = cmmUtils.getUUID();
        global.modFileArr.push({uuid: uuid, fileId: file['fileId'], fileSize: file['fileSize']});
        fragment.appendChild(appendFileTag({uuid: uuid, name: file['originalFileName'], fileId: file['fileId']}, true));
      }
      modIdeaFileDiv.appendChild(fragment.cloneNode(true));
      // 아이디어 다운로드 이벤트 추가
      const ideaFileAnchors = modIdeaFileDiv.querySelectorAll('[data-anchor=ideaFile]');
      for (let i = 0; i < ideaFileAnchors.length; i++) {
        ideaFileAnchors[i].addEventListener('click', function() {
          cmmUtils.downloadFile(this.getAttribute('data-file-id'));
        })
      }
    }
  }

  function appendFileTag(data, hasLink) {
    const button = document.createElement('button');
    button.classList.add('delete');
    button.classList.add('is-small');
    button.setAttribute('onclick', 'main.removeFileTag(\'' + data.uuid + '\')');
    const span = document.createElement('span');
    span.classList.add('tag');
    span.classList.add('is-warning');
    span.classList.add('is-light');
    span.classList.add('mr-3');
    span.setAttribute('data-key', data.uuid);
    if (hasLink) {
      const a = document.createElement('a');
      a.classList.add('is-link');
      a.innerText = data.name;
      a.setAttribute('data-anchor', 'ideaFile');
      a.setAttribute('data-file-id', data['fileId']);
      span.appendChild(a);
    } else {
      span.innerText = data.name;
    }
    span.appendChild(button);
    return span;
  }

  function removeFileTag(uuid) {
    const ideaFileDiv = global['modFileArr'].length
      ? document.getElementById('modIdeaFileDiv')
      : document.getElementById('newIdeaFileDiv');
    const spanTags = ideaFileDiv.querySelectorAll('span');
    for (let i = 0; i < spanTags.length; i++) {
      const span = spanTags[i];
      if (span.getAttribute('data-key') === uuid) {
        span.remove();
      }
    }
    removeNewFileArrIdx(uuid);
    if (global['modFileArr'].length) removeModFileArrInx(uuid);
  }

  function removeNewFileArrIdx(uuid) {
    for (let i = 0; i < global.newFileArr.length; i++) {
      const obj = global.newFileArr[i];
      if (uuid === obj.uuid) {
        obj.isRemoved = true;
      }
    }
  }

  function removeModFileArrInx(uuid) {
    for (let i = 0; i < global.modFileArr.length; i++) {
      const obj = global.modFileArr[i];
      if (uuid === obj.uuid) {
        obj.isRemoved = true;
      }
    }
  }

  function saveIdea() {
    if (verifyNewIdeaForm()) {
      const formData = new FormData();
      formData.append('profileId', global.profileId);
      formData.append('ideaTitle', document.getElementById('newIdeaTitle').value);
      formData.append('ideaCont', global.ckEditNewIdeaCont.getData());
      for (let i = 0; i < global.newFileArr.length; i++) {
        const fileObj = global.newFileArr[i];
        if (fileObj.isRemoved == null || !fileObj.isRemoved) {
          formData.append('file' + i, fileObj.file);
        }
      }
      cmmUtils.postData({
        url: '/api/v1/analysis/profile/insert-idea',
        headers: {},
        isMultipartFile: true,
        body: formData,
        loading: 'btnNewIdea'
      }).then(function (response) {
        if (response === 1) {
          cmmUtils.showToast({message: '저장 되었습니다.'});
          closeNewIdeaModal();
        } else {
          cmmUtils.showWarningModal('비정상적인 저장 데이터', '아이디어가 정상적으로 저장되지 않았습니다.<br/>관리자에게 문의하세요.');
        }
      }).catch(function (err) {
        cmmUtils.hideLoadingElement(document.getElementById('btnNewIdea'));
        cmmUtils.showErrModal();
        console.log(err);
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
        for (let i = 0; i < global.newFileArr.length; i++) {
          const fileObj = global.newFileArr[i];
          if (fileObj.isRemoved == null || !fileObj.isRemoved) {
            formData.append('file' + i, fileObj.file);
          }
        }
        // 기존에 저장된 파일중 제거된 파일정보를 바디에 추가
        let strArr = [];
        for (let i = 0; i < global.modFileArr.length; i++) {
          const fileObj = global.modFileArr[i];
          if (fileObj.isRemoved != null || fileObj.isRemoved) {
            strArr.push(fileObj.fileId);
          }
        }
        if (strArr.length) {
          formData.append('modifiedFileStr', strArr.join(','));
        }
        cmmUtils.postData({
          url: '/api/v1/analysis/profile/update-idea',
          headers: {},
          isMultipartFile: true,
          body: formData,
          loading: 'btnModIdea'
        }).then(function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '수정 되었습니다.'});
            closeModIdeaModal();
          } else {
            cmmUtils.showWarningModal('비정상적인 저장 데이터', '아이디어가 정상적으로 저장되지 않았습니다.<br/>관리자에게 문의하세요.');
          }
        }).catch(function (err) {
          cmmUtils.hideLoadingElement(document.getElementById('btnModIdea'));
          cmmUtils.showErrModal();
          console.log(err);
        });
      });
    }
  }

  function verifyNewIdeaForm() {
    const newIdeaTitle = document.getElementById('newIdeaTitle').value;
    const checkedFiles = cmmUtils.verifyFileSize(global.newFileArr);
    if (!newIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (!checkedFiles.status) {
      cmmUtils.showIpModal('파일', checkedFiles.msg);
      return false;
    }
    return true;
  }

  function verifyModIdeaForm() {
    const modIdeaTitle = document.getElementById('modIdeaTitle').value;
    const checkedFiles = cmmUtils.verifyFileSize(global.newFileArr, getModFileSize());
    if (!modIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (!checkedFiles.status) {
      cmmUtils.showIpModal('파일', checkedFiles.msg);
      return false;
    }
    return true;
  }

  function getModFileSize() {
    let size = 0;
    if (global.modFileArr.length) {
      for (let i = 0; i < global.modFileArr.length; i++) {
        size = size + global.modFileArr[i].fileSize;
      }
    }
    return size;
  }

  function downloadProfileGrid() {
    profileGrid.downloadExcel();
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
    removeFileTag: removeFileTag,
    saveIdea: saveIdea,
    modifyIdea: modifyIdea
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});