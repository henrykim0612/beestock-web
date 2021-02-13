const COMPONENTS = BeeComponents('dataGrid', function (box) {});
const main = (function () {

  let global = {
  }
  let dataGrid;

  function init() {
    createBreadCrumb();
    initQuarterSlider();
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
    html += '      <span class="icon is-small"><i class="fas fa-search-dollar"></i></span>';
    html += '      <span>종목검색</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initQuarterSlider() {
    const url = '/api/v1/analysis/profile/quarter-all';
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
        textSpan.innerText = '없는 분기'
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
    button.classList.add('is-small');
    button.setAttribute('data-button', 'slide');
    button.setAttribute('data-quarter', quarter['quarterDate']);
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('icon');
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-clock');
    iconSpan.appendChild(icon);
    const textSpan = document.createElement('span');
    textSpan.innerText = quarter['quarterDate'] + 'Q';
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

  return {
    init: init
  }

}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});