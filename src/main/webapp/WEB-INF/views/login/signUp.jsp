<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<script src="${pageContext.request.contextPath}/js/login/signup.js" type="text/javascript"></script>

<nav class="level">
    <div class="level-item">
        <img style="width: 15%;" src="${pageContext.request.contextPath}/resources/images/logo/horizontal/logo.png">
    </div>
</nav>

<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipEmail" class="input" type="email" placeholder="Email 형식" onblur="main.isEmailPattern()" maxlength="50">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoEmailCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoEmailTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpEmail" class="help is-hidden">입력하신 값은 이메일 형식이 아닙니다.</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipPwd" class="input" type="password" placeholder="8 ~ 16자 영문, 숫자, 특수문자 조합" onblur="main.isPwdPattern()" maxlength="20">
                <span class="icon is-small is-left">
                     <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoPwdCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpPwd" class="help is-hidden">패스워드 형식을 다시 확인해주세요(8 ~ 16자 영문, 숫자, 특수문자 조합).</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Confirm password</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipCfPwd" class="input" type="password" placeholder="패스워드 확인" onblur="main.isSamePassword()" maxlength="20">
                <span class="icon is-small is-left">
                     <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoCfPwdCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoCfPwdTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpCfPwd" class="help is-hidden">패스워드가 일치하지 않습니다.</p>
        </div>
    </div>
</nav>
<nav class="level">
    <div class="level-item has-text-left">
        <div class="field loginField">
            <label class="label">Your Name</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipUserName" class="input" type="text" placeholder="사용자 이름 또는 닉네임" maxlength="50">
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
            <label class="label">Your Mobile</label>
            <div class="control has-icons-left has-icons-right">
                <input id="ipUserPhone" class="input" type="text" placeholder="'-' 포함입력(010-xxxx-xxxx)" onblur="main.isUserPhonePattern()" maxlength="50">
                <span class="icon is-small is-left">
                     <i class="fas fa-mobile-alt"></i>
                </span>
                <span class="icon is-small is-right">
                    <i id="icoUserPhoneCheck" class="fas fa-check is-hidden"></i>
                    <i id="icoUserPhoneTriangle" class="fas fa-exclamation-triangle is-hidden"></i>
                </span>
            </div>
            <p id="helpUserPhone" class="help is-hidden">핸드폰 번호 형식을 다시 확인해주세요(010-xxxx-xxxx).</p>
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
                <input id="ipHintAnswer" class="input" type="text" placeholder="비밀번호 힌트 질문 답변" maxlength="150">
                <span class="icon is-small is-left">
                    <i class="fas fa-pencil-alt"></i>
                </span>
            </div>
        </div>
    </div>
</nav>
<nav class="level mt-6">
    <div class="level-item has-text-centered">
        <div class="field loginField is-grouped is-grouped-centered">
            <div class="buttons">
                <button class="button is-warning" onclick="main.showAgreeModal()"><strong>약관동의</strong></button>
                <button disabled id="btnSubmit" class="button is-primary" onclick="main.signup()"><strong>회원가입</strong></button>
            </div>
        </div>
    </div>
</nav>


<%--완료 모달--%>
<div id="sucModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">회원가입 완료</p>
            <button class="delete" aria-label="close" onclick="main.closeModal('sucModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>회원가입 감사합니다.</h2>
            <p><strong>BeeStock</strong>에서 다양한 정보를 확인하십시오.</p>
        </section>
        <footer class="modal-card-foot justify-content-center">
            <div class="buttons">
                <a class="button is-warning is-small" href="${pageContext.request.contextPath}/login/login-home"><strong>로그인 창으로 이동</strong></a>
            </div>
        </footer>
    </div>
</div>

<%--이메일 중복--%>
<div id="dangerModal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Email 중복</p>
            <button class="delete" aria-label="close" onclick="main.focusIpEmail('dangerModal')"></button>
        </header>
        <section class="modal-card-body">
            <h2>현재 사용중인 이메일 입니다. 다른 이메일을 입력해주세요.</h2>
        </section>
    </div>
</div>


