const main = (function () {

  let global = {
    userRole: null,
    selectedTab: null,
    splitNum: 4,
    autocompleteValues: {
      in: [], // 국내
      out: [] // 해외
    }
  }
  let __autocomplete = undefined;

  function init() {
    setGuestLayout();
    initAutoComplete();
    setUserRole();
    setSelectedTab();
    addTabListener();
    initCards();
    setHelp();
  }

  async function initAutoComplete() {
    const element = document.getElementById("inputSearch");
    const response = await cmmUtils.awaitAxiosGet({
      url: '/api/v1/dashboard/profile/autocomplete'
    });
    response.forEach(function(e) {
      if (e.profileType === 1) {
        global.autocompleteValues.in.push(e.profileTitle)
      } else {
        global.autocompleteValues.out.push(e.profileTitle)
      }
    });
    __autocomplete = new Awesomplete(element);
    __autocomplete.list = global.autocompleteValues.out; // 기본은 해외
  }

  // 게스트일 경우의 화면 처리
  function setGuestLayout() {
    if (!document.getElementById('loginId')) {
      // Premium badge
      const span = document.createElement('span');
      span.classList.add('badge');
      span.classList.add('is-danger');
      span.classList.add('is-top-right');
      span.innerText = 'Premium Plus';
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
        __autocomplete.list = (contId === 'contIn') ? global.autocompleteValues.in : global.autocompleteValues.out;
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

  function setHelp() {
    const msg = '<span class="title is-6 has-text-white">새탭으로 포트폴리오 보기</span><br/>Windows: <span class="is-orange">Ctrl</span> + 마우스 <span class="is-orange">왼쪽</span>클릭<br/>Mac: <span class="is-orange">Command</span> + 마우스 <span class="is-orange">왼쪽</span>클릭';
    cmmUtils.setTippy([
      {selector: '#dashboardHelp', content: msg, placement: 'bottom', allowHTML: true}
    ]);
  }

  function inputSearchKeyup(e) {
    if (e.key === 'Enter') {
      initCards(this.value);
    }
  }

  function seearchProfile() {
    initCards(document.getElementById('inputSearch').value);
  }

  return {
    init: init,
    inputSearchKeyup: inputSearchKeyup,
    seearchProfile: seearchProfile
  }

}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.inputSearchKeyup);
});
