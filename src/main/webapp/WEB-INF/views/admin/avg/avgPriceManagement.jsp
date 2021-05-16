<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/admin/avg/avg_price_management.js" type="text/javascript"></script>

<article class="message is-warning">
    <div class="message-body">
        평균주가를 업로드 하기전 <strong>포트폴리오 분기 데이터</strong>를 먼저 작업 후 진행해주세요.
    </div>
</article>

<%--검색조건--%>
<div class="columns">
    <div class="column">
        <div class="field">
            <input type="radio" class="is-checkradio is-primary is-circle" id="profileType1" name="profileType" value="1" checked="checked">
            <label for="profileType1">국내</label>
            <input type="radio" class="is-checkradio is-primary is-circle" id="profileType2" name="profileType" value="2">
            <label for="profileType2">해외</label>
        </div>
    </div>
</div>

<sec:authorize access="hasRole('ROLE_ADMIN')">
    <div class="level-right mb-4">
        <div class="control ml-4">
            <div class="buttons">
                <button class="button is-primary is-small" onclick="main.showUploadModal()">
                    <span class="icon is-small"><i class="fas fa-file-upload"></i></span>
                    <span>종목코드 업로드</span>
                </button>
            </div>
        </div>
    </div>
</sec:authorize>

<%--엑셀 다운로드--%>
<sec:authorize access="hasAnyRole('ROLE_PREMIUM', 'ROLE_PREMIUM_PLUS', 'ROLE_ADMIN')">
    <div class="has-text-right">
        <span id="icoExcelDownload" class="icon has-text-success cursor" onclick="main.downloadExcel()"><i class="fas fa-lg fa-file-download"></i></span>
    </div>
</sec:authorize>

<%--테이블 그리드--%>
<table id="dataGrid" class="table is-narrow is-hoverable is-fullwidth"></table>

<%--상세 그리드 모달--%>
<div id="detailModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card width900px">
        <header class="modal-card-head">
            <p class="modal-card-title" id="detailTitle"></p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('detailModal')"></button>
        </header>
        <section class="modal-card-body">
            <table id="detailDataGrid" class="table is-narrow is-hoverable is-fullwidth"></table>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <button onclick="cmmUtils.closeModal('detailModal')" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                <span>닫기</span>
            </button>
        </footer>
    </div>
</div>

<%--업로드 모달--%>
<sec:authorize access="hasRole('ROLE_ADMIN')">
    <div id="uploadModal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card width900px">
            <header class="modal-card-head">
                <p class="modal-card-title">평균주가 업로드</p>
                <button class="delete" aria-label="close" onclick="main.hideUploadModal()"></button>
            </header>
            <section class="modal-card-body">
                <div class="columns">
                    <div class="column">
                        <div class="field">
                            <input type="radio" class="is-checkradio is-primary is-circle is-small" id="uploadType1" name="uploadType" value="1" checked="checked">
                            <label for="uploadType1">국내</label>
                            <input type="radio" class="is-checkradio is-primary is-circle is-small" id="uploadType2" name="uploadType" value="2">
                            <label for="uploadType2">해외</label>
                        </div>
                    </div>
                </div>
                <div class="columns">
                    <div class="column is-2 is-vertical-center">
                        <div class="field" id="fileField">
                            <div class="file is-white">
                                <label class="file-label">
                                    <input multiple class="file-input" type="file" id="uploadFile" accept=".xlsx">
                                    <span class="file-cta">
                                        <span class="file-icon"><i class="fas fa-file-upload"></i></span>
                                        <span class="file-label">파일선택</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="columns">
                            <div class="column" id="uploadFileDiv">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot justify-content-center">
                <button onclick="main.uploadData()" class="button is-success is-small">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
                    <span>업로드</span>
                </button>
                <button onclick="main.hideUploadModal()" class="button is-dark is-small">
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
                    <span>닫기</span>
                </button>
            </footer>
        </div>
    </div>
</sec:authorize>