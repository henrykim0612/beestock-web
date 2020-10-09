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
        html += '      <span>Home</span>';
        html += '    </a>';
        html += '  </li>';
        html += '</ul>';
        breadCrumbNav.innerHTML = html;
    }


    function goToUser1() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/user/user1';
        document.body.appendChild(frm);
        frm.submit();
    }

    function goToSubc1() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/subc/subc1';
        document.body.appendChild(frm);
        frm.submit();
    }


    function goToAdmin1() {
        const frm = document.createElement('form');
        frm.action = CONTEXT_PATH + '/admin/admin1';
        document.body.appendChild(frm);
        frm.submit();
    }

    return {
        init: init,
        goToUser1: goToUser1,
        goToSubc1: goToSubc1,
        goToAdmin1: goToAdmin1
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
});
