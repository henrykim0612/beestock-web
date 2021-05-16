

const main = (function() {

  function init() {
    createBreadCrumb();
    initInProfile();
    initOutProfile();
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
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/admin/profile-order-management.do">';
    html += '      <span class="icon is-small"><i class="fas fa-cogs" aria-hidden="true"></i></span>';
    html += '      <span>시스템관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-sort-numeric-up"></i></span>';
    html += '      <span>포트폴리오 순서 관리</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }


  // 국내 프로필 조회
  function initInProfile() {
    cmmUtils.axiosPost({
      url: '/api/v1/admin/profile/profile-list',
      body: {profileType: 1}
    }, function (response) {
      const ele = document.getElementById('inDiv');
      appendProfileButtons(response, ele);
      addProfileClickEvents(ele);
    });
  }

  // 국외 프로필
  function initOutProfile() {
    cmmUtils.axiosPost({
      url: '/api/v1/admin/profile/profile-list',
      body: {profileType: 2}
    }, function (response) {
      const ele = document.getElementById('outDiv');
      appendProfileButtons(response, ele);
      addProfileClickEvents(ele);
    });
  }

  function appendProfileButtons(dataArr, ele) {
    // Clear content
    cmmUtils.clearChildNodes(ele);
    if (dataArr.length) {
      const fragment = document.createDocumentFragment();
      const dataLen = dataArr.length;
      for (let i = 0; i < dataLen; i++) {
        const datum = dataArr[i];
        const button = document.createElement('button');
        button.classList.add('button');
        button.classList.add('is-ghost');
        button.classList.add('mt-2');
        button.dataset.pid = datum['profileId'];
        button.innerText = datum['profileTitle'] + ' ' + datum['profileSubtitle'];
        fragment.appendChild(button);
      }
      ele.appendChild(fragment.cloneNode(true));
    }
  }

  // 프로필 엑티브 이벤트
  function addProfileClickEvents(ele) {
    const buttons = ele.querySelectorAll('button');
    const maxLen = buttons.length;
    for (let i = 0; i < maxLen; i++) {
      buttons[i].addEventListener('click', function() {
        resetActive();
        this.classList.add('is-active');
      })
    }
  }

  // Active 초기화
  function resetActive() {
    // 국내
    let profiles = document.getElementById('inDiv').querySelectorAll('button');
    removeClass(profiles, profiles.length);
    // 해외
    profiles = document.getElementById('outDiv').querySelectorAll('button');
    removeClass(profiles, profiles.length);

    function removeClass(profiles, maxLen) {
      for (let i = 0; i < maxLen; i++) {
        profiles[i].classList.remove('is-active');
      }
    }
  }

  function moveUp() {
    let ele = document.getElementById('inDiv');
    let profiles = ele.querySelectorAll('button');
    changeTag(profiles, profiles.length);

    ele = document.getElementById('outDiv');
    profiles = ele.querySelectorAll('button');
    changeTag(profiles, profiles.length);

    function changeTag(profiles, maxLen) {
      for (let i = 0; i < maxLen; i++) {
        if (profiles[i].classList.contains('is-active')) {
          if (i !== 0) { // 첫번째는 변경불가
            ele.insertBefore(profiles[i], ele.childNodes.item(i-1));
            break;
          }
        }
      }
    }
  }

  function moveDown() {
    let ele = document.getElementById('inDiv');
    let profiles = ele.querySelectorAll('button');
    changeTag(profiles, profiles.length);

    ele = document.getElementById('outDiv');
    profiles = ele.querySelectorAll('button');
    changeTag(profiles, profiles.length);

    function changeTag(profiles, maxLen) {
      for (let i = 0; i < maxLen; i++) {
        if (profiles[i].classList.contains('is-active')) {
          if (i !== (maxLen - 1)) { // 마지막은 변경불가
            ele.insertBefore(profiles[i], ele.childNodes.item(i+2));
            break;
          }
        }
      }
    }
  }

  function save() {
    let param = [];
    // 국내
    let div = document.getElementById('inDiv');
    let profiles = div.querySelectorAll('button');
    pushArr(param, profiles);
    // 국외
    div = document.getElementById('outDiv');
    profiles = div.querySelectorAll('button');
    pushArr(param, profiles);
    // 검증
    if (!param.length) {
      cmmUtils.showWarningModal('프로필 없음', '국내, 국외 프로필이 존재하지 않습니다.');
      return false;
    }
    // 저장
    cmmConfirm.show({msg: '변경된 순서로 포트폴리오 순서를 적용합니다.', color: 'is-warning'}, function() {
      cmmUtils.axiosPost({
        url: '/api/v1/admin/profile/update-order',
        body: {
          profileList: param
        },
        loading: 'btnSave'
      }, function (response) {
        if (response > 0) {
          cmmUtils.showToast({message: '저장되었습니다.'});
        }
      });
    })

    function pushArr(arr, profiles) {
      const maxLen = profiles.length;
      for (let i = 0; i < maxLen; i++) {
        const profile = profiles[i];
        arr.push({
          profileId: profile.dataset.pid,
          profileOrder: (i + 1)
        });
      }
    }
  }

  return {
    init: init,
    moveUp: moveUp,
    moveDown: moveDown,
    save: save
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});