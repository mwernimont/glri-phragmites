/**
 * @author johnhollister
 * 
 * @augments	JMap.web.mapLayer.Layer
 * @constructor
 */
JMap.web.mapLayer.NationalMapTileLayer = function(params) {
	this.format = 'png';
		
	//call base class
	JMap.web.mapLayer.Layer.call(this,params);
}

//inherit prototype from Layer
JMap.web.mapLayer.NationalMapTileLayer.prototype = new JMap.web.mapLayer.Layer();

//redefine getSource method
JMap.web.mapLayer.NationalMapTileLayer.prototype.getSourceURL = function(x, y) {
	var src = this.baseUrl + '/' + (this.map.zoom - this.minZoom)  +  '/' + (this.map.getTilesPerMapY() - y - 1) + '/' + x + '.' + this.format;
	return src;
}