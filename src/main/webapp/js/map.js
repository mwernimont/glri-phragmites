// When using an XYZ layer with OpenLayers, this needs to be appended to the
// base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';
GLRI.ui.map.mainMap;
GLRI.ui.map.baseLayers = [
    { name: "ESRI Shaded Relief World 2D", 
     url: "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_ShadedRelief_World_2D/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
     type: OpenLayers.Layer.XYZ}
];

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
            {isBaseLayer: true}
        ));
	}
	
	GLRI.ui.map.mainMap.zoomTo(3);
	GLRI.ui.map.mainMap.panTo(new OpenLayers.LonLat(-100, 35));
}