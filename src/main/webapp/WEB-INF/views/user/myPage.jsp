<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/common/common_profile_card.js" type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/${jsDir}/user/my_page.js" type="text/javascript"></script>

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
                    <sec:authorize access="hasRole('ROLE_BASIC')">
                        <div class="flex-col justify-content-center">
                            <div class="flex-row">
                                <span class="icon has-text-primary mr-2"><i class="fas fa-lg fa-id-card"></i></span>
                                <span class="subtitle">Basic 등급</span>
                            </div>
                        </div>
                    </sec:authorize>
                    <sec:authorize access="hasRole('ROLE_STANDARD')">
                        <div class="flex-col justify-content-center">
                            <div class="flex-row">
                                <span class="icon has-text-info mr-2"><i class="fas fa-lg fa-id-card"></i></span>
                                <span class="subtitle">Standard 등급</span>
                            </div>
                        </div>
                    </sec:authorize>
                    <sec:authorize access="hasRole('ROLE_PREMIUM')">
                        <div class="flex-col justify-content-center">
                            <div class="flex-row">
                                <span class="icon has-text-warning mr-2"><i class="fas fa-lg fa-id-card"></i></span>
                                <span class="subtitle">Premium 등급</span>
                            </div>
                        </div>
                    </sec:authorize>
                    <sec:authorize access="hasRole('ROLE_PREMIUM_PLUS')">
                        <div class="flex-col justify-content-center">
                            <div class="flex-row">
                                <span class="icon has-text-danger mr-2"><i class="fas fa-lg fa-id-card"></i></span>
                                <span class="subtitle">Premium plus</span>
                            </div>
                        </div>
                    </sec:authorize>
                    <sec:authorize access="hasRole('ROLE_ADMIN')">
                        <div class="flex-col justify-content-center">
                            <div class="flex-row">
                                <span class="icon has-text-black mr-2"><i class="fas fa-lg fa-id-card"></i></span>
                                <span class="subtitle">관리자</span>
                            </div>
                        </div>
                    </sec:authorize>
                </div>
            </div>
            <sec:authorize access="hasAnyRole('ROLE_ADMIN', 'ROLE_STANDARD', 'ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS')">
                <div class="columns">
                    <div class="column flex-row align-items-center">
                        <span class="icon has-text-grey mr-2"><i class="fas fa-clock"></i></span>
                        <span class="has-text-grey"><sec:authentication property="principal.expDate"/> 까지</span>
                        <div id="paymentDiv" class="flex-row align-items-center">
                        </div>
                    </div>
                </div>
            </sec:authorize>
            <div class="columns">
                <div class="column">
                    <button class="button is-warning is-small" onclick="main.showConfirmPwdModal()">
                        <span class="file-icon"><i class="fas fa-user-edit"></i></span>계정수정
                    </button>
                    <button class="button is-success is-small" onclick="main.showOrderModal()">
                        <span class="file-icon"><i class="fas fa-wallet"></i></span>가상계좌 이체결과
                    </button>
                    <button class="button is-danger is-small" onclick="cmmUtils.showModal('withdrawalModal')">
                        <span class="file-icon"><i class="fas fa-user-slash"></i></span>회원탈퇴
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
        <div class="tile is-child box">
            <p class="subtitle"><span class="icon has-text-warning mr-2"><i class="fas fa-star"></i></span>즐겨찾기한 포트폴리오</p>
            <div class="tabs is-centered">
                <ul>
                    <li id="tabOut" name="tabs" data-cont-id="contOut" class="is-active">
                        <a>
                            <span class="icon is-small"><i class="fas fa-globe"></i></span>
                            <span>해외</span>
                        </a>
                    </li>
                    <li id="tabIn" name="tabs" data-cont-id="contIn">
                        <a>
                            <span class="icon is-small"><i class="fas fa-globe-asia"></i></span>
                            <span>국내</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div id="contOut"></div>
            <div id="contIn" class="is-hidden"></div>
        </div>
    </div>
</div>
<div class="tile is-ancestor">
    <div class="tile is-parent">
        <div class="tile is-child box">
            <p class="subtitle"><span class="icon has-text-warning mr-2"><i class="fas fa-lightbulb"></i></span>투자 아이디어 목록</p>
            <div class="table-container mt-3">
                <table id="ideaGrid" class="table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
            </div>
            <nav id="ideaPagination" class="pagination is-small ml-3 mr-3" role="navigation" aria-label="pagination"></nav>
        </div>
    </div>
</div>

<div id="confirmPwdModal" class="modal is-small">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">비밀번호 확인</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('confirmPwdModal')"></button>
        </header>
        <section class="modal-card-body">
            <nav class="level">
                <div class="level-left">
                    <div class="is-vcentered">
                        <label class="label mr-3">비밀번호</label>
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
                    <p id="helpPwd" class="help is-danger is-hidden">비밀번호가 일치하지 않습니다.</p>
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

<%--탈퇴모달--%>
<div class="modal" id="withdrawalModal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">탈퇴 동의</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('withdrawalModal')"></button>
        </header>
        <section class="modal-card-body">
            <p><strong>BEESTOCK</strong> 회원을 탈퇴하시겠습니까?</p>
            <p>탈퇴처리 후 계정은 <strong>1개월</strong>동안 <strong>휴먼계정</strong> 상태로 변경되어 복구 가능하며, <br/><strong>1개월</strong> 이후에는 계정내 저장된 모든 데이터는 <strong>삭제</strong>처리 됩니다.</p>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-dark is-small" id="btnWithdrawal" onclick="main.withdrawal()">
                <span class="icon has-text-danger"><i class="fas fa-user-alt-slash"></i></span>
                <span>탈퇴</span>
            </button>
            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('withdrawalModal')">
                <span class="icon has-text-danger"><i class="fas fa-times"></i></span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>


<%--아이디어 수정모달--%>
<div id="modIdeaModal" class="modal">
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
            </form>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button id="btnModIdea" onclick="main.modifyIdea()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                <span>수정</span>
            </button>
            <button id="btnRmIdea" onclick="main.removeIdea()" class="button is-danger is-small">
                <span class="icon is-small">
                  <i class="fas fa-trash"></i>
                </span>
                <span>삭제</span>
            </button>
            <button onclick="main.closeModIdeaModal()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>취소</span>
            </button>
        </footer>
    </div>
</div>


<div id="myOrderModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card width1200px">
        <header class="modal-card-head">
            <p class="modal-card-title">가상계좌 이체결과</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('myOrderModal');"></button>
        </header>
        <section class="modal-card-body height500px overflowY-auto">
            <table id="myOrderGrid" class="table table is-bordered is-narrow is-hoverable is-fullwidth"></table>
        </section>
    </div>
</div>