const main = (function() {

  let global = {
    isAdmin: cmmUtils.nvl(document.getElementById('authority')) === '[ROLE_ADMIN]',
    loginId: cmmUtils.nvl(document.getElementById('loginId')),
    qaId: null
  }

  function init() {
    global.qaId = document.getElementById('qaId').value
    createBreadCrumb();
    drawDetails();
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
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa.do">';
    html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
    html += '      <span>고객지원</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li>';
    html += '    <a href="' + CONTEXT_PATH + '/bbs/qa.do">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
    html += '      <span>Q&A</span>';
    html += '    </a>';
    html += '  </li>';
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-question-circle"></i></span>';
    html += '      <span>Q&A 상세보기</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  function drawDetails() {
    const qaId = global.qaId;
    const url = '/api/v1/bbs/qa/' + qaId;
    cmmUtils.axiosGet({url: url}, function(response) {
      cmmUtils.bindData('qaDetailForm', response);
      if (cmmUtils.nvl(response['qaAnswer'])) { // 답변완료 상태
        changeSteps();
        removeModifyButton();
      } else { // 미답변 상태
        setDefaultAnswer();
        // 등록자가 아니면 수정버튼 삭제
        if (response['regLoginId'] !== global.loginId) {
          removeModifyButton();
        }
      }
    });
  }

  // 완료 상태로 스탭 변경
  function changeSteps() {
    const step2 = document.getElementById('step2');
    step2.classList.remove('is-active');
    step2.classList.remove('has-gaps');
    const step3 = document.getElementById('step3');
    step3.classList.add('is-active');
    const step3Span = document.getElementById('step3Span');
    step3Span.classList.remove('is-hollow');
  }

  // 미답변 상태일 경우 기본 답변 문구 추가
  function setDefaultAnswer() {
    document.getElementById('qaAnswer').innerHTML = '<p>관리자가 아직 확인하지 않았습니다.</p>'
  }

  // 답변완료는 수정불가
  function removeModifyButton() {
    if (!global.isAdmin) { // 관리자가 아니라면 삭제
      document.getElementById('uptDiv').remove();
    }
  }

  // 목록으로 돌아가기
  function goToQa() {
    cmmUtils.goToPage('/bbs/qa');
  }

  // 수정 페이지로
  function goToModify() {
    const url = '/bbs/qa/modify/' + global.qaId;
    cmmUtils.goToPage(url);
  }

  return {
    init: init,
    goToQa: goToQa,
    goToModify: goToModify
  }
})();

document.addEventListener("DOMContentLoaded", function() {
  main.init();
});