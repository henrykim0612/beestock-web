<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/js/user/my_page.js"></script>


<div class="tile is-ancestor">
    <div class="tile is-parent is-4">
        <div class="tile is-child box">
            <p class="title"><sec:authentication property="principal.username"/></p>
            <p class="subtitle"><sec:authentication property="principal.userNm"/></p>
            <nav class="level">
                <div class="level-left">
                    <button class="button" onclick="cmmUtils.showModal('confirmPwdModal')">Modify</button>
                </div>
            </nav>
        </div>
    </div>
    <div class="tile is-parent">
        <div class="tile is-child box">
            <p class="title">Three</p>
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
                <a class="button is-warning is-small" onclick="main.goToModProfile()"><strong>Confirm</strong></a>
            </div>
        </footer>
    </div>
</div>