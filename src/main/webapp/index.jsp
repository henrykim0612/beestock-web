<%--
  Created by IntelliJ IDEA.
  User: herny.kim
  Date: 2021/02/01
  Time: 11:53 오후
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"  />
    <title>Insert title here</title>
    <script type="text/javascript">
      function goToMain() {
        const CONTEXT_PATH = "${pageContext.request.contextPath}";
        const form = document.createElement('form');
        form.action = CONTEXT_PATH + '/index.do';
        document.body.appendChild(form);
        form.submit();
        form.remove();
      }
    </script>
</head>
<body onload="goToMain()">
</body>
</html>
