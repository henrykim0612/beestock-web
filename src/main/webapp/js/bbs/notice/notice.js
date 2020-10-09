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
        html += '    <a href="' + CONTEXT_PATH + '/bbs/qa">';
        html += '      <span class="icon is-small"><i class="fas fa-puzzle-piece" aria-hidden="true"></i></span>';
        html += '      <span>고객센터</span>';
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

    function initGrid() {

        const pinned = function(col, row) {
            return row['ckPinnedNotice'] === 1
              ? '<span class="icon has-text-primary"><i class="fas fa-thumbtack"></i></span>'
              : '<span class="icon"><i class="fas fa-bell"></i></span>';
        }

        const dday = function(col, row) {
            return 0 < row['dday']
              ? '<span class="tag is-danger is-light">D-' + row['dday'] + '</span>'
              : '';
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
            colModel: [
                {id: 'rowNum', name: 'No', isSort: true, isStrong: true},
                {type: 'custom', userCustom: pinned, width: '40px', align: 'center'},
                {type: 'custom', userCustom: dday, width: '50px', align: 'center'},
                {id: 'noticeTitle', name: '제목', isSort: true, width: '600px', isLink: true, userCustom: titleAnchor},
                {id: 'alarmStDate', name: '공지 시작일', isSort: true, align: 'center', width: '200px', isExcel: true},
                {id: 'alarmEdDate', name: '공지 종료일', isSort: true, align: 'center', width: '200px', isExcel: true},
                {id: 'regLoginId', name: '등록자', isSort: true, align: 'center', width: '200px', isExcel: true},
                {id: 'uptDate', name: '최근 수정일', isSort: true, align: 'center', width: '150px', isExcel: true}
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
            const key = document.getElementById('selSearch').value;
            const props = {};
            props[key] = this.value;
            dataGrid.reload(props);
        }
    }

    return {
        init: init,
        findNotice: findNotice,
        goToNoticeForm: goToNoticeForm
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
    // 사용자 검색 이벤트 리스너
    document.getElementById('inputSearch').addEventListener('keyup', main.findNotice);
});