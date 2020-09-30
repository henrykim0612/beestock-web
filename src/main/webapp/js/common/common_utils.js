const cmmUtils = (function () {

  function getData(props) {
    if (props['loading'] != null) {
      cmmUtils.showLoadingElement(document.getElementById(props['loading']));
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
      return response.json();
    });
  }

  function postData(props) {

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
      body: props['body'] != null ? JSON.stringify(props['body']) : '{}'
    }).then(function (response) {
      if (props['loading'] != null) {
        cmmUtils.hideLoadingElement(document.getElementById(props['loading']));
      }
      return response.json();
    }); // parses JSON response into native JavaScript objects
  }

  function showModal(eleOrId) {
    typeof eleOrId === 'object'
      ? eleOrId.classList.add('is-active')
      : document.getElementById(eleOrId).classList.add('is-active');
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
        case 'P': setParagraphTag(tag, data); break;
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

    function setParagraphTag(tag, data) {
      tag.innerText = getValue(tag, data);
    }
  }

  function removeClassAll(eId) {
    const ele = document.getElementById(eId);
    const classList = ele.classList;
    while (classList.length > 0) {
      classList.remove(classList.item(0));
    }
  }

  function nvl(value) {
    return value == null || false || value === 'null' ? '' : value;
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

  return {
    getData: getData,
    postData: postData,
    showLoadingElement: showLoadingElement,
    hideLoadingElement: hideLoadingElement,
    closeModal: closeModal,
    showModal: showModal,
    showErrModal: showErrModal,
    goToPage: goToPage,
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
    getCheckedValues: getCheckedValues

  }
})();