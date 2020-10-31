<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/common/common_profile_card.js"></script>
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
            <div class="tabs is-centered">
                <ul>
                    <li id="tabIn" name="tabs" class="is-active" data-cont-id="contIn">
                        <a>
                            <span class="icon is-small"><i class="fas fa-globe-asia"></i></span>
                            <span>국내</span>
                        </a>
                    </li>
                    <li id="tabOut" name="tabs" data-cont-id="contOut">
                        <a>
                            <span class="icon is-small"><i class="fas fa-globe"></i></span>
                            <span>국외</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div id="contIn"></div>
            <div id="contOut" class="is-hidden"></div>
        </div>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
        <div class="tile is-child box">
            <p class="subtitle"><span class="icon has-text-warning mr-2"><i class="fas fa-lightbulb"></i></span>투자 아이디어 목록</p>
            <div class="table-container mt-3">
                <table id="ideaGrid" class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"></table>
            </div>
            <nav id="ideaPagination" class="pagination is-rounded is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
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

<%--아이디어 수정모달--%>
<div id="modIdeaModal" class="modal is-mobile">
    <div class="modal-background"></div>
    <div class="modal-card width1200px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="modCardTitle">투자 아이디어</p>
            <button class="delete" aria-label="close" onclick="main.closeModIdeaModal()"></button>
        </header>
        <section class="modal-card-body">
            <form id="modIdeaForm">
                <div class="columns">
                    <div class="column is-1 is-vertical-center">
                        <label class="label" for="modIdeaTitle">제목</label>
                    </div>
                    <div class="column">
                        <div class="control">
                            <input id="modIdeaTitle" class="input is-info" type="text" maxlength="30" placeholder="최대 30자리 입력" data-bind="true" data-id="ideaTitle">
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-1 is-vertical-center">
                        <label class="label" for="modIdeaCont">내용</label>
                    </div>
                    <div class="column">
                        <div class="control has-icons-left">
                            <div id="modIdeaCont"></div>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-1 is-vertical-center">
                        <div class="field" id="modFileField">
                            <div class="file is-white">
                                <label class="file-label">
                                    <input class="file-input" type="file" multiple id="modIdeaFile">
                                    <span class="file-cta">
                                    <span class="file-icon"><i class="fas fa-file-signature"></i></span>
                                    <span class="file-label">첨부</span>
                                </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="columns">
                            <div class="column" id="modIdeaFileDiv">
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnModIdea" onclick="main.modifyIdea()" class="button is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>수정</span>
            </button>
            <button onclick="main.closeModIdeaModal()" class="button is-dark">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>