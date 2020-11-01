const cmmProfileCard = (function () {

  let global = {
    splitNum: 4
  }

  function appendCards(response, eId) {
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
    content.appendChild(fragment.cloneNode(true));
    addCardEventListener();
  }

  function addCardEventListener() {
    const profileCard = document.getElementsByName('profileCard');
    for (let i = 0; i < profileCard.length; i++) {
      const card = profileCard[i];
      // 프로필 카드 클릭 이벤트
      card.addEventListener('click', function() {
        const profileId = this.getAttribute('data-profile-id');
        const url = '/analysis/profile/' + profileId;
        cmmUtils.goToPage(url);
      })
    }
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
    column.classList.add('is-3');
    return column;
  }

  // 카드 생성
  function createCard(data) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('cursor');
    card.setAttribute('name', 'profileCard');
    card.setAttribute('data-profile-id', data['profileId']);
    card.setAttribute('data-free', data['isFree']);
    // 카드 이미지
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const figure = document.createElement('figure');
    figure.classList.add('image');
    figure.classList.add('is-square');
    const img = document.createElement('img');
    img.alt = 'Placeholder image';
    img.src = CONTEXT_PATH + '/common/image/' + data['fileId'];
    figure.appendChild(img);
    cardImage.appendChild(figure);
    // 카드 타이틀
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
    const media = document.createElement('div');
    media.classList.add('media');
    const mediaContent = document.createElement('div');
    mediaContent.classList.add('media-content');
    mediaContent.classList.add('has-text-centered');
    const title = document.createElement('p');
    title.classList.add('title');
    title.classList.add('is-4');
    // 오늘 읽었으면 색상 변경(1:읽음, 2:읽지않음)
    if (data['isRead'] === 1) {
      title.classList.add('has-text-grey-light');
    }
    title.innerText = data['profileTitle'];
    // 무료 프로필은 뱃지 추가
    if (data['isFree'] === 2) {
      title.setAttribute('data-badge', '무료');
      title.classList.add('has-badge-rounded');
      title.classList.add('has-badge-info');
    }
    // 보조명칭
    const subTitle = document.createElement('p');
    subTitle.classList.add('subtitle');
    subTitle.classList.add('is-6');
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