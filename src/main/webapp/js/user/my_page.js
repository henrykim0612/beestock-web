const main = (function() {

    function init() {
        createBreadCrumb();
        initMyImage();
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

                const formData = new FormData();
                formData.append('myImgFile', document.getElementById('myImgFile').files[0]);

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
                cmmUtils.showIpModal('파일 확장자', '이미지형식(.jpg, .jpeg, .bmp, .png) 파일 형식만 가능합니다.');
            }
        }
    }

    return {
        init: init,
        goToModProfile: goToModProfile,
        keyupIpPwd: keyupIpPwd,
        onChangeImgFile: onChangeImgFile
    }
}());

document.addEventListener("DOMContentLoaded", function() {
    main.init();
    document.getElementById('ipPwd').addEventListener('keyup', main.keyupIpPwd);
});