package gov.usgs.warp;

//import gov.usgswim.util.shapefile.ESRIShapefile;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.naming.Context;
import javax.naming.InitialContext;

import javax.servlet.*;
import javax.servlet.http.*;

import javax.sql.DataSource;

import oracle.spatial.geometry.JGeometry;
//import oracle.sql.STRUCT;


public class ExportServlet extends HttpServlet {
  private static final String CONTENT_TYPE = "text/html; charset=windows-1252";
  private static final String KML_CONTENT_TYPE = "application/vnd.google-earth.kmz";
  private static final String SHP_CONTENT_TYPE = "application/zip";
  final String NL = "\n";
  final String TAB = "\t"; 
  
  String baseQueryPath = "";
  String mapText = "";
  URL legendUrl = null;
  
  
  public void doGet(HttpServletRequest request, 
                    HttpServletResponse response) throws ServletException, IOException {
                         
    String exportType = request.getParameter("export");
    //float mapscale = (new Float(request.getParameter("mapscale"))).floatValue();
    ServletOutputStream os = response.getOutputStream();    
    baseQueryPath = request.getParameter("base_query_path");
    //outputText = "Annual Statistic: " + model_output;    
    if ("_conc".equals(baseQueryPath)) {
      mapText = "Predicted Atrazine Concentration (ug/L) <br/>Annual Statistic: " + request.getParameter("model_output");
    } else if ("_prob".equals(baseQueryPath)) {
      mapText = "Probability Exceeds Benchmark " + request.getParameter("threshold") + "ug/L";
    }
    
    legendUrl = new URL(request.getParameter("legend_url"));

    
       
    //if (mapscale < 0.0102273)  {

    
	    //get export query
	    String exportQuery = "";
	    try {
	    	URL exportQueryUrl = new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/" + baseQueryPath + "/base_query.jsp;jsessionid=" + request.getSession().getId());
	    	exportQuery = URLUtil.getStringFromURL(exportQueryUrl.toExternalForm(), request.getQueryString() + "&query_id=export");
	    } catch (Exception e) {
	    	e.printStackTrace();
	    	return;
	    	
	    }
	    
	    //execute query
	    Statement statement = null;
	    ResultSet rset = null;
	    Connection connection = null;
	    
	    try {
	      Context ctx = new InitialContext();
	      DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/warpDS");
	      connection = ds.getConnection();
	      statement = connection.createStatement();
	      
	      rset = statement.executeQuery(exportQuery);
	      	    
	      if ("kml".equals(exportType)) {
	      	response.setContentType(KML_CONTENT_TYPE);
	        response.setHeader("Content-Disposition", "attachment; filename=warp.kmz");
	        exportToKML(rset, os);
	      } else if ("shp".equals(exportType)) {
	      	response.setContentType(SHP_CONTENT_TYPE);
	        response.setContentType("application/zip");
	        response.setHeader("Content-Disposition", "attachment; filename=warp_shapefiles.zip");
	        exportToSHP(rset, os);
	      }	      

				statement.close();
				statement = null;
				rset.close();  
				rset = null;
				connection.close();  
				connection = null;
				
			} catch (Exception e) {
				
				System.out.println("warpapp - export servlet - query data retrieved failed");    
				System.out.println(e.getMessage());
				e.printStackTrace();
			} finally {
		    if (rset != null) {
		      try { rset.close(); } catch (SQLException e1) { ; }
		      rset = null;
		    }
		    if (statement != null) {
		      try { statement.close(); } catch (SQLException e2) { ; }
		      statement = null;
		    }
		    if (connection != null) {
		      try { connection.close(); } catch (SQLException e3) { ; }
		      connection = null;
		    }
			}  /*
    } else {
      response.setContentType("text/html");
      os.print("<h1>Export data set was too large.  Zoom in and try again.</h1><br/>");
      os.print("<a href=\"#\" onclick=\"window.close(); return false;\">Close Window</a>");
    }
    */
  }
  
  
  
  
  public void exportToKML(ResultSet rset, ServletOutputStream os) throws Exception {

//  	String[] binColors = {"gray","blue","light_blue","yellow","orange","red"};
//  	String[] predictedBinVals = {"Model Estimate Unavailable","&lt; 0.001", "0.001 - 0.038", "0.039 - 0.150", "0.151 - 1.026", "&gt; 1.026"};
//  	String[] probabilityBinVals = {"Model Estimate Unavailable",null,"&lt; 5%", "5 - 25%","25 - 50%", "&gt; 50%"};
//  	
//  	ZipOutputStream zos = new ZipOutputStream(os);
//  	zos.putNextEntry(new ZipEntry("warp.kml"));
//    String startKML = "<kml>" + NL + TAB + "<Document>" + NL;
//  	zos.write(startKML.getBytes()); 
//
//    		
//  	
//  	StringBuffer kmlStyles = new StringBuffer();
//  	
//  	
//  	kmlStyles.append(TAB + TAB + "<ScreenOverlay>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<name>Legend</name>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<Icon>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + TAB + "<href>" + legendUrl.toExternalForm().replaceAll("&","&amp;") + "</href>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "</Icon>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<overlayXY x=\"0\" y=\"1\" xunits=\"fraction\" yunits=\"fraction\"/>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<screenXY x=\"0\" y=\"1\" xunits=\"fraction\" yunits=\"fraction\"/>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<rotationXY x=\"0\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"/>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<size x=\"0\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"/>" + NL);
//  	kmlStyles.append(TAB + TAB + "</ScreenOverlay>" + NL);     
//  	
//  	
//  	
//  	kmlStyles.append(TAB + TAB + "<Style id=\"black\">" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//  	kmlStyles.append(TAB + TAB + TAB + TAB + "<color>ff000000</color>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + TAB + "<width>1</width>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//  	kmlStyles.append(TAB + TAB + "</Style>" + NL);
//  	kmlStyles.append(TAB + TAB + "<Style id=\"gray\">" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//  	kmlStyles.append(TAB + TAB + TAB + TAB + "<color>ff555555</color>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + TAB + "<width>3</width>" + NL);
//  	kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//  	kmlStyles.append(TAB + TAB + "</Style>" + NL);
//    kmlStyles.append(TAB + TAB + "<Style id=\"blue\">" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<color>ffff3300</color>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<width>1</width>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//    kmlStyles.append(TAB + TAB + "</Style>" + NL);
//    kmlStyles.append(TAB + TAB + "<Style id=\"light_blue\">" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<color>fff49060</color>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<width>1</width>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//    kmlStyles.append(TAB + TAB + "</Style>" + NL);
//    kmlStyles.append(TAB + TAB + "<Style id=\"yellow\">" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<color>ff00ffff</color>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<width>1</width>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//    kmlStyles.append(TAB + TAB + "</Style>" + NL);    
//    kmlStyles.append(TAB + TAB + "<Style id=\"orange\">" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<color>ff60a8ff</color>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<width>1</width>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//    kmlStyles.append(TAB + TAB + "</Style>" + NL);
//    kmlStyles.append(TAB + TAB + "<Style id=\"red\">" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "<LineStyle>" + NL);    
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<color>ff1818d0</color>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + TAB + "<width>1</width>" + NL);
//    kmlStyles.append(TAB + TAB + TAB + "</LineStyle>" + NL);
//    kmlStyles.append(TAB + TAB + "</Style>" + NL);    
//  	zos.write(kmlStyles.toString().getBytes());
//   	
//
//    while (rset.next()) {
//      STRUCT st = (STRUCT) rset.getObject("geom");
//      JGeometry j_geom = JGeometry.load(st);
//      j_geom.setType(JGeometry.GTYPE_CURVE);
//      double[] points = j_geom.getOrdinatesArray();
//      String name = rset.getString("name");
//      int binIdx = rset.getInt("bin");
//      
//      StringBuffer bw = new StringBuffer();
//      bw.append(TAB + TAB + "<Placemark>" + NL);
//      bw.append(TAB + TAB + TAB + "<name>" + name.replaceAll("&","and") + "</name>" + NL);
//    	if ("_conc".equals(baseQueryPath)) {
//        bw.append(TAB + TAB + TAB + "<description><![CDATA[<b>Range: " + predictedBinVals[binIdx] + "</b><br/>" + mapText + "]]></description>" + NL);
//    	} else if ("_prob".equals(baseQueryPath)) {
//        bw.append(TAB + TAB + TAB + "<description><![CDATA[<b>Range: " + probabilityBinVals[binIdx] + "</b><br/>" + mapText + "]]></description>" + NL);
//    	}
//      bw.append(TAB + TAB + TAB + "<styleUrl>" + binColors[binIdx] + "</styleUrl>" + NL);
//      bw.append(TAB + TAB + TAB + "<LineString>" + NL);
//      bw.append(TAB + TAB + TAB + TAB + "<tessellate>1</tessellate>" + NL);        
//      bw.append(TAB + TAB + TAB + TAB +  "<coordinates>");
//      for (int i = 0; i < points.length; i++) {
//        bw.append(String.valueOf(points[i]));
//        if ((i % 2) == 1) {
//          bw.append(",0");
//        }
//        if (i < points.length - 1) {
//          bw.append(",");
//        }        
//      }     
//      bw.append("</coordinates>" + NL);        
//      bw.append(TAB + TAB + TAB + "</LineString>" + NL);
//      bw.append(TAB + TAB + "</Placemark>" + NL);
//      
//      zos.write(bw.toString().getBytes());
//      
//    }
//  	
//    String endKML = TAB + "</Document>" + NL + "</kml>";
//    zos.write(endKML.getBytes());
//    
//    zos.flush();
//    zos.close();
  
  }
  
  
  
  
  
  
  
  
  public void exportToSHP(ResultSet rset, ServletOutputStream os) throws Exception {
  	/*
  	
    String fn = "warp_shapefiles";
    String uid = "_" + System.currentTimeMillis();
   
    ESRIShapefile shapefile = new ESRIShapefile(fn + uid);
    
    shapefile.addColumn("Reach_Name", 'C');
    
    shapefile.addColumn("Pred_MEAN", 'F');
    shapefile.addColumn("Lower_MEAN", 'F');
    shapefile.addColumn("Upper_MEAN", 'F');
    
    shapefile.addColumn("Pred_P50", 'F');
    shapefile.addColumn("Lower_P50", 'F');
    shapefile.addColumn("Upper_P50", 'F');
    
    shapefile.addColumn("Pred_P95", 'F');
    shapefile.addColumn("Lower_P95", 'F');
    shapefile.addColumn("Upper_P95", 'F');

    //shapefile.addColumn("Prob_MEAN%", 'F');
    
    
    shapefile.addColumn("Atr_Use", 'F');
    shapefile.addColumn("R_Factor", 'F');
    shapefile.addColumn("K_Factor", 'F');
    shapefile.addColumn("DUNNE_%", 'F');    
    shapefile.addColumn("DRAIN_AREA", 'F');    

  	
    while (rset.next()) {
      STRUCT st = (STRUCT) rset.getObject(1);
      JGeometry j_geom = JGeometry.load(st);
      j_geom.setType(JGeometry.GTYPE_CURVE);
      double[] points = j_geom.getOrdinatesArray();
      double val = rset.getDouble(2);      
      String name = rset.getString(3);
      
      shapefile.addLineString(points, new Object[] {
          rset.getString("data"),
          new Float(rset.getString(2)), 
          new Float(rset.getString(3)), 
          new Float(rset.getString(4)), 
          new Float(rset.getString(5)),
          new Float(rset.getString(6)), 
          new Float(rset.getString(7)), 
          new Float(rset.getString(8)), 
          new Float(rset.getString(9)),
          new Float(rset.getString(10)),
          //prob_mean,
          new Float(rset.getString(12)),
          new Float(rset.getString(13)),
          new Float(rset.getString(14)),
          new Float(rset.getString(15)),
          new Float(rset.getString(16))      
      });
      
      
    } 
    
    
    shapefile.writeShapefilesUnzipped();

    ServletContext sc = this.getServletContext();
    String prjfn = sc.getRealPath(fn + ".prj");
    
    
    //copy prj files so they have the same name as rest of shapefile set
    File srcprj = new File(prjfn);
    File dstprj = new File(fn + uid + ".prj");
    
    InputStream fin = new FileInputStream(srcprj);
    OutputStream fout = new FileOutputStream(dstprj);
    
    // Transfer bytes from in to out
    byte[] buf = new byte[1024];
    int len;
    while ((len = fin.read(buf)) > 0) {
        fout.write(buf, 0, len);
    }
    fin.close();
    fout.close();    
    
    (new ESRIShapefile("")).writeZipFiles(new String[] {fn + uid + ".prj", fn + uid + ".shx", fn + uid + ".shp", fn + uid + ".dbf"}, os);
    (new File(fn + uid + ".shx")).delete();
    (new File(fn + uid + ".shp")).delete();
    (new File(fn + uid + ".dbf")).delete();
    dstprj.delete();
    */
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
/*
  
  public void exportToShapeFile(HttpServletRequest request, 
                     HttpServletResponse response) throws ServletException, IOException {  
                     
    response.setContentType("application/zip");
    response.setHeader("Content-Disposition", "attachment; filename=warp_shapefiles.zip");

    String query_string = request.getQueryString(); //pass this to base_query
    query_string += "&query_id=map";
    
    String base_query_path = "_alldata/base_query.jsp";    
    
    
    
    
    String exportQuery = "";
    try {
    	URL exportQueryUrl = new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/_alldata/base_query.jsp;jsessionid=" + request.getSession().getId());
    	exportQuery = URLUtil.getStringFromURL(exportQueryUrl.toExternalForm(), request.getQueryString() + "&query_id=export");
    } catch (Exception e) {
    	e.printStackTrace();
    	return;
    	
    }
    
    String query = "";
    
    //get query to send in map request
    DataInputStream input = null;
    StringBuffer page = new StringBuffer();
    
    try {
      URL thisUrl = new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/" + base_query_path);
    
      // Get response data.
      input = new DataInputStream(
          makeUrlRequest(thisUrl.toExternalForm(), query_string).getInputStream()
      );
            
      String str = "";
      while (null != ((str = input.readLine()))) {
        page.append(str);
      }
      
      input.close();
    
      query = page.toString();

    } catch (Exception e) {
      e.printStackTrace();
    }    
    
    
    System.out.println(query);
   
    String fn = "warp_shapefiles";
    String uid = "_" + System.currentTimeMillis();
   
    ESRIShapefile shapefile = new ESRIShapefile(fn + uid);
    
    shapefile.addColumn("Reach_Name", 'C');
    
    shapefile.addColumn("Pred_MEAN", 'F');
    shapefile.addColumn("Lower_MEAN", 'F');
    shapefile.addColumn("Upper_MEAN", 'F');
    
    shapefile.addColumn("Pred_P50", 'F');
    shapefile.addColumn("Lower_P50", 'F');
    shapefile.addColumn("Upper_P50", 'F');
    
    shapefile.addColumn("Pred_P95", 'F');
    shapefile.addColumn("Lower_P95", 'F');
    shapefile.addColumn("Upper_P95", 'F');

    //shapefile.addColumn("Prob_MEAN%", 'F');
    
    
    shapefile.addColumn("Atr_Use", 'F');
    shapefile.addColumn("R_Factor", 'F');
    shapefile.addColumn("K_Factor", 'F');
    shapefile.addColumn("DUNNE_%", 'F');    
    shapefile.addColumn("DRAIN_AREA", 'F');    


    Statement statement = null;
    ResultSet rset = null;
    Connection connection = null;
    
    try {
    	Context ctx = new InitialContext();
      DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/warpDS");
      connection = ds.getConnection();
      statement = connection.createStatement();
      rset = statement.executeQuery(query);
      
      
      //retrieve data in to ArrayList to return
      while (rset.next()) {
        STRUCT st = (STRUCT) rset.getObject(1);
        JGeometry j_geom = JGeometry.load(st);
        j_geom.setType(JGeometry.GTYPE_CURVE);
        double[] points = j_geom.getOrdinatesArray();
        
        
        //float prob_mean = (new Float(rset.getString(11)).floatValue() * 100);

        shapefile.addLineString(points, new Object[] {
                rset.getString("data"),
                new Float(rset.getString(2)), 
                new Float(rset.getString(3)), 
                new Float(rset.getString(4)), 
                new Float(rset.getString(5)),
                new Float(rset.getString(6)), 
                new Float(rset.getString(7)), 
                new Float(rset.getString(8)), 
                new Float(rset.getString(9)),
                new Float(rset.getString(10)),
                //prob_mean,
                new Float(rset.getString(12)),
                new Float(rset.getString(13)),
                new Float(rset.getString(14)),
                new Float(rset.getString(15)),
                new Float(rset.getString(16))      
        });
      }     
      rset.close();
      connection.close();
          
    } catch (Exception e) {
      System.out.println("JDBC connection threw an error: " + e.getMessage());
      e.printStackTrace();
      try {
        connection.close();                   
      } catch (Exception ee) { 
        // ignore
      }
    } finally {
       if (rset != null) {
         try {
           rset.close();
         } catch (Exception ee) { 
          // ignore 
         }
       }
       rset = null;
       statement = null;
    } 
    
    
    shapefile.writeShapefilesUnzipped();

    ServletContext sc = this.getServletContext();
    String prjfn = sc.getRealPath(fn + ".prj");
    
    
    //copy prj files so they have the same name as rest of shapefile set
    File srcprj = new File(prjfn);
    File dstprj = new File(fn + uid + ".prj");
    
    InputStream fin = new FileInputStream(srcprj);
    OutputStream fout = new FileOutputStream(dstprj);
    
    // Transfer bytes from in to out
    byte[] buf = new byte[1024];
    int len;
    while ((len = fin.read(buf)) > 0) {
        fout.write(buf, 0, len);
    }
    fin.close();
    fout.close();    
    
    (new ESRIShapefile("")).writeZipFiles(new String[] {fn + uid + ".prj", fn + uid + ".shx", fn + uid + ".shp", fn + uid + ".dbf"}, response.getOutputStream());
    (new File(fn + uid + ".shx")).delete();
    (new File(fn + uid + ".shp")).delete();
    (new File(fn + uid + ".dbf")).delete();
    dstprj.delete();
    
  
  }
  */
  
}
