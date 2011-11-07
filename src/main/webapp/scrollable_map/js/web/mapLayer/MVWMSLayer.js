/**
 * @author johnhollister
 * 
 * @augments	JMap.web.mapLayer.Layer
 * @constructor
 */
JMap.web.mapLayer.MVWMSLayer = function(params) {
	//call base class
	JMap.web.mapLayer.Layer.call(this,params);
	this.serviceType = 'wms';
}


//inherit prototype from Layer
JMap.web.mapLayer.MVWMSLayer.prototype = new JMap.web.mapLayer.Layer();


//redefine getSource method
JMap.web.mapLayer.MVWMSLayer.prototype.getSourceURL = function(x, y) {
	var src = this.baseUrl;
	if (src.indexOf('?') == -1) {
		src += '?';
	} else if (src.indexOf('?') != src.length - 1) {
		src += '&';
	}
	
	var xmin = this.map.projection.getLonFromX(((x) * this.map.tileSize) - this.overlapX);
	var xmax = this.map.projection.getLonFromX(((x + 1) * this.map.tileSize) + this.overlapX);
	var ymin = this.map.projection.getLatFromY(((y) * this.map.tileSize) - this.overlapY);
	var ymax = this.map.projection.getLatFromY(((y + 1) * this.map.tileSize) + this.overlapY);
	
	//convert to mercator meters
	if (this.srs == 3785) {
		var min = JMap.util.degreesToMercatorMeters(ymin, xmin);
		xmin = min.x;
		ymin = min.y;
		
		var max = JMap.util.degreesToMercatorMeters(ymax, xmax);
		xmax = max.x;
		ymax = max.y;
	}
	var src = 'request=GetMap';
	src += '&datasource=' + this.datasource;
	src += '&srs=EPSG:' + this.srs;
	src += '&version=' + this.version;
	src += '&layers=' + this.layersUrlParam;
	src += "&BBOX=" + xmin + "," + ymin + "," + xmax + "," + ymax;
	src += "&width=" + (this.map.tileSize - (this.overlapX * -2));
	src += "&height=" + (this.map.tileSize - (this.overlapY * -2));           
	src += '&transparent=true';
	src += '&format=' + this.format;    

	return src;
}