const cmmUtils = (function () {

  const global = {
    maxFileSize: 3,
    maxGroupFileSize: 30
  }

  function axiosGet(props, callback) {
    if (props['loading'] != null) showLoadingElement(document.getElementById(props['loading']));
    if (props['isPageLoader'] != null && props['isPageLoader']) showPageLoader();
    axios({url: CONTEXT_PATH + props['url'] + '.do', method: 'get', params: props.params != null ? props.params : {}, timeout: 180000})
      .then(function(response) {
        verifyResponse(response);
        if (props['loading'] != null) cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
        if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.hidePageLoader();
        callback(response.data);
      })
      .catch(function(err) {
        console.error(err);
        goToErrorPage(err);
      });
  }

  function axiosPost(props, callback) {
    const args = arguments.length;
    if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.showPageLoader();
    if (props['loading'] != null) cmmUtils.showLoadingElement(document.getElementById(props['loading']));
    const url = CONTEXT_PATH + props['url'] + '.do';
    const body = props['body'] != null ? props['body'] : {};
    axios({url: url, method: 'post', data: body, timeout: 180000})
      .then(function(response) {
        if (props['loading'] != null) cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
        if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.hidePageLoader();
        if (args === 2) callback(response.data);
      })
      .catch(function(err) {
        console.error(err);
        goToErrorPage(err);
      })
  }

  async function awaitAxiosGet(props) {
    if (props['loading'] != null) showLoadingElement(document.getElementById(props['loading']));
    if (props['isPageLoader'] != null && props['isPageLoader']) showPageLoader();
    let response = null;
    try {
      response = await axios({url: CONTEXT_PATH + props['url'] + '.do', method: 'get', params: props.params != null ? props.params : {}, timeout: 180000});
      verifyResponse(response);
      if (props['loading'] != null) cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
      if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.hidePageLoader();
    } catch (err) {
      console.error(err);
      goToErrorPage(err);
    }
    return response != null ? response.data : null;
  }

  async function awaitAxiosPost(props) {
    if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.showPageLoader();
    if (props['loading'] != null) cmmUtils.showLoadingElement(document.getElementById(props['loading']));
    const url = CONTEXT_PATH + props['url'] + '.do';
    const body = props['body'] != null ? props['body'] : {};
    let response = null;
    try {
      response = await axios({url: url, method: 'post', data: body, timeout: 180000});
      verifyResponse(response);
      if (props['loading'] != null) cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
      if (props['isPageLoader'] != null && props['isPageLoader']) cmmUtils.hidePageLoader();
    } catch (err) {
      console.error(err);
      goToErrorPage(err);
    }
    return response != null ? response.data : null;
  }

  function showModal(eleOrId) {
    typeof eleOrId === 'object'
      ? eleOrId.classList.add('is-active')
      : document.getElementById(eleOrId).classList.add('is-active');
  }

  function showGuideModal(props) {

    setColor(props.color != null ? props.color : 'is-info');
    document.getElementById('guideHeader').innerHTML = props.header;
    document.getElementById('guideModal').classList.add('is-active')

    function setColor(className) {
      const article = document.getElementById('guideArticle');
      article.classList.remove('is-danger');
      article.classList.remove('is-warning');
      article.classList.remove('is-info');
      article.classList.remove('is-link');
      article.classList.remove('is-success');
      article.classList.add(className);
    }
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

  function showCustomErrModal(msg) {
    document.getElementById('customErrMsg').innerText = msg;
    showModal('customErrModal');
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
      form.appendChild(input1);

      const input2 = document.createElement('input');
      input2.type = 'hidden';
      input2.name = 'message'
      input2.value = err['message'];
      form.appendChild(input2);

      const input3 = document.createElement('input');
      input3.type = 'hidden';
      input3.name = 'responseText'
      input3.value = err['responseText'];
      form.appendChild(input3);
    }

    form.method = argLen === 2 ? 'post' : 'get';

    if (url.indexOf('?') !== -1) {
      // 파라미터가 있는 경우
      const splitUrl = url.split('?');
      form.action = CONTEXT_PATH + splitUrl[0] + '.do';

      const params = splitUrl[1].split('&');
      params.forEach(function(e) {
        const info = e.split('=');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = info[0];
        input.value = info[1];
        form.appendChild(input);
      });

    } else {
      // 없는경우
      form.action = CONTEXT_PATH + url + '.do';
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  function goToLoginHome() {
    const form = document.createElement('form');
    form.method = 'get';
    form.action = CONTEXT_PATH + '/login/login-home.do';
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
    const regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
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

    ipModalTitle.innerText = '"' + text + '" 오류';
    ipModalContent.innerText = argLen === 2 ? customText : '"' + text + '" 입력값을 다시 확인해주세요.';
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

    let config = {
      extraPlugins: [MyCustomUploadAdapterPlugin],
      removePlugins: ['ImageCaption'],
      toolbar: {
        items: [
          'heading', '|',
          'fontfamily', 'fontsize', '|',
          'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify', '|',
          'fontColor', 'fontBackgroundColor', '|',
          'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'link', '|',
          'outdent', 'indent', '|',
          'imageInsert', 'blockQuote', 'insertTable', '|',
          'undo', 'redo'
        ],
        shouldNotGroupWhenFull: true
      },
      table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
      },
      image: {
        styles: [
          'alignLeft', 'alignCenter', 'alignRight'
        ],
        // Configure the available image resize options.
        resizeOptions: [
          {
            name: 'imageResize:original',
            label: '100%',
            value: null
          },
          {
            name: 'imageResize:75',
            label: '75%',
            value: '75'
          },
          {
            name: 'imageResize:50',
            label: '50%',
            value: '50'
          },
          {
            name: 'imageResize:250',
            label: '25%',
            value: '25'
          }
        ],
        // You need to configure the image toolbar, too, so it shows the new style
        // buttons as well as the resize buttons.
        toolbar: [
          'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
          '|',
          'imageResize'
          // '|',
          // 'imageTextAlternative'
        ]
      },
      heading: {
        options: [
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
        ]
      }
    }

    /*Word count 이벤트 처리*/
    if (props['wordCount'] != null) {
      config.wordCount = {
        onUpdate: props['wordCount']
      }
    }

    ClassicEditor
      .create(document.querySelector(props['selector']), config)
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

  function clearCalendarValue(id) {
    document.getElementById(id).bulmaCalendar.clear();
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
        placement: 'top',
        animation: 'perspective',
        theme: 'translucent'
      });
    }
  }

  function setTippy(data) {
    if (data.length === undefined) {
      tippy(data.selector, {
        content: data.content,
        placement: data.placement != null ? data.placement : 'top',
        animation: 'scale',
        theme: 'translucent',
        allowHTML: data.allowHTML != null ? data.allowHTML : false
      });
    } else {
      // 배열
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        tippy(obj.selector, {
          content: obj.content,
          placement: obj.placement != null ? obj.placement : 'top',
          animation: 'scale',
          theme: 'translucent',
          allowHTML: obj.allowHTML != null ? obj.allowHTML : false
        });
      }
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
  function checkQuarterDatePattern(quarter) {
    const dayRegExp = /^(19|20)\d{2}-([1-4])$/;
    return dayRegExp.test(quarter);
  }

  function checkQuarterExcelFilePattern(quarter) {
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
    const pageLoader = document.getElementById('pageLoader');
    // pageLoader.style.top = (window.innerHeight / 2) + 'px';
    pageLoader.classList.remove('is-hidden');
  }

  function hidePageLoader() {
    document.getElementById('pageLoader').classList.add('is-hidden');
  }

  function showToast(props) {
    const defaultAnimate = { in: 'fadeInDown', out: 'fadeOutUp' };
    if (arguments.length === 0) {
      bulmaToast.toast({
        message: '저장되었습니다.',
        type: 'is-warning',
        duration: 3000,
        position: 'top-center',
        dismissible: true,
        animate: defaultAnimate
      });
    } else {
      bulmaToast.toast({
        message: props['message'] != null ? props['message'] : '저장되었습니다.',
        type: props['type'] != null ? props['type'] : 'is-warning',
        duration: props['duration'] != null ? props['duration'] : 3000,
        position: props['position'] != null ? props['position'] : 'top-center',
        dismissible: props['dismissible'] != null ? props['dismissible'] : true,
        animate: defaultAnimate
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
    const sizeLimit = 1048578 * global.maxFileSize;
    const sizeOfAllFiles = 1048578 * global.maxGroupFileSize; // 모든 파일의 사이즈는 50MB 넘을 수 없음.
    let size = arguments.length === 2 ? defaultSize : 0; // 수정모드에서는 기존에 등록된 파일사이즈를 기본값으로 사용.
    let rtnObj = {status: true, msg: null};
    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i].file != null ? fileArr[i].file : fileArr[i];
      if (!file.isRemoved) {
        size = size + file.size;
        if (sizeLimit < file.size) {
          rtnObj.status = false;
          rtnObj.msg = file.name + '은 ' + global.maxFileSize + 'MB를 초과합니다(파일당 ' + global.maxFileSize + 'MB 사이즈 제한).';
          break;
        }
      }
    }
    if (sizeOfAllFiles < size) {
      rtnObj.status = false;
      rtnObj.msg = '업로드 최대 사이즈는 ' + global.maxGroupFileSize + 'MB 입니다(현재:' + (size/1048576).toFixed(1) + 'MB). 파일 사이즈를 확인해주세요.';
    }
    return rtnObj;
  }

  function verifySingleFileSize(file) {
    let rtnObj = {status: true, msg: null};
    const sizeLimit = 1048578 * global.maxFileSize;
    if (sizeLimit < file.size) {
      rtnObj.status = false;
      rtnObj.msg = file.name + '은 ' + global.maxFileSize + 'MB를 초과합니다(' + global.maxFileSize + 'MB 사이즈 제한).';
    }
    return rtnObj;
  }

  function downloadFile(fileId) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = CONTEXT_PATH + '/common/download-file.do';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'fileId';
    input.value = fileId;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    form.remove();
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
        // 알람을 만들때 linkId 는 ?profileType=x&profileId=xx 형태임
        goToPage('/analysis/profile/details' + linkId);
        break;
    }
  }

  // 포트폴리오 분석막대 생성
  function createAnalysisBar(value, viewValue) {
    const arg = arguments.length;
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
        const strong = document.createElement('strong');
        strong.classList.add('flex-row');
        strong.classList.add('justify-content-end');
        strong.style.color = '#0a0a0a';
        strong.innerText = arg === 2 ? viewValue : value + '%';
        contDiv.appendChild(strong);
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
        strong.classList.add('flex-row');
        strong.style.color = '#0a0a0a';
        strong.innerText = arg === 2 ? viewValue : value + '%';
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
      strong.innerText = arg === 2 ? viewValue : value + '%';
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
    if (err != null && err['pageUrl'] != null) {
      goToPage(err['pageUrl'], err);
    } else if (err.request != null && err.request.status != null) {
      switch (err.request.status) {
        case 404: goToPage('/errors/404', getErrOptions(err)); break;
        case 500: goToPage('/errors/500', getErrOptions(err)); break;
        default: goToPage('errors/exception', getErrOptions(err)); break;
      }
    } else {
      showErrModal();
    }

    function getErrOptions(err) {
      return {
        exceptionName: err.response.data.exceptionName,
        message: err.response.data.message,
        responseText: err.request.responseText
      }
    }
  }

  function goToLinkPop(url) {
    window.open(url, '', "width=500,height=600");
  }

  function callPopup(prop) {
    let url = prop.url + '.do';
    if (prop.param != null) {
      let param = [];
      for (let key in prop.param) {
        param.push(key + '=' + prop.param[key]);
      }
      url = url + '?' + param.join('&');
    }
    window.open(url, '_blank', "width= 1000, height= 600, left=0, top=0, resizable=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no");
    window.focus();
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

  // 선택한 분기가 최근 분기인지 확인
  function isLatestQuarter(selectedQuarterDate) {
    return selectedQuarterDate === getLatestQuarter() ? 1 : 0;
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

  // 바로 이전 분기를 가져옴
  function getPrevQuarter(quarterDate) {
    const splitDate = quarterDate.split('-');
    let year = parseInt(splitDate[0]);
    let quarter = parseInt(splitDate[1]);
    switch (quarter - 1) {
      case 0:
        year = year - 1;
        quarter = 4;
        break;
      default:
        quarter = quarter - 1;
        break;
    }
    return year + '-' + quarter;
  }

  // 미공시 분기를 추가하여 리턴
  function addUnknownQuarters(categoryArr, seriesDataArr, selectedQuarterDate) {

    const argLen = arguments.length;
    let newCategoryArr = [];
    let newSeriesDataArr = [];
    let markArea = []; // EChart 에서 사용하는 미공시를 표시할 변수
    let prevQuarter = categoryArr[0]; // 이전 분기와 현재분기를 비교할 값
    const iLen = categoryArr.length;

    for (let i = 0; i < iLen; i++) {

      const currentQuarter = categoryArr[i];

      if (i === 0) {
        newCategoryArr.push(currentQuarter)
        // 매치되는 데이터까지 인자값으로 넘어오면 같은 Index 에 추가
        if (1 < argLen) newSeriesDataArr.push(seriesDataArr[i]);
      } else {
        if (getPrevQuarter(currentQuarter) !== prevQuarter) { // 비어있는 분기를 비교하여 찾음
          const unknownQuarters = getUnknownQuarters(prevQuarter, currentQuarter);
          const jLen = unknownQuarters.length;
          // 미공시 분기 추가
          for (let j = 0; j < jLen; j++) {
            newCategoryArr.push(unknownQuarters[j]);
            // 매치되는 데이터까지 인자값으로 넘어오면 같은 Index 에 0 추가
            if (1 < argLen) newSeriesDataArr.push(0);
          }
          // markArea 추가
          markArea.push([{name: '미공시', label: {color: 'grey', fontWeight: 'bold'}, xAxis: categoryArr[i - 1]}, {xAxis: categoryArr[i]}]);
        }
        // 존재하는 분기 추가
        newCategoryArr.push(currentQuarter)
        if (1 < argLen) newSeriesDataArr.push(seriesDataArr[i]);
        prevQuarter = currentQuarter;
      }

      // 마지막은 최근 분기가 맞는지 확인 후 아니면 미공시 추가
      if (i === iLen - 1) {
        const latestQuarter = getLatestQuarter();
        if ((currentQuarter !== latestQuarter) && (selectedQuarterDate === latestQuarter)) {
          newCategoryArr.push(latestQuarter);
          if (1 < argLen) newSeriesDataArr.push(0);
          // markArea 추가
          markArea.push([{name: '미공시', label: {color: 'grey', fontWeight: 'bold'}, xAxis: currentQuarter}, {xAxis: latestQuarter}]);
        }
      }
    }

    // 분기 뒤에 Q 표시
    newCategoryArr = newCategoryArr.map(function(e) { return e + 'Q'});
    markArea.forEach(function(arr) {
      arr.forEach(function(v) {
        v.xAxis = v.xAxis + 'Q';
      })
    });

    return 1 < argLen
      ? {quarters: newCategoryArr, data: newSeriesDataArr, markArea: markArea}
      : {quarters: newCategoryArr, markArea: markArea};
  }

  // From 부터 To 까지의 비어있는 분기를 리턴 (이전에서 최근순으로)
  function getUnknownQuarters(fromQuarter, toQuarter) {
    let unknownArr = [];
    const splitDate = fromQuarter.split('-');
    let year = parseInt(splitDate[0]);
    let quarter = parseInt(splitDate[1]);
    let compareQuarter = fromQuarter;
    while (compareQuarter !== toQuarter) {
      switch (quarter + 1) {
        case 5:
          year = year + 1;
          quarter = 1;
          break;
        default:
          quarter = quarter + 1;
          break;
      }
      compareQuarter = year + '-' + quarter;
      if (compareQuarter !== toQuarter) unknownArr.push(compareQuarter);
    }
    return unknownArr;
  }

  // From 부터 To 까지의 비어있는 분기를 리턴 (최근에서 이전 순으로)
  function getUnknownQuartersReverse(fromQuarter, toQuarter) {
    let unknownArr = [];
    const splitDate = fromQuarter.split('-');
    let year = parseInt(splitDate[0]);
    let quarter = parseInt(splitDate[1]);
    let compareQuarter = fromQuarter;
    while (compareQuarter !== toQuarter) {
      switch (quarter - 1) {
        case 0:
          year = year - 1;
          quarter = 4;
          break;
        default:
          quarter = quarter - 1;
          break;
      }
      compareQuarter = year + '-' + quarter;
      if (compareQuarter !== toQuarter) unknownArr.push(compareQuarter);
    }
    return unknownArr;
  }

  function initSpinner(callback) {
    const spinnerDivs = document.getElementsByClassName('spinnerDiv');
    if (spinnerDivs.length) {
      const len = spinnerDivs.length;
      // 스피너 개수만큼
      for (let i = 0; i < len; i++) {

        const spinnerDiv = spinnerDivs[i];
        const btnMinus = spinnerDiv.querySelector('.spinner-minus');
        const btnPlus = spinnerDiv.querySelector('.spinner-plus');
        const counter = spinnerDiv.querySelector('.spinner-count');

        btnMinus.addEventListener('click', function() {
          let value = parseInt(counter.value) - 1;
          for (let j = 0; j < len; j++) { // 다른 스피너와 값 동기화
            value = value > 0 ? value : 1;
            spinnerDivs[j].querySelector('.spinner-count').value = value;
          }
          callback(value, counter.dataset.idx);
        });
        btnPlus.addEventListener('click', function() {
          let value = parseInt(counter.value) + 1;
          value = value > 0 ? value : 1
          for (let j = 0; j < len; j++) { // 다른 스피너와 값 동기화
            spinnerDivs[j].querySelector('.spinner-count').value = value;
          }
          callback(value, counter.dataset.idx);
        });
        counter.addEventListener('keyup', function() {
          const regexp = /^[0-9]*$/ // 숫자만
          let value = this.value;
          if (!value) value = 1;
          if( !regexp.test(value) ) {
            value = 1;
          }
          for (let j = 0; j < len; j++) { // 다른 스피너와 값 동기화
            spinnerDivs[j].querySelector('.spinner-count').value = value > 0 ? value : 1;
          }
          callback(value, this.dataset.idx);
        });
      }
    }
  }

  function openNewTab(url) {
    const splitUrl = url.split('?');
    const urlArr = [splitUrl[0], '.do?', splitUrl[1]];
    window.open(CONTEXT_PATH + urlArr.join(''), '_blank').focus();

  }

  function getCurrentTime() {
    const date = new Date();
    return date.getHours() + '시 ' + date.getMinutes() + '분';
  }

  // 화폐단위 변경
  function roundCurrency(value, divide, round) {
    const split = value.toString().split('-'); // 마이너스 값 추출
    let v = split.length === 2 ? split[1] : split[0];
    let result = (v / divide).toFixed(round);
    if (split.length === 2) { // 음수 처리
      return parseFloat((result * -1));
    } else { // 양수 처리
      return parseFloat(result);
    }
  }

  function convertDotText(text, size) {
    if (size < text.length) {
      return text.substr(0, size) + '...';
    } else {
      return text;
    }
  }

  function isEmptyObject(param) {
    return Object.keys(param).length === 0 && param.constructor === Object;
  }

  function hasKoreanWord(value) {
    const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return korean.test(value);
  }

  function getRole() {
    const auth = document.getElementById('authority');
    return auth != null ? auth : null;
  }

  function getRoleNm() {
    return document.getElementById('authority').value;
  }

  function addZeroStr(str) {
    const result = (typeof str === 'number') ? str.toString() : str;
    const arr = result.split('.');
    if (arr.length === 1) {
      return str + '.00';
    } else {
      return (arr[1].length === 1) ? str + '0' : str;
    }
  }

  function replaceCellular(value) {
    return value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
  }

  function historyBack() {
    history.back();
  }

  function isAvailableTime(range1, range2) {
    const date = new Date();
    let hour = date.getHours().toString();
    if (hour.length === 1) hour = '0' + hour;
    let minutes = date.getMinutes().toString();
    if (minutes.length === 1) minutes = '0' + minutes;
    const currentTime = parseInt(hour + minutes);
    return (range1 < currentTime && currentTime < range2);
  }

  function byteCalculation(size) {
    const bytes = parseInt(size);
    const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const e = Math.floor(Math.log(bytes)/Math.log(1024));
    if(e == "-Infinity") return "0 "+s[0];
    else
      return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
  }

  function getNegativeValues(rowData, key) {
    return rowData.filter(function(o) {
      return o[key] < 0;
    });
  }

  function getPositiveValues(rowData, key) {
    return rowData.filter(function(o) {
      return 0 <= o[key];
    });
  }

  function getAbsValues(rowData, key) {
    return rowData.map(function(o) { return Math.abs(o[key]); });
  }

  function getPercentage(value, maxValue, adjustedValue) {
    if (maxValue === 0) {
      return 0;
    } else {
      const result = (100 * value) / maxValue;
      if (arguments.length === 3 && adjustedValue) {
        return (-1 < result && result < 0) ? -1 : (0 < result && result < 1) ? 1 : result;
      } else {
        return result;
      }
    }
  }

  function initMiniProfileImg(eventTag, profileId) {
    const miniImg = document.getElementById('miniProfileImg');
    eventTag.addEventListener('mouseover', async function(e) {
      const pos = e.target.getBoundingClientRect();
      const response = await cmmUtils.awaitAxiosGet({url: '/api/v1/admin/profile/' + profileId});
      miniImg.children[0].src =  CONTEXT_PATH + '/common/image/' + response.fileId + '.do';
      miniImg.style.top = (pos.top - 50) + 'px';
      miniImg.style.left = (pos.left - 140) + 'px';
      miniImg.classList.remove('is-hidden');
    });
    eventTag.addEventListener('mouseleave', function(e) {
      miniImg.classList.add('is-hidden');
    });
  }

  function initDraggableBox(id) {
    // Make the DIV element draggable:
    dragElement(document.getElementById(id));

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }

  function closeMiniProfileImg() {
    document.getElementById('miniProfileImg').classList.add('is-hidden');
  }

  function isCheckedAll(name) {
    const tags = document.getElementsByName(name);
    let result = true;
    tags.forEach(function(v) {
      if (!v.checked) {
        result = false;
      }
    });
    return result;
  }

  function isCheckedCnt(name) {
    const tags = document.getElementsByName(name);
    let result = 0;
    tags.forEach(function(v) {
      if (v.checked) {
        result++;
      }
    });
    return result;
  }

  function resetCheckedItems(name) {
    const tags = document.getElementsByName(name);
    tags.forEach(function(v) {
      v.checked = false;
    });
  }

  function getTomorrow() {
    const today = new Date()
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  function getChroma(percentage, negative) {
    const v = Math.abs((2.5 * percentage) / 100);
    if (negative) {
      return chroma('#ff0000').darken(v).hex();
    } else {
      return chroma('#0eff0e').darken(v).hex();
    }
  }

  return {
    axiosGet: axiosGet,
    awaitAxiosGet: awaitAxiosGet,
    axiosPost: axiosPost,
    awaitAxiosPost: awaitAxiosPost,
    showLoadingElement: showLoadingElement,
    hideLoadingElement: hideLoadingElement,
    showModal: showModal,
    showGuideModal: showGuideModal,
    showWarningModal: showWarningModal,
    closeModal: closeModal,
    showErrModal: showErrModal,
    showCustomErrModal: showCustomErrModal,
    goToPage: goToPage,
    goToLoginHome: goToLoginHome,
    goToLinkPop: goToLinkPop,
    callPopup: callPopup,
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
    clearCalendarValue: clearCalendarValue,
    getCalendarValue: getCalendarValue,
    isValidDateRange: isValidDateRange,
    setExcelTippy: setExcelTippy,
    setTippy: setTippy,
    getToday: getToday,
    checkExcelExtension: checkExcelExtension,
    checkImageExtension: checkImageExtension,
    checkQuarterExcelFilePattern: checkQuarterExcelFilePattern,
    checkQuarterDatePattern: checkQuarterDatePattern,
    checkYYYYMMDDPattern: checkYYYYMMDDPattern,
    showPageLoader: showPageLoader,
    hidePageLoader: hidePageLoader,
    showToast: showToast,
    getUUID: getUUID,
    verifyFileSize: verifyFileSize,
    verifySingleFileSize: verifySingleFileSize,
    downloadFile: downloadFile,
    goToAlarmPage: goToAlarmPage,
    createAnalysisBar: createAnalysisBar,
    getRandomValue: getRandomValue,
    goToErrorPage: goToErrorPage,
    verifyResponse: verifyResponse,
    getLatestQuarter: getLatestQuarter,
    getQuarter: getQuarter,
    getFrontQuarter: getFrontQuarter,
    getPrevQuarter: getPrevQuarter,
    addUnknownQuarters: addUnknownQuarters,
    getUnknownQuarters: getUnknownQuarters,
    getUnknownQuartersReverse: getUnknownQuartersReverse,
    initSpinner: initSpinner,
    openNewTab: openNewTab,
    getCurrentTime: getCurrentTime,
    roundCurrency: roundCurrency,
    convertDotText: convertDotText,
    isLatestQuarter: isLatestQuarter,
    isEmptyObject: isEmptyObject,
    hasKoreanWord: hasKoreanWord,
    getRole: getRole,
    getRoleNm: getRoleNm,
    addZeroStr: addZeroStr,
    replaceCellular: replaceCellular,
    historyBack: historyBack,
    isAvailableTime: isAvailableTime,
    byteCalculation: byteCalculation,
    getNegativeValues: getNegativeValues,
    getPositiveValues: getPositiveValues,
    getAbsValues: getAbsValues,
    getPercentage: getPercentage,
    initMiniProfileImg: initMiniProfileImg,
    closeMiniProfileImg: closeMiniProfileImg,
    initDraggableBox: initDraggableBox,
    isCheckedAll: isCheckedAll,
    isCheckedCnt: isCheckedCnt,
    resetCheckedItems: resetCheckedItems,
    getTomorrow: getTomorrow,
    getChroma: getChroma
  }
})();