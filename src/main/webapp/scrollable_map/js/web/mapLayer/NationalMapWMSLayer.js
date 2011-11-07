
/**
 * @author johnhollister
 * 
 * @augments	JMap.web.mapLayer.Layer
 * @constructor
 */
JMap.web.mapLayer.NationalMapWMSLayer = function(params) {
	this.format = 'png';
	//call base class
	JMap.web.mapLayer.Layer.call(this,params);
}

//inherit prototype from Layer
JMap.web.mapLayer.NationalMapWMSLayer.prototype = new JMap.web.mapLayer.Layer();


JMap.web.mapLayer.NationalMapWMSLayer.prototype.removeSubLayer = function(subId) {
	if (this.layersUrlParam != null) {
		var tmpLayersUrl = '';
		var subList = this.layersUrlParam.split(',')
		if (subList.length > 1) {
			for (var i = 0; i < subList.length; i++) {
				if (parseInt(subId) != parseInt(subList[i])) {
					tmpLayersUrl += subList[i] + ',';
				}
			}
			this.layersUrlParam = tmpLayersUrl.substr(0,tmpLayersUrl.length-1);
		} else {
			this.layersUrlParam = null;
		}
	}
}

JMap.web.mapLayer.NationalMapWMSLayer.prototype.appendSubLayer = function(subId) {
	if (this.layersUrlParam == null) {
		this.layersUrlParam = '' + subId;
	} else {
		//make sure sublayer id isn't already there
		var subList = this.layersUrlParam.split(',');
		for (var i = 0; i < subList.length; i++) {
			if (parseInt(subId) == parseInt(subList[i])) {
				return;	//already there
			}
		}
		this.layersUrlParam += ',' + subId;
		
		//now order them to help with browser caching
		subList = this.layersUrlParam.split(',');
		subList.sort(function(a,b){return a - b});
		this.layersUrlParam = subList.join();
	}
}

//redefine getSource method
JMap.web.mapLayer.NationalMapWMSLayer.prototype.getSourceURL = function(x, y) {
	
	//http://tnm2beta.cr.usgs.gov/ArcGIS/rest/services/NEXRAD_Weather/MapServer/export?f=image&dpi=96&transparent=true&format=png8&bbox={"xmin":-14580819.086008776,"ymin":3323584.22615344,"xmax":-7049421.109385753,"ymax":6493564.19054452,"spatialReference":{"wkid":102113}}&bboxSR=102113&imageSR=102113&size=1397,588
	
	var src = this.baseUrl;
	if (src.indexOf('?') == -1) {
		src += '?';
	} else if (src.indexOf('?') != src.length - 1) {
		src += '&';
	}
	
	var xmin = this.map.projection.getLonFromX(((x) * this.map.tileSize));
	var xmax = this.map.projection.getLonFromX(((x + 1) * this.map.tileSize));
	var ymin = this.map.projection.getLatFromY(((y) * this.map.tileSize));
	var ymax = this.map.projection.getLatFromY(((y + 1) * this.map.tileSize));
	
	var metersMin = JMap.util.degreesToMercatorMeters(ymin, xmin);
	var metersMax = JMap.util.degreesToMercatorMeters(ymax, xmax);
		
	src += 'f=image&dpi=96&transparent=true&format=png8';	
	src += '&bbox={"xmin":' + metersMin.x + ',"ymin":' + metersMin.y + ',"xmax":' + metersMax.x + ',"ymax":' + metersMax.y + ',"spatialReference":{"wkid":102113}}';
	src += '&bboxSR=102113&imageSR=102113';
	if (this.layersUrlParam) src += '&layers=show:' + this.layersUrlParam;
	src += "&size=" + (this.map.tileSize)  + "," + (this.map.tileSize); 
	
	//console.log(src);
	
	return src;
}

