package gov.usgs.warp;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;

import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletOutputStream;


public class URLUtil {

  public static String getStringFromURL(String urlString, String params) throws Exception {
    DataInputStream input = null;
    StringBuffer page = new StringBuffer();
    
    String returnString = "";
    
    //fetch base query
    try {
      // Get response data.
      input = new DataInputStream(
          URLUtil.makeUrlPostRequest(urlString, params).getInputStream()
      );
            
      String str = "";
      while (null != ((str = input.readLine()))) {
        page.append(str);
      }
      
      input.close();
      returnString = page.toString();
    } catch (Exception e) {
      e.printStackTrace();
      System.out.println("Url: " + urlString + "?" + params);
    }      
    
    return returnString;
    
  }
  
  
  

  public static String getStringFromURLGET(String urlString) throws Exception {
    DataInputStream input = null;
    StringBuffer page = new StringBuffer();
    
    String returnString = "";
    
    //fetch base query
    try {
      // Get response data.
      input = new DataInputStream(
          URLUtil.makeUrlGetRequest(urlString).getInputStream()
      );
            
      String str = "";
      while (null != ((str = input.readLine()))) {
        page.append(str);
      }
      
      input.close();
      returnString = page.toString();
    } catch (Exception e) {
      e.printStackTrace();
    }      
    
    return returnString;
    
  }

  
  
  public static void writeBytesToOutputStream(String urlString, String params, ServletOutputStream out) throws Exception {
    DataInputStream input = new DataInputStream(URLUtil.makeUrlPostRequest(urlString, params).getInputStream());
    
    BufferedInputStream buf = new BufferedInputStream(input);
    int readBytes = 0;    
    //read from the file; write to the ServletOutputStream
    while((readBytes = buf.read( )) != -1)
      out.write(readBytes);

    input.close();
  }


  


  private static URLConnection makeUrlPostRequest(String urlString, String params) throws Exception {
  
    URL                 url;
    URLConnection       urlConn;
    DataOutputStream    printout;
    DataInputStream     input = null;  
    try {
      url = new URL(urlString);
      // URL connection channel.
      urlConn = url.openConnection();
      // Let the run-time system (RTS) know that we want input.
      urlConn.setDoInput(true);
      // Let the RTS know that we want to do output.
      urlConn.setDoOutput(true);
      // No caching, we want the real thing.
      urlConn.setUseCaches(false);
      // Specify the content type.
      urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      // Send POST output.
      printout = new DataOutputStream (urlConn.getOutputStream());
                          
      printout.writeBytes(params);
      printout.flush();
      printout.close();     
      
      return urlConn;
    }  catch (Exception e) {
       
      return null;
      
    }
  }
  
  
  private static URLConnection makeUrlGetRequest(String urlString) throws Exception {
    
    URL                 url;
    URLConnection       urlConn;

    try {
      url = new URL(urlString);
      // URL connection channel.
      urlConn = url.openConnection();
      // Let the run-time system (RTS) know that we want input.
      urlConn.setDoInput(true);
      // Let the RTS know that we want to do output.
      urlConn.setDoOutput(true);
      // No caching, we want the real thing.
      urlConn.setUseCaches(false);
      // Specify the content type.
      urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");   
      
      return urlConn;
    }  catch (Exception e) {
       
      return null;
      
    }
  }  
  

}
