Ext.ns("GLRI");
Ext.ns("GLRI.ui");
Ext.ns("GLRI.ui.map");

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

GLRI.ui.map.baseUrl = 'http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer/WMSServer';

GLRI.ui.getLegendHTML = function(url, layers){
	// Return the html representing the layers by retrieving the map legend at url.
	var html = '';
	var listOfLayers = layers.split(',');
	for (var i = 0;  i < listOfLayers.length; i++){
		if (i != 0) {
			html += '<br/>';
		}
		html += '<img src=' + url + '?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=' + listOfLayers[i] + '>';
	}
	return html;
};

GLRI.ui.map.baseLayers = [
//  { 
//    	name: "USA_Topo_Maps", 
//      url: "http://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
//      type: OpenLayers.Layer.XYZ,
//		projection: new OpenLayers.Projection("EPSG:900913")
//    },
      {
    	  name: "ESRI Imagery World 2D",
    	  url: "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
    	  type: OpenLayers.Layer.XYZ,
      },
      {
    	name: "SDDS Imagery",
    	url: "http://isse.cr.usgs.gov/ArcGIS/services/Combined/SDDS_Imagery/MapServer/WMSServer",
    	type: OpenLayers.Layer.WMS,
    	layers: '0'
// This is not working well as a base Layer so I'm taking it out for now.
//      },
//     {
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
  		name: "Streams, wetlands and waterbodies",
  		url: GLRI.ui.map.baseUrl,
   	 	type: OpenLayers.Layer.WMS,
  	 	layers: '0',
  	 	legend: { 
  	 		name: 'Streams, wetlands, and waterbodies',
  	 		imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '0')
  	 	},
  	 	legendDivId: 'habitat-layer-0'
  	 },
	 { 
  	 	name: "Phragmites stands > 0.2 ha", 
  	 	url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '17',
  	 	legend: {
  	 		name: 'Phragmites stands > 0.2 ha',
  	 		imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '17')
  	 	}, 
  	 	legendDivId: 'habitat-layer-17'
      },
  	 {
  		name: "Phragmites habitat",
  		url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '1',
  	 	legend: {
  	 		name: 'Phragmites habitat',
  	 		imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '1')
  	 	},
  	 	legendDivId: 'habitat-layer-1'
  	 },
  	 {
  		 name: "Study area",
  		 url: GLRI.ui.map.baseUrl,
   	 	 type: OpenLayers.Layer.WMS,
   	 	 layers: '15',
   	 	 legend: {
   	 		name: 'Study area',
   	 		imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '15')
   	 	 },
   	 	 legendDivId: 'habitat-layer-15'
  	 }

   ];

GLRI.ui.map.networkLayers = [{ 
  	 	name: 'Contour-based 1 m reduction', 
  	 	url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '4',
  	 	legend: [
  	 	         {
  	 	        	 name: 'Contour-based 1 m reduction',
  	 	        	 imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '4')
  	 	         }
  	 	]
       },{ 
  	 	name: 'Lidar-based 1 m reduction', 
  	 	url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '11,14',
  	 	legend:[
  	 	        {
  	 	        	name: 'Lidar-based 1 m reduction',
  	 	        	imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '11')
  	 	        },
  	 	        {
  	 	        	name: 'Lidar unavailable',
  	 	        	imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '14')
  	 	        }
  	 	]
       },{ 
  	 	name: 'Lidar-based 50 cm reduction', 
  	 	url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '13,14',
  	 	legend:[
  	 	        {
  	 	        	name: 'Lidar-based 50 cm reduction',
  	 	        	imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '13')
  	 	        },
  	 	        {
  	 	        	name: 'Lidar unavailable',
  	 	        	imgHtml: GLRI.ui.getLegendHTML(GLRI.ui.map.baseUrl, '14')
  	 	        }
  	 	]
       }                 
   ];