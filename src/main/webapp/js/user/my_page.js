const COMPONENTS = BeeComponents('dataGrid', function(box) {});
const main = (function() {

    let global = {
        selectedTab: 'contIn', // 기본은 국내
        splitNum: 4,
        selectedIdeaId: null,
        ckEditModIdeaCont: undefined,
        newFileArr: [], // uuid, file, isRemoved
        modFileArr: [] // uuid, fileId, fileSize, isRemoved
    }
    let ideaGrid = undefined;

    function init() {
        createBreadCrumb();
        initMyImage();
        addTabListener();
        addFileEventListener();
        initFavoriteProfiles();
        initIdeaGrid();
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
        html += '      <span>마이 페이지</span>';
        html += '    </a>';
        html += '  </li>';
        html += '</ul>';
        breadCrumbNav.innerHTML = html;
    }

    function initMyImage() {
        cmmUtils.getData({
            url: '/api/v1/login/my-image',
        }).then(function (response) {
            const src = cmmUtils.nvl(response.data)
              ? CONTEXT_PATH + '/common/image/' + response['data']
              : CONTEXT_PATH + '/resources/images/no-profile.png';
            const myImgFile = document.getElementById('myImage');
            myImgFile.setAttribute('src', src);
        }).catch(function (err) {
            console.log(err);
        });
    }

    function addTabListener() {
        const tabs = document.getElementsByName('tabs');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            tab.addEventListener('click', function () {
                resetTabs();
                this.classList.add('is-active');
                const contId = this.getAttribute('data-cont-id');
                global['selectedTab'] = contId;
                document.getElementById(contId).classList.remove('is-hidden');
                initFavoriteProfiles();
            })
        }
    }

    // 파일태그 변경 이벤트
    function addFileEventListener() {
        // 수정모달 첨부파일
        document.getElementById('modIdeaFile').addEventListener('change', function() {
            if (this.files.length) {
                const modIdeaFileDiv = document.getElementById('modIdeaFileDiv');
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const uuid = cmmUtils.getUUID();
                    global.newFileArr.push({uuid: uuid, file: file});
                    fragment.appendChild(appendFileTag({uuid: uuid, name: file.name}));
                }
                modIdeaFileDiv.appendChild(fragment.cloneNode(true));
                this.value = ''; // 리셋
            }
        })
    }

    function appendFileTag(data, hasLink) {
        const button = document.createElement('button');
        button.classList.add('delete');
        button.classList.add('is-small');
        button.setAttribute('onclick', 'main.removeFileTag(\'' + data.uuid + '\')');
        const span = document.createElement('span');
        span.classList.add('tag');
        span.classList.add('is-warning');
        span.classList.add('is-light');
        span.classList.add('mr-3');
        span.setAttribute('data-key', data.uuid);
        if (hasLink) {
            const a = document.createElement('a');
            a.classList.add('is-link');
            a.innerText = data.name;
            a.setAttribute('data-anchor', 'ideaFile');
            a.setAttribute('data-file-id', data['fileId']);
            span.appendChild(a);
        } else {
            span.innerText = data.name;
        }
        span.appendChild(button);
        return span;
    }

    function resetTabs() {
        const tabs = document.getElementsByName('tabs');
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            tab.classList.remove('is-active');
            document.getElementById(tab.getAttribute('data-cont-id')).classList.add('is-hidden');
        }
    }

    function initFavoriteProfiles() {
        cmmUtils.postData({
            url: '/api/v1/login/favorite-profile',
            body: {
                profileType: global['selectedTab'] === 'contIn' ? 1 : 2 // 1: 국내, 2: 해외
            }
        }).then(function (response) {
            cmmProfileCard.appendCards(response, global['selectedTab']);
        }).catch(function (err) {
            cmmUtils.showErrModal();
            console.log(err);
        });
    }

    function initIdeaGrid() {
        const profileTitleAnchor = function(anchor, col, row) {
            anchor.setAttribute('data-custom', 'profileAnchor');
            anchor.setAttribute('data-key', row['profileId']);
        }
        const ideaTitleAnchor = function(anchor, col, row) {
            anchor.setAttribute('data-custom', 'ideaAnchor');
            anchor.setAttribute('data-key', row['ideaId']);
        }
        const props = {
            url: '/api/v1/analysis/profile/paging-idea-list',
            body: {
                orderBy: [{column: 'uptDate', desc: true}]
            },
            eId: 'ideaGrid',
            pId: 'ideaPagination',
            isThead: true,
            isTfoot: false,
            colModel: [
                {id: 'ideaId', isHidden: true},
                {id: 'rowNum', name: 'No', isSort: true, isStrong: true},
                {id: 'profileTitle', name: '프로필', width: '300px', isSort: true, align: 'left', isLink: true, userCustom: profileTitleAnchor},
                {id: 'ideaTitle', name: '아이디어 제목', width: '800px', isSort: true, isLink: true, userCustom: ideaTitleAnchor},
                {id: 'uptDate', name: '최근 수정일', width: '150px', isSort: true, align: 'center'}
            ],
            success: function (data, _this) {
                addTitleAnchorEvent(data, _this);
            }
        }
        ideaGrid = new COMPONENTS.DataGrid(props);
        initCKEditor();

        function addTitleAnchorEvent(data, _this) {
            const eId = _this.props.eId;
            // 아이디어 타이틀 이벤트
            const ideaAnchorTags = document.getElementById(eId).querySelectorAll('[data-custom=ideaAnchor]');
            for (let i = 0; i < ideaAnchorTags.length; i++) {
                ideaAnchorTags[i].addEventListener('click', function () {
                    const ideaId = this.getAttribute('data-key');
                    showModIdeaModal(ideaId);
                })
            }
            // 프로필 타이틀 이벤트
            const profileAnchorTags = document.getElementById(eId).querySelectorAll('[data-custom=profileAnchor]');
            for (let i = 0; i < profileAnchorTags.length; i++) {
                profileAnchorTags[i].addEventListener('click', function () {
                    const profileId = this.getAttribute('data-key');
                    const url = '/analysis/profile/' + profileId;
                    cmmUtils.goToPage(url);
                })
            }
        }
    }

    function initCKEditor() {
        if (!global['ckEditModIdeaCont']) {
            cmmUtils.createCKEditor({selector: '#modIdeaCont'}, function(editor) {
                global['ckEditModIdeaCont'] = editor;
            });
        }
    }

    function showModIdeaModal(ideaId) {
        global.selectedIdeaId = ideaId;
        const url = '/api/v1/analysis/profile/idea/' + ideaId;
        cmmUtils.getData({
            url: url
        }).then(function (response) {
            clearModIdeaModal(response);
            cmmUtils.bindData('modIdeaForm', response);
            global.ckEditModIdeaCont.setData(response['ideaCont']);
            appendModIdeaFiles(response);
            cmmUtils.showModal('modIdeaModal');
        }).catch(function (err) {
            cmmUtils.showErrModal();
            console.log(err);
        });
    }

    function clearModIdeaModal(response) {
        document.getElementById('modIdeaTitle').value = '';
        global.ckEditModIdeaCont.setData('');
        document.getElementById('modIdeaFile').value = '';
        cmmUtils.clearChildNodes(document.getElementById('modIdeaFileDiv'));
        document.getElementById('modCardTitle').innerText = response['ideaTitle'];
        global.newFileArr = [];
    }

    function appendModIdeaFiles(response) {
        if (response['ideaFiles'] != null && response['ideaFiles'].length) {
            global.modFileArr = [];
            const modIdeaFileDiv = document.getElementById('modIdeaFileDiv');
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < response['ideaFiles'].length; i++) {
                const file = response['ideaFiles'][i];
                const uuid = cmmUtils.getUUID();
                global.modFileArr.push({uuid: uuid, fileId: file['fileId'], fileSize: file['fileSize']});
                fragment.appendChild(appendFileTag({uuid: uuid, name: file['originalFileName'], fileId: file['fileId']}, true));
            }
            modIdeaFileDiv.appendChild(fragment.cloneNode(true));
            // 아이디어 다운로드 이벤트 추가
            const ideaFileAnchors = modIdeaFileDiv.querySelectorAll('[data-anchor=ideaFile]');
            for (let i = 0; i < ideaFileAnchors.length; i++) {
                ideaFileAnchors[i].addEventListener('click', function() {
                    cmmUtils.downloadFile(this.getAttribute('data-file-id'));
                })
            }
        }
    }

    function goToModProfile() {
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
                const form = document.createElement('form');
                form.method = 'get';
                form.action = CONTEXT_PATH + '/user/mod-account';
                document.body.appendChild(form);
                form.submit();
                form.remove();
            } else {
                const helpPwd = document.getElementById('helpPwd');
                helpPwd.classList.remove('is-hidden');
            }
        });
    }

    function keyupIpPwd(e) {
        if (e.key === 'Enter') {
            goToModProfile();
        }
    }

    // 내 프로필 사진 변경
    function onChangeImgFile(fis) {
        const str = fis.value;
        const fileName = fis.value.substring(str.lastIndexOf("\\")+1);
        if (fileName) {
            if (cmmUtils.checkImageExtension(fileName)) {
                const file = document.getElementById('myImgFile').files[0];
                const checkedFiles = cmmUtils.verifySingleFileSize(file);
                if (checkedFiles.status) {
                    const formData = new FormData();
                    formData.append('myImgFile', file);
                    cmmUtils.postData({
                        url: '/api/v1/login/update-my-image',
                        isMultipartFile: true,
                        headers: {},
                        body: formData,
                    }).then(function (response) {
                        if (response.status === 'OK') {
                            const myImage = document.getElementById('myImage');
                            const src = CONTEXT_PATH + '/common/image/' + response['data'];
                            myImage.setAttribute('src', src);
                        }
                    }).catch(function (err) {
                        cmmUtils.showErrModal();
                        console.log(err);
                    });
                } else {
                    cmmUtils.showIpModal('파일', checkedFiles.msg);
                    return false;
                }
            } else {
                cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
            }
        }
    }

    function removeFileTag(uuid) {
        const ideaFileDiv = global['modFileArr'].length
          ? document.getElementById('modIdeaFileDiv')
          : document.getElementById('newIdeaFileDiv');
        const spanTags = ideaFileDiv.querySelectorAll('span');
        for (let i = 0; i < spanTags.length; i++) {
            const span = spanTags[i];
            if (span.getAttribute('data-key') === uuid) {
                span.remove();
            }
        }
        removeNewFileArrIdx(uuid);
        if (global['modFileArr'].length) removeModFileArrInx(uuid);
    }

    function removeNewFileArrIdx(uuid) {
        for (let i = 0; i < global.newFileArr.length; i++) {
            const obj = global.newFileArr[i];
            if (uuid === obj.uuid) {
                obj.isRemoved = true;
            }
        }
    }

    function removeModFileArrInx(uuid) {
        for (let i = 0; i < global.modFileArr.length; i++) {
            const obj = global.modFileArr[i];
            if (uuid === obj.uuid) {
                obj.isRemoved = true;
            }
        }
    }

    function modifyIdea() {
        if (verifyModIdeaForm()) {
            const msg = '아이디어를 수정 하시겠습니까?';
            cmmConfirm.show({msg: msg, color: 'is-warning'}, function() {
                const formData = new FormData();
                formData.append('ideaId', global.selectedIdeaId);
                formData.append('ideaTitle', document.getElementById('modIdeaTitle').value);
                formData.append('ideaCont', global.ckEditModIdeaCont.getData());
                for (let i = 0; i < global.newFileArr.length; i++) {
                    const fileObj = global.newFileArr[i];
                    if (fileObj.isRemoved == null || !fileObj.isRemoved) {
                        formData.append('file' + i, fileObj.file);
                    }
                }
                // 기존에 저장된 파일중 제거된 파일정보를 바디에 추가
                let strArr = [];
                for (let i = 0; i < global.modFileArr.length; i++) {
                    const fileObj = global.modFileArr[i];
                    if (fileObj.isRemoved != null || fileObj.isRemoved) {
                        strArr.push(fileObj.fileId);
                    }
                }
                if (strArr.length) {
                    formData.append('modifiedFileStr', strArr.join(','));
                }
                cmmUtils.postData({
                    url: '/api/v1/analysis/profile/update-idea',
                    headers: {},
                    isMultipartFile: true,
                    body: formData,
                    loading: 'btnModIdea'
                }).then(function (response) {
                    if (response === 1) {
                        cmmUtils.showToast({message: '수정 되었습니다.'});
                        closeModIdeaModal();
                    } else {
                        cmmUtils.showWarningModal('비정상적인 저장 데이터', '아이디어가 정상적으로 저장되지 않았습니다.<br/>관리자에게 문의하세요.');
                    }
                }).catch(function (err) {
                    cmmUtils.hideLoadingElement(document.getElementById('btnModIdea'));
                    cmmUtils.showErrModal();
                    console.log(err);
                });
            });
        }
    }

    function verifyModIdeaForm() {
        const modIdeaTitle = document.getElementById('modIdeaTitle').value;
        const checkedFiles = cmmUtils.verifyFileSize(global.newFileArr, getModFileSize());
        if (!modIdeaTitle) {
            cmmUtils.showIpModal('제목', '제목을 입력해주세요.');
            return false;
        }
        if (!checkedFiles.status) {
            cmmUtils.showIpModal('파일', checkedFiles.msg);
            return false;
        }
        return true;
    }

    function getModFileSize() {
        let size = 0;
        if (global.modFileArr.length) {
            for (let i = 0; i < global.modFileArr.length; i++) {
                size = size + global.modFileArr[i].fileSize;
            }
        }
        return size;
    }

    function closeModIdeaModal() {
        cmmUtils.closeModal('modIdeaModal');
        reloadIdeaGrid();
    }

    function reloadIdeaGrid() {
        ideaGrid.reload();
    }

    return {
        init: init,
        goToModProfile: goToModProfile,
        keyupIpPwd: keyupIpPwd,
        onChangeImgFile: onChangeImgFile,
        modifyIdea: modifyIdea,
        removeFileTag: removeFileTag,
        closeModIdeaModal: closeModIdeaModal
    }
}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
    document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd);
});