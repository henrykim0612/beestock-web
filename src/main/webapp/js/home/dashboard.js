const main = (function() {

    function init() {
        addTabListener();
    }

    function addTabListener() {
        const tabs = document.getElementsByName('tabs');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            tab.addEventListener('click', function() {
                resetTabs();
                this.classList.add('is-active');
                document.getElementById(this.getAttribute('data-cont-id')).classList.remove('is-hidden');
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


    return {
        init: init
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
});
