/**
 * Layer represents a WMS + HTML layer in the map.
 * 
 * @param {JSON} params	JSON object defining various datamembers in this layer
 * @constructor
 */
JMap.web.mapLayer.Layer = function(params) {

	this.mapTiles = [];
	this.mapLayer;
	this.params = params;
	
	if (params != undefined) {
		this.map = params.map;
		this.id = params.id;
		this.title = params.title;
		this.name = params.name;
		
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
		
		this.zDepth = (params.zDepth||0);
		this.opacity = (params.opacity||100);
		this.version = (params.version||'1.1.1');
		this.srs = (params.srs||4326);
		if (params.request) this.request = params.request;
		if (params.format) this.format = params.format;
		this.validBoundingBox = params.validBoundingBox;
		this.layersUrlParam = params.layersUrlParam;
	
		this.legendUrl = params.legendUrl;
		this.metaUrl = params.metaUrl;
		this.description = params.description;
		this.classTheme = params.classTheme;
		this.className = params.className;
		this.sld = params.sld;
		this.overlap = (params.overlap || 0);
		this.customParams = params.customParams;
		
		
		//check for server indexing...
		this.baseUrl = params.baseUrl;
		if (this.baseUrl.indexOf('$[') > 0) {
			var serverIndexes = this.baseUrl.split('$[')[1].split(']')[0];
			this.serverStart = parseInt(serverIndexes.split('-')[0]);
			this.serverEnd = parseInt(serverIndexes.split('-')[1]);

			this.baseUrls = [];		
			var serverBeginPart = this.baseUrl.split('$[')[0];
			var serverEndPart = this.baseUrl.split(']')[1];
			for (var i = this.serverStart; i <= this.serverEnd; i++) {
				this.baseUrls[i - this.serverStart] = serverBeginPart + i + serverEndPart;
			}
			
			this.serverIndex = this.serverStart;

		}
		
		
		//for overlapping images. if symbols are chopped at borders of tiles, this helps
		if (this.overlap) {
			this.overlapX = Math.floor(this.overlap);
			this.overlapY = Math.floor(this.overlap);
		} else {
			this.overlapX = 0;
			this.overlapY = 0;
		}
		
		this.dataSource = params.dataSource;
		this.isHiddenFromUser = (params.isHiddenFromUser||false);
		this.isOnByDefault = params.isOnByDefault;
		if (params.isOnByDefault == undefined) {
			this.isOnByDefault = true;
		}
		
		this.cacheLayer = params.cacheLayer;
		if (params.cacheLayer == undefined) {
			this.cacheLayer = true;
		}
		
		//create the HTML
		if (this.isOnByDefault && this.map) {
			this._createLayerHTML();
		}
	}
}


/**
 * Creates the HTML associated with this layer.
 * 
 */
JMap.web.mapLayer.Layer.prototype._createLayerHTML = function() {

	//the all-containing layer div.  this will hold map tiles of the layer
	this.mapLayer = document.createElement('div');
	this.mapLayer.className = 'map-layer';
	this.mapLayer.style.width = this.map.mapLayerContainer.style.width;
	this.mapLayer.style.height = this.map.mapLayerContainer.style.height;

	//if layer was defined in the WMS XML config file with an opacity tag, then
	//give it some opacity
	if (this.opacity >= 0 && this.opacity < 100) { 
		this.mapLayer.style.opacity = (this.opacity / 100);
		this.mapLayer.style.filter = 'alpha(opacity=' + this.opacity + ')';
	} else {
		this.mapLayer.style.filter = '';
		this.mapLayer.style.opacity = '';
	}

	//create mapTiles
	for (var i = 0; i < this.map.numTilesX; i++) {
		for (var j = 0; j < this.map.numTilesY; j++) {
			this.mapTiles.push(new JMap.web.MapTile({
				layer: this,
				initX: i,
				initY: j
			}));
		}
	}  
}



/**
 * Insert the HTML from this layer into the web page.
 */
