package gov.usgs.warp;


import java.io.IOException;

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

public class HelpTipServlet extends HttpServlet {

  public void doGet(HttpServletRequest request, 
                    HttpServletResponse response) throws ServletException, IOException {
    doPost(request,response);
  }

  public void doPost(HttpServletRequest request, 
                     HttpServletResponse response) throws ServletException, IOException {
                     
  	
  	String tipID = request.getParameter("id");
    response.setContentType("text/xml");
    ServletOutputStream os = response.getOutputStream();
                                     
    StringBuilder responseXML = new StringBuilder("<helptip id=\"" + tipID + "\">");
    
    Statement statement = null;
    ResultSet rset = null;
    Connection connection = null;  

    //run the query
    try {
      Context ctx = new InitialContext();
      DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/warpDS");
      connection = ds.getConnection();
      statement = connection.createStatement();
      rset = statement.executeQuery("select title, text from help_tips where id=" + tipID);      
      
      if (rset.next()) {
      	responseXML.append("<title><![CDATA[" + rset.getString("title") + "]]></title>");
      	responseXML.append("<text><![CDATA[" + rset.getString("text") + "]]></text>");        
      } else {
      	responseXML.append("<error>no tip exists for this ID</error>");
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

		responseXML.append("</helptip>");
		os.println(responseXML.toString());
		
		os.flush();         
  }
}