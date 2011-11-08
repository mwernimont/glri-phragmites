Ext.ns("GLRI");
Ext.ns("GLRI.ui");
Ext.ns("GLRI.ui.map");

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

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