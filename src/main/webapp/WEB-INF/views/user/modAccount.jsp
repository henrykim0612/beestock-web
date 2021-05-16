<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script src="${pageContext.request.contextPath}/${jsDir}/user/mod_account.js" type="text/javascript"></script>

<input type="hidden" id="hiddenHintCode" value="<sec:authentication property="principal.hintCode"/>"/>

<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">아이디</label>
            <div class="control has-icons-left">
                <input disabled id="ipEmail" class="input" type="text" value="<sec:authentication property="principal.username"/>">
                <span class="icon is-small is-left">
                    <i class="fas fa-id-card"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">비밀번호</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipPwd" class="input" type="password" placeholder="8 ~ 16자 영문, 숫자, 특수문자 조합" onblur="main.isPwdPattern()">
                <span class="icon is-small is-left">
                     <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoPwdCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpPwd" class="help is-hidden">비밀번호 형식을 다시 확인해주세요(8 ~ 16자 영문, 숫자, 특수문자 조합).</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">비밀번호 확인</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipCfPwd" class="input" type="password" placeholder="비밀번호 확인" onblur="main.isSamePassword()">
                <span class="icon is-small is-left">
                     <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoCfPwdCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoCfPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpCfPwd" class="help is-hidden">비밀번호가 일치하지 않습니다.</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">이름</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipUserName" class="input" type="text" maxlength="50" placeholder="사용자 이름" value="<sec:authentication property="principal.userNm"/>">
                <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">핸드폰 번호</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipUserPhone" class="input" type="text" maxlength="50" placeholder="'-' 없이 입력" onblur="main.isUserPhonePattern()" value="<sec:authentication property="principal.userPhone"/>">
                <span class="icon is-small is-left">
                     <i class="fas fa-mobile-alt"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoUserPhoneCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoUserPhoneTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpUserPhone" class="help is-hidden">핸드폰 번호 형식을 다시 확인해주세요.</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">비밀번호 힌트 질문</label>
            <div class="control has-icons-left ">
                <div class="select">
                    <select id="selHintCode">
                    </select>
                </div>
                <div class="icon is-small is-left">
                    <i class="fas fa-question-circle"></i>
                </div>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">비밀번호 힌트 답변</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipHintAnswer" class="input" type="text" placeholder="비밀번호 힌트 질문 답변" maxlength="200">
                <span class="icon is-small is-left">
                    <i class="fas fa-pencil-alt"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-centered">
        <div class="field loginField is-grouped is-grouped-centered">
            <div class="control">
                <button id="btnSubmit" onclick="main.modifyAccount()" class="button is-success is-small">
                    <span class="icon is-small">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span>수정</span>
                </button>
                <button onclick="main.goToMyPage()" class="button is-dark is-small">
                    <span class="icon is-small">
                      <i class="fas fa-arrow-alt-circle-left"></i>
                    </span>
                    <span>목록으로</span>
                </button>
            </div>
        </div>
    </div>
</nav>



