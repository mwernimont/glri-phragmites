package gov.usgs;

import gov.usgs.cida.proxy.PathPreservingProxyServlet;
import java.net.HttpURLConnection;
import javax.servlet.http.HttpServletResponse;

/**
 * A proxy that preserves the extra url path and forces the results to be downloaded.
 * 
 * Handy for talking to MS servers that don't add the correct header for this.
 * 
 * @author eeverman
 */
public class ForceDownloadProxy extends PathPreservingProxyServlet {
    private static final long serialVersionUID = 2L;

	private static final String CONTENT_DEP = "Content-Disposition";
	
	
	@Override
	protected void copyHeaders(HttpURLConnection urlConn, HttpServletResponse response) {
		super.copyHeaders(urlConn, response);
		
		String orgVal = urlConn.getHeaderField(CONTENT_DEP);
		
		if (orgVal == null || ! orgVal.contains("attachment")) {
			response.setHeader("Content-Disposition", "attachment");
		} else {
			//The header was already set.  Don't re-set b/c the original one
			//likely had a file name specified, which we don't know.
		}
		
	}
 }