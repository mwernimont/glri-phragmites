
GLRI.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now

GLRI.ui.map.mercatorProjection = new OpenLayers.Projection("EPSG:900913"); // Use this projection for transformations
GLRI.ui.map.wgs84Projection = new OpenLayers.Projection("EPSG:4326"); // Use this projection for transformations

GLRI.ui.map.setHTML = function (response) {
    alert(response.responseText);
};
GLRI.ui.initMap = function() {
	OpenLayers.ProxyHost = "/glri-phragmites-map/proxy?url=";
	
	var initCenter = new OpenLayers.LonLat(-84, 45);
	
	GLRI.ui.map.mainMap = new OpenLayers.Map("map-area", {
        numZoomLevels: 18,
        center: initCenter.transform(GLRI.ui.map.wgs84Projection, GLRI.ui.map.mercatorProjection),
        units: 'm',
        // Set the maxResolutions and maxExtent as indicated in http://docs.openlayers.org/library/spherical_mercator.html
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,20037508.34, 20037508.34),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.MousePosition({
            	// Defined formatOutput because the displayProjection was not working.
            	formatOutput: function(lonLat){
            		lonLat.transform(GLRI.ui.map.mercatorProjection, GLRI.ui.map.wgs84Projection);
           			return lonLat.toShortString();
           		}
           	}),
            new OpenLayers.Control.ScaleLine()
        ]
    });
	

	// Add base layers to map. Set the projection to the mercator projection in the data layers.
	for (var i = 0; i < GLRI.ui.map.baseLayers.length; i++){
		var baseLayer = new GLRI.ui.map.baseLayers[i].type(
				GLRI.ui.map.baseLayers[i].name,
				GLRI.ui.map.baseLayers[i].url,
	            {
					isBaseLayer: true,
			        sphericalMercator : true,
			        projection: "EPSG:102113",
			        units: "m",
			        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),			        
					layers: GLRI.ui.map.baseLayers[i].layers
				},
				{
					singleTile: true
				}
	        );
		GLRI.ui.map.mainMap.addLayer(baseLayer);
	}
	
	// First sort static, habitat and network layers by drawingOrder
	var layersToAdd = GLRI.ui.map.habitatLayers.concat(GLRI.ui.map.networkLayers, GLRI.ui.map.staticLayers);
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
    
	// Add the sorted layers.
	for (var j = 0; j < layersToAdd.length; j++){
		var thisLayer = layersToAdd[j];
		var wmsLayer = new thisLayer.type(
				thisLayer.name,
				thisLayer.url,
				{
					layers: thisLayer.layers,
					transparent: true
				},
				{
					displayInLayerSwitcher: false,
					singleTile: true,
					visibility: thisLayer.initialOn,
					opacity: thisLayer.opacity
				});				
		GLRI.ui.map.mainMap.addLayer(wmsLayer);
	}

//	var infoControl = new OpenLayers.Control.WMSGetFeatureInfo({
//    	url: GLRI.ui.map.baseUrl,
//   	title: 'Identify features by clicking',
//    	queryVisible: true,
//    	layers: ['Outside study area'], <!-- this has to be a WMSLayer object array
//    	eventListeners: {
//    		getfeatureinfo: function(event) {
//    			GLRI.ui.map.mainMap.addPopup(new OpenLayers.Popup(
//    					"Feature Info",
//    					GLRI.ui.map.mainMap.getLonLatFromPixel(event.xy),
//    					null,
//    					event.text,
//    					true,
//    					null)
//    			);
//    		}
//    	}
//	});
//	GLRI.ui.map.mainMap.addControl(infoControl);
//	infoControl.activate();
	GLRI.ui.map.mainMap.zoomTo(5);
};

GLRI.ui.getLayerByName = function(name, layers) {
	// Return the layer in layers that matches name. Return nothing if there is no match
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name){
			return layers[i];
		}
	}
	return;
};

GLRI.ui.setHelpContext = function(config/* contains a title and content properties */){
	// Set the help section title and content. Add a click event handler to any faq links to set the active tab.
	Ext.getCmp('help-context-panel').setTitle(config.title);
	document.getElementById('help-context-content').innerHTML = config.content;
	
	if (config.faq_link_id) {
		Ext.get(config.faq_link_id).on('click', function() {
			Ext.getCmp('map-and-tabs').setActiveTab('faqs-tab');
			return true;
		});
	}
};

GLRI.ui.toggleLayerMap = function(name, on){
	// Set the visibility of the layers in mainMap whose name matches "name" to on.
	var layerList = GLRI.ui.map.mainMap.getLayersByName(name);
	for (var i=0; i < layerList.length; i++){
		layerList[i].setVisibility(on);
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

GLRI.ui.getLegendWithHeaderHtml = function(legend /* object with name and imgHtml properties*/) {
	return '<p><b>' + legend.name + '</b></p>' + legend.imgHtml + '<br />';
};

GLRI.ui.turnOnLegend = function(name, layers, div_id){
	// Show the legend information for the layer in layers with a name equal to name in the div element, div_id.
	// If name doesn't exist in layers, then set the div element to null string.
	for (var i = 0; i < layers.length; i++){
		if (layers[i].name == name) {
			var legendHtml = '';
			var helpDivs = []; // This collects the divs for which we need to add a click event handler for help
			
			for (var j = 0; j < layers[i].legend.length; j++){
				var thisLegend = layers[i].legend[j];
				if (thisLegend.helpContext) {
					helpDivs.push({div: thisLegend.divId, helpContext: thisLegend.helpContext});
				}
				legendHtml = legendHtml + '<div id="' + thisLegend.divId + '">' + GLRI.ui.getLegendWithHeaderHtml(thisLegend) + '</div><br />';
			}
			document.getElementById(div_id).innerHTML = legendHtml;
			// Add help click handlers
			for (var k = 0; k < helpDivs.length; k++){
				Ext.get(helpDivs[k].div).on('click', function() {
					GLRI.ui.setHelpContext(GLRI.ui.helpContext[this]);
				},
				helpDivs[k].helpContext);
			}
			
			return;
		}
	}
	document.getElementById(div_id).innerHTML='';
	return;
};

GLRI.ui.toggleLegend = function(name, layers, on) {
	// If on is true, retrieve the legend for the layer in layers that matches name, and
	// assign it to that layer's div element. If false, set the layer's div element to 
	// the null string. This assumes one legend in legend
	var thisLayer = GLRI.ui.getLayerByName(name, layers);
	var divEl = document.getElementById(thisLayer.legend[0].divId);
	
	if (on) {
		divEl.innerHTML = GLRI.ui.getLegendWithHeaderHtml(thisLayer.legend[0]) + '<br />';	
	}
	else {
		divEl.innerHTML = '';
	}
	return;
};
