const main = (function() {

  function init() {
    const props = {
      url: '/api/v1/admin/user-list',
      body: {
        orderBy: [{column: 'loginId'}, {column: 'uptDate', desc: true}]
      },
      eId: 'dataGrid',
      pId: 'dataPagination',
      isThead: true,
      isTfoot: true,
      colModel: [
        {id: 'rowNum', name: 'No'},
        {id: 'loginId', name: '이메일', isSort: true},
        {id: 'userNm', name: '사용자/닉네임', isSort: true},
        {id: 'userPhone', name: '연락처'},
        {id: 'regDate', name: '회원가입 일자'},
        {id: 'uptDate', name: '수정일자', isSort: true}
      ]
    }
    cmmDataGrid.init(props);
  }

  return {
    init: init
  }
}());

document.addEventListener("DOMContentLoaded", function() {
   main.init();
});