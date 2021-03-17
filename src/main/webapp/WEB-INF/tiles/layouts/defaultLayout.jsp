<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<!DOCTYPE html>
<html>
    <head>
        <script data-ad-client="ca-pub-8183196412584390" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <tiles:insertAttribute name="header" />
    </head>
    <body>
        <tiles:insertAttribute name="commonScript" />
        <tiles:insertAttribute name="top" />
        <tiles:insertAttribute name="adsenseTop" />
        <div class="container is-fullhd mt-6 min-screen-height">
            <tiles:insertAttribute name="content"/>
        </div>
        <tiles:insertAttribute name="modal" />
        <tiles:insertAttribute name="adsenseBottom" />
        <tiles:insertAttribute name="footer" />
    </body>
</html>