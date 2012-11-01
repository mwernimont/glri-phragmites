Ext.onReady(function() {
	
	var downloadableLayers = GLRI.ui.map.habitatLayers.concat(GLRI.ui.map.networkLayers);
	
	var createDownloadMenu = function(){
		var downloadLayerGeotiff = function(obj, event){
			var bbox = GLRI.ui.map.mainMap.getExtent().transform(GLRI.ui.map.mercatorProjection, GLRI.ui.map.wgs84Projection);
			bboxLatLon = bbox.transform(GLRI.ui.map.mercatorProjection, GLRI.ui.map.wgs84Projection);
			var width = bbox.getWidth();
			var height = bbox.getHeight();
			if (width > 1.0 || height > 1.0) {
				alert('You must zoom in to a map view that has a width < 1.0 and height < 1.0 degrees. \n'
					+ 'Your current map has width = ' + width + ' and height = ' + height + '.');
			}
			else {
				var mapExtEl = Ext.ComponentManager.get('ext-map-area');
				var bboxstr = bbox.toBBOX();
				var w = mapExtEl.getWidth();
				var h = mapExtEl.getHeight();
				// Note that the url code has not been tested.
				var url = GLRI.ui.map.baseMapServerUrl + '/WCSServer?service=WCS&version=1.0.0&request=GetCoverage&crs=EPSG:4326&format=GEOTIFF' +
				'&coverage=' + obj.layer_id +
				'&bbox='+ bboxstr + 'urn:ogc:def:crs:CPSG::4326' +
				'&gridBaseCRS=urn:goc:def:crs:EPSG::102039' +
				'&format=image/GeoTIFF' +
				'&gridOffsets=' + obj.gridOffset +
				'&store=true';
// This will return an XML object. Ivan has a servlet which allows use to parse the xml and then download the file contained in the XML.				
//				window.open(GLRI.ui.map.baseMapServerUrl + '/WCSServer?service=WCS&version=1.1.1&request=GetCoverage&' +
//						'&boundingbox=' + bbox.toBBOX() +
//						'&identifier=' + obj.layer_id
//						''
			}									
		};
		
		var items = [];
		
		for (var i = 0; i< downloadableLayers.length; i++) {
			if (downloadableLayers.geotiffLayer){
				items.push({
					text: downloadableLayers[i].name,
					handler: downloadLayerGeotiff,
					layer_id: downloadableLayers[i].geotiffLayer,
					gridOffset: downloadableLayers[i].geotiffGridOffset
				});
			}
		}
		
		return items;
	};
	
	var createLayersDropDown = function(emptyOption, layers){
		// Return a list of names to be used for a layers drop down menu.
		// The emptyOption parameter defines the empty option.
		var dataArray = [[emptyOption]];
		for(var i = 0; i < layers.length; i++){
			dataArray.push([layers[i].name]);
		}
		return dataArray;
	};

	var networkDataArray = createLayersDropDown('No reduction', GLRI.ui.map.networkLayers);
	
	var createLayerCheckBoxes = function (layers){
		// Return a list of checkbox objects that represent the layers
		// and can be used to turn on/off the visibility of that layer.
		var dataArray = [];
		for (var i = 0; i < layers.length; i++){
			dataArray.push({
                    boxLabel: layers[i].name,
                    xtype: 'checkbox',
                    checked: layers[i].initialOn,
                    boxLabelAlign: 'before',
                    listeners: {
                        change: {
                            fn: function(checkbox, newValue, oldValue) {
                                GLRI.ui.toggleLayerMap(checkbox.boxLabel, newValue);
                                GLRI.ui.toggleLegend(checkbox.boxLabel, GLRI.ui.map.habitatLayers, newValue);
                                // Set the context sensitive help if the checkbox is turned on.
                                if (newValue) {
                                    var helpContext = GLRI.ui.helpContext[this.helpContext];
                                    GLRI.ui.setHelpContext(helpContext);
                                }
                            },
                            scope: layers[i]
                        }
                    }
			});
		}
		return dataArray;
	};
	
	var createLegendDiv = function (layers) {
		// Create the div elements to be used to display legends for each layer in layers.
		var html = '';
		for (var i = 0; i < layers.length; i++){
			for (var j = 0; j < layers[i].legend.length; j++) {
				html += '<div class="legend-div" id="' + layers[i].legend[j].divId + '"></div>';
			}
		}
		return html;
	};

	
	var otherCheckBoxes = createLayerCheckBoxes(GLRI.ui.map.habitatLayers.slice(0, 1));
	var habitatCheckBoxes = createLayerCheckBoxes(GLRI.ui.map.habitatLayers.slice(1));
	var habitatAndStaticLegendDivs = createLegendDiv(GLRI.ui.map.habitatLayers.concat(GLRI.ui.map.staticLayers));
	
	Ext.create('Ext.container.Viewport', {
		layout: 'border',
		border: 0,
		listeners: {
			afterrender: GLRI.ui.initMap
		},
		items: [{
			id: 'ext-header-banner',
			region: 'north',
			contentEl: 'header',
			xtype: 'panel',
			border: 0
		},{
			id: 'map-and-tabs',
			region: 'center',
			xtype: 'tabpanel',
//			activeTab: 0,
			margin: '3 0 3 3',
			listeners: {
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					if (GLRI.ui.map.mainMap){
						GLRI.ui.map.mainMap.updateSize();
					}										
				}
			},
			items: [{
				title: 'About the DST',
				id: 'about-tab',
				contentEl: 'mapper-intro',
				bodyStyle: 'padding: 5px;',
				autoScroll: true
				},
				{
				region: 'north',
				layout: 'border',
				title: 'Vulnerability Assessment Map',
				items: [{
					xtype: 'form',
					id: 'phragmites-map-form',
					bodyStyle: 'padding: 10px',
					layout: 'column',
					region: 'north',
					split: true,
					height: 85,
					border: 0,
					id: 'map-data-layers-selection',
					items: [{
						xtype: 'fieldset',
						title: '<span style="font-size: 1.2em;"><b>Distance to <i>Phragmites</i><b></span>',
						columnWidth: 0.50,
                        padding: '0, 0, 0, 5',
						style: 'border-width: 0px',
						items: [{
							fieldLabel: 'Within reduced lake-level corridors',
							labelWidth: 200,
							width: 400,
							margin: '0, 0, 0, 15',
							id: 'phragmitesNetwork',
							name: 'phragmitesNetwork', // Test to see if this fixes IE 7 display issues
							xtype: 'combo',
							triggerAction: 'all',
							lazyRender:true,
							forceSelection: true,
							value: 'No reduction',
							editable: false,
							mode: 'local',
							store: new Ext.data.ArrayStore({
								fields: [
								         'network'
								         ],
								         data: networkDataArray	
							}),
							listeners: {
								select: function(combo, records, eOpts) {
									GLRI.ui.turnOnLayerMap(records[0].data.network, GLRI.ui.map.networkLayers);
									GLRI.ui.turnOnLegend(records[0].data.network, GLRI.ui.map.networkLayers, 'network-layer-div');
									var thisLayer = GLRI.ui.getLayerByName(records[0].data.network, GLRI.ui.map.networkLayers);
									GLRI.ui.setHelpContext(GLRI.ui.helpContext[thisLayer.helpContext]);
								},
								expand: function(combo) {
									GLRI.ui.setHelpContext(GLRI.ui.helpContext.corridors);
								}
							},
							valueField: 'network',
							displayField: 'network'
						},
						{
							id: 'otherSuitability',
							xtype: 'fieldcontainer',
							margin: '0, 0, 0, 15',
							items: otherCheckBoxes
						}]
					},{
						xtype: 'fieldset',
						columnWidth: 0.30,
						title: '<span style="font-size: 1.2em;"><b><i>Phragmites</i> and Suitable Habitat</b></span>',
						style: 'border-width: 0px',
						items: [{
							id: 'habitatSuitability',
							margin: '0, 0, 0, 15',
							xtype: 'fieldcontainer',
							items: habitatCheckBoxes
						}]
					},{
						xtype: 'fieldset',
						columnWidth: 0.20,
						style: 'border-width: 0px',
						items: [{
							id: 'geotiffDownload',
							xtype: 'button',
							text: 'Download data (geotiff)',
							menu: createDownloadMenu()
						},{
                            id: 'transparencyButton',
                            xtype: 'button',
                            margin: '10 0 0 0',
                            text: 'Set layer opacity...',
                            handler: function() {
                                opacityPanel.show();
                            }
                        }]
					}
				]
				},{
					contentEl: 'map-area',
					id: 'ext-map-area',
					region: 'center',
					layout: 'fit',
					border: 0,
					listeners: {
						bodyresize: function(p,w,h) {
							if (GLRI.ui.map.mainMap){
								GLRI.ui.map.mainMap.updateSize();
							}
                        }
					}
				}] // end tabs
			},
            {
				title: 'FAQs',
				id: 'faqs-tab',
				contentEl: 'mapper-faqs',
				bodyStyle: 'padding: 5px;',
				autoScroll: true
			}]
		},{
			id: 'sidebar-area',
			region: 'east',
			border: 1,
			width: 300,
			layout: 'border',
			margin: '3, 0, 0, 0',
			split: true,
			tools: [{
				type: 'maximize',
				tooltip: 'Toggle page header/footer visibility',
				tooltipType: 'title',
				handler: function(e,t,p,c) {
					// Using the toggleCollapse method didn't work because the element
					// toggled last would be overlaid by the map.
					if (t.className == 'x-tool-maximize') {
						t.className ='x-tool-restore';
						
						Ext.getCmp('ext-header-banner').collapse();
						Ext.getCmp('ext-footer-banner').collapse();
						
					} else {
						t.className ='x-tool-maximize';
						
						Ext.getCmp('ext-header-banner').expand();
						Ext.getCmp('ext-footer-banner').expand();
					}
					GLRI.ui.map.mainMap.updateSize();
				}
			}],
			items: [
			        {
			        	xtype: 'panel',
						title: 'Legend',
						id: 'legend-panel',
						height: 200,
						split: true,
						autoScroll: true,
						bodyStyle: "padding: 5px;",
						region: 'north',
						html: '<div class="legend-div" id="network-layer-div"></div>' + habitatAndStaticLegendDivs
					},{
			        	id: 'help-context-panel', 
			        	title: GLRI.ui.helpContext.map.title,
			        	bbar: ['->','<a href="#" onclick="Ext.getCmp(\'map-and-tabs\').setActiveTab(\'faqs-tab\'); return false;">Open FAQs</a>'],
			        	html: '<div id=help-context-content>' + GLRI.ui.helpContext.map.content + '</div>',
			        	bodyStyle: "padding: 5px;",
			        	autoScroll: true,
			        	region: 'center'
			        }]
		},{
			id: 'ext-footer-banner',
			contentEl: 'footer',
			border: 0,
			region: 'south'
		  }
		]
	});

    var config = GLRI.ui.helpContext.map;
    var el = Ext.get('map-area');
    el.on('click', function() {
        GLRI.ui.setHelpContext(this);
        },
        config);
   // Add staticLayers legends to legend area.
   for (var i = 0; i < GLRI.ui.map.staticLayers.length; i++) {
        GLRI.ui.toggleLegend(GLRI.ui.map.staticLayers[i].name, GLRI.ui.map.staticLayers, true);
   }

   // Add event handler for map-area click
});