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
    <title>BEESTOCK</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript">
      const goToMain = (function() {
        return function goToMain() {
          const CONTEXT_PATH = "${pageContext.request.contextPath}";
          const form = document.createElement('form');
          form.action = CONTEXT_PATH + '/index.do';
          document.body.appendChild(form);
          form.submit();
          form.remove();
        }
      })();
      goToMain();
    </script>
</head>
<body onload="goToMain()">
</body>
</html>
