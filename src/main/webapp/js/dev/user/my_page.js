const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

  let global = {
    selectedTab: null,
    splitNum: 4,
    selectedIdeaId: null,
    ckEditModIdeaCont: undefined,
    modIdeaWordCount: 0
  }
  let ideaGrid = undefined;
  let myOrderGrid = undefined;

  function init() {
    createBreadCrumb();
    setActiveTab();
    // initIamport();
    // initTooltips();
    initMyImage();
    addTabListener();
    initFavoriteProfiles();
    initIdeaGrid();
    // initAutoPayment();
  }

  function setActiveTab() {
    document.getElementsByName('tabs').forEach(function(e) {
      if (e.classList.contains('is-active')) {
        global.selectedTab = e.dataset.contId;
      }
    })
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
    html += '  <li class="is-active">';
    html += '    <a aria-current="page">';
    html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
    html += '      <span>마이 페이지</span>';
    html += '    </a>';
    html += '  </li>';
    html += '</ul>';
    breadCrumbNav.innerHTML = html;
  }

  // function initIamport() {
  //   IMP.init(IMP_KEY);
  // }

  function initTooltips() {
    cmmUtils.setTippy([{
      selector: '#btnAutoPayment',
      content: '<p>정기결제를 설정하시면 등록된 신용카드로<br/>만료일 이후 자동으로 결제됩니다.</p>',
      placement: 'right',
      allowHTML: true
    }]);
  }


  function initMyImage() {
    cmmUtils.axiosGet({url: '/api/v1/login/my-image'}, function(response) {
      const src = cmmUtils.nvl(response.data)
        ? CONTEXT_PATH + '/common/image/' + response['data'] + '.do'
        : CONTEXT_PATH + '/resources/images/no-profile.png';
      const myImgFile = document.getElementById('myImage');
      myImgFile.setAttribute('src', src);
    });
  }

  function addTabListener() {
    const tabs = document.getElementsByName('tabs');
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      tab.addEventListener('click', function () {
        resetTabs();
        this.classList.add('is-active');
        const contId = this.getAttribute('data-cont-id');
        global['selectedTab'] = contId;
        document.getElementById(contId).classList.remove('is-hidden');
        initFavoriteProfiles();
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

  function initFavoriteProfiles() {
    cmmUtils.axiosPost({
      url: '/api/v1/login/favorite-profile',
      body: {
        profileType: global['selectedTab'] === 'contIn' ? 1 : 2 // 1: 국내, 2: 해외
      }
    }, function (response) {
      cmmProfileCard.appendCards(response, global['selectedTab']);
    });
  }

  function initIdeaGrid() {

    const profileTitleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        const url = '/analysis/profile/details?profileType=' + row['profileType'] + '&profileId=' + row['profileId'];
        cmmUtils.goToPage(url);
      })
    }

    const ideaTitleAnchor = function(anchor, col, row) {
      anchor.addEventListener('click', function() {
        showModIdeaModal(row['ideaId']);
      })
    }

    const props = {
      url: '/api/v1/analysis/profile/idea-list',
      body: {
        orderBy: [{column: 'uptDate', desc: true}],
        pageSize: 5 //  기본 5개로 설정
      },
      eId: 'ideaGrid',
      pId: 'ideaPagination',
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'ideaId', isHidden: true},
        {id: 'profileType', isHidden: true},
        {id: 'rowNum', name: 'No', isSort: true, align: 'center'},
        {id: 'profileTitle', name: '포트폴리오', width: '300px', isSort: true, dotText: 22, align: 'left', isLink: true, userCustom: profileTitleAnchor},
        {id: 'ideaTitle', name: '아이디어 제목', width: '800px', isSort: true, isLink: true, userCustom: ideaTitleAnchor},
        {id: 'uptDate', name: '최근 수정일', width: '150px', isSort: true, align: 'center'}
      ]
    }
    ideaGrid = new COMPONENTS.DataGrid(props);
    initCKEditor();
  }

  async function initAutoPayment() {
    if (document.getElementById('paymentDiv')) {
      const response = await cmmUtils.awaitAxiosGet({url: '/api/v1/login/user'});
      const container = document.getElementById('paymentDiv');
      cmmUtils.clearChildNodes('paymentDiv');
      const button = document.createElement('button');
      button.classList.add('button');
      button.classList.add('is-light');
      button.classList.add('is-small');
      button.classList.add('ml-3');
      if (cmmUtils.nvl(response.customerUid) === '') {
        button.classList.add('is-success');
        button.innerHTML = '<span class="file-icon"><i class="fab fa-lg fa-cc-visa"></i></span><span>정기결제 등록</span>';
        button.addEventListener('click', showAuthPaymentModal);
        container.appendChild(button);
      } else {
        button.classList.add('is-success');
        button.innerHTML = '<span class="file-icon"><i class="fab fa-lg fa-cc-visa"></i></span><span>정기결제 재등록</span>';
        button.addEventListener('click', createOtherPayment);
        container.appendChild(button);
        const delButton = document.createElement('button');
        delButton.classList.add('button');
        delButton.classList.add('is-danger');
        delButton.classList.add('is-light');
        delButton.classList.add('is-small');
        delButton.classList.add('ml-2');
        delButton.innerHTML = '<span class="file-icon"><i class="fas fa-lg fa-credit-card"></i></span><span>정기결제 해제</span>';
        delButton.addEventListener('click', stopAutoPayment);
        container.appendChild(delButton);
      }
    }
  }

  function createOtherPayment(e) {
    cmmConfirm.show({msg: '새로운 신용카드 정보로 정기결제를 재등록하시겠습니까?', color: 'is-warning'}, showAuthPaymentModal);
  }

  function stopAutoPayment(e) {
    cmmConfirm.show({msg: '자동 결제를 해제하시겠습니까?', color: 'is-warning'}, async function() {
      const response = await cmmUtils.awaitAxiosPost({url: '/api/v1/login/payment/stop'});
      if (response) {
        await initAutoPayment();
      }
    })
  }


  function initCKEditor() {
    const modIdeaContWordCount = function(stats) {
      global.modIdeaWordCount = stats.characters;
    }
    if (!global['ckEditModIdeaCont']) {
      cmmUtils.createCKEditor({selector: '#modIdeaCont', wordCount: modIdeaContWordCount}, function(editor) {
        global['ckEditModIdeaCont'] = editor;
      });
    }
  }

  function showModIdeaModal(ideaId) {
    global.selectedIdeaId = ideaId;
    const url = '/api/v1/analysis/profile/idea/' + ideaId;
    cmmUtils.axiosGet({url: url}, function(response) {
      clearModIdeaModal(response);
      cmmUtils.bindData('modIdeaForm', response);
      global.ckEditModIdeaCont.setData(response['ideaCont']);
      cmmUtils.showModal('modIdeaModal');
    });
  }

  function clearModIdeaModal(response) {
    document.getElementById('modIdeaTitle').value = '';
    global.ckEditModIdeaCont.setData('');
    document.getElementById('modCardTitle').innerText = response['ideaTitle'];
  }

  function goToModProfile() {
    const loginId = document.getElementById('loginId').value;
    const loginPwd = document.getElementById('ipPwd').value;
    cmmUtils.axiosPost({
      url: '/api/v1/login/check-pwd',
      body: {
        loginId: loginId,
        loginPwd: loginPwd
      }
    }, function (response) {
      if (response) {
        cmmUtils.goToPage('/user/mod-account');
      } else {
        const helpPwd = document.getElementById('helpPwd');
        helpPwd.classList.remove('is-hidden');
      }
    });
  }

  function keyupIpPwd(e) {
    if (e.key === 'Enter') {
      goToModProfile();
    }
  }

  // 내 포트폴리오 사진 변경
  function onChangeImgFile(fis) {
    const str = fis.value;
    const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
    if (fileName) {
      if (cmmUtils.checkImageExtension(fileName)) {
        const file = document.getElementById('myImgFile').files[0];
        const checkedFiles = cmmUtils.verifySingleFileSize(file);
        if (checkedFiles.status) {
          const formData = new FormData();
          formData.append('myImgFile', file);
          cmmUtils.axiosPost({
            url: '/api/v1/login/update-my-image',
            isMultipartFile: true,
            body: formData
          }, function (response) {
            if (response.status === 'OK') {
              const myImage = document.getElementById('myImage');
              const src = CONTEXT_PATH + '/common/image/' + response['data'] + '.do';
              myImage.setAttribute('src', src);
            } else {
              cmmUtils.showErrModal();
            }
          });
        } else {
          cmmUtils.showIpModal('파일', checkedFiles.msg);
          return false;
        }
      } else {
        cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
      }
    }
  }

  function modifyIdea() {
    if (verifyModIdeaForm()) {
      const msg = '아이디어를 수정 하시겠습니까?';
      cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
        const formData = new FormData();
        formData.append('ideaId', global.selectedIdeaId);
        formData.append('ideaTitle', document.getElementById('modIdeaTitle').value);
        formData.append('ideaCont', global.ckEditModIdeaCont.getData());

        const images = document.getElementById('modIdeaModal').querySelector('.ck-content').querySelectorAll('img');
        for (let i=0;i<images.length;i++) {
          const split = images[i].src.split('.')[0].split('/');
          const usedImageId = split[split.length - 1];
          formData.append('usedImageIds', usedImageId);
        }

        cmmUtils.axiosPost({
          url: '/api/v1/analysis/profile/update-idea',
          body: formData,
          loading: 'btnModIdea'
        }, function (response) {
          if (response === 1) {
            cmmUtils.showToast({message: '수정 되었습니다.'});
            closeModIdeaModal();
          } else {
            cmmUtils.showErrModal();
          }
        });
      });
    }
  }

  function removeIdea() {
    const msg = '아이디어를 삭제 하시겠습니까?';
    cmmConfirm.show({msg: msg, color: 'is-warning'}, async function() {
      const response = await cmmUtils.awaitAxiosPost({
        url: '/api/v1/analysis/profile/remove-idea',
        body: {
          ideaId: global.selectedIdeaId
        }
      });

      if (response) {
        cmmUtils.showToast({message: '삭제 되었습니다.'});
        closeModIdeaModal();
      } else {
        cmmUtils.goToErrorPage(response);
      }
    });
  }


  function verifyModIdeaForm() {
    const modIdeaTitle = document.getElementById('modIdeaTitle').value;
    if (!modIdeaTitle) {
      cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
      return false;
    }
    if (global.modIdeaWordCount > 2000) {
      cmmUtils.showIpModal('문자수 초과', '아이디어 문자수는 최대 2000문자(현재:' + global.modIdeaWordCount + '문자)까지 가능합니다. ');
      return false;
    }
    return true;
  }

  async function closeModIdeaModal() {
    cmmUtils.closeModal('modIdeaModal');
    await cmmUtils.axiosPost({url: '/common/ckeditor5/unused-files'});
    reloadIdeaGrid();
  }

  function reloadIdeaGrid() {
    ideaGrid.reload();
  }

  // 회원탈퇴
  function withdrawal() {
    cmmUtils.axiosPost({
      url: '/api/v1/login/withdrawal',
      loading: 'btnWithdrawal'
    }, function (response) {
      if (response) {
        document.getElementById('spanLogout').click(); // 로그아웃
      } else {
        cmmUtils.goToErrorPage();
      }
    });
  }

  function showConfirmPwdModal() {
    cmmUtils.showModal('confirmPwdModal');
    document.getElementById('ipPwd').focus();
  }

  function showAuthPaymentModal() {
    cmmConfirm.show({msg: '정기결제를 등록하시면 등급 만료일 하루 전 자동으로 갱신됩니다.<br/>등록하시겠습니까?', color: 'is-warning'}, function() {
      const custometUid = cmmUtils.getUUID();
      IMP.request_pay({
        // pg : "html5_inicis.INIBillTst", // 실제 계약 후에는 실제 상점아이디로 변경
        pg : "html5_inicis.MOIbeesto1", // 실제 계약 후에는 실제 상점아이디로 변경
        pay_method : 'card', // 'card'만 지원됩니다.
        merchant_uid : 'merchant_' + new Date().getTime(),
        name : 'BEESTOCK 정기결제 등록',
        amount : 0, // 결제창에 표시될 금액. 실제 승인이 이뤄지지는 않습니다. (모바일에서는 가격이 표시되지 않음)
        customer_uid : custometUid,
        buyer_name : document.getElementById('loginUserNm').value,
        buyer_tel : cmmUtils.replaceCellular(document.getElementById('loginUserPhone').value)
      }, function(rsp) {
        console.log(rsp);
        if ( rsp.success ) {
          updateCustomerUid(rsp.customer_uid);
        } else {
          cmmUtils.showToast({
            message: '정기결제 실패',
            type: 'is-danger'
          });
        }
      });
    });
  }

  async function updateCustomerUid(customerUid) {
    const response = await cmmUtils.awaitAxiosPost({
      url: '/api/v1/login/payment/billing',
      body: {
        customerUid: customerUid
      }
    });
    if (response) {
      cmmUtils.showModal('autopaySuccessModal');
      await initAutoPayment();
    } else {
      cmmUtils.showToast({
        message: '빌링키 저장 실패',
        type: 'is-danger'
      });
    }
  }

  // 가상계좌 주문내역 확인 모달
  function showOrderModal() {
    cmmUtils.showModal('myOrderModal');
    initMyOrderGrid();
  }

  function initMyOrderGrid() {
    // 상태 커스텀
    const status = function(col, row) {
      if (row.expired === 1) {
        return '<span class="tag is-danger is-light">기한만료</span>';
      } else if (row.status === 'ready') {
        return '<span class="tag is-warning is-light">이체예정</span>';
      } else if(row.status === 'paid') {
        return '<span class="tag is-success is-light">이체완료</span>';
      } else {
        return '<span class="tag is-danger is-light">오류</span>';
      }
    }
    const dueDate = function(col, row) {
      return '<span>' + makeDueDate(row.dueDate.toString()) + '</span>';
    }
    const props = {
      url: '/api/v1/login/mypage/order',
      eId: 'myOrderGrid',
      body: {
        orderBy: [{column: 'orderDate', desc: true}],
      },
      isThead: true,
      isTfoot: false,
      colModel: [
        {id: 'orderDate', name: '가상계좌 채번일', isSort: true, align: 'center'},
        {id: 'vbankName', name: '은행명', isSort: true, align: 'center'},
        {id: 'vbankNum', name: '가상계좌', align: 'center'},
        {name: '이체기한', align: 'center', type: 'custom', userCustom: dueDate},
        {id: 'month', name: '이용 개월수', align: 'center'},
        {id: 'paidAmount', name: '금액', align: 'right', isCurrency: true},
        {name: '상태', align: 'center', type: 'custom', userCustom: status}
      ]
    }
    myOrderGrid = new COMPONENTS.DataGrid(props);
  }

  function makeDueDate(dueDate) {
    const year = dueDate.substr(0, 4);
    const month = dueDate.substr(4, 2);
    const day = dueDate.substr(6, 2);
    const hour = dueDate.substr(8, 2);
    const minutes = dueDate.substr(10, 2);
    return year.concat('-').concat(month).concat('-').concat(day).concat(' ').concat(hour).concat(':').concat(minutes);
  }


  return {
    init: init,
    goToModProfile: goToModProfile,
    keyupIpPwd: keyupIpPwd,
    onChangeImgFile: onChangeImgFile,
    modifyIdea: modifyIdea,
    removeIdea: removeIdea,
    closeModIdeaModal: closeModIdeaModal,
    withdrawal: withdrawal,
    showConfirmPwdModal: showConfirmPwdModal,
    showAuthPaymentModal: showAuthPaymentModal,
    showOrderModal: showOrderModal
  }
}());

document.addEventListener("DOMContentLoaded", function() {
  main.init();
  document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd);
});