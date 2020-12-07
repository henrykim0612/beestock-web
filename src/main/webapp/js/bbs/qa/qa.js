const COMPONENTS = BeeComponents('dataGrid', function (box) {});
const main = (function () {

  let global = {
    selectedQaId: null
  }
  let dataGrid;

  function init() {
    createBreadCrumb();
    initGrid();
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
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa">';
    html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
    html += '      <span>고객센터</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
    html += '      <span>Q&A</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function initGrid() {
    const questionMark = function (col, row) {
      return '<span class="icon is-dark"><i class="fab fa-quora"></i>' + row['rowNum'] + '</span>';
    }

    const locker = function (col, row) {
      return row['ckSecret'] === 1 ? '<span class="icon is-dark"><i class="fas fa-lock"></i></span>' : '<span class="icon is-dark"><i class="fas fa-lock-open"></i></span>';
    }

    const answerMark = function (col, row) {
      return !cmmUtils.isEmpty(row['qaAnswer']) ? '<span class="tag is-success is-light">답변완료</span>' : '<span class="tag is-warning is-light">미답변</span>';
    }

    const titleAnchor = function (anchor, col, row) {
      anchor.setAttribute('data-custom', 'titleAnchor');
      anchor.setAttribute('data-qa-id', row['qaId']);
      anchor.setAttribute('data-owner', row['uptLoginId']);
      anchor.setAttribute('data-secret', row['ckSecret'] === 1 ? 'true' : 'false');
    }

    const props = {
      url: '/api/v1/bbs/paging-qa-list',
      body: {
        orderBy: [{column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      isThead: true,
      isTfoot: false,
      loading: 'btnSearch',
      colModel: [
        {name: 'No', type: 'custom', userCustom: questionMark, width: '50px', align: 'center', isStrong: true},
        {name: '비밀글', type: 'custom', userCustom: locker, width: '50px', align: 'center'},
        {id: 'qaTitle', name: '제목', isSort: true, width: '600px', isLink: true, userCustom: titleAnchor},
        {name: '답변상태', type: 'custom', userCustom: answerMark, width: '80px', align: 'center'},
        {id: 'regLoginId', name: '등록자', isSort: true, align: 'center', width: '200px', isExcel: true},
        {id: 'uptDate', name: '최근 수정일', isSort: true, align: 'center', width: '150px', isExcel: true}
      ],
      success: function (data, _this) {
        addTitleAnchorEvent(data, _this);
      }
    }
    dataGrid = new COMPONENTS.DataGrid(props);
  }

  function findQa(e) {
    if (e.key === 'Enter') {
      reloadGrid();
    }
  }

  function reloadGrid() {
    const key = document.getElementById('selSearch').value;
    const props = {};
    props[key] = document.getElementById('inputSearch').value;
    dataGrid.reload(props);
  }

  function keyupIpPwd(e) {
    if (e.key === 'Enter') {
      checkPwd();
    }
  }

  function addTitleAnchorEvent(data, _this) {
    const eId = _this.props.eId;
    const tags = document.getElementById(eId).querySelectorAll('[data-custom=titleAnchor]');
    for (let i = 0; i < tags.length; i++) {

      tags[i].addEventListener('click', function () {
        const isSecret = this.getAttribute('data-secret') === 'true';
        const owner = this.getAttribute('data-owner');
        const loginId = cmmUtils.nvl(document.getElementById('loginId'));

        global['selectedQaId'] = this.getAttribute('data-qa-id');

        if (cmmUtils.nvl(document.getElementById('authority')) === '[ROLE_ADMIN]') {
          // 관리자는 통과
          goToDetails();
        } else {
          if (isSecret && owner === loginId) {
            // 자신이 작성한 비밀글인지 패스워드 확인
            cmmUtils.showModal('confirmPwdModal');
          } else {
            if (isSecret) {
              cmmUtils.showModal('secretQaModal')
            } else {
              goToDetails();
            }
          }
        }

      })
    }
  }

  // 상세보기 화면으로 이동
  function goToDetails() {
    const url = '/bbs/qa/' + global['selectedQaId'];
    cmmUtils.goToPage(url);
  }

  function goToQaForm() {
    cmmUtils.goToPage('/bbs/qa-form');
  }

  function closeModQaModal() {
    cmmUtils.closeModal('modQaModal');
    dataGrid.reload();
  }

  // 비밀글은 패스워드 확인
  function checkPwd() {
    const loginId = document.getElementById('loginId').value;
    const loginPwd = document.getElementById('ipPwd').value;
    cmmUtils.postData({
      url: '/api/v1/login/check-pwd',
      body: {
        loginId: loginId,
        loginPwd: loginPwd
      }
    }).then(function (response) {
      cmmUtils.verifyResponse(response);
      if (response) {
        goToDetails();
      } else {
        const helpPwd = document.getElementById('helpPwd');
        helpPwd.classList.remove('is-hidden');
      }
    });
  }

  return {
    init: init,
    findQa: findQa,
    reloadGrid: reloadGrid,
    keyupIpPwd: keyupIpPwd,
    closeModQaModal: closeModQaModal,
    checkPwd: checkPwd,
    goToQaForm: goToQaForm
  }

}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
  // 사용자 검색 이벤트 리스너
  document.getElementById('inputSearch').addEventListener('keyup', main.findQa);
  // 패스워드 확인 엔터키 이벤트
  document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd)
});