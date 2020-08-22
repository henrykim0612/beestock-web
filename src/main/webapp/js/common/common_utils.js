const cmmUtils = (function() {

    function startFetch(props, callback) {
        fetch(CONTEXT_PATH + props.url, {
            method: props['method'] != null ? props.method : 'get',
            headers: props['headers'] != null ? props.headers : {'Content-Type': 'application/json'},
            body: props['body'] != null ? JSON.stringify(props.body) : '{}'
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            return callback(result);
        });
    }

    function getData(props) {
        return fetch(CONTEXT_PATH + props.url, {
            method: props['method'] != null ? props.method : 'GET',
            headers: props['headers'] != null ? props.headers : {'Content-Type': 'application/json'},
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

    function showLoadingElement(ele) {
        ele.classList.add('is-loading');
    }

    function hideLoadingElement(ele) {
        ele.classList.remove('is-loading');
    }

    return {
        startFetch: startFetch,
        getData: getData,
        postData: postData,
        showLoadingElement: showLoadingElement,
        hideLoadingElement: hideLoadingElement
    }
})();