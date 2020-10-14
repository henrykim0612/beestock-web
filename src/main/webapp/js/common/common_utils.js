const cmmUtils = (function () {

  function getData(props) {
    if (props['loading'] != null) {
      cmmUtils.showLoadingElement(document.getElementById(props['loading']));
    }
    if (props['isPageLoader'] != null && props['isPageLoader']) {
      cmmUtils.showPageLoader();
    }
    return fetch(CONTEXT_PATH + props['url'], {
      method: 'GET',
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: props['headers'] != null ? props['headers'] : {'Content-Type': 'application/json'},
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *client
    }).then(function (response) {
      if (props['loading'] != null) {
        cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
      }
      if (props['isPageLoader'] != null && props['isPageLoader']) {
        cmmUtils.hidePageLoader();
      }
      return response.json();
    });
  }

  function postData(props) {

    if (props['isPageLoader'] != null && props['isPageLoader']) {
      cmmUtils.showPageLoader();
    }

    if (props['loading'] != null) {
      cmmUtils.showLoadingElement(document.getElementById(props['loading']));
    }
    // Default options are marked with *
    return fetch(CONTEXT_PATH + props['url'], {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: props['headers'] != null ? props['headers'] : {'Content-Type': 'application/json'},
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: props['isMultipartFile'] != null && props['isMultipartFile']
        ? props['body']
        : props['body'] != null ? JSON.stringify(props['body']) : '{}'
    }).then(function (response) {
      if (props['loading'] != null) {
        cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
      }
      if (props['isPageLoader'] != null && props['isPageLoader']) {
        cmmUtils.hidePageLoader();
      }
      return response.json();
    }); // parses JSON response into native JavaScript objects
  }

  function showModal(eleOrId) {
    typeof eleOrId === 'object'
      ? eleOrId.classList.add('is-active')
      : document.getElementById(eleOrId).classList.add('is-active');
  }

  function showWarningModal(title, cont) {
    document.getElementById('warningModalTitle').innerHTML = title;
    document.getElementById('warningModalCont').innerHTML = cont;
    showModal('warningModal');
  }

  function closeModal(id, fId) {
    document.getElementById(id).classList.remove('is-active');
    if (arguments.length === 2) {
      document.getElementById(fId).focus();
    }
  }

  function showErrModal() {
    showModal('errModal');
  }

  function showLoadingElement(ele) {
    ele.classList.add('is-loading');
  }

  function hideLoadingElement(ele) {
    ele.classList.remove('is-loading');
  }

  function goToPage(url) {
    const form = document.createElement('form');
    form.method = 'get';
    form.action = CONTEXT_PATH + url;
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  function goToLoginHome() {
    const form = document.createElement('form');
    form.method = 'get';
    form.action = CONTEXT_PATH + '/login/login-home';
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  function clearChildNodes(eleArr) {
    if (typeof eleArr === 'object') {
      if (eleArr.length) {
        for (let i = 0; i < eleArr.length; i++) {
          const ele = eleArr[i];
          typeof ele === 'string' ? removeChild(document.getElementById(ele)) : removeChild(ele);
        }
      } else {
        removeChild(eleArr);
      }
    } else {
      // String ID
      removeChild(document.getElementById(eleArr));
    }
    function removeChild(ele) {
      while(ele.firstChild) {
        ele.removeChild(ele.firstChild);
      }
    }
  }

  function removeHiddenClass(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      if (typeof ele === 'string') {
        document.getElementById(ele).classList.remove('is-hidden');
      } else {
        ele.classList.remove('is-hidden');
      }
    }
  }

  function appendHiddenClass(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      if (typeof ele === 'string') {
        document.getElementById(ele).classList.add('is-hidden');
      } else {
        ele.classList.add('is-hidden');
      }
    }
  }

  function appendInfoClasses(eleArr, isSuccess) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      if (typeof ele === 'string') {
        document.getElementById(ele).classList.add(isSuccess ? 'is-success' : 'is-danger');
      } else {
        ele.classList.add(isSuccess ? 'is-success' : 'is-danger');
      }
    }
  }

  function clearClasses(eleArr) {
    for (let i = 0; i < eleArr.length; i++) {
      const ele = eleArr[i];
      if (typeof ele === 'string') {
        const element = document.getElementById(ele);
        element.classList.remove('is-hidden');
        element.classList.remove('is-success');
        element.classList.remove('is-danger');
      } else {
        ele.classList.remove('is-hidden');
        ele.classList.remove('is-success');
        ele.classList.remove('is-danger');
      }
    }
  }

  // 이메일 체크 정규식
  function isEmail(asValue) {
    const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(asValue);
  }

  // 핸드폰 번호 체크 정규식
  function isCellular(asValue) {
    const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴

  }

  // 비밀번호 체크 정규식
  function isJobPassword(asValue) {
    const regExp = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/; //  8 ~ 16자 영문, 숫자, 특수문자 조합
    return regExp.test(asValue); // 형식에 맞는 경우 true 리턴
  }

  function showIpModal(text, customText) {
    const argLen = arguments.length;
    const ipModal = document.getElementById('inputModal');
    const ipModalTitle = document.getElementById('ipModalTitle');
    const ipModalContent = document.getElementById('ipModalContent');

    ipModalTitle.innerText = text + ' 입력 오류';
    ipModalContent.innerText = argLen === 2 ? customText : text + ' 입력값을 확인해주세요.';
    showModal(ipModal);
  }

  function createIcon(iconClassArr, attrProps, editing) {
    const span = document.createElement('span');
    span.classList.add('icon');
    for (let i = 0; i < iconClassArr.length; i++) {
      span.classList.add(iconClassArr[i]);
    }
    for (let i = 0; i < attrProps.length; i++) {
      span.setAttribute(attrProps[i]['attrName'], attrProps[i]['value']);
    }
    const italic = document.createElement('i');
    span.appendChild(italic);
    if (arguments.length === 3) {
      editing(span);
    }
    return span;
  }

  function showElement(id) {
    document.getElementById(id).style.display = '';
  }

  function hideElement(id) {
    document.getElementById(id).style.display = 'none';
  }

  // 데이터를 태그에 바인딩
  // 필수 옵션: data-bind=true, data-id 필요
  function bindData(eId, data) {
    const tags = document.getElementById(eId).querySelectorAll('[data-bind=true]');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      switch (tag.tagName) {
        case 'INPUT': setInputTag(tag, data); break;
        case 'TEXTAREA': setTextareaTag(tag, data); break;
        case 'A': setAnchorTag(tag, data); break;
        default: setInnerHtml(tag, data); break;
      }
    }

    function getValue(tag, data) {
      return nvl(String(data[tag.getAttribute('data-id')]));
    }

    function setInputTag(tag, data) {
      switch (tag.type.toUpperCase()) {
        case 'TEXT': setText(tag, data); break;
        case 'CHECKBOX': setCheckbox(tag, data); break;
        case 'RADIO': setRadio(tag, data); break;
        case 'SELECTBOX': setSelectBox(tag, data); break;
      }

      // TEXT
      function setText(tag, data) {
        if (tag.getAttribute('data-type') === 'date') { // Date
          tag.bulmaCalendar.value(getValue(tag, data));
        } else { // Default
          tag.value = getValue(tag, data);
        }
      }
      // CHECKBOX
      function setCheckbox(tag, data) {
        tag.checked = tag.value === getValue(tag, data);
      }
      // RADIO
      function setRadio(tag, data) {
        tag.checked = tag.value === getValue(tag, data);
      }
      // SELECT BOX
      function setSelectBox(tag, data) {
        for (let i = 0; i < tag.length; i++) {
          const option = tag[i];
          option.selected = option.value === getValue(tag, data);
        }
      }
    }

    function setTextareaTag(tag, data) {
      tag.value = getValue(tag, data);
    }

    function setAnchorTag(tag, data) {
      tag.innerHTML = getValue(tag, data);
      tag.setAttribute('data-link-value', nvl(String(data[tag.getAttribute('data-link-id')])));
    }

    function setInnerHtml(tag, data) {
      tag.innerHTML = getValue(tag, data);
    }
  }

  function removeClassAll(eId) {
    const ele = document.getElementById(eId);
    const classList = ele.classList;
    while (classList.length > 0) {
      classList.remove(classList.item(0));
    }
  }

  function nvl(v) {
    if (typeof v === 'object') {
      if (v == null) {
        return '';
      } else {
        return v.value == null || false || v === 'null' ? '' : v.value;
      }
    } else {
      return v == null || false || v === 'null' ? '' : v;
    }
  }

  function isEmpty(value) {
    return value == null || value === '' || value === undefined;
  }

  function getCheckedValues(name) {
    let arr = [];
    const tags = document.getElementsByName(name);
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      if (tag.checked) {
        arr.push(tag.value);
      }
    }
    return arr;
  }

  function createCKEditor(props, callback) {
    const toolbar = props['isReadOnly'] != null && props['isReadOnly']
      ? []
      : ['heading', 'bold', 'italic', 'link', 'blockQuote', 'fontColor', 'fontSize', 'alignment', 'highlight', 'code', 'underline', 'superscript', 'subscript', 'strikethrough', 'undo', 'redo'];
    const options = props['isReadOnly'] != null && props['isReadOnly']
      ? []
      : [
        {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
        {
          model: 'headingFancy1',
          view: {
            name: 'h1',
            classes: 'fancy1'
          },
          title: 'Heading 1',
          class: 'ck-heading_heading1',
          // It needs to be converted before the standard 'heading2'.
          converterPriority: 'high'
        },
        {
          model: 'headingFancy2',
          view: {
            name: 'h2',
            classes: 'fancy2'
          },
          title: 'Heading 2',
          class: 'ck-heading_heading2',
          // It needs to be converted before the standard 'heading2'.
          converterPriority: 'high'
        },
        {
          model: 'headingFancy3',
          view: {
            name: 'h3',
            classes: 'fancy3'
          },
          title: 'Heading 3',
          class: 'ck-heading_heading3',
          // It needs to be converted before the standard 'heading2'.
          converterPriority: 'high'
        }
      ];

    ClassicEditor
      .create(document.querySelector(props['selector']), {
        toolbar: toolbar,
        language: 'ko',
        heading: {
          options: options
        }
      })
      .then(function(editor) {
        if (props['data'] != null) {
          editor.setData(props['data']);
        }
        callback(editor);
        //console.log(Array.from(editor.ui.componentFactory.names())); // 이용가능한 Toolbar 아이템})
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  function setCKEditor(editorArr, response) {
    for (let i = 0; i < editorArr.length; i++) {
      const obj = editorArr[i];
      obj.editor.setData(response[obj.key] != null ? response[obj.key] : '');
    }
  }

  function initCalendar(options) {
    const arg = arguments.length;
    bulmaCalendar.attach('[type="date"]', arg === 1 ? options : {
      type: 'date',
      color: 'info',
      dateFormat: 'YYYY-MM-DD',
      displayMode: 'dialog',
      todayButton: true,
      clearButton: true,
      showHeader: false,
      showClearButton: false
    });
  }

  function getCalendarValue(id) {
    return document.getElementById(id).bulmaCalendar.value();
  }

  function setCalendarValue(id, value) {
    document.getElementById(id).bulmaCalendar.value(value);
  }

  // 시작 날짜가 종료 날짜보다 작은지 검증한다
  function isValidDateRange(sId, eId) {
    const stDate = document.getElementById(sId).bulmaCalendar.value();
    const edDate = document.getElementById(eId).bulmaCalendar.value();
    const splitStDate = stDate.split('-');
    const splitEdDate = edDate.split('-');
    const d1 = new Date(parseInt(splitStDate[0]), parseInt(splitStDate[1]), parseInt(splitStDate[2]));
    const d2 = new Date(parseInt(splitEdDate[0]), parseInt(splitEdDate[1]), parseInt(splitEdDate[2]));
    return d1 < d2;
  }

  function setExcelTippy(selectorArr) {
    for (let i = 0; i < selectorArr.length; i++) {
      tippy(selectorArr[i], {
        content: '엑셀 다운로드',
        placement: 'top'
      });
    }
  }

  function getToday(){
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
  }

  // 엑셀 확장자 체크
  function checkExcelExtension(fileName) {
    // return /\.(xls|png|gif)$/i.test(fileName);
    return /\.(xlsx)$/i.test(fileName);
  }

  // 이미지 확장자 체크
  function checkImageExtension(fileName) {
    // return /\.(xls|png|gif)$/i.test(fileName);
    return /\.(jpg|jpeg|bmp|png)$/i.test(fileName);
  }

  function showPageLoader() {
    document.getElementById('pageLoader').classList.add('is-active');
  }

  function hidePageLoader() {
    document.getElementById('pageLoader').classList.remove('is-active');
  }

  function showToast(props) {
    if (arguments.length === 0) {
      bulmaToast.toast({
        message: '저장되었습니다.',
        type: 'is-success',
        duration: 3000,
        position: 'bottom-right',
        dismissible: false,
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    } else {
      bulmaToast.toast({
        message: props['message'] != null ? props['message'] : '저장되었습니다.',
        type: props['type'] != null ? props['type'] : 'is-success',
        duration: props['duration'] != null ? props['duration'] : 3000,
        position: props['position'] != null ? props['position'] : 'bottom-right',
        dismissible: props['dismissible'] != null ? props['dismissible'] : false,
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
  }

  return {
    getData: getData,
    postData: postData,
    showLoadingElement: showLoadingElement,
    hideLoadingElement: hideLoadingElement,
    showModal: showModal,
    showWarningModal: showWarningModal,
    closeModal: closeModal,
    showErrModal: showErrModal,
    goToPage: goToPage,
    goToLoginHome: goToLoginHome,
    clearChildNodes: clearChildNodes,
    removeHiddenClass: removeHiddenClass,
    appendHiddenClass: appendHiddenClass,
    appendInfoClasses: appendInfoClasses,
    clearClasses: clearClasses,
    isEmail: isEmail,
    isCellular: isCellular,
    isJobPassword: isJobPassword,
    showIpModal: showIpModal,
    createIcon: createIcon,
    showElement: showElement,
    hideElement: hideElement,
    bindData: bindData,
    removeClassAll: removeClassAll,
    nvl: nvl,
    isEmpty: isEmpty,
    getCheckedValues: getCheckedValues,
    createCKEditor: createCKEditor,
    setCKEditor: setCKEditor,
    initCalendar: initCalendar,
    setCalendarValue: setCalendarValue,
    getCalendarValue: getCalendarValue,
    isValidDateRange: isValidDateRange,
    setExcelTippy: setExcelTippy,
    getToday: getToday,
    checkExcelExtension: checkExcelExtension,
    checkImageExtension: checkImageExtension,
    showPageLoader: showPageLoader,
    hidePageLoader: hidePageLoader,
    showToast: showToast
  }
})();