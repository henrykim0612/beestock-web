const main = (function () {

  let global = {
    userRole: null,
    selectedTab: null,
    splitNum: 4
  }

  function init() {
    setGuestLayout();
    setUserRole();
    setSelectedTab();
    addTabListener();
    initCards();
  }

  // 게스트일 경우의 화면 처리
  function setGuestLayout() {
    if (!document.getElementById('loginId')) {
      // Premium badge
      const span = document.createElement('span');
      span.classList.add('badge');
      span.classList.add('is-danger');
      span.classList.add('is-top-right');
      span.innerText = 'Premium';
      document.getElementById('tabInAnchor').appendChild(span);
    }
  }

  function setUserRole() {
    global.userRole = !!document.getElementById('authority') ? document.getElementById('authority').value : '';
  }

  function setSelectedTab() {
    const tabs = document.getElementsByName('tabs');
    const len = tabs.length;
    for (let i = 0; i < len; i++) {
      const tab = tabs[i];
      if (tab.classList.contains('is-active')) {
        const contId = tab.dataset.contId;
        global.selectedTab = contId;
        // Tab content 숨김 해제
        document.getElementById(contId).classList.remove('is-hidden');
      }
    }
  }

  function addTabListener() {
    const tabs = document.getElementsByName('tabs');
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.addEventListener('click', function () {
        resetTabs();
        this.classList.add('is-active');
        const contId = this.getAttribute('data-cont-id');
        global['selectedTab'] = contId;
        document.getElementById(contId).classList.remove('is-hidden');
        initCards();
      })
    }
  }

  function resetTabs() {
    const tabs = document.getElementsByName('tabs');
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.classList.remove('is-active');
      document.getElementById(tab.getAttribute('data-cont-id')).classList.add('is-hidden');
    }
  }

  // 카드 생성
  function initCards(searchWord) {
    const profileType = global['selectedTab'] === 'contIn' ? 1 : 2; // 1: 국내, 2: 해외
    const body = arguments.length === 1
      ? {profileType: profileType, profileTitle: searchWord}
      : {profileType: profileType};

    cmmUtils.axiosPost({
      url: '/api/v1/dashboard/profile-list',
      body: body
    }, function (response) {
      cmmProfileCard.appendCards(response, global['selectedTab'], global.userRole);
    });
  }

  function findProfile() {
    initCards(this.value);
  }

  return {
    init: init,
    findProfile: findProfile
  }

}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findProfile);
});
