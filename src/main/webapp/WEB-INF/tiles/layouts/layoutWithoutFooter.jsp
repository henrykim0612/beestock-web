<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<!DOCTYPE html>
<html>
    <tiles:insertAttribute name="header" />
    <body>
        <tiles:insertAttribute name="commonScript" />
        <tiles:insertAttribute name="top" />
        <div class="container mt-6">
            <tiles:insertAttribute name="content" />
        </div>
        <tiles:insertAttribute name="modal" />
    </body>
</html>