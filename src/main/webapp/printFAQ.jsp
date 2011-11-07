<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page contentType="text/html;charset=windows-1252"%>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=windows-1252"/>
    <title>USGS NAWQA Watershed Regression for Pesticides (WARP)</title> 
    
    <script type="text/javascript">
        function showall() {
          var mr_divs = document.getElementsByTagName('div');
          for (var i = 0; i < mr_divs.length; i++) {
            mr_divs[i].style.display = 'block';
          }
        }
    </script>
    
  </head>
  <body onload="showall(); setTimeout('window.print()', 10)">    
    <jsp:include page="warpFAQ.jsp"/>  
  </body>
</html>