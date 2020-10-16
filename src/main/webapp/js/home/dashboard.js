const main = (function() {

    let global = {
        selectedTab: 'contIn', // 기본은 국내
        splitNum: 4
    }

    function init() {
        addTabListener();
        initCards();
    }

    function addTabListener() {
        const tabs = document.getElementsByName('tabs');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            tab.addEventListener('click', function() {
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
    function initCards() {
        const profileType = global['selectedTab'] === 'contIn' ? 1 : 2; // 1: 국내, 2: 해외
        cmmUtils.postData({
            url: '/api/v1/dashboard/profile-list',
            body: { profileType: profileType },
        }).then(appendCards).catch(function (err) {
            cmmUtils.showErrModal();
            console.log(err);
        });
    }

    function appendCards(response) {
      cmmUtils.clearChildNodes(global['selectedTab']);
      const content = document.getElementById(global['selectedTab']);
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
      // 카드 이미지
      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      const figure = document.createElement('figure');
      figure.classList.add('image');
      figure.classList.add('is-4by3');
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
      title.innerText = data['profileTitle'];
      // 무료 프로필은 뱃지 추가
      if (data['isFree'] === 2) {
        title.setAttribute('data-badge', '무료');
        title.classList.add('has-badge-rounded');
        title.classList.add('has-badge-info');
      }
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
        init: init,
        getGlobal: function() { return global; }
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
});
