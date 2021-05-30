const main = (function () {

  let selectedGrade = null;

  function init() {
    initIamport();
    initPrices();
    initAccordion();
    initDOMEvents();
  }

  function initIamport() {
    IMP.init(IMP_KEY);
  }

  function initAccordion() {
    bulmaAccordion.attach();
  }

  function initDOMEvents() {
    document.getElementsByName('chkNoti').forEach(function(el) {
      el.addEventListener('click', function() {
        if (selectedGrade === 'ROLE_PREMIUM_PLUS') {
          document.getElementById('btnPayment').disabled = !cmmUtils.isCheckedAll('chkNoti');
        } else {
          document.getElementById('btnPayment').disabled = cmmUtils.isCheckedCnt('chkNoti') !== 3;
        }
      });
    })
  }

  // 등급별 금액설정
  async function initPrices() {
    const response = await cmmUtils.awaitAxiosGet({url: '/api/v1/login/price'});
    document.getElementById('standardPrice').innerText = getPrice(response, 'ROLE_STANDARD').toLocaleString() + '원'
    document.getElementById('premiumPrice').innerText = getPrice(response, 'ROLE_PREMIUM').toLocaleString() + '원'
    document.getElementById('premiumPlusPrice').innerText = getPrice(response, 'ROLE_PREMIUM_PLUS').toLocaleString() + '원'
  }

  function getPrice(data, roleNm) {
    const len = data.length;
    for (let i = 0; i < len; i++) {
      const row = data[i];
      if (row.roleNm === roleNm) {
        return row.priceAmount;
      }
    }
  }

  function setSelectedGrade(grade) {
    selectedGrade = grade;
  }

  function showPremiumPlusTerm(grade) {
    document.getElementById('paymentModal').querySelectorAll('.premiumPlusOnly').forEach(function(v) {
      if (grade === 'ROLE_PREMIUM_PLUS') {
        v.classList.remove('is-hidden');
      } else {
        v.classList.add('is-hidden');
      }
    });
  }

  // 업그레이드
  async function upgrade(grade) {
    cmmUtils.resetCheckedItems('chkNoti');
    showPremiumPlusTerm(grade);
    setSelectedGrade(grade);
    cmmUtils.showModal('paymentModal');
  }

  async function payment() {
    const price = await cmmUtils.awaitAxiosGet({url: '/api/v1/login/price/' + selectedGrade});
    if (price > 0) {
      IMP.request_pay({
        pg : 'html5_inicis',
        pay_method : 'card',
        merchant_uid : cmmUtils.getUUID(),
        name : 'BEESTOCK 월 유료서비스', // 16자 이내로 작성하길 권장
        amount : price,
        buyer_name : document.getElementById('loginUserNm').value,
        buyer_email : '',
        buyer_tel : cmmUtils.replaceCellular(document.getElementById('loginUserPhone').value),
        company: COMPANY_NAME
      }, function(rsp) {
        if ( rsp.success ) {
          updateGrade(grade);
          // var msg = '결제가 완료되었습니다.';
          // msg += '고유ID : ' + rsp.imp_uid;
          // msg += '상점 거래ID : ' + rsp.merchant_uid;
          // msg += '결제 금액 : ' + rsp.paid_amount;
          // msg += '카드 승인번호 : ' + rsp.apply_num;
        } else {
          cmmUtils.showToast({
            message: rsp.error_msg,
            type: 'is-danger'
          });
        }
      });
    }
  }

  async function updateGrade(grade) {
    const response = await cmmUtils.awaitAxiosPost({url: '/api/v1/login/price/grade-up', body: {roleNm: grade}});
    if (response) {
      cmmUtils.closeModal('paymentModal');
      cmmUtils.showModal('sucModal');
    } else {
      cmmUtils.showCustomErrModal('정상적으로 처리되지 않았습니다. support@beestock.co.kr로 메일을 남겨주시면 확인 후 처리해드리겠습니다.');
    }
  }

  function goToGuide() {
    cmmUtils.openNewTab('/home/guide');
  }

  function goToStatute() {
    cmmUtils.goToLinkPop('https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%EC%A0%84%EC%9E%90%EC%83%81%EA%B1%B0%EB%9E%98%EB%93%B1%EC%97%90%EC%84%9C%EC%9D%98%EC%86%8C%EB%B9%84%EC%9E%90%EB%B3%B4%ED%98%B8%EC%97%90%EA%B4%80%ED%95%9C%EB%B2%95%EB%A5%A0/%EC%A0%9C17%EC%A1%B0');
  }

  function goToSummaryArt() {
    cmmUtils.showModal('summaryArtModal');
  }

  function goToArticle() {
    cmmUtils.showModal('articleModal');
  }

  function goToDifference() {
    cmmUtils.showModal('differenceModal');
  }

  return {
    init: init,
    upgrade: upgrade,
    payment: payment,
    goToGuide: goToGuide,
    goToStatute: goToStatute,
    goToSummaryArt: goToSummaryArt,
    goToArticle: goToArticle,
    goToDifference: goToDifference
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
