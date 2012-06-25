
GLRI.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now

GLRI.ui.initMap = function() {
	GLRI.ui.map.mainMap = new OpenLayers.Map("map-area", {
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.ScaleLine(),
            // Trying new controls ... need to talk to J.L. about this
        ],
        // Got this number from Hollister, and he's not sure where it came from.
        // Without this line, the esri road and relief layers will not display
        // outside of the upper western hemisphere.
        maxResolution: 1.40625/2
    });
	
	for (var i = 0; i < GLRI.ui.map.baseLayers.length; i++){
		var baseLayer = new GLRI.ui.map.baseLayers[i].type(
				GLRI.ui.map.baseLayers[i].name,
				GLRI.ui.map.baseLayers[i].url,
	            {
					isBaseLayer: true,
					layers: GLRI.ui.map.baseLayers[i].layers,
				},
				{
					singleTile: true
				}
	        );
		GLRI.ui.map.mainMap.addLayer(baseLayer);
	}
	// First sort habitat and network layers by drawingOrder
	var layersToAdd = GLRI.ui.map.habitatLayers.concat(GLRI.ui.map.networkLayers);
    layersToAdd.sort(function(a,b){
		if (a.drawingOrder < b.drawingOrder) {
			return -1;
		}
		else if (a.drawingOrder > b.drawingOrder) {
			return 1;
		}
		else {
			return 0;
		}
	});
    
	// Add the sorted layers with visibility off.
	for (var j = 0; j < layersToAdd.length; j++){
		var thisLayer = layersToAdd[j];
		GLRI.ui.map.mainMap.addLayer(new thisLayer.type(
				thisLayer.name,
				thisLayer.url,
				{
					layers: thisLayer.layers,
					transparent: true,
				},
				{
					displayInLayerSwitcher: false,
					singleTile: true,
					visibility: false
				})
		);
	}
	GLRI.ui.map.mainMap.zoomTo(5);
	GLRI.ui.map.mainMap.panTo(new OpenLayers.LonLat(-84, 45));
};

GLRI.ui.getLayerByName = function(name, layers) {
	// Returns the layer in layers that matches name. Return nothing if there is no match
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name){
			return layers[i];
		}
	}
	return;
};

GLRI.ui.toggleLayerMap = function(name, on){
	// Set the visibility of the layers in mainMap whose name matches "name" to on.
	var layerList = GLRI.ui.map.mainMap.getLayersByName(name);
	for (var i=0; i < layerList.length; i++){
		layerList[0].setVisibility(on);
	}
	return;
};

GLRI.ui.turnOnLayerMap = function(name, layers){
	// Set visibility to on the layer matching name in layers to the map. 
	// All other layers in should be turned off that are in the layers array.
	for (var i = 0; i < layers.length; i++){
		var layerList = GLRI.ui.map.mainMap.getLayersByName(layers[i].name);
		for (var j = 0; j < layerList.length; j++) {
			layerList[j].setVisibility(layers[i].name == name);
		}
	}
	return;
};

GLRI.ui.getLegendWithHeaderHtml = function(legend /* array object with name and imgHtml properties*/) {
	return '<p><b>' + legend.name + '</b></p>' + legend.imgHtml + '<br />';
};

GLRI.ui.turnOnLegend = function(name, layers, div_id){
	// Show the legend information for the layer in layers with a name equal to name in the div element, div_id.
	// If name doesn't exist in layers, then set the div element to null string.
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name) {
			var legendHtml = '';
			for (var j = 0; j < layers[i].legend.length; j++){
				legendHtml = legendHtml + GLRI.ui.getLegendWithHeaderHtml(layers[i].legend[j]) + '<br />';
			}
			document.getElementById(div_id).innerHTML = legendHtml;
			return;
		}
	}
	document.getElementById(div_id).innerHTML='';
	return;
};

GLRI.ui.toggleLegend = function(name, layers, on) {
	// If on is true, retrieve the legend for the layer in layers that matches name, and
	// assign it to that layer's div element. If false, set the layer's div element to 
	// the null string.
	var thisLayer = GLRI.ui.getLayerByName(name, layers);
	var divEl = document.getElementById(thisLayer.legendDivId);
	
	if (on) {
		divEl.innerHTML = GLRI.ui.getLegendWithHeaderHtml(thisLayer.legend) + '<br />';		
	}
	else {
		divEl.innerHTML = '';
	}
	return;
};
