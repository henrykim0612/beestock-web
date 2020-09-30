const main = (function() {

    function init() {
        createBreadCrumb();
    }

    function createBreadCrumb() {
        const breadCrumbNav = document.getElementById('breadCrumbNav');
        let html = '';
        html += '<ul>';
        html += '  <li>';
        html += '    <a href="' + CONTEXT_PATH + '/home/dashboard">';
        html += '      <span class="icon is-small"><i class="fas fa-home" aria-hidden="true"></i></span>';
        html += '      <span>BeeStock</span>';
        html += '    </a>';
        html += '  </li>';
        html += '  <li class="is-active">';
        html += '    <a aria-current="page">';
        html += '      <span class="icon is-small"><i class="fas fa-hand-point-right"></i></span>';
        html += '      <span>공지사항</span>';
        html += '    </a>';
        html += '  </li>';
        html += '</ul>';
        breadCrumbNav.innerHTML = html;
    }


    return {
        init: init
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
});