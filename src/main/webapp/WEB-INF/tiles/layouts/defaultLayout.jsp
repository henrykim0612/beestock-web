<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<!DOCTYPE html>
<html>
    <head>
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
        <tiles:insertAttribute name="footer" />
        <tiles:insertAttribute name="adsenseBottom" />
    </body>
</html>