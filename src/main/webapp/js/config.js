Ext.ns("GLRI");
Ext.ns("GLRI.ui");
Ext.ns("GLRI.ui.map");

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

GLRI.ui.map.baseMapServerUrl = 'http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer'
GLRI.ui.map.baseUrl = GLRI.ui.map.baseMapServerUrl + '/WMSServer';

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
//    	name: "World_Topo_Maps", 
//        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
//        type: OpenLayers.Layer.XYZ,
//    },
      {
    	  name: "ESRI Imagery World 2D",
    	  url: "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
    	  type: OpenLayers.Layer.XYZ
      },
      {
    	name: "SDDS Imagery",
    	url: "http://isse.cr.usgs.gov/ArcGIS/services/Combined/SDDS_Imagery/MapServer/WMSServer",
    	type: OpenLayers.Layer.WMS,
    	layers: '0'
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

/* Each habitat or network layer should have the following properties:
      name  - used on the UI
      url - resource to retrieve the layer from
      type - the OpenLayers.Layer type 
      legend - An object (or array of objects) with properties for: name - to be used on the legend and imgHtml - the html containing the legend image.
      legendDivId - The div id where the legend for this layer is placed when visible.
      drawingOrder - An integer index indicating the order of drawing. Larger indexes will be placed on top of smaller indexes.
      initialOn - Boolean indicating whether the layer should initially be turned on
      opacity - Float value between 0.0 and 1.0 setting the layer's opacity. Normally set to 1.0
*/
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
  	 	legendDivId: 'habitat-layer-0',
  	 	drawingOrder: 2,
  	 	initialOn: false,
  	 	opacity: 1.0
  	 },
	 { 
  	 	name: "<i>Phragmites</i> stands > 0.2 ha", 
  	 	url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '17',
  	 	legend: {
  	 		name: '<i>Phragmites</i> stands > 0.2 ha',
  	 		imgHtml: '<img src=images/legends/phragmites_stands.jpg />'
  	 	}, 
  	 	legendDivId: 'habitat-layer-17',
  	 	drawingOrder: 4,
  	 	initialOn: false,
  	 	opacity: 1.0
      },
  	 {
  		name: "<i>Phragmites</i> habitat",
  		url: GLRI.ui.map.baseUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '1',
  	 	legend: {
  	 		name: '<i>Phragmites</i> habitat',
  	 		imgHtml: '<img src=images/legends/phragmites_habitat.jpg />'
  	 	},
  	 	legendDivId: 'habitat-layer-1',
  	 	drawingOrder: 1,
  	 	initialOn: false,
  	 	opacity: 1.0
  	 },
  	 {
  		 name: "Outside study area",
  		 url: GLRI.ui.map.baseUrl,
   	 	 type: OpenLayers.Layer.WMS,
   	 	 layers: '15',
   	 	 legend: {
   	 		name: 'Outside study area',
   	 		imgHtml: '<img src=images/legends/outside_study_area.jpg />'
   	 	 },
   	 	 legendDivId: 'habitat-layer-15',
   	 	 drawingOrder: 5,
   	 	 initialOn: true,
   	 	 opacity: 0.75
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
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0
       },
       { 
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
  	 	        	imgHtml: '<img src=images/legends/lidar_unavailable.jpg />'
  	 	        }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0
       },
       { 
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
  	 	        	imgHtml: '<img src=images/legends/lidar_unavailable.jpg />'
  	 	        }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0
       }                 
   ];

// Declare objects which define the title and content for context specific help and the id and event type to add to display the help.
GLRI.ui.helpContext = {
		map: {
			title: 'Map Tools Help',
			content: '<p>Tools to move and zoom in/out the map are located at the far left of the map view.</p><br/> ' + 
			 		 '<p>The map can also be moved by holding down the left mouse button and dragging the map.</p><br/>' +
			         '<p>You can zoom in by double clicking on a location which will center your display at that point while zooming in.</p><br /> ' +
			         '<p>Another way to zoom in and move the map is by holding down the shift key, hold down and drag the left mouse button. A rectangle will appear ' +
			         'on your screen which represents the new location and size of the map once you release the mouse button.</p><br />' +
			         '<p>Clicking the blue '+' button on the far right of the map will toggle on/off the display of a panel which allows ' +
			         'you to select a different base layer.</p>',
			id: 'map-area',
			event: 'click'
		},
		layers: {
			title: 'Data Layer Selection Help',
			content: '<p>These menus and buttons can be used to select/deselect data layers for viewing on the map viewer.</p>',
			id: 'map-data-layers-selection',
			event: 'click'
		}
};