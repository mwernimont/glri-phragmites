package gov.usgs.warp;

import java.io.IOException;

import java.net.URL;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.sql.DataSource;

public class IdentifyServlet extends HttpServlet {

	
	
	/*
	 * 	 * 
	 * <identify type="reach|calibration|reservoir|unmodeled|small|nodata">
	 * 	<lat>[point clicked lat]</lat>
	 * 	<lon>[point clicked lon]</lon>
	 * 	<e2rf1>1234</e2rf1>
	 * 	<parameterName>[pname]</parameterName>
	 * 	<basinArea>134</basinArea>
	 * 	<basinMbr>1235123</basinMbr>
	 * 	<mbr>-120,20,-65,75</mbr>
	 * 	<html>
	 * 		[netcharts returned html]
	 * 	</html>
	 * </identify>
	 * 
	 * 
	 */
	
	
	public void doGet(HttpServletRequest request, 
			HttpServletResponse response) throws ServletException, IOException {

		String base_query_path = request.getParameter("base_query_path");
		String datalayers = request.getParameter("datalayers");
				
		ServletOutputStream os = response.getOutputStream();
		response.setContentType("text/xml");

		StringBuilder responseXML = new StringBuilder();
		if ("".equals(datalayers)) {	//no data, no data layer
			
			os.println("<identify type=\"nomap\">");
			os.println(responseXML.toString());
			os.println("</identify>");
			os.flush();
			os.close();
			return;
		} 

		
		//get the query
		URL idQueryUrl = new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/" + base_query_path);
		String query = "";
		try {
			query = URLUtil.getStringFromURLGET(idQueryUrl.toExternalForm() + ";jsessionid=" + request.getSession().getId() + "?" + request.getQueryString() + "&query_id=identify");
		} catch (Exception e) {
			os.println("<identify type=\"error\"/>");
		}

		
		//run the query
		Statement statement = null;
		ResultSet rset = null;
		Connection connection = null; 


		boolean bNotModeled = false;
		boolean bNoData = false;
		double min = 0;
		double max = 0;
		String name = "";
		StringBuilder dataset = new StringBuilder();
		int idType = -1;  //0 is river reach, 1 is calibration site - based on priority column in query
		String idTypeAttr = "";
		String idTypeTitle = "";
		String e2rf1 = "";
		String basinArea = "";
		String pname = "None";
		String meanQ = "";
		String stationId = "";
		double demtarea = 0;
		double rescode = 0;
		
		try {
			Context ctx = new InitialContext();
			DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/warpDS");
			connection = ds.getConnection();
			statement = connection.createStatement();

			rset = statement.executeQuery(query);			
			if (rset.next()) {
				idType = rset.getInt("priority");        
				pname = rset.getString("pname");        
				e2rf1 = rset.getString("e2rf1");
				stationId = rset.getString("station_id");         
				meanQ = rset.getString("meanq");
				demtarea = rset.getDouble("demtarea");
				rescode = rset.getDouble("rescode");
				responseXML.append("<rescode>" + rescode + "</rescode>");
				
				//unmodeled basin
				if ((demtarea < 75.0 && idType == 0) || (rescode > 0 && idType == 0)) {
					bNotModeled = true;
				} else { //this basin is modeled
					
					double P5 = rset.getDouble("P5");
					double P10 = rset.getDouble("P10");
					double P15 = rset.getDouble("P15");
					double P25 = rset.getDouble("P25");
					double P50 = rset.getDouble("P50");
					double P75 = rset.getDouble("P75");
					double P85 = rset.getDouble("P85");
					double P90 = rset.getDouble("P90");
					double P95 = rset.getDouble("P95");
	
					double LP5 = rset.getDouble("LP5");
					double LP10 = rset.getDouble("LP10");
					double LP15 = rset.getDouble("LP15");
					double LP25 = rset.getDouble("LP25");
					double LP50 = rset.getDouble("LP50");
					double LP75 = rset.getDouble("LP75");
					double LP85 = rset.getDouble("LP85");
					double LP90 = rset.getDouble("LP90");
					double LP95 = rset.getDouble("LP95");
					
					double HP5 = rset.getDouble("HP5");
					double HP10 = rset.getDouble("HP10");
					double HP15 = rset.getDouble("HP15");
					double HP25 = rset.getDouble("HP25");
					double HP50 = rset.getDouble("HP50");
					double HP75 = rset.getDouble("HP75");
					double HP85 = rset.getDouble("HP85");
					double HP90 = rset.getDouble("HP90");
					double HP95 = rset.getDouble("HP95");
	 
					//get min/max values from data sets for graphing
					min = Math.min(LP5, Math.min(LP10,Math.min(LP15, Math.min(LP25,Math.min(LP50, Math.min(LP75, Math.min(LP85, Math.min(LP90, LP95))))))));
					max = Math.max(HP5, Math.max(HP10,Math.max(HP15, Math.max(HP25,Math.max(HP50, Math.max(HP75, Math.max(HP85, Math.max(HP90, HP95))))))));
						
					
					responseXML.append("<lat>" + rset.getString("lat") + "</lat>");
					responseXML.append("<lon>" + rset.getString("lon") + "</lon>");		
					responseXML.append("<name><![CDATA[" + rset.getString("pname") + "]]></name>");				
					if (idType == 0) {
						responseXML.append("<basinArea>" + demtarea + "</basinArea>");
					}
	
					dataset.append("LineSet10 = " +
					"(" + P5 + ",5)," +
					"(" + P25 + ",25)," +
					"(" + P50 + ",50)," +
					"(" + P75 + ",75)," +
					"(" + P95 + ",95);");
					dataset.append("LineSet2 = (" + LP5 + ",5),(" + HP5 + ",5);");
					dataset.append("LineSet5 = (" + LP25 + ",25),(" + HP25 + ",25);");
					dataset.append("LineSet6 = (" + LP50 + ",50),(" + HP50 + ",50);");
					dataset.append("LineSet7 = (" + LP75 + ",75),(" + HP75 + ",75);");
					dataset.append("LineSet1 = (" + LP95 + ",95),(" + HP95 + ",95);");
				}
			} else {
				//no data
				bNoData = true;
			}

			statement.close();
			statement = null;
			rset.close();  
			rset = null;
			connection.close();  
			connection = null;
		} catch (Exception e) {
			System.out.println("warpapp - identify servlet - query data retrieved failed");                
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
		}   

		if (bNotModeled) {
			//not modeled
			os.println("<identify type=\"unmodeled\">");
			os.println(responseXML.toString());
			os.println("</identify>");
			os.flush();
			os.close();
			return;
		}
		
		if (bNoData) {
			//not modeled
			os.println("<identify type=\"nodata\">");
			os.println(responseXML.toString());
			os.println("</identify>");
			os.flush();
			os.close();
			return;
		}
		

		if (idType == 0) {
			idTypeAttr = "reach";
			idTypeTitle = "Modeled River Reach\\n(basin area: " + demtarea + " km2)";
			responseXML.append("<meanq>" + meanQ + "</meanq>");
		} else if (idType == 1) {
			idTypeAttr = "site";
			idTypeTitle = "Calibration Site";
		}
		
		//calculate bounds for chart
		double scalemin = 0.00001;
		while (min > scalemin * 10) {
			scalemin *= 10;
		}        
		double scalemax = 10000;
		while (max < scalemax / 10) {
			scalemax /= 10;
		}   

		//retrieve CDL
		StringBuilder cdlArgs = new StringBuilder();
		cdlArgs.append("lineset=" + dataset.toString());
		cdlArgs.append("&name=" + idTypeTitle);
		cdlArgs.append("&scalemin=" + scalemin);
		cdlArgs.append("&scalemax=" + scalemax);


		if (idType != 1) {
			String threshold = request.getParameter("threshold");
			if (threshold == null) threshold = "0.00001";
			cdlArgs.append("&threshold=" + threshold);
		}

		//get cdl as string
		URL cdlTemplateUrl = new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/_cdl/identify_cdl.jsp");
		String cdl = ""; 
		try {
			cdl = URLUtil.getStringFromURL(cdlTemplateUrl.toExternalForm(), cdlArgs.toString());
		} catch (Exception e) {
			os.println("<identify type=\"error\"/>");
			return;
		}
		
		//send cdl to netcharts server
		URL netchartsUrl = new URL("http://infotrek.er.usgs.gov/netchart_server/graph");
		String chartHtml = "";
		try {
			chartHtml = URLUtil.getStringFromURL(netchartsUrl.toExternalForm(), "cdl=" + cdl);
		} catch (Exception e) {
			os.println("<identify type=\"error\"/>");
			return;
		}
		
		responseXML.append("<netchartsHtml><![CDATA[" + chartHtml + "]]></netchartsHtml>");

		//get the modeled reach basin mbr--
		if (idType == 0) {
			String basinMbr = "";
			responseXML.append("<e2rf1>" + e2rf1 + "</e2rf1>");
			responseXML.append("<basinArea>" + basinArea + "</basinArea>");
			
			//let's get this basin's mbr
			URL mbrUrl =  new URL("http",request.getServerName(),request.getServerPort(),request.getContextPath() + "/_identify/base_query.jsp");
			String mbrQuery = "";
			try {
				mbrQuery = URLUtil.getStringFromURLGET(mbrUrl.toExternalForm() + "?query_id=mbr&e2rf1_id=" + e2rf1);
			} catch (Exception e) {
				os.println("<identify type=\"error\"/>");
				return;
			}
   

			//run the query
			try {
				Context ctx = new InitialContext();
				DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/warpDS");
				connection = ds.getConnection();
				statement = connection.createStatement();
				rset = statement.executeQuery(mbrQuery);

				if (rset.next()) {
					responseXML.append("<basinMbr>" + rset.getString("mbr") + "</basinMbr>");
				}
				rset.close();  
				rset = null;
				connection.close();  
				connection = null;
			} catch (Exception e) {
				System.out.println("warpapp - identify servlet - query data retrieved failed");                
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
			}    


		} else if (idType == 1) {
			responseXML.append("<nwisLink>http://waterdata.usgs.gov/nwis/inventory/?site_no=" + stationId + "</nwisLink>");        
		}
		
		os.println("<identify type=\"" + idTypeAttr + "\" title=\"" + idTypeTitle + "\">");
		os.println(responseXML.toString());
		os.println("</identify>");
		os.flush();
		
	}
}
