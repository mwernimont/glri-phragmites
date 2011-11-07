<%
  String query_id = request.getParameter("query_id");
%>
<% if ("map".equals(query_id)) {
  //get query-specific parameters
  String model_output = request.getParameter("model_output");
  String bbox = request.getParameter("BBOX");
%>
SELECT 
  /*+ ordered */ rf1.geom, 
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    bc.mean 
  end mean,    
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    pi.u_lomean 
  end u_lomean, 
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    pi.u_himean 
  end u_himean,     
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    bc.P50 
  end P50,  
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    pi.u_lop50 
  end u_lop50,  
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    pi.u_hip50  
  end u_hip50, 
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    bc.P95  
  end P95,  
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    pi.u_lop95  
  end u_lop95, 
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    pi.u_hip95  
  end u_hip95, 
  case when rf1.demtarea_km2 < 50 then 
    -999.0 
  when rf1.rescode > 0 then 
    -999.0     
  else 
    px.u_mean  
  end u_mean, 
  iv.atr_use, 
  iv.r_factor, 
  iv.k_factor, 
  iv.perdunne, 
  iv.drain_area,  
  rf1.pname data  
FROM 
  rf1_streams rf1, 
  outbcall bc,
  outpxall px,
  e2rf1_input_variables iv,
  outpiall pi 
WHERE 
  rf1.rf1_wolock_pd = pi.id and 
  rf1.rf1_wolock_pd = bc.id and 
  rf1.rf1_wolock_pd = px.id and 
  rf1.rf1_wolock_pd = iv.r2rf1_id and 
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
<%}%>