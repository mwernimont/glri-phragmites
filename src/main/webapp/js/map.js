// When using an XYZ layer with OpenLayers, this needs to be appended to the
// base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';
GLRI.ui.map.mainMap; //global reference to map, don't know if I like it but I don't care right now
GLRI.ui.map.baseLayers = [
    { 
    	name: "ESRI Shaded Relief World 2D", 
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_ShadedRelief_World_2D/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    }
];

GLRI.ui.map.habitatLayers = [
	 { 
	 	name: "Monotypic Phragmites Stands greater than 0.4 ha (0.5 acre)", 
	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_preliminary_Phragmites_v1_1_mxd/MapServer/WMSServer",
	 	type: OpenLayers.Layer.WMS,
	 	layers: '17'
     }                     
 ];

GLRI.ui.map.networkLayers = [{ 
	 	name: 'Area with no available lidar data', 
	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_preliminary_Phragmites_v1_1_mxd/MapServer/WMSServer",
	 	type: OpenLayers.Layer.WMS,
	 	layers: '12'
     },{ 
	 	name: 'Vulnerable Corridors from NOAA Bathymetry: 1m Lake Level Drop', 
	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_preliminary_Phragmites_v1_1_mxd/MapServer/WMSServer",
	 	type: OpenLayers.Layer.WMS,
	 	layers: '2'
     },{ 
	 	name: 'Vulnerable Corridors from Lidar Data: 1m Lake Level Drop', 
	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_preliminary_Phragmites_v1_1_mxd/MapServer/WMSServer",
	 	type: OpenLayers.Layer.WMS,
	 	layers: '9'
     },{ 
	 	name: 'Vulnerable Corridors from Lidar Data: 50cm Lake Level Drop', 
	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_preliminary_Phragmites_v1_1_mxd/MapServer/WMSServer",
	 	type: OpenLayers.Layer.WMS,
	 	layers: '11'
     }                 
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