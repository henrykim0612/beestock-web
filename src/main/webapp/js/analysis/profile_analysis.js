const COMPONENTS = BeeComponents('dataGrid', 'chart', function(box) {});
const main = (function() {

  let global = {
    profileId: null,
    chart: undefined
  };

  function init() {
    createBreadCrumb();
    global.profileId = document.getElementById('profileId').value;
    getProfileDetails();
    addSpanStarEvent();
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

  // 프로필 헤더 생성
  function setProfileHeader(data) {
    // 프로필 이미지
    const profileImg = document.getElementById('profileImg');
    profileImg.src = CONTEXT_PATH + '/common/image/' + data['fileId'];
    // 타이틀
    document.getElementById('profileTitle').innerText = data['profileTitle'];
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

  return {
    getChart: function() { return global.chart; },
    init: init
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});