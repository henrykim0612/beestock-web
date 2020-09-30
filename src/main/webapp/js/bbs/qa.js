const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

    let global = {
        selectedQaId: null
    }
    let dataGrid;

    function init() {

        initCalendar();

        const questionMark = function(col, row) {
            return '<span class="icon is-dark"><i class="fab fa-quora"></i>' + row['rowNum'] + '</span>';
        }

        const locker = function(col, row) {
            return row['ckSecret'] === 1 ? '<span class="icon is-dark"><i class="fas fa-lock"></i></span>' : '<span class="icon is-dark"><i class="fas fa-lock-open"></i></span>';
        }

        const answerMark = function(col, row) {
            return !cmmUtils.isEmpty(row['qaAnswer']) ? '<span class="tag is-info is-light">답변완료</span>' : '<span class="tag is-warning is-light">미답변</span>';        }

        const titleAnchor = function(anchor, col, row) {
            anchor.setAttribute('data-custom', 'titleAnchor');
            anchor.setAttribute('data-qa-id', row['qaId']);
            anchor.setAttribute('data-owner', row['uptLoginId']);
            anchor.setAttribute('data-secret', row['ckSecret'] === 1 ? 'true' : 'false');
        }

        const props = {
            url: '/api/v1/bbs/paging-qa-list',
            body: {
                orderBy: [{column: 'uptDate', desc: true}]
            },
            eId: 'dataGrid',
            pId: 'dataPagination',
            isThead: true,
            isTfoot: false,
            colModel: [
                {type: 'custom', userCustom: questionMark, width: '50px', align: 'center'},
                {type: 'custom', userCustom: locker, width: '30px', align: 'center'},
                {id: 'qaTitle', name: '제목', isSort: true, width: '600px', isLink: true, userCustom: titleAnchor},
                {name: '답변상태', type: 'custom', userCustom: answerMark, width: '80px', align: 'center'},
                {id: 'regLoginId', name: '등록자', isSort: true, align: 'center', width: '200px', isExcel: true},
                {id: 'uptDate', name: '최근 수정일', isSort: true, align: 'center', width: '150px', isExcel: true}
            ],
            success: function(data, _this) {
                addTitleAnchorEvent(data, _this);
            }
        }
        dataGrid = new COMPONENTS.DataGrid(props);
    }

    function findQa(e) {
        if (e.key === 'Enter') {
            const key = document.getElementById('selSearch').value;
            const props = {};
            props[key] = this.value;
            dataGrid.reload(props);
        }
    }

    function keyupIpPwd(e) {
        if (e.key === 'Enter') {
            checkPwd();
        }
    }

    function changeSelSearch() {
        const inputSearch = document.getElementById('inputSearch');
        const placeholder = this.value + ' 검색';
        inputSearch.setAttribute('placeholder', placeholder);
    }

    function initCalendar() {
        bulmaCalendar.attach('[type="date"]', {
            type: 'date',
            color: 'info',
            dateFormat: 'YYYY-MM-DD',
            displayMode: 'dialog',
            showHeader: false,
            showClearButton: false
        });
    }

    function addTitleAnchorEvent(data, _this) {
        const eId = _this.props.eId;
        const tags = document.getElementById(eId).querySelectorAll('[data-custom=titleAnchor]');
        for (let i = 0; i < tags.length; i++) {
            tags[i].addEventListener('click', function() {

                const isSecret =  this.getAttribute('data-secret') === 'true';
                const owner = this.getAttribute('data-owner');
                const loginId = document.getElementById('loginId').value;
                global['selectedQaId'] = this.getAttribute('data-qa-id');

                if (document.getElementById('authority').value === '[ROLE_ADMIN]') {
                    // 관리자는 통과
                    goToDetails();
                } else {
                    if (isSecret && owner === loginId) {
                        // 자신이 작성한 비밀글인지 패스워드 확인
                        cmmUtils.showModal('confirmPwdModal');
                    } else {
                        if (isSecret) {
                            cmmUtils.showModal('secretQaModal')
                        } else {
                            goToDetails();
                        }
                    }
                }
            })
        }
    }

    // 상세보기 화면으로 이동
    function goToDetails() {
        const url = '/bbs/qa/' + global['selectedQaId'];
        cmmUtils.goToPage(url);
    }

    function closeModQaModal() {
        cmmUtils.closeModal('modQaModal');
        dataGrid.reload();
    }

    // 비밀글은 패스워드 확인
    function checkPwd() {
        const loginId = document.getElementById('loginId').value;
        const loginPwd = document.getElementById('ipPwd').value;
        cmmUtils.postData({
            url: '/api/v1/login/check-pwd',
            body: {
                loginId: loginId,
                loginPwd: loginPwd
            }
        }).then(function(response) {
            if (response) {
                goToDetails();
            } else {
                const helpPwd = document.getElementById('helpPwd');
                helpPwd.classList.remove('is-hidden');
            }
        });
    }

    function goToQaForm() {
        cmmUtils.goToPage('/bbs/qa-form');
    }

    return {
        init: init,
        changeSelSearch: changeSelSearch,
        findQa: findQa,
        keyupIpPwd: keyupIpPwd,
        closeModQaModal: closeModQaModal,
        checkPwd: checkPwd,
        goToQaForm: goToQaForm
    }

}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
    // 검색조건 셀렉트박스 변경 이벤트
    document.getElementById('selSearch').addEventListener('change', main.changeSelSearch);
    // 사용자 검색 이벤트 리스너
    document.getElementById('inputSearch').addEventListener('keyup', main.findQa);
    // 패스워드 확인 엔터키 이벤트
    document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd)
});