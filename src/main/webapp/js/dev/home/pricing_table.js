const main = (function () {

  let selectedGrade = null;
  let selectedMonth = '1';
  let impKey = null;
  let pg = null;

  function init() {
    if (cmmUtils.getRole() != null) { // Guest 가 아닌 경우에만
      initIamport();
    }
    initPrices();
    initAccordion();
    initDOMEvents();
  }

  async function initIamport() {
    const response = await cmmUtils.awaitAxiosGet({url: '/api/v1/import/keys'});
    impKey = response.find(function(v) { return v.codeId === 'K0001'; }).codeName;
    pg = response.find(function(v) { return v.codeId === 'K0002'; }).codeName;
    IMP.init(impKey);
  }

  function initAccordion() {
    bulmaAccordion.attach();
  }

  function setSelectedMonth(month) {
    selectedMonth = month;
  }

  function initDOMEvents() {
    // 탭 이벤트
    const tabs = document.getElementById('tabs').querySelectorAll('li');
    const pricingTables = document.querySelectorAll('.pricing-table');
    tabs.forEach(function(el) {
      el.addEventListener('click', function() {
        setSelectedMonth(this.dataset.month);
        tabs.forEach(function(v) { v.classList.remove('is-active'); });
        pricingTables.forEach(function(v) { v.classList.add('is-hidden') });
        this.classList.add('is-active');
        document.getElementById(this.dataset.contId).classList.remove('is-hidden');
      })
    });
    // 약관 이벤트
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
    setPriceText('standardPrice', (getPrice(response, 'ROLE_STANDARD') + (getPrice(response, 'ROLE_STANDARD') * 0.5)).toLocaleString());
    setPriceText('premiumPrice', (getPrice(response, 'ROLE_PREMIUM') + (getPrice(response, 'ROLE_PREMIUM') * 0.5)).toLocaleString());
    setPriceText('premiumPlusPrice', (getPrice(response, 'ROLE_PREMIUM_PLUS') + (getPrice(response, 'ROLE_PREMIUM_PLUS') * 0.5)).toLocaleString());
    setPriceText('standardPrice3', (getPrice(response, 'ROLE_STANDARD') * 3).toLocaleString());
    setPriceText('premiumPrice3', (getPrice(response, 'ROLE_PREMIUM') * 3).toLocaleString());
    setPriceText('premiumPlusPrice3', (getPrice(response, 'ROLE_PREMIUM_PLUS') * 3).toLocaleString());
  }

  function setPriceText(id, price) {
    const ele = document.getElementById(id);
    if (price === '0') {
      ele.parentNode.parentNode.classList.add('is-hidden');
    } else {
      ele.innerText = price + '원';
    }
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

  function getDueDate() {
    const tomorrow = cmmUtils.getTomorrow();
    const year = tomorrow.getFullYear();
    let month = tomorrow.getMonth() + 1
    if (month.toString().length === 1) {
      month = '0' + month;
    }
    let day = tomorrow.getDate();
    if (day.toString().length === 1) {
      day = '0' + day;
    }
    return year + month + day + '1800'; // 18시까지
  }

  async function payment() {
    const price = await cmmUtils.awaitAxiosGet({url: '/api/v1/login/price/' + selectedMonth + '/' + selectedGrade});
    if (price > 0) {
      const dueDate = getDueDate();
      IMP.request_pay({
        // pg : 'html5_inicis',
        pg : pg,
        pay_method : 'vbank',
        vbank_due: dueDate,
        merchant_uid : cmmUtils.getUUID(),
        name : 'BEESTOCK 유료서비스', // 16자 이내로 작성하길 권장
        amount : price,
        buyer_name : document.getElementById('loginUserNm').value,
        buyer_email : '',
        buyer_tel : cmmUtils.replaceCellular(document.getElementById('loginUserPhone').value),
        company: COMPANY_NAME
      }, async function(rsp) {
        if ( rsp.success ) {
          rsp.month = selectedMonth;
          rsp.dueDate = makeDueDate(dueDate);
          rsp.grade = selectedGrade.split('ROLE_')[1];
          const response = await cmmUtils.awaitAxiosPost({
            url: '/api/v1/import/order',
            loading: 'btnPayment',
            body: rsp
          });
          if (response) {
            cmmUtils.closeModal('paymentModal');
            showSucModal(rsp, price);
          } else {
            cmmUtils.showToast({
              message: '가상계좌 주문정보 저장에 실패했습니다.',
              type: 'is-danger'
            });
          }
          // updateGrade(selectedGrade);
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

  function makeDueDate(dueDate) {
    const year = dueDate.substr(0, 4);
    const month = dueDate.substr(4, 2);
    const day = dueDate.substr(6, 2);
    const hour = dueDate.substr(8, 2);
    const minutes = dueDate.substr(10, 2);
    return parseInt(year.concat(month).concat(day).concat(hour).concat(minutes), 10);
  }


  // 채번완료 모달
  function showSucModal(rsp, price) {
    document.getElementById('vbankName').innerHTML = '<strong>은행명 : ' + rsp.vbank_name + '</strong>';
    document.getElementById('vbankNum').innerHTML = '<strong>가상계좌 : ' + rsp.vbank_num + '</strong>';
    document.getElementById('money').innerHTML = '<strong>금액 : ' + price.toLocaleString() + '</strong>원';
    cmmUtils.showModal('sucModal');
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
    goToDifference: goToDifference,
    getDueDate: getDueDate
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
