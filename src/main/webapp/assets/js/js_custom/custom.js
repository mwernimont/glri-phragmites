
function SaveMap() {
  var vpbb = map1.getViewportBoundingBox();
  var ucbb = map1.getUnclippedBoundingBox();
  var legendEl = document.getElementById('datalayer-legend')
  
  var xml = '<map dimX="' + map1.numTilesX + '" dimY="' + map1.numTilesY + '" tileSize="' + map1.tileSize + '">';
  xml += '<responseType>image</responseType>';
  xml += '<fileExtension>PNG</fileExtension>';
  xml += '<attachFile>warpMap</attachFile>';
  xml += '<viewportBBox><xmin>' + vpbb.xmin + '</xmin><ymin>' + vpbb.ymin + '</ymin><xmax>' + vpbb.xmax + '</xmax><ymax>' + vpbb.ymax + '</ymax></viewportBBox>';
  xml += '<unclippedBBox><xmin>' + ucbb.xmin + '</xmin><ymin>' + ucbb.ymin + '</ymin><xmax>' + ucbb.xmax + '</xmax><ymax>' + ucbb.ymax + '</ymax></unclippedBBox>';

  
  if (legendEl) {
    xml += '<legend><url>' + legendEl.src + '</url><position>rightbottom</position></legend>';
  }
  
  
  xml += '<watermark><image>http://internal.usgs.gov/visual/visual_id_files/raster/BW/80x22_black.jpg</image><location>bottomleft</location><opacity>0.5</opacity></watermark>';
  var mapLayers = map1.layerManager.activeMapLayers;
  
  
  for (var i = 0; i < mapLayers.length; i++) {
      xml += '<layer zOrder="' + i + '" opacity="' + mapLayers[i].opacity + '">';
      for (var j = 0; j < mapLayers[i].mapTiles.length; j++) {
          var tile = mapLayers[i].mapTiles[j];
          if (tile.img.src.indexOf('blank.gif') < 0) {
              xml += '<tile x="' + tile.img.style.left.split('px')[0] + '" y="' + tile.img.style.top.split('px')[0] + '">' + tile.img.src.replace(/&/g,"&amp;") + '</tile>';
          }
      }
      xml += '</layer>';
  }
  xml += "</map>";

  var saveMapForm = document.getElementById('save_map_form');
  document.getElementById('xml_req').value = xml;
  saveMapForm.submit();
}



/*used*/
function removeDataLayer() {
	//remove any current data layer
	for (var i = -816; i < -800; i++) {
		map1.removeLayer(i);
	}

	Ext.getCmp('prob-map-button').hide();
	Ext.getCmp('conc-map-button').hide();
	Ext.getCmp('export-button').setDisabled(true);
	Ext.getCmp('annual-stat').setValue('none,none');
	Ext.getCmp('wq-benchmark').setValue('Select Benchmark');
	Ext.getCmp('threshold').setValue(null);
}

/*used*/
function appendDataLayer(id) {
	//remove any current data layer
	for (var i = -816; i < -800; i++) {
		map1.removeLayer(i);
	}
		
	map1.appendLayer(id);

	Ext.getCmp('prob-map-button').show();
	Ext.getCmp('conc-map-button').show();
	Ext.getCmp('export-button').setDisabled(false);
}



/* used */
function exportData() {
	if (map1.zoom < -1) {
		alert('dataset too large.  zoom in closer then try again');
	} else {
	    var args = 'BBOX=' + map1.getViewportBoundingBoxString();
	    	args += '&export=kml';
	    	args += '&legend_url=' + document.getElementById('datalayer-legend').src;
	    
		//use threshold to determine if prob or pred is mapped
		if (Ext.getCmp('threshold').getValue()) {
			args += '&threshold=' + Ext.getCmp('threshold').getValue();
			args += '&model_output=' + Ext.getCmp('model_output').getValue();
			args += '&base_query_path=_prob';
		} else {
			args += '&model_output=' + Ext.getCmp('annual-stat').getValue().split(',')[1];
			args += '&base_query_path=_conc';
		}
	    	    	
	    if (document.getElementById('export-iframe')) document.body.removeChild(document.getElementById('export-iframe'));
	    var iframe = document.createElement('iframe');
	    iframe.id = 'export-iframe';
	    iframe.style.visibility = 'hidden';
	    iframe.src = 'export?' + args;
	    document.body.appendChild(iframe); 
	}

}