<%--동의 모달--%>
<div class="modal" id="agreeModal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">이용약관</p>
            <button class="delete" aria-label="close" onclick="cmmUtils.closeModal('agreeModal')"></button>
        </header>
        <section class="modal-card-body">
            <div class="content">
                <h1>Hello World</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan, metus ultrices eleifend gravida, nulla nunc varius lectus, nec rutrum justo nibh eu lectus. Ut vulputate semper dui. Fusce erat odio, sollicitudin vel erat vel, interdum mattis neque.</p>
                <h2>Second level</h2>
                <p>Curabitur accumsan turpis pharetra <strong>augue tincidunt</strong> blandit. Quisque condimentum maximus mi, sit amet commodo arcu rutrum id. Proin pretium urna vel cursus venenatis. Suspendisse potenti. Etiam mattis sem rhoncus lacus dapibus facilisis. Donec at dignissim dui. Ut et neque nisl.</p>
                <ul>
                    <li>In fermentum leo eu lectus mollis, quis dictum mi aliquet.</li>
                    <li>Morbi eu nulla lobortis, lobortis est in, fringilla felis.</li>
                    <li>Aliquam nec felis in sapien venenatis viverra fermentum nec lectus.</li>
                    <li>Ut non enim metus.</li>
                </ul>
                <h3>Third level</h3>
                <p>Quisque ante lacus, malesuada ac auctor vitae, congue <a href="#">non ante</a>. Phasellus lacus ex, semper ac tortor nec, fringilla condimentum orci. Fusce eu rutrum tellus.</p>
                <ol>
                    <li>Donec blandit a lorem id convallis.</li>
                    <li>Cras gravida arcu at diam gravida gravida.</li>
                    <li>Integer in volutpat libero.</li>
                    <li>Donec a diam tellus.</li>
                    <li>Aenean nec tortor orci.</li>
                    <li>Quisque aliquam cursus urna, non bibendum massa viverra eget.</li>
                    <li>Vivamus maximus ultricies pulvinar.</li>
                </ol>
                <blockquote>Ut venenatis, nisl scelerisque sollicitudin fermentum, quam libero hendrerit ipsum, ut blandit est tellus sit amet turpis.</blockquote>
                <p>Quisque at semper enim, eu hendrerit odio. Etiam auctor nisl et <em>justo sodales</em> elementum. Maecenas ultrices lacus quis neque consectetur, et lobortis nisi molestie.</p>
                <p>Sed sagittis enim ac tortor maximus rutrum. Nulla facilisi. Donec mattis vulputate risus in luctus. Maecenas vestibulum interdum commodo.</p>
                <p>Suspendisse egestas sapien non felis placerat elementum. Morbi tortor nisl, suscipit sed mi sit amet, mollis malesuada nulla. Nulla facilisi. Nullam ac erat ante.</p>
                <h4>Fourth level</h4>
                <p>Nulla efficitur eleifend nisi, sit amet bibendum sapien fringilla ac. Mauris euismod metus a tellus laoreet, at elementum ex efficitur.</p>
                <p>Maecenas eleifend sollicitudin dui, faucibus sollicitudin augue cursus non. Ut finibus eleifend arcu ut vehicula. Mauris eu est maximus est porta condimentum in eu justo. Nulla id iaculis sapien.</p>
                <p>Phasellus porttitor enim id metus volutpat ultricies. Ut nisi nunc, blandit sed dapibus at, vestibulum in felis. Etiam iaculis lorem ac nibh bibendum rhoncus. Nam interdum efficitur ligula sit amet ullamcorper. Etiam tristique, leo vitae porta faucibus, mi lacus laoreet metus, at cursus leo est vel tellus. Sed ac posuere est. Nunc ultricies nunc neque, vitae ultricies ex sodales quis. Aliquam eu nibh in libero accumsan pulvinar. Nullam nec nisl placerat, pretium metus vel, euismod ipsum. Proin tempor cursus nisl vel condimentum. Nam pharetra varius metus non pellentesque.</p>
                <h5>Fifth level</h5>
                <p>Aliquam sagittis rhoncus vulputate. Cras non luctus sem, sed tincidunt ligula. Vestibulum at nunc elit. Praesent aliquet ligula mi, in luctus elit volutpat porta. Phasellus molestie diam vel nisi sodales, a eleifend augue laoreet. Sed nec eleifend justo. Nam et sollicitudin odio.</p>
                <h6>Sixth level</h6>
                <p>Cras in nibh lacinia, venenatis nisi et, auctor urna. Donec pulvinar lacus sed diam dignissim, ut eleifend eros accumsan. Phasellus non tortor eros. Ut sed rutrum lacus. Etiam purus nunc, scelerisque quis enim vitae, malesuada ultrices turpis. Nunc vitae maximus purus, nec consectetur dui. Suspendisse euismod, elit vel rutrum commodo, ipsum tortor maximus dui, sed varius sapien odio vitae est. Etiam at cursus metus.</p>
            </div>
        </section>
        <footer class="modal-card-foot">
            <div class="field">
                <input id="chkAgreement" class="is-checkradio is-success" type="checkbox">
                <label for="chkAgreement">약관을 확인했습니다</label>
            </div>
        </footer>
    </div>
</div>