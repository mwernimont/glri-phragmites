Ext.ns("GLRI");
Ext.ns("GLRI.ui");
Ext.ns("GLRI.ui.map");

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

GLRI.ui.map.baseLayers = [
//  { 
//    	name: "USA_Topo_Maps", 
//      url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
//      type: OpenLayers.Layer.XYZ,
//		projection: new OpenLayers.Projection("EPSG:900913")
//    },
    { 
      	name: "ESRI Shaded Relief World 2D", 
        url: "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_ShadedRelief_World_2D/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
      },
      {
    	name: "SDDS Imagery",
    	url: "http://isse.cr.usgs.gov/ArcGIS/services/Combined/SDDS_Imagery/MapServer/WMSServer",
    	type: OpenLayers.Layer.WMS,
    	layers: '0'
// This is not working well as a base Layer so I'm taking it out for now.
//      },
//      {
//    	  name: "Forecasting Phragmites Study Area",
//    	  url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
//    	  type: OpenLayers.Layer.WMS,
//      	  layers: '15'
      }
// Removed the wetlands map for now as it doesn't appear to have map data.
//      
//      {
//      	name: "FWS Wetlands",
//      	url: "http://137.227.242.85/arcGIS/services/FWS_Wetlands_WMS/MapServer/WMSServer",
//      	type: OpenLayers.Layer.WMS,
//      	layers: '17'
//       }
  ];

GLRI.ui.map.habitatLayers = [
  	 { 
  	 	name: "Monotypic Phragmites Stands greater than 0.4 ha (0.5 acre)", 
  	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '17',
  	 	legendDivId: 'habitat-layer-17'
      },
  	 {
  		name: "Ecologocial niche",
  		url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '1',
  	 	legendDivId: 'habitat-layer-1'
  	 },
  	 {
  		name: "Streams Wetlands and Waterbodies",
  		url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
   	 	type: OpenLayers.Layer.WMS,
  	 	layers: '0',
  	 	legendDivId: 'habitat-layer-0'
  	 }
   ];

GLRI.ui.map.networkLayers = [{ 
  	 	name: 'Area with no available lidar data', 
  	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '14'
       },{ 
  	 	name: 'Vulnerable Corridors from NOAA Bathymetry: 1m Lake Level Drop', 
  	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '4'
       },{ 
  	 	name: 'Vulnerable Corridors from Lidar Data: 1m Lake Level Drop', 
  	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '11'
       },{ 
  	 	name: 'Vulnerable Corridors from Lidar Data: 50cm Lake Level Drop', 
  	 	url: "http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer",
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '13'
       }                 
   ];