JMap.web.mapLayer.Layer.prototype.activate = function() {
	
	//make sure the HTML has been generated for this layer before turning it on
	if (!this.mapLayer) {
		this._createLayerHTML();
	} else {
		//give all the map tiles to proper coordinates if HTML was created prior to this method being called
		for (var i = 0; i < this.mapTiles.length; i++) {
			this.mapTiles[i].syncWithMapCoordinates();
		}
	}
	
	//insert the map layer into the actual HTML
	//first see if it's already inserted in the HTML
	var inserted = false;
	for (var i = 0; i < this.map.layerManager.activeMapLayers.length; i++) {		
		if (parseInt(this.zDepth,10) > parseInt(this.map.layerManager.activeMapLayers[i].zDepth,10)) {
			this.map.mapLayerContainer.insertBefore(this.mapLayer, this.map.layerManager.activeMapLayers[i].mapLayer);
			inserted = true;
			break;
		}
	}  

	//If it's not already in the HTML, put it at the (top/bottom)?
	if (!inserted) {
		this.map.mapLayerContainer.appendChild(this.mapLayer);
	}
	
	this.draw();
}



/**
 * "Undraw" this layer from the map, by removing from html
 */
JMap.web.mapLayer.Layer.prototype.deactivate = function() {
	this.map.mapLayerContainer.removeChild(this.mapLayer);
}




/**
 * Refreshes all the map tiles in this layer.
 */
JMap.web.mapLayer.Layer.prototype.draw = function() {
	for (var i = 0; i < this.mapTiles.length; i++) {
		this.mapTiles[i].draw();
	}
}


/**
 * sets all the map tiles' image source attribute to a blank gif, but leaves the HTML on the page
 */
JMap.web.mapLayer.Layer.prototype.clear = function() {
	for (var i = 0; i < this.mapTiles.length; i++) {
		this.mapTiles[i].clear();
	}
}


/**
 * create url for src of image and return
 * 
 * @return	URL src of map tile image
 */
JMap.web.mapLayer.Layer.prototype.getSourceURL = function(x, y) {
	return '';	//dummy method for sub classes
}


/**
 * Set the opacity (transparency) value of the layer.
 * 
 * @param {int} opacity	opacity value - 0 (invisible) to 100 (opaque).
 */
JMap.web.mapLayer.Layer.prototype.setOpacity = function(opacity) {
	if (this.mapLayer) {
		this.opacity = opacity;
		if (this.opacity >= 0 && this.opacity < 100) { 
			this.mapLayer.style.opacity = (this.opacity / 100);
			this.mapLayer.style.filter = 'alpha(opacity=' + this.opacity + ')';
		} else {
			this.mapLayer.style.filter = '';
			this.mapLayer.style.opacity = '';
		}
	}
}




/**
 * shift all the tiles by dx/dy tile widths/heights when the map cycles
 *
 *@param dx  number of tile widths to shift all map tiles in this layer in the x direction
 *@param dy  number of tile heights to shift all map tiles in this layer in the y direction
 */
JMap.web.mapLayer.Layer.prototype.mapTileCycle = function(dx, dy) {

	//IE chokes when moving an element if opacity is set
	if (this.opacity >= 0 && this.opacity <= 100) { 
		this.mapLayer.style.filter = '';
	}

	for (var i = 0; i < this.mapTiles.length; i++) {
		this.mapTiles[i].moveBy(dx, dy);
	}

	if (this.opacity >= 0 && this.opacity < 100) { 
		this.mapLayer.style.filter = 'alpha(opacity=' + this.opacity + ')';
	}
}



/**
 * sync this layer with the current coordinates of map
 */
JMap.web.mapLayer.Layer.prototype.syncWithMapCoordinates = function() {
	for (var i = 0; i < this.mapTiles.length; i++) {
		this.mapTiles[i].syncWithMapCoordinates();
	}
}


/**
 * get constructor params to use a JSON object defining layer
 */
JMap.web.mapLayer.Layer.prototype.getLayerAsJSON = function() {
	return this.params;
}


/**
 * Remove all HTML etc from this layer.
 */
JMap.web.mapLayer.Layer.prototype.kill = function() {
	try {
		this.map.mapLayerContainer.removeChild(this.mapLayer);
	} catch (e) {
		//layer was not appended to DOM
	}
	for (var i = 0; i < this.mapTiles.length; i++) {  
		this.mapTiles[i].kill();    
	}
	this.mapTiles = null;

	//Layer node remove from map
	this.mapLayer = null;
	this.map = null;
}
