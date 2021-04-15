const main = (function () {

  function init() {
    initIamport();
    initPrices();
  }

  function initIamport() {
    IMP.init('imp75429459');
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

  // 업그레이드
  async function upgrade(grade) {
    alert('현재 PG연동 준비중입니다.');
    // const price = await cmmUtils.awaitAxiosGet({url: '/api/v1/login/price/' + grade});
    // if (price > 0) {
    //   payment(price, grade);
    // }
  }

  async function payment(price, grade) {

    IMP.request_pay({
      pg : 'html5_inicis',
      pay_method : 'card',
      merchant_uid : cmmUtils.getUUID(),
      name : 'BEESTOCK 월결제', // 16자 이내로 작성하길 권장
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

  async function updateGrade(grade) {
    const response = await cmmUtils.awaitAxiosPost({url: '/api/v1/login/price/grade-up', body: {roleNm: grade}});
    if (response) {
      cmmUtils.showModal('sucModal');
    } else {
      cmmUtils.showCustomErrModal('정상적으로 처리되지 않았습니다. support@beestock.co.kr로 메일을 남겨주시면 확인 후 처리해드리겠습니다.');
    }
  }

  return {
    init: init,
    upgrade: upgrade
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