function toggleExportData() {


    //var args = map.currentParamSet.getArgsString();  
    var args = map_parameter_string;
    args += '&BBOX=' + map1.getViewportBoundingBoxString();
  
    var export_anchor = document.getElementById('exp_anc_kml');
    export_anchor.href = "/export?" + args + "&export=kml&mapscale=" + map.getScale();
    (map1.getScale() > 0.0102273)?export_anchor.target = '_blank':export_anchor.target = '';
    
    
    export_anchor = document.getElementById('exp_anc_shp');
    export_anchor.href = "/export?" + args + "&export=shp&mapscale=" + map.getScale();
    (map1.getScale() > 0.0102273)?export_anchor.target = '_blank':export_anchor.target = '';

    var ed =  document.getElementById('export-list')
    if (ed.style.display == 'block') {
      //document.getElementById('export-list').style.display = 'none';
      hideExport();
    } else {
      document.getElementById('export-list').style.display = 'block';
      //highlightTool(node);
    }
  
}

function hideExport() {
    document.getElementById('export-list').style.display = 'none';
  document.onmousedown = '';
}



/*used*/
var foi;
function identifyPoint(event, map) {
	//attempt to remove previous basin layer
	map.removeLayer(-95);
	map.layerManager.unloadMapLayer(-95);
	
	if (Ext.getCmp('identify-popup')) Ext.getCmp('identify-popup').close();
	Ext.getCmp('map-and-tabs').body.mask('Identifying Nearest Point of Interest...', 'x-mask-loading');
	
	//getHelpTip('identify_tool');

	//map1.setMouseAction(null);

	
	var c = JMap.util.getRelativeCoords(event, map.pane);
	var mapCoords = map.getMapCoordsInPixelSpace();
	var clickLL = map.getLatLonFromPixel(mapCoords.x + c.x, mapCoords.y + (map.viewportHeight - c.y));
	map.animateMoveToPx(c.x, c.y);
	
	foi = new JMap.foi.FOI(clickLL);
	map.FOIManager.addFOI(foi);

	//determine which identifying layers are on (data layer and/or sites layer)
	var bSitesLayerOn = !!map.layerManager.getActiveLayer(-90);
	var bDataLayerOn = false;
	for (var i = -816; i <= -800; i++) {
		if (!!map.layerManager.getActiveLayer(i)) {
			bDataLayerOn = true;
			break;
		}
	}
	
	var datalayers = '';
	
	if (bSitesLayerOn) {
		datalayers = 'sites';
	}
	
	if (bDataLayerOn) {
		datalayers += 'streams';
	}
	
	//calculate id click buffer based on clicked lat/lon
	var llMin = map.getLatLonFromPixel((mapCoords.x + c.x) - 15, (mapCoords.y + (map.viewportHeight - c.y) - 15));
	var llMax = map.getLatLonFromPixel((mapCoords.x + c.x) + 15, (mapCoords.y + (map.viewportHeight - c.y) + 15));
	var params = { 
		datalayers: datalayers,
		base_query_path: '_identify/base_query.jsp',
		lat: clickLL.lat,
		lon: clickLL.lon,
		id_buffer: llMin.lon + ',' + llMin.lat + ',' + llMax.lon + ',' + llMax.lat,
		pesticide: 'Atrazine'
	};
	
	//if threshold, put threshold line on graph
	if (Ext.getCmp('threshold').getValue()) {
		params.threshold = Ext.getCmp('threshold').getValue();
	}
	
	
	//make ajax call to get id info back
	Ext.Ajax.request({
		url: 'identify',
		method: 'GET',
		success: function(r,o) { addIdentifyLayer(r,o,map) },
		failure: idFailed,
		params: params
	});
	
}
identifyPoint.cursor = 'cursor-identify';




