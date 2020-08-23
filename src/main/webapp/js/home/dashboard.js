const main = (function() {

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
        goToUser1: goToUser1,
        goToSubc1: goToSubc1,
        goToAdmin1: goToAdmin1
    }

}());
