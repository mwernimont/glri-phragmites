<%@page import="gov.usgs.SQLInjectionTest" %>

<%
String query_id = request.getParameter("query_id");
%>

<%if ("identify".equals(query_id)) {
  String datalayers = request.getParameter("datalayers");
  
  String idBuffer = request.getParameter("id_buffer");
  String[] bufferPart = idBuffer.split(",");

  String lat = request.getParameter("lat");
  String lon = request.getParameter("lon");

  if (!SQLInjectionTest.testDouble(lat)) {lat = "0.0"; }
  if (!SQLInjectionTest.testDouble(lon)) {lon = "0.0"; }
  
  double dlat = Double.parseDouble(lat);
  double dlon = Double.parseDouble(lon);  
  double xmin = Double.parseDouble(bufferPart[0]);
  double ymin = Double.parseDouble(bufferPart[1]);   
  double xmax = Double.parseDouble(bufferPart[2]);
  double ymax = Double.parseDouble(bufferPart[3]); 
%>
SELECT 
  dist, 
  priority, 
  data, 
  P5,
  P10,
  P15,
  P25,
  P50,
  P75,
  P85,
  P90,
  P95,
  LP5,
  LP10,
  LP15,
  LP25,
  LP50,
  LP75,
  LP85,
  LP90,
  LP95,
  HP5,
  HP10,
  HP15,
  HP25,
  HP50,
  HP75,
  HP85,
  HP90,
  HP95,  
  pname,
  e2rf1, 
  meanq, 
  station_id, 
  demtarea, 
  rescode,
  lat, 
  lon 
FROM 
  (
  <% if (datalayers != null && datalayers.indexOf("streams") >= 0) {%>
  (
  SELECT
    sdo_nn_distance(1) dist, 
    0 priority, 
    mr.U_mean data, 
    mr.U_P5 P5, 
    mr.U_P10 P10, 
    mr.U_P15 P15,  
    mr.U_P25 P25,  
    mr.U_P50 P50, 
    mr.U_P75 P75, 
    mr.U_P85 P85,  
    mr.U_P90 P90, 
    mr.U_P95 P95,  
    mr.U_LOP5 LP5, 
    mr.U_LOP10 LP10, 
    mr.U_LOP15 LP15,  
    mr.U_LOP25 LP25,  
    mr.U_LOP50 LP50, 
    mr.U_LOP75 LP75, 
    mr.U_LOP85 LP85,  
    mr.U_LOP90 LP90, 
    mr.U_LOP95 LP95,  
    mr.U_HIP5 HP5, 
    mr.U_HIP10 HP10, 
    mr.U_HIP15 HP15,  
    mr.U_HIP25 HP25,  
    mr.U_HIP50 HP50, 
    mr.U_HIP75 HP75, 
    mr.U_HIP85 HP85,  
    mr.U_HIP90 HP90, 
    mr.U_HIP95 HP95,      
    e2att.pname pname, 
    rf1.e2rf1 e2rf1,
    rf1.meanq meanq, 
    null station_id, 
    rf1.demtarea_km2 demtarea,
    rf1.rescode rescode,
    <%=lat%> lat, 
  	<%=lon%> lon  
  FROM
    rf1_streams rf1, 
    e2rf1_attributes e2att, 
    outpiall_v2 mr 
  WHERE 
    rf1.e2rf1 = e2att.e2rf1 AND  
    mr.id = rf1.rf1_wolock_pd AND
    sdo_nn( 
      rf1.geom, 
      SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(<%=dlon%>,<%=dlat%>,NULL),NULL,NULL), 
      'sdo_num_res=1',1
    ) = 'TRUE'
  ) 
  <%} if (datalayers != null && datalayers.indexOf("sites") >= 0 && datalayers.indexOf("streams") >= 0 ) {%>
  UNION ALL
  <%} if (datalayers != null && datalayers.indexOf("sites") >= 0) {%>  
  (
  SELECT
    sdo_nn_distance(1) dist, 
    1 priority, 
    ANN_MEAN_CONC_VAL data, 
    P5_CONC_VAL P5,
    P10_CONC_VAL P10, 
    P15_CONC_VAL P15,     
    P25_CONC_VAL P25, 
    P50_CONC_VAL P50, 
    P75_CONC_VAL P75,
    P85_CONC_VAL P85,
    P90_CONC_VAL P90, 
    P95_CONC_VAL P95, 
    P5_CONC_VAL LP5,
    P10_CONC_VAL LP10, 
    P15_CONC_VAL LP15,     
    P25_CONC_VAL LP25, 
    P50_CONC_VAL LP50, 
    P75_CONC_VAL LP75,
    P85_CONC_VAL LP85,
    P90_CONC_VAL LP90, 
    P95_CONC_VAL LP95, 
    P5_CONC_VAL HP5,
    P10_CONC_VAL HP10, 
    P15_CONC_VAL HP15,     
    P25_CONC_VAL HP25, 
    P50_CONC_VAL HP50, 
    P75_CONC_VAL HP75,
    P85_CONC_VAL HP85,
    P90_CONC_VAL HP90, 
    P95_CONC_VAL HP95,     
    place_name pname, 
    null e2rf1, 
    null meanq, 
    station_id station_id, 
    null demtarea, 
    null rescode,
    a.geom.sdo_point.y lat, 
    a.geom.sdo_point.x lon  
  FROM 
    warp_sites a
  WHERE 
    sdo_nn( 
      geom,
      mdsys.sdo_geometry( 
        2003, 
        8307, 
        NULL, 
        mdsys.sdo_elem_info_array(1,1003,3), 
        mdsys.sdo_ordinate_array(<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>)
      ), 
      'sdo_num_res=1',1 
    ) = 'TRUE'
  )
  <%}%>
) 
ORDER BY
  dist, priority desc
<%} else if ("basin_outline".equals(query_id)) { 
  String e2rf1_id = request.getParameter("e2rf1_id");
  String bbox = request.getParameter("BBOX");
  
  //test for sql injection--
  if (!SQLInjectionTest.testInteger(e2rf1_id)) {e2rf1_id = "-1"; }
  if (!SQLInjectionTest.testBBox(bbox)) {bbox = "0,0,0,0"; }
%>
SELECT 
  cum_catch_geom geom 
FROM 
  rf1_streams r 
WHERE 
  r.e2rf1 = <%=e2rf1_id%> 
<%} else if ("mbr".equals(query_id)) { 
  String e2rf1_id = request.getParameter("e2rf1_id");
%>
SELECT 
  SDO_GEOM.SDO_MIN_MBR_ORDINATE(geom, 1) || ',' ||  SDO_GEOM.SDO_MIN_MBR_ORDINATE(geom, 2) || ',' ||
  SDO_GEOM.SDO_MAX_MBR_ORDINATE(geom, 1) || ',' || SDO_GEOM.SDO_MAX_MBR_ORDINATE(geom, 2) mbr   
FROM ( 
  SELECT 
    cum_catch_geom geom 
  FROM 
    rf1_streams 
  WHERE 
    e2rf1 = <%=e2rf1_id%>   
)
<%}%>