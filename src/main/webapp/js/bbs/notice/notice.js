const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

    let global = {
        selectedNoticeId: null
    }
    let dataGrid;

    function init() {
        createBreadCrumb();
        initGrid();
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
        html += '  <li>';
        html += '    <a href="' + CONTEXT_PATH + '/bbs/notice">';
        html += '      <span class="icon is-small"><i class="fas fa-info" aria-hidden="true"></i></span>';
        html += '      <span>고객센터</span>';
        html += '    </a>';
        html += '  </li>';
        html += '  <li class="is-active">';
        html += '    <a aria-current="page">';
        html += '      <span class="icon is-small"><i class="fas fa-flag"></i></span>';
        html += '      <span>공지사항</span>';
        html += '    </a>';
        html += '  </li>';
        html += '</ul>';
        breadCrumbNav.innerHTML = html;
    }

    function initGrid() {

        const pinned = function(col, row) {
            return row['ckPinnedNotice'] === 1
              ? '<span class="icon has-text-primary"><i class="fas fa-thumbtack"></i></span>'
              : '<span class="icon"><i class="fas fa-bell"></i></span>';
        }

        const dday = function(col, row) {
            if (row['dday'] === 99999) {
                return '<span class="tag is-success is-light">공지중</span>';
            } else {
                return 0 < row['dday']
                  ? '<span class="tag is-danger is-light">D-' + row['dday'] + '</span>'
                  : '<span class="tag is-danger is-light">기간만료</span>';
            }
        }

        const titleAnchor = function(anchor, col, row) {
            anchor.setAttribute('data-custom', 'titleAnchor');
            anchor.setAttribute('data-notice-id', row['noticeId']);
        }

        const props = {
            url: '/api/v1/bbs/paging-notice-list',
            body: {
                orderBy: [{column: 'uptDate', desc: true}]
            },
            eId: 'dataGrid',
            pId: 'dataPagination',
            isThead: true,
            isTfoot: false,
            loading: 'btnSearch',
            colModel: [
                {id: 'rowNum', name: 'No', isSort: true, isStrong: true, align: 'center'},
                {name: '핀고정', type: 'custom', userCustom: pinned, width: '60px', align: 'center'},
                {name:'상태', type: 'custom', userCustom: dday, width: '70px', align: 'center'},
                {id: 'noticeTitle', name: '제목', isSort: true, width: '1100px', isLink: true, userCustom: titleAnchor, hasBadge: 'isRead', hasBadgeText: 'New'}
            ],
            success: function(data, _this) {
                addTitleAnchorEvent(data, _this);
            }
        }
        dataGrid = new COMPONENTS.DataGrid(props);
    }

    function addTitleAnchorEvent(data, _this) {
        const eId = _this.props.eId;
        const tags = document.getElementById(eId).querySelectorAll('[data-custom=titleAnchor]');
        for (let i = 0; i < tags.length; i++) {
            tags[i].addEventListener('click', function() {
                global['selectedNoticeId'] = this.getAttribute('data-notice-id');
                goToDetails();
            })
        }
    }

    // 상세보기 화면으로 이동
    function goToDetails() {
        const url = '/bbs/notice/' + global['selectedNoticeId'];
        cmmUtils.goToPage(url);
    }

    function goToNoticeForm() {
        cmmUtils.goToPage('/bbs/notice-form')
    }

    function findNotice(e) {
        if (e.key === 'Enter') {
            reloadGrid();
        }
    }

    function reloadGrid() {
        const key = document.getElementById('selSearch').value;
        const props = {};
        props[key] = document.getElementById('inputSearch').value;
        dataGrid.reload(props);
    }

    return {
        init: init,
        findNotice: findNotice,
        reloadGrid: reloadGrid,
        goToNoticeForm: goToNoticeForm
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
    // 사용자 검색 이벤트 리스너
    document.getElementById('inputSearch').addEventListener('keyup', main.findNotice);
});