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

  // 존재하는 분기 검색
  function initQuarterSlider() {
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

  // 그리드 생성
  function initGrid() {

  }

  function inputKeyup(e) {
    if (e.key === 'Enter') {
      initGrid();
    }
  }

  return {
    init: init,
    initGrid: initGrid,
    inputKeyup: inputKeyup
  }

}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
  document.getElementById('inputSearch').addEventListener('keyup', main.inputKeyup)
});