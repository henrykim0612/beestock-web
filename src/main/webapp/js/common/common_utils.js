const cmmUtils = (function () {

  const global = {
    maxFileSize: 10,
    maxGroupFileSize: 50
  }

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

  function goToPage(url, err) {
    const argLen = arguments.length;
    const form = document.createElement('form');

    // 에러정보 추가
    if (argLen === 2) {
      const input1 = document.createElement('input');
      input1.type = 'hidden';
      input1.name = 'exceptionName'
      input1.value = err['exceptionName'];
      const input2 = document.createElement('input');
      input2.type = 'hidden';
      input2.name = 'message'
      input2.value = err['message'];
      const input3 = document.createElement('input');
      input3.type = 'hidden';
      input3.name = 'requestUrl'
      input3.value = err['requestUrl'];
      const input4 = document.createElement('input');
      input4.type = 'hidden';
      input4.name = 'pageUrl'
      input4.value = err['pageUrl'];
      form.appendChild(input1);
      form.appendChild(input2);
      form.appendChild(input3);
      form.appendChild(input4);
    }

    form.method = argLen === 2 ? 'post' : 'get';
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

    ipModalTitle.innerText = text + ' 입력 확인필요';
    ipModalContent.innerText = argLen === 2 ? customText : text + ' 입력값은 필수 입력항목 입니다.';
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
        case 'TEXT':
        case 'HIDDEN':
          setText(tag, data); break;
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
    const toolbar = ['heading', 'bold', 'italic', 'link', 'blockQuote', 'fontColor', 'fontSize', 'alignment', 'highlight', 'code', 'underline', 'superscript', 'subscript', 'strikethrough', 'undo', 'redo'];
    const options = [
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
        heading: {
          options: options,
          plugins: [ ]
        }
      })
      .then(function(editor) {
        if (props['data'] != null) {
          editor.setData(props['data']);
        }
        // 객체 콜백
        callback(editor);
        // 읽기전용 모드
        if (props['isReadOnly'] != null && props['isReadOnly']) {
          editor.isReadOnly = true;
          // 상단 툴바 제거
          const toolbarContainer = editor.ui.view.stickyPanel;
          editor.ui.view.top.remove( toolbarContainer );
          // Border 제거
          const selector = props['selector'];
          const editorDiv = document.querySelector(selector + '~div');
          editorDiv.querySelector('.ck-editor__editable_inline').style.border = 0;
        }
      })
      .catch(function(error) {
        console.log(error.stack);
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

  function setTippy(selectorArr) {
    for (let i = 0; i < selectorArr.length; i++) {
      const obj = selectorArr[i];
      tippy(obj.selector, {
        content: obj.content,
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

  // 분기 형식 체크(2020-1, 2020-4..)
  function checkQuarterPattern(quarter) {
    const dayRegExp = /^(19|20)\d{2}-([1-4])\.(xlsx)$/;
    return dayRegExp.test(quarter);
  }

  // yyyy-MM-dd 체크
  function checkYYYYMMDDPattern(value) {
    const dayRegExp = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;
    if (dayRegExp.test(value)) {
      return isValidDate(value)
    } else {
      return false;
    }
  }

  function isValidDate(date) {
    const splitDate = date.split('-');
    const year = Number(splitDate[0]);
    const month = Number(splitDate[1]);
    const day = Number(splitDate[2]);

    if( month<1 || month>12 ) {
      return false;
    }

    const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let maxDay = maxDaysInMonth[month-1];

    // 윤년 체크
    if (month === 2 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0)) {
      maxDay = 29;
    }

    return !(day <= 0 || day > maxDay);
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
        type: 'is-success is-light',
        duration: 3000,
        position: 'bottom-right',
        dismissible: false,
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    } else {
      bulmaToast.toast({
        message: props['message'] != null ? props['message'] : '저장되었습니다.',
        type: props['type'] != null ? props['type'] : 'is-success is-light',
        duration: props['duration'] != null ? props['duration'] : 3000,
        position: props['position'] != null ? props['position'] : 'bottom-right',
        dismissible: props['dismissible'] != null ? props['dismissible'] : false,
        animate: { in: 'fadeIn', out: 'fadeOut' }
      });
    }
  }

  function getUUID() {
    function s4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }

  function verifyFileSize(fileArr, defaultSize) {
    const sizeLimit = 1048578 * global.maxFileSize; // 파일별 사이즈는 10MB 제한.
    const sizeOfAllFiles = 1048578 * global.maxGroupFileSize; // 모든 파일의 사이즈는 50MB 넘을 수 없음.
    let size = arguments.length === 2 ? defaultSize : 0; // 수정모드에서는 기존에 등록된 파일사이즈를 기본값으로 사용.
    let rtnObj = {status: true, msg: null};
    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i].file != null ? fileArr[i].file : fileArr[i];
      if (!file.isRemoved) {
        size = size + file.size;
        if (sizeLimit < file.size) {
          rtnObj.status = false;
          rtnObj.msg = file.name + '은 10MB를 초과합니다(파일당 10MB 사이즈 제한).';
          break;
        }
      }
    }
    if (sizeOfAllFiles < size) {
      rtnObj.status = false;
      rtnObj.msg = '업로드 최대 사이즈는 50MB 입니다(현재:' + (size/1048576).toFixed(1) + 'MB). 파일 사이즈를 확인해주세요.';
    }
    return rtnObj;
  }

  function verifySingleFileSize(file) {
    let rtnObj = {status: true, msg: null};
    const sizeLimit = 1048578 * global.maxFileSize; // 파일별 사이즈는 10MB 제한.
    if (sizeLimit < file.size) {
      rtnObj.status = false;
      rtnObj.msg = file.name + '은 10MB를 초과합니다(10MB 사이즈 제한).';
    }
    return rtnObj;
  }

  function downloadFile(fileId) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = CONTEXT_PATH + '/common/download-file';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'fileId';
    input.value = fileId;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  function initInputSpinner(props) {
    const spinner = new InputSpinner(document.getElementById(props['eId']));
    spinner.ready(props);
  }

  function goToAlarmPage(linkCode, linkId) {
    switch (linkCode) {
      case 'M0001': // 공지사항
        goToPage('/bbs/notice/' + linkId);
        break;
      case 'M0002': // Q&A
        goToPage('/bbs/qa/' + linkId);
        break;
      case 'M0003': // 포트폴리오
        goToPage('/analysis/profile/' + linkId);
        break;
    }
  }

  // 포트폴리오 분석막대 생성
  function createAnalysisBar(value) {
    if (Math.abs(value) === 100) value = Math.floor(value); // 100 이면 소수점 제거
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('flex-row');
    if (value === 0) {
      appendZeroBar(mainDiv, value);
    } else {
      appendBar(mainDiv, value);
    }
    return mainDiv;

    function appendBar(mainDiv, value) {
      if (value < 0) {
        // 적자 막대 생성
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('flex-row');
        leftDiv.classList.add('justify-content-end');
        leftDiv.classList.add('width-50per');
        const minusDiv = document.createElement('div');
        minusDiv.classList.add('flex-row');
        minusDiv.classList.add('justify-content-end');
        minusDiv.classList.add('analysis-bar');
        minusDiv.classList.add('analysis-minus');
        minusDiv.style.width = Math.abs(value) + '%';
        const contDiv = document.createElement('div');
        contDiv.classList.add('flex-col');
        contDiv.classList.add('justify-content-center');
        const leftStrong = document.createElement('strong');
        leftStrong.innerText = value + '%';
        contDiv.appendChild(leftStrong);
        minusDiv.appendChild(contDiv);
        leftDiv.appendChild(minusDiv);
        mainDiv.appendChild(leftDiv);

        const rightDiv = document.createElement('div');
        leftDiv.classList.add('flex-row');
        leftDiv.classList.add('justify-content-start');
        leftDiv.classList.add('width-50per');
        mainDiv.appendChild(rightDiv);
      } else {
        // 흑자 막대 생성
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('flex-row');
        leftDiv.classList.add('justify-content-end');
        leftDiv.classList.add('width-50per');
        mainDiv.appendChild(leftDiv);

        const rightDiv = document.createElement('div');
        rightDiv.classList.add('flex-row');
        rightDiv.classList.add('justify-content-start');
        rightDiv.classList.add('width-50per');
        const contDiv = document.createElement('div');
        contDiv.classList.add('flex-col');
        contDiv.classList.add('justify-content-center');
        contDiv.classList.add('analysis-bar');
        contDiv.classList.add('analysis-plus');
        contDiv.style.width = value + '%';
        const strong = document.createElement('strong');
        strong.innerText = value + '%';
        contDiv.appendChild(strong);
        rightDiv.appendChild(contDiv);
        mainDiv.appendChild(rightDiv);
      }
    }

    function appendZeroBar(mainDiv, value) {
      mainDiv.classList.add('flex-row');
      mainDiv.classList.add('justify-content-center');
      mainDiv.classList.add('width-100per');
      const strong = document.createElement('strong');
      strong.innerText = value + '%';
      mainDiv.appendChild(strong);
    }
  }

  function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
  }

  function verifyResponse(response) {
    if (response['pageUrl'] != null) {
      goToPage(response['pageUrl'], response);
    }
    if (response === -401) { // 세션 끊어짐
      goToLoginHome();
    }
  }

  function goToErrorPage(err) {
    if (err['pageUrl'] != null) {
      goToPage(err['pageUrl'], err);
    } else {
      console.log(err);
      showErrModal();
    }
  }

  function goToLinkPop(url) {
    window.open(url, '', "width=500,height=600");
  }

  // 최근 업로드된 분기를 리턴 (최근 업도드된 분기는 현재 분기에서 2분기 이전임)
  function getLatestQuarter() {
    const currentDate = new Date();
    const currentQuarter = getQuarter(currentDate);
    // 2분기 이전을 구함
    let currentYear = currentDate.getFullYear();
    let latestQuarter;
    switch (currentQuarter - 2) {
      case 0:
        currentYear = currentYear - 1;
        latestQuarter = 4;
        break;
      case -1:
        currentYear = currentYear - 1;
        latestQuarter = 3;
        break;
      default:
        latestQuarter = currentQuarter - 2;
        break;
    }
    return currentYear + '-' + latestQuarter;
  }

  function getQuarter(date) {
    const month = date.getMonth() + 1;
    return (Math.ceil(month / 3));
  }

  // 바로 앞의 분기를 가져옴
  function getFrontQuarter(quarterDate) {
    const splitDate = quarterDate.split('-');
    let year = parseInt(splitDate[0]);
    let quarter = parseInt(splitDate[1]);
    switch (quarter + 1) {
      case 5:
        year = year + 1;
        quarter = 1;
        break;
      default:
        quarter = quarter + 1;
        break;
    }
    return year + '-' + quarter;
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
    goToLinkPop: goToLinkPop,
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
    setTippy: setTippy,
    getToday: getToday,
    checkExcelExtension: checkExcelExtension,
    checkImageExtension: checkImageExtension,
    checkQuarterPattern: checkQuarterPattern,
    checkYYYYMMDDPattern: checkYYYYMMDDPattern,
    showPageLoader: showPageLoader,
    hidePageLoader: hidePageLoader,
    showToast: showToast,
    getUUID: getUUID,
    verifyFileSize: verifyFileSize,
    verifySingleFileSize: verifySingleFileSize,
    downloadFile: downloadFile,
    initInputSpinner: initInputSpinner,
    goToAlarmPage: goToAlarmPage,
    createAnalysisBar: createAnalysisBar,
    getRandomValue: getRandomValue,
    goToErrorPage: goToErrorPage,
    verifyResponse: verifyResponse,
    getLatestQuarter: getLatestQuarter,
    getQuarter: getQuarter,
    getFrontQuarter: getFrontQuarter
  }
})();