/*used*/
function addIdentifyLayer(response, options, map) {
	
	Ext.getCmp('map-and-tabs').body.unmask();
	var title = '';
	var idHtml = JMap.util.getNodeValue(response.responseXML, 'netchartsHtml');
	var idType = response.responseXML.getElementsByTagName('identify')[0].getAttribute('type');
	if (idType == 'reach') {
		map1.FOIManager.removeAllFOIs()
		loadHelpTip(9);

		title = Ext.util.Format.ellipsis(JMap.util.getNodeValue(response.responseXML, 'name'), 35, true);
		idHtml += '<div class="clearfix reach-id-footer">' +
					'<span style="float:left">RF1 ID: ' + JMap.util.getNodeValue(response.responseXML, 'e2rf1') + '</span>' +
					'<span style="float:right">mean discharge: ' + JMap.util.getNodeValue(response.responseXML, 'meanq') + ' cfs</span>' +
				  '</div>';
		var mbr = JMap.util.getNodeValue(response.responseXML, 'basinMbr').split(',');
		map.fitToBBox(parseFloat(mbr[0],10), parseFloat(mbr[1],10), parseFloat(mbr[2],10), parseFloat(mbr[3],10));
		
		//create the wms basin outline layer
		map1.appendLayer(
			new JMap.web.mapLayer.WMSLayer({
				name: 'Basin Outline',
				id: -95,
				baseUrl: 'mvwms',
				customParams: {
					base_query_path: '_identify/base_query.jsp',
					e2rf1_id: JMap.util.getNodeValue(response.responseXML, 'e2rf1'),
					style: 'L.BASIN_OUTLINE',
					query_id: 'basin_outline'
				},
				legendUrl: 'assets/images/legends/basin_outline.png'
			})
		);
		
	} else if (idType == 'site') {
		loadHelpTip(10);

		//move foi marker to lat lon
		var lat = parseFloat(JMap.util.getNodeValue(response.responseXML, 'lat'));
		var lon = parseFloat(JMap.util.getNodeValue(response.responseXML, 'lon'));
		foi.moveToLatLon(lat, lon)
		title = Ext.util.Format.ellipsis(JMap.util.getNodeValue(response.responseXML, 'name'), 35, true);
		idHtml += '<div class="id-nwis-link"><a href="' + JMap.util.getNodeValue(response.responseXML, 'nwisLink') + '" target="_blank">NWIS Link</a></div>';
	} else if (idType == 'nodata') {
		title = 'No Data';
		idHtml = 'This reach was not modeled';
	} else if (idType == 'nomap') {
		title = 'Nothing to ID';
		idHtml = 'You must first map a data layer for identify to work.';
	} else if (idType == 'unmodeled') {
		title = 'Reach Not Modeled';
		var rescode = parseInt(JMap.util.getNodeValue(response.responseXML, 'rescode'),10);
		if (rescode > 0) {	
			idHtml = 'Identified reach is a reservoir.  WARP was designed for use on streams (see FAQ).';
		} else {
			idHtml = 'Model estimates not available for watersheds smaller than 75 km2.';
		}
	}
	
	
	var po = Ext.getCmp('ext-map-area').getPosition();
	
	(new Ext.Window({
		id: 'identify-popup',
		title: title,
		resizable: false,
		width: 310,
		height: 300,
		x: po[0] + 40,
		y: po[1] + 80,
		shadow: false,
		html: idHtml,
		tools: [{
			id: 'up',
			handler: function(e,t,p,c) {
				if (t.hasClass('x-tool-up')) {
					t.removeClass('x-tool-up');
					t.addClass('x-tool-down');
				} else {
					t.addClass('x-tool-up');
					t.removeClass('x-tool-down');
				}
				p.toggleCollapse();
			}
		}],
		listeners: {
			afterrender: function(w) {
				w.on('close', function() { map1.removeLayer(-95); map1.FOIManager.removeAllFOIs();});
			},
			minimize: function(w) {
				w.toggleCollapse();
			}
		}
	})).show();	
	
}


