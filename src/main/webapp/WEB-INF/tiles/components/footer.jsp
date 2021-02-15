<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<script src="${pageContext.request.contextPath}/js/tiles/components/footer.js" type="text/javascript"></script>

<footer class="footer mt-6">
    <div class="content has-text-centered">
        <p>
            Copyright © 2020 <strong>BeeStock</strong> All rights reserved.
        </p>
    </div>
    <div class="content has-text-centered">
        <button class="button is-text" onclick="footerMain.openModal1()">이용약관</button>
        <button class="button is-text" onclick="footerMain.openModal2()">법적고지</button>
    </div>
</footer>


<%--이용약관--%>
<div id="footerModal1" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">이용약관</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('footerModal1')"></button>
        </header>
        <section class="modal-card-body">
            <!-- Content ... -->
        </section>
        <footer class="modal-card-foot">
            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('footerModal1')">
                <span class="icon"><i class="fas fa-check"></i></span>
                <span>확인</span>
            </button>
        </footer>
    </div>
</div>



<%--법적고지--%>
<div id="footerModal2" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">법적고지</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('footerModal2')"></button>
        </header>
        <section class="modal-card-body">
            <!-- Content ... -->
        </section>
        <footer class="modal-card-foot">
            <button class="button is-dark is-small" onclick="cmmUtils.closeModal('footerModal2')">
                <span class="icon"><i class="fas fa-check"></i></span>
                <span>확인</span>
            </button>
        </footer>
    </div>
</div>
