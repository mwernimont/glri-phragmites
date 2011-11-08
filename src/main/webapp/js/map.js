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
            new OpenLayers.Control.ScaleLine()
        ],
        // Got this number from Hollister, and he's not sure where it came from.
        // Without this line, the esri road and relief layers will not display
        // outside of the upper western hemisphere.
        maxResolution: 1.40625/2
    });
	
	for(var i = 0; i < GLRI.ui.map.baseLayers.length; i++){
		GLRI.ui.map.mainMap.addLayer(new GLRI.ui.map.baseLayers[i].type(
			GLRI.ui.map.baseLayers[i].name,
			GLRI.ui.map.baseLayers[i].url,
            {
				isBaseLayer: true,
				layers: GLRI.ui.map.baseLayers[i].layers
			}
        ));
	}
	
	GLRI.ui.map.mainMap.zoomTo(5);
	GLRI.ui.map.mainMap.panTo(new OpenLayers.LonLat(-84, 45));
};

GLRI.ui.turnOnHabitatLayerMap = function(name, layers){
	for(var i = 0; i < layers.length; i++){
		if(layers[i].name==name){
			GLRI.ui.map.mainMap.addLayer(new layers[i].type(
				layers[i].name,
				layers[i].url,
	            {
					layers: layers[i].layers,
					transparent: true,
					displayInLayerSwitcher: false
				}
	        ));
		} else {
			var map = GLRI.ui.map.mainMap;
			if(map.getLayersByName(layers[i].name)[0])
				map.removeLayer(map.getLayersByName(layers[i].name)[0], false);
		}
	}
}