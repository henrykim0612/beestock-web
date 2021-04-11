const cmmProfileCard = (function () {

  let global = {
    userRole: null,
    splitNum: 6
  }

  function appendCards(response, eId, userRole) {
    setUserRole(userRole);
    cmmUtils.clearChildNodes(eId);
    const content = document.getElementById(eId);
    const fragment = document.createDocumentFragment();
    let columns;
    for (let i = 0; i < response.length; i = i + global['splitNum']) {
      // 카드는 가로로 다섯장씩
      columns = createColumns();
      const maxLen = global['splitNum'] < (response.length - i)
        ? i + global['splitNum'] // 남은 개수가 6개가 넘을 경우
        : response.length; // 남은 개수가 6개도 안남았을 경우
      for (let j = i; j < maxLen; j++) {
        const column = createColumn();
        column.appendChild(createCard(response[j]));
        columns.appendChild(column);
      }
      fragment.appendChild(columns);
    }
    content.appendChild(fragment);
    // 카드 툴팁
    setTooltips();
  }

  // 카드 툴팁 적용
  function setTooltips() {
    const cardContents = document.querySelectorAll('.card-content');
    const size = cardContents.length;
    let tooltipArr = [];
    for (let i = 0; i < size; i++) {
      const ele = cardContents[i];
      if (ele.dataset.tooltipTxt !== 'null') {
        tooltipArr.push({
          selector: ele,
          content: ele.dataset.tooltipTxt,
          placement: 'bottom'
        });
      }
    }
    cmmUtils.setTippy(tooltipArr);
  }

  function setUserRole(userRole) {
    global.userRole = userRole;
  }

  // 묶음을 컬럼 생성
  function createColumns() {
    const columns = document.createElement('div');
    columns.classList.add('columns');
    return columns;
  }

  function createColumn() {
    const column = document.createElement('column');
    column.style.display = 'relative';
    column.classList.add('column');
    column.classList.add('is-2');
    return column;
  }

  // 카드 생성
  function createCard(data) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('cursor');
    card.setAttribute('name', 'profileCard');
    // 카드 클릭 이벤트
    card.addEventListener('click', function(e) {
      if (data['profileType'] === 1 && (global.userRole !== '[ROLE_PREMIUM_PLUS]' && global.userRole !== '[ROLE_ADMIN]')) {
        // 국내 프로필은 프리미엄 플러스만 이용가능
        cmmUtils.showModal('premiumPlusModal');
      } else {
        const url = '/analysis/profile/details?profileType=' + data['profileType'] + '&profileId=' + data['profileId'];
        if (e.ctrlKey || e.metaKey) { // metaKey 는 맥용
          cmmUtils.openNewTab(url); // 새탭으로
        } else {
          cmmUtils.goToPage(url);
        }
      }
    })
    // 카드 이미지
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const figure = document.createElement('figure');
    figure.classList.add('image');
    figure.classList.add('is-square');
    const img = document.createElement('img');
    img.alt = 'Placeholder image';
    img.src = CONTEXT_PATH + '/common/image/' + data['fileId'] + '.do';
    figure.appendChild(img);
    cardImage.appendChild(figure);
    // 카드 타이틀
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    cardContent.dataset.tooltipTxt = data['tooltipTxt'];
    const media = document.createElement('div');
    media.classList.add('media');
    const mediaContent = document.createElement('div');
    mediaContent.classList.add('media-content');
    mediaContent.classList.add('has-text-centered');
    const title = document.createElement('p');
    title.classList.add('title');
    title.classList.add('is-7');

    // 오늘 읽었으면 색상 변경(1:읽음, 2:읽지않음)
    if (data['isRead'] === 1) {
      title.classList.add('has-text-grey-light');
    }
    title.innerText = data['profileTitle'];

    // 보조명칭
    const subTitle = document.createElement('p');
    subTitle.classList.add('subtitle');
    subTitle.classList.add('is-7');
    subTitle.innerText = data['profileSubtitle'];

    mediaContent.appendChild(title);
    mediaContent.appendChild(subTitle);
    media.appendChild(mediaContent);
    cardContent.appendChild(media);
    card.appendChild(cardImage);
    card.appendChild(cardContent);
    return card;
  }

  return {
    appendCards: appendCards
  }
})();