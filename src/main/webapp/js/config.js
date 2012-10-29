Ext.ns("GLRI");
Ext.ns("GLRI.ui");
Ext.ns("GLRI.ui.map");

//When using an XYZ layer with OpenLayers, this needs to be appended to the
//base URL.
GLRI.ui.map.XYZ_URL_POSTFIX = '${z}/${y}/${x}';

// define urls for map server services
GLRI.ui.map.baseMapServerUrl = 'http://cida.usgs.gov/ArcGIS/services/GLRI68_Phragmites/MapServer';
GLRI.ui.map.baseWMSServiceUrl = GLRI.ui.map.baseMapServerUrl + '/WMSServer';

GLRI.ui.getLegendHTML = function(url, layers/* string containing comma separated layer names */){
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

/* Define an object containing all base layers used in the application */
GLRI.ui.map.baseLayers = [
  {
	  name: 'World Imagery',
	  url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/' + GLRI.ui.map.XYZ_URL_POSTFIX,
	  type: OpenLayers.Layer.XYZ
  },
  {
		name: 'World Street Map',
		url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/' + GLRI.ui.map.XYZ_URL_POSTFIX,
		type: OpenLayers.Layer.XYZ
  },
  { 
    	name: "World Topo Map", 
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    },
    { 
    	name: "World Relief Map", 
        url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/"+GLRI.ui.map.XYZ_URL_POSTFIX,
        type: OpenLayers.Layer.XYZ
    }
  ];

/* Each habitat, static or network layer should have the following properties:
      name  - used on the UI
      url - resource to retrieve the layer from
      type - the OpenLayers.Layer type 
      legend - An object (or array of objects) with properties for: name - to be used on the legend, imgHtml - the html containing the legend image, and
               divId - the id of the div to place the legend in, helpContext - optional help that would be associated with that particular div.
      drawingOrder - An integer index indicating the order of drawing. Larger indexes will be placed on top of smaller indexes.
      initialOn - Boolean indicating whether the layer should initially be turned on
      opacity - Float value between 0.0 and 1.0 setting the layer's opacity. Normally set to 1.0
      helpContext(optional) - An object defining the context sensitive help for the element. Generally used for checkbox or selection elements
      geotiffLayer - The corresponding name of the layer to get geotiff from WCS and is optional.
      geotiffGridOffset - the offset to use in the wcs request.
      The previous two properties where obtained from GLRI.ui.map.baseMapServerUrl/WCSServer?service=wcs&request=describecoverage&version=1.0.0
*/
GLRI.ui.map.habitatLayers = [
	 {
  		name: "Within streams, wetlands, and water bodies",
  		url: GLRI.ui.map.baseWMSServiceUrl,
   	 	type: OpenLayers.Layer.WMS,
  	 	layers: '0',
  	 	legend: [{
  	 		name: 'Streams, wetlands, and water bodies',
  	 		imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	  	 	divId: 'habitat-layer-0'
  	 	}],
  	 	inputId: 'id-habitat-layer-0-checkbox',
  	 	drawingOrder: 2,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'streams_wetlands_waterbodies',
  	 	geotiffLayer: '9',
  	 	geotiffGridOffset: '30.0,-30.0'
  	 },
	 { 
  	 	name: "<i>Phragmites</i> stands > 0.2 ha", 
  	 	url: GLRI.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '17',
  	 	legend: [{
  	 		name: '<i>Phragmites</i> stands > 0.2 ha',
  	 		imgHtml: '<img src=images/legends/phragmites_stands.jpg />',
  	 		divId: 'habitat-layer-17'
  	 		
  	 	}], 
  	 	
  	 	drawingOrder: 4,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'phragmites_stands'
      },
  	 {
  		name: "<i>Phragmites</i> habitat suitability",
  		url: GLRI.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '1',
  	 	legend: [{
  	 		name: '<i>Phragmites</i> habitat suitability',
  	 		imgHtml: '<img src=images/legends/phragmites_habitat.jpg />',
  	 		divId: 'habitat-layer-1'
  	 	}],
  	 	drawingOrder: 1,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'phragmites_habitat',
  	   	geotiffLayer: '8',
  	   	geotiffGridOffset: '0.0012065038948423097,0.0012065038948423097'
  	 }
];

GLRI.ui.map.staticLayers = [
  	 {
  		 name: "Outside study area",
  		 url: GLRI.ui.map.baseWMSServiceUrl,
   	 	 type: OpenLayers.Layer.WMS,
   	 	 layers: '15',
   	 	 legend: [{
   	 		name: 'Outside study area',
   	 		imgHtml: '<img src=images/legends/outside_study_area.jpg />',
   	 		divId: 'habitat-layer-15'
   	 	 }],
   	 	 drawingOrder: 5,
   	 	 initialOn: true,
   	 	 opacity: 0.75,
   	 	 helpContext: 'outside_study_area'
  	 }
];

GLRI.ui.map.networkLayers = [{ 
  	 	name: 'Contour-based 1 m reduction', 
  	 	url: GLRI.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '4',
  	 	legend: [
  	 	         {
  	 	        	 name: 'Contour-based 1 m reduction',
  	 	        	 imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	 divId: 'legend-contour-layer',
  	 	        	 helpContext: 'contour_corridor'
  	 	         }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'contour_corridor',
  	 	geotiffLayer: '7',
  	 	geotiffOffset: '30.0,-30.0'
       },
       { 
  	 	name: 'Lidar-based 1 m reduction', 
  	 	url: GLRI.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '11,14',
  	 	legend:[
  	 	        {
  	 	        	name: 'Lidar-based 1 m reduction',
  	 	        	imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	divId: 'legend-lidar-1m-reduction',
  	 	        	helpContext: 'lidar_1m_reduction'
  	 	        },
  	 	        {
  	 	        	name: 'Lidar unavailable',
  	 	        	imgHtml: '<img src=images/legends/lidar_unavailable.jpg />',
  	 	        	divId: 'legend-lidar-unavailable'
  	 	        }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'lidar_1m_reduction',
  	 	geotiffLayer: '2',
  	 	geotiffOffset: '30.0,-30.0'
       },
       { 
  	 	name: 'Lidar-based 50 cm reduction', 
  	 	url: GLRI.ui.map.baseWMSServiceUrl,
  	 	type: OpenLayers.Layer.WMS,
  	 	layers: '13,14',
  	 	legend:[
  	 	        {
  	 	        	name: 'Lidar-based 50 cm reduction',
  	 	        	imgHtml: '<img src=images/legends/corridor_networks.jpg />',
  	 	        	divId: 'legend-lidar-50cm-reduction',
  	 	        	helpContext: 'lidar_50cm_reduction'
  	 	        },
  	 	        {
  	 	        	name: 'Lidar unavailable',
  	 	        	imgHtml: '<img src=images/legends/lidar_unavailable.jpg />',
  	 	        	divId: 'legend-lidar-unavailable'
  	 	        }
  	 	],
  	 	drawingOrder: 3,
  	 	initialOn: false,
  	 	opacity: 1.0,
  	 	helpContext: 'lidar_50cm_reduction',
  	 	geotiffLayer: '1',
  	 	geotiffOffset: '30.0, -30.0'
       }                 
 ];

// Declare objects which define the title and content for context specific help.
// The property faq_link_id is used to specify the id of the faq help section to reference and is optional.
GLRI.ui.helpContext = {
		map: {
			title: 'Map Tools Help',
			content: '<p>Tools to move and zoom in/out the map are located at the far left of the map view. ' + 
			 		 'You can also move the map by holding down the left mouse button and dragging the map ' +
			 		 ' and you can zoom in/out the map can by using the scroll wheel on your mouse.</p></br>' +
			 		 '<p>There are other ways to move and zoom in. You can zoom in by double clicking on a location which ' +
			 		 'will center your display at that point while zooming in. Another way to zoom in and move the map is by ' +
			 		 'holding down the shift key while holding down and dragging the left mouse button. A rectangle will appear ' +
			         'on your screen which represents the new location and size of the map once you release the mouse button.</p><br />' +
			         '<p>Clicking the blue \'+\' button in the upper right corner of the map will toggle on/off the display of a panel ' +
			         'which allows you to select a different base layer.</p><br />' +
			         '<p> The small button above the Legend area can be used to collapse/show the page header and footer.</p>'
		},
		corridors: {
			title: 'Within reduced lake-level corridors',
			content: '<p>These corridors simulate the coastal areas that emerge during periods of low lake levels.  Corridors are ' + 
					 'weighted by distance to existing <i>Phragmites</i> stands as a way to assess vulnerability. ' +
					 '<a id="help-link-corridors" href="#data-to-construct-corridor">[more info]</a></p>',
			faq_link_id: 'help-link-corridors'
		},
		contour_corridor: {
			title: 'Contour-based 1 m reduction',
			content: '<p>This corridor depicts a 1 m lake-level reduction based on the low water datum for Lake Ontario, ' +
					 'Lake Erie, Lake St. Clair, and most of Lake Huron.  It is defined by the NOAA medium resolution shoreline ' +
					 'and the 1 m contour from a data base of historic soundings. ' +
					 '<a id="help-link-contour-corridors" href="#water-level-fluctuations">[more info]</a></p>',
			faq_link_id: 'help-link-contour-corridors'
		},
		lidar_1m_reduction: {
			title: 'Lidar-based 1 m reduction',
			content: '<p>This corridor depicts a 1 m lake-level reduction based on mean 2009 lake levels and was ' +
			         'derived from recently acquired lidar-based topo-bathymetry.  Lidar acquisition was limited by water ' +
			         'clarity, and the accompanying \'lidar unavailable\' layer shows where corridor extraction was limited by data availability. ' +
			         '<a id="help-link-lidar-1m-reduction" href="#water-level-fluctuations">[more info]</a></p>',
			faq_link_id: 'help-link-lidar-1m-reduction'
		},
		lidar_50cm_reduction: {
			title: 'Lidar-based 50 cm reduction',
			content: '<p>This corridor depicts a 50 cm lake-level reduction based on mean 2009 lake levels and was derived from recently ' +
					 'acquired lidar-based topo-bathymetry.  Lidar acquisition was limited by water clarity, and the accompanying ' +
					 '\'lidar unavailable\' layer shows where corridor extraction was limited by data availability. ' +
					 '<a id="help-link-lidar-50cm-reduction" href="#water-level-fluctuations">[more info]</a></p>',
			faq_link_id: 'help-link-lidar-50cm-reduction'
		},
		streams_wetlands_waterbodies: {
			title: 'Within streams, wetlands, and water bodies',
			content: '<p>These features make up an inland corridor network to depict possible <i>Phragmites</i> expansion pathways, ' +
			         'and are coded by distance to existing <i>Phragmites</i>. ' +
			         '<a id="help-streams-wetlands-waterbodies" href="#data-to-construct-corridor">[more info]</a></p>',
			faq_link_id: 'help-streams-wetlands-waterbodies'
		},
		phragmites_stands: {
			title: '<i>Phragmites</i> stands > 0.2 ha',
			content: '<p>The existing distribution of invasive <i>Phragmites</i> was mapped through the use of satellite imagery and ground truthing. ' +
				'<a id="help-link-phragmites-stands" href="#how-map-was-developed">[more info]</a></p>',
			faq_link_id: 'help-link-phragmites-stands'
		},
		phragmites_habitat: {
			title: '<i>Phragmites</i> habitat suitability',
			content: '<p>Statistical models were used to estimate habitat quality for <i>Phragmites</i> based on its current ' +
			         'distribution and environmental conditions. ' +
			         '<a id="help-link-phragmites-habitat" href="#habitat-suitability-estimated">[more info]</a></p>',
			faq_link_id: 'help-link-phragmites-habitat'
		},
		outside_study_area: {
			title: 'Outside study area',
			content: '<p>The study consists of the U. S. side of the Great Lakes coastal zone, and ' +
				     'is defined by a 10 km inland buffer of the shoreline.  It also includes ' +
				     'offshore islands where satellite imagery was available.</p>'
		}
};
