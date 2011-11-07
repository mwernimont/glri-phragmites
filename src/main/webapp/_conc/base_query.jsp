<%@page import="gov.usgs.SQLInjectionTest" %>

<%

//
//  CONCENTRATION BASE QUERIES
//

  String query_id = request.getParameter("query_id");
%>
<% if ("export".equals(query_id)) {
  //get query-specific parameters
  String model_output = request.getParameter("model_output");
  String bbox = request.getParameter("BBOX");
  
  if (!SQLInjectionTest.testNoSpaces(model_output)) {model_output = "error"; }
  if (!SQLInjectionTest.testBBox(bbox)) {bbox = "0,0,0,0"; }
%>
SELECT 
  rf1.geom geom, 
  rf1.<%=model_output%> attrib,
  rf1.name name,
  case 
  	when rf1.<%=model_output%> = -999 then 0 
  	when rf1.<%=model_output%> >= 0 and rf1.<%=model_output%> < 0.001 then 1 
  	when rf1.<%=model_output%> >= 0.001 and rf1.<%=model_output%> < 0.038 then 2 
  	when rf1.<%=model_output%> >= 0.038 and rf1.<%=model_output%> < 0.15  then 3 
  	when rf1.<%=model_output%> >= 0.15 and rf1.<%=model_output%> < 1.026  then 4 
  	when rf1.<%=model_output%> >= 1.026 then 5 
  end bin    
FROM 
  rf1_bc_view_v2 rf1 
WHERE 
  sdo_filter( 
      rf1.geom, 
      mdsys.sdo_geometry( 
        2003,
        8307, 
        NULL, 
        mdsys.sdo_elem_info_array(1,1003,3), 
        mdsys.sdo_ordinate_array(<%=bbox%>) 
      )
    ) = 'TRUE' 
<% } %>