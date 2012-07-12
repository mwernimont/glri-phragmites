package gov.usgs;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

/**
 *
 * @author isuftin
 */
public class GLRIProxy extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String reqUrl = request.getParameter("url");
        String returnType = StringUtils.trimToEmpty(request.getParameter("url"));
        URL url;
        HttpGet httpGetRequest;
        
        if (StringUtils.isBlank(reqUrl)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parameter URL cannot be blank");
            return;
        }
        reqUrl = URLDecoder.decode(reqUrl, "UTF-8");
        
        try {
            url = new URL(reqUrl);
            httpGetRequest = new HttpGet(url.toURI());
        } catch (MalformedURLException mue) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, mue.getMessage());
            return;
        }catch (URISyntaxException ex) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
            return;
        }
        
        if ("json".equalsIgnoreCase(returnType)) {
            response.setContentType("application/json;charset=UTF-8");
        }else {
            response.setContentType("text/html;charset=UTF-8");
        }
        HttpClient httpClient = new DefaultHttpClient();
        HttpResponse httpResponse = httpClient.execute(httpGetRequest);
        StatusLine statusLine = httpResponse.getStatusLine();
        if (statusLine.getStatusCode() != HttpServletResponse.SC_OK) {
            response.sendError(statusLine.getStatusCode(), statusLine.getReasonPhrase());
        }
        
        response.setStatus(HttpServletResponse.SC_OK);
        ServletOutputStream outputStream = response.getOutputStream();
        IOUtils.copy(httpResponse.getEntity().getContent(), outputStream);
        IOUtils.closeQuietly(outputStream);
        IOUtils.closeQuietly(httpResponse.getEntity().getContent());
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
 }