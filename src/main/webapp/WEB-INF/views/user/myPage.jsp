<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/user/my_page.js"></script>

<div class="tile is-ancestor">
    <div class="tile is-parent is-2">
        <div class="tile is-child box">
            <div class="columns">
                <div class="column is-full">
                    <figure class="image mb-3 is-1by1">
                        <img id="myImage" class="is-rounded" src="" alt="No image">
                    </figure>
                </div>
            </div>
            <div class="columns">
                <div class="column is-full">
                    <div class="file is-warning is-small is-centered">
                        <label class="file-label">
                            <input class="file-input" type="file" id="myImgFile" name="myImgFile" onchange="main.onChangeImgFile(this)" accept=".jpg, .jpeg, .bmp, .png">
                            <span class="file-cta">
                                <span class="file-icon"><i class="fas fa-camera-retro"></i></span>
                                <span class="file-label">사진 변경</span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="tile is-parent">
        <div class="tile is-child box">
            <div class="columns">
                <div class="column">
                    <p class="title"><sec:authentication property="principal.username"/></p>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <p class="subtitle"><sec:authentication property="principal.userNm"/></p>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <sec:authorize access="hasRole('ROLE_USER')">
                        <span class="icon has-text-link mr-2 is-medium"><i class="fas fa-lg fa-id-card"></i></span>일반사용자
                    </sec:authorize>
                    <sec:authorize access="hasRole('ROLE_SUBC')">
                        <span class="icon has-text-danger mr-2 medium"><i class="fas fa-lg fa-id-card"></i></span>구독자
                    </sec:authorize>
                    <sec:authorize access="hasRole('ROLE_ADMIN')">
                        <span class="icon has-text-dark mr-2 medium"><i class="fas fa-lg fa-id-card"></i></span>관리자
                    </sec:authorize>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <sec:authorize access="hasRole('ROLE_ADMIN')">
                        <p class="subtitle">
                            <span class="icon has-text-dark mr-2"><i class="fas fa-user-clock"></i></span><sec:authentication property="principal.expDate"/> 까지 구독
                        </p>
                    </sec:authorize>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <button class="button is-primary is-small" onclick="cmmUtils.showModal('confirmPwdModal')">
                        <span class="file-icon"><i class="fas fa-user-edit"></i></span>계정수정
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
        <div class="tile is-child box">
            <p class="subtitle"><span class="icon has-text-warning mr-2"><i class="fas fa-star"></i></span>즐겨찾기한 프로필</p>
        </div>
    </div>
</div>



<div id="confirmPwdModal" class="modal is-small">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">패스워드 확인</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('confirmPwdModal')"></button>
        </header>
        <section class="modal-card-body">
            <nav class="level">
                <div class="level-left">
                    <div class="is-vcentered">
                        <label class="label mr-3">Password</label>
                    </div>
                    <div class="control has-icons-left">
                        <input id="ipPwd" class="input" type="password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </div>
                </div>
            </nav>
            <nav class="level">
                <div class="level-left">
                    <p id="helpPwd" class="help is-danger is-hidden">패스워드가 일치하지 않습니다.</p>
                </div>
            </nav>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" onclick="main.goToModProfile()"><strong>확인</strong></a>
            </div>
        </footer>
    </div>
</div>