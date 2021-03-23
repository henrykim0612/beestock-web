const main = (function () {

  function init() {
    initImp();
  }

  function initImp() {
    IMP.init('imp75429459');
  }

  // 결제창 호출
  function showPayment() {
    const uuid = cmmUtils.getUUID();
    // 서버에 결제정보를 먼저 저장하고 아임포트를 호출하자. 결제가 완료되면 다시 저장된 결제정보로 대조하여 체크해야 안전함.
    // TODO: 선 저장 프로세스

    // IMP.request_pay(param, callback) 호출
    IMP.request_pay({ // param
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: uuid,
      name: "노르웨이 회전 의자",
      amount: 64900,
      buyer_email: "hyeongjong90@gmail.com",
      buyer_name: "김형종",
      buyer_tel: "010-8895-0104"
    }, function (response) { // callback
      if (response.success) {
        console.log(response);
      } else {
        console.log(response.error_msg);
      }
    });
  }

  return {
    init: init,
    showPayment: showPayment
  }
}());

document.addEventListener("DOMContentLoaded", function () {
  main.init();
});
