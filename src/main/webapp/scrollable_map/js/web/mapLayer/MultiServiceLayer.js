/**
 * Layer represents a WMS + HTML layer in the map.
 * 
 * @param {JSON} params	JSON object defining various datamembers in this layer
 * @constructor
 */
JMap.web.mapLayer.MultiServiceLayer = function(params) {

	this.params = params;
	
	if (params != undefined) {
		this.map = params.map;
		this.id = params.id;
		this.title = params.title;
		this.name = params.name;
		this.scaleMin = (params.scaleMin||0);
		this.scaleMax = (params.scaleMax||100);
		
		this.opacity = (params.opacity||100);
		this.legendUrl = params.legendUrl;
		this.metaUrl = params.metaUrl;
		this.description = params.description;
		this.classTheme = params.classTheme;
		this.className = params.className;
		this.sld = params.sld;
		this.overlap = (params.overlap || 0);
		this.customParams = params.customParams;
		
		this.scaleMin = (params.scaleMin);
		this.scaleMax = (params.scaleMax);
		this.minZoom = (params.minZoom);
		this.maxZoom = (params.maxZoom);
		if (this.map) {
			if (this.scaleMin == undefined && this.maxZoom == undefined) {
				this.maxZoom = this.map.maxZoom;
			}
			if (this.scaleMax == undefined && this.minZoom == undefined) {
				this.minZoom = this.map.minZoom;
			}
		} else {
			this.scaleMin = 0;
			this.scaleMax = 10;
		}
		
		this.isHiddenFromUser = (params.isHiddenFromUser||false);
		this.isOnByDefault = params.isOnByDefault;
		if (params.isOnByDefault == undefined) {
			this.isOnByDefault = true;
		}
		
		this.cacheLayer = params.cacheLayer;
		if (params.cacheLayer == undefined) {
			this.cacheLayer = true;
		}
		
		this.mapLayers = params.layers;
		for (var i = 0; i < this.mapLayers.length; i++) {
			this.mapLayers[i].isHiddenFromUser = true;
			this.mapLayers[i].map = this.map;
		}
	}
	//this.syncWithMapCoordinates();
}



JMap.web.mapLayer.MultiServiceLayer.prototype._createLayerHTML = function() {}


/**
 * Insert the HTML from this layer into the web page.
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.activate = function() {
	this.syncWithMapCoordinates();
}



/**
 * "Undraw" this layer from the map, by removing from html
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.deactivate = function() {
	var scale = this.map.getScale();
	for (var i = 0; i < this.mapLayers.length; i++) {
		var l = this.mapLayers[i];
		this.map.removeLayer(l);
	}
}




/**
 * Refreshes all the map tiles in this layer.
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.draw = function() {}


/**
 * sets all the map tiles' image source attribute to a blank gif, but leaves the HTML on the page
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.clear = function() {}


/**
 * create url for src of image and return
 * 
 * @return	URL src of map tile image
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.getSourceURL = function(x, y) {}


/**
 * Set the opacity (transparency) value of the layer.
 * 
 * @param {int} opacity	opacity value - 0 (invisible) to 100 (opaque).
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	for (var i = 0; i < this.mapLayers.length; i++) {
		var ml = this.mapLayers[i];
		ml.opacity = opacity;
		if (ml && ml.mapLayer) {
			ml.setOpacity(opacity);
		}
	}
}




/**
 * shift all the tiles by dx/dy tile widths/heights when the map cycles
 *
 *@param dx  number of tile widths to shift all map tiles in this layer in the x direction
 *@param dy  number of tile heights to shift all map tiles in this layer in the y direction
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.mapTileCycle = function(dx, dy) {}



/**
 * sync this layer with the current coordinates of map
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.syncWithMapCoordinates = function() {
	
	//TOGGLE LAyerS HERE
	var scale = this.map.getScale();
	//console.log(scale + " : " + this.map.zoom);
	for (var i = 0; i < this.mapLayers.length; i++) {
		var l = this.mapLayers[i];
		//console.log(l.minZoom + ' <= ' + this.map.zoom + ' && ' + l.maxZoom + ' >= ' + this.map.zoom + " :: " + this.map.layerManager.isLayerAvailable(l));
		if (this.map.layerManager.isLayerAvailable(l)) {
			//console.log(l.zDepth + " : " + l.baseUrl);	
			this.map.appendLayer(l);
		} else {
			this.map.removeLayer(l);
		}
	}
}


/**
 * get constructor params to use a JSON object defining layer
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.getLayerAsJSON = function() {}


/**
 * Remove all HTML etc from this layer.
 */
JMap.web.mapLayer.MultiServiceLayer.prototype.kill = function() {}