function idFailed() {
	
}


/*used*/
function closeBenchmark() {
	benchmarkWindow.hide();
}

/*used*/
function chooseBenchmarkClose(id, threshold, model_output, text) {
  Ext.getCmp('threshold').setValue(threshold);
  Ext.getCmp('model_output').setValue(model_output);
	
  closeBenchmark();
  Ext.getCmp('annual-stat').setValue('none,none');
  Ext.getCmp('wq-benchmark').setValue(text);
  appendDataLayer(id);
}


/*used*/
function appendPredictorLayer(layerId) {
	var predictorConcTab = Ext.getCmp('predictor-conc-tab');
	var predictorProbTab = Ext.getCmp('predictor-prob-tab');
	
	var store = predictorConcTab.getStore();
	store.each(function(r) {
		map1.removeLayer(r.data.modelFactorId);
	});
	
	map1.appendLayer(layerId);

	predictorConcTab.setValue(layerId);
	predictorProbTab.setValue(layerId);
}


/*used*/
function toggleSitesLayer(b,checkbox) {
	var sitesProbTab = Ext.getCmp('sites-prob-tab');
	var sitesConcTab = Ext.getCmp('sites-conc-tab');
	if (b) {
		sitesProbTab.setValue(true);
		sitesConcTab.setValue(true);
		map1.appendLayer(-90);
	} else {
		sitesProbTab.setValue(false);
		sitesConcTab.setValue(false);		
		map1.removeLayer(-90);
	}
}

/*used*/
function appendLayerCB(layerId) {

  var layer = map1.layerManager.getMapLayer(layerId);
  if (layer) {
	  var legend = Ext.getCmp('legend-panel');
	  legend.controller.appendLegendItem(layer);
  }
  
}

/*used*/
function removeLayerCB(layerId) {
  //removeLegend(layerId);
  var legend = Ext.getCmp('legend-panel');
  legend.controller.removeLegendItem(layerId);
}





function openFAQ() {
	var mapArea = Ext.getCmp('ext-map-area');
	var tabsArea = Ext.getCmp('tabs-area');
	var mapHeight = mapArea.getHeight();
	var tabHeight = tabsArea.getHeight();
	Ext.getCmp('tabs-area').setHeight(tabHeight + mapHeight);
	mapArea.hide();
	var idWindow = Ext.getCmp('identify-popup');
	if (idWindow) idWindow.hide();
}

function closeFAQ() {
	Ext.getCmp('tabs-area').setHeight(100);
	Ext.getCmp('ext-map-area').show();
	var idWindow = Ext.getCmp('identify-popup');
	if (idWindow) idWindow.show();
}



/*used*/
function setMapTitle(title) {
	Ext.getCmp('ext-map-area').setTitle(title);
}




//help tip stuff
function loadHelpTip(id) {
	var helpPanel = Ext.getCmp('help-context-panel');
	helpPanel.setTitle('Loading Tip...');
	if (helpPanel.body) { //might not have rendered yet...
		helpPanel.body.dom.innerHTML = '';
		helpPanel.body.mask('Loading...','x-mask-loading');
	}
	Ext.Ajax.request({
		disableCaching: false,
		url: 'helptip',
		method: 'GET',
		success: helptipSuccess,
		failure: helptipFailed,
		params: {
			id: id
		}
	});
}

function helptipSuccess(response, options) {
	var helpPanel = Ext.getCmp('help-context-panel');
	var title = JMap.util.getNodeValue(response.responseXML, 'title');
	var text = JMap.util.getNodeValue(response.responseXML, 'text');
	var helpObj = {title: title, text: text};

	var helpTpl = new Ext.Template(
		'<div>{text}</div>'
	);
	
	helpPanel.setTitle(Ext.util.Format.ellipsis(title, 45, true));
	helpTpl.overwrite(helpPanel.body, helpObj);
	helpPanel.body.unmask();
}

function helptipFailed() {
}
