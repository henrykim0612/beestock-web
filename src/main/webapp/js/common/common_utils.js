const cmmUtils = (function() {

    function getData(props) {
        return fetch(CONTEXT_PATH + props['url'], {
            method: 'GET',
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: props['headers'] != null ? props['headers'] : {'Content-Type': 'application/json'},
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer' // no-referrer, *client
        }).then(function (response) {
            return response.json();
        });
    }

    function postData(props) {
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
        }).then(function(response) {
            return response.json();
        }); // parses JSON response into native JavaScript objects
    }

    function showModal(id) {
        document.getElementById(id).classList.add('is-active');
    }

    function closeModal(id, fId) {
        document.getElementById(id).classList.remove('is-active');
        if (arguments.length === 2) {
            document.getElementById(fId).focus();
        }
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

    return {
        getData: getData,
        postData: postData,
        showLoadingElement: showLoadingElement,
        hideLoadingElement: hideLoadingElement,
        closeModal: closeModal,
        showModal: showModal,
        goToPage: goToPage
    }
})();