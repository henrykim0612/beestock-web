<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles"%>
<!DOCTYPE html>
<html>
    <tiles:insertAttribute name="header" />
    <body>
        <tiles:insertAttribute name="commonScript" />
        <div class="container">
            <tiles:insertAttribute name="content"/>
        </div>
    </body>
</html>