package gov.usgs.warp;


import java.io.IOException;


import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MVServlet extends HttpServlet {

  public static int index = 0;



  public void doGet(HttpServletRequest request, 
                    HttpServletResponse response) throws ServletException, IOException {
    doPost(request,response);
  }

  public void doPost(HttpServletRequest request, 
                     HttpServletResponse response) throws ServletException, IOException { 

    response.setContentType("image/png");   


    String servlet_path = request.getServletPath();
                                          
    String base_query_path = request.getParameter("base_query_path");
    String bbox = request.getParameter("BBOX");
    String width = request.getParameter("width");
    String height = request.getParameter("height");
    String style = request.getParameter("style");
    String query_string = request.getQueryString(); //pass this to base_query
     
    ServletOutputStream os = response.getOutputStream();
    
    
    //get query to send in map request
    String mapQuery = "";
    try {
    	URL mapQueryUrl = new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/" + base_query_path);
    	
    	mapQuery = URLUtil.getStringFromURL(mapQueryUrl.toExternalForm() + ";jsessionid=" + request.getSession().getId(), query_string);
    	
    } catch (Exception e) {
    	e.printStackTrace();
    	return;
    	
    }
 
    //get xml request that goes to mapviewer
    String maprequest = "";
    
    //see if request is for map image or legend image
    if ("/mvwms".equals(servlet_path)) {
      //only cache larger area tiles
      maprequest = getMapImageXML(width, height, bbox, style, mapQuery);
    } else if ("/mvlegend".equals(servlet_path)) {
      maprequest = getMapLegendXML(style, request);
    }
  
    
    //System.out.println(maprequest);
    
    
    //write image out from servlet
    try {
    	URLUtil.writeBytesToOutputStream("http://maptrek.er.usgs.gov/mapviewer_dev/omserver","xml_request=" + maprequest, os);
 
    } catch (Exception e) {
    	e.printStackTrace();
    	return;
    }  
  }
  
  
  private String getMapImageXML(String width, String height, String bbox, String style, String query) {
    return "<?xml version=\"1.0\" standalone=\"yes\"?> " + 
    "       <map_request " + 
    "         datasource=\"warp\" " + 
    "         srid=\"8307\" " + 
    "         width=\"" + width + "\" " + 
    "         height=\"" + height + "\" " + 
    "         bgcolor=\"#ffffff\" " + 
    "         transparent=\"true\" " + 
    "         antialiase=\"true\" " + 
    "         format=\"PNG8_STREAM\"> " + 
    "           <box> \n" + 
    "             <coordinates>" + bbox + "</coordinates> " + 
    "           </box> " + 
    "           <themes> " + 
    "             <theme name=\"warp_query\"> " + 
    "               <jdbc_query " + 
    "                 spatial_column=\"geom\" " + 
    "                 render_style=\"" + style + "\" " + 
    "                 jdbc_srid=\"8307\" " + 
    "                 datasource=\"warp\" " + 
    "                 asis=\"true\">" + 
                      query +
    "                </jdbc_query> " + 
    "              </theme> " + 
    "            </themes> " + 
    "            <styles> " + 
    "             <style name=\"" + style + "\"> " + 
    "             </style> " + 
    "            </styles>" + 
    "        </map_request>"; 
  }
  
  
  
  private String getMapLegendXML(String style, HttpServletRequest request) {
  
  
    String title = "Legend";    
    
    if ("L.BASIN_OUTLINE".equals(style)) {
      title = "Basin Outline";
    }
  
  
    return "<?xml version=\"1.0\" standalone=\"yes\"?>" +
    " <map_request " +
    "     datasource=\"warp\" " +
    "     bgcolor=\"#ffffff\" " +
    "     antialiase=\"false\" " +
    "     format=\"PNG8_STREAM\">" +
    "   <legend " +
    "       bgstyle=\"fill:#fffff8;fill-opacity:255;stroke:#ffffff\" " +
    "       position=\"SOUTH_WEST\" " +
    "       profile=\"MEDIUM\">" +
    "     <column>" +
    "       <entry is_title=\"true\" text=\"" + title + "\"/>" +
    "				<entry style=\"" + style + "\"/>" +
    "     </column>" +
    "   </legend>" +
    " </map_request>";
    
  }   
}