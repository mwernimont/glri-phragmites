Ext.onReady(function() {	
	
	var createLayersDropDown = function(emptyOption, layers){
		// Return a list of names to be used for a layers drop down menu.
		// The emptyOption parameter defines the empty option.
		var dataArray = [[emptyOption]];
		for(var i = 0; i < layers.length; i++){
			dataArray.push([layers[i].name]);
		}
		return dataArray;
	};

	var networkDataArray = createLayersDropDown('Map Off', GLRI.ui.map.networkLayers);
	
	var createLayerCheckBoxes = function (layers){
		var dataArray = [];
		for (var i = 0; i < layers.length; i++){
			dataArray.push({
				boxLabel: layers[i].name,
				xtype: 'checkbox',
				listeners: {
					change: function(checkbox, newValue, oldValue) {
						GLRI.ui.toggleLayerMap(checkbox.boxLabel, GLRI.ui.map.habitatLayers, newValue);
						GLRI.ui.toggleLegend(checkbox.boxLabel, GLRI.ui.map.habitatLayers, newValue);
					}
				}
			});
		};
		return dataArray;
	};
	
	var createLegendHtml = function (layers) {
		var html = '';
		for (var i = 0; i < layers.length; i++){
			html += '<div id="' + layers[i].legendDivId + '"></div>';
		}
		return html;
	};
	
	var habitatCheckBoxes = createLayerCheckBoxes(GLRI.ui.map.habitatLayers);
	var habitatLegendHTML = createLegendHtml(GLRI.ui.map.habitatLayers);
	
	Ext.create('Ext.container.Viewport', {
		layout: 'border',
		border: false,
		plain: true,
		listeners: {
			afterrender: GLRI.ui.initMap
		},
		items: [{
			id: 'ext-header-banner',
			region: 'north',
			contentEl: 'header',
			xtype: 'panel',
			border: false
		},{
			id: 'map-and-tabs',
			region: 'center',
			xtype: 'tabpanel',
			activeTab: 1,
			margin: '3 0 3 3',
			border: false,
			bodyBorder: true,
			items: [{
					title: 'About the DSS (FAQs)',
					id: 'about-tab',
					contentEl: 'mapper-intro',
					bodyStyle: 'padding: 5px;',
					autoScroll: true
				},{
				region: 'north',
				layout: 'border',
				title: 'Phragmites Corridor Network',
				height: 100,
				border: false,
				items: [{
					xtype: 'form',
					id: 'prediction-form',
					bodyStyle: 'padding: 10px',
					title: 'Phragmites Corridor Network',
					layout: 'column',
					region: 'north',
					items: [{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.45,
						style: 'border-width: 0px',
						items: [{
							fieldLabel: 'Corridor Network',
							id: 'phragmitesNetwork',
							xtype: 'combo',
							anchor: '.9',
							triggerAction: 'all',
							lazyRender:true,
							forceSelection: true,
							value: 'Map Off',
							editable: false,
							mode: 'local',
							labelWidth: 120,
							store: new Ext.data.ArrayStore({
								fields: [
								         'network'
								         ],
								         data: networkDataArray	
							}),
							listeners: {
								select: function(a, b, c) {
									GLRI.ui.turnOnLayerMap(b[0].data.network, GLRI.ui.map.networkLayers);
									GLRI.ui.turnOnLegend(b[0].data.network, GLRI.ui.map.networkLayers, 'network-layer-div');
								}
							},
							valueField: 'network',
							displayField: 'network'
						}]
					},{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.55,
						style: 'border-width: 0px',
						items: [{
							id: 'habitatSuitability',
							fieldLabel: 'Habitat Suitability',
							xtype: 'fieldcontainer',
							items: habitatCheckBoxes
						},{
							fieldLabel: 'Show Lidar Availability Layer',
							xtype: 'checkbox',
							labelWidth: 180,
							id: 'showLidarAvailability',
							listeners: {
								change: function() { alert('Function not yet implemented');} //TODO duhhhh
							}
						}]
					}]
				},{
					contentEl: 'map-area',
					id: 'ext-map-area',
					title: 'Click and drag the map around.',
					region: 'center',
					layout: 'fit',
					border: false,
					toolTemplate: new Ext.Template('<div title="{title}" class="x-tool x-tool-{id}">&#160;</div>'),
					tools: [{
						id: 'maximize',
						title: 'toggle map area size',
						handler: function(e,t,p,c) {
							if (t.className == 'x-tool-maximize') {
								t.className ='x-tool-restore';
							} else {
								t.className ='x-tool-restore';'x-tool-maximize';
							}

							if (!Ext.getCmp('ext-header-banner').collapsed) {
								Ext.getCmp('ext-footer-banner').collapse();
							} else {
								Ext.getCmp('ext-footer-banner').expand();
							}
							Ext.getCmp('ext-header-banner').toggleCollapse();

							//Ext.getCmp('ext-footer-banner').toggleCollapse();									
						}
					}],
					listeners: {
						bodyresize: function(p,w,h) {
							if (GLRI.ui.map.mainMap) GLRI.ui.map.mainMap.updateSize();
						}
					}
				}] // end tabs
			}]
		},{
			id: 'sidebar-area',
			region: 'east',
			border: false,
			width: 300,
			layout: 'border',
			margin: 3,
			items: [
			        {
			        	xtype: 'panel',
						title: 'Legend',
						id: 'legend-panel',
						height: 200,
						anchor: '100%',
						autoScroll: true,
						bodyStyle: "padding: 5px;",
						region: 'north',
						html: '<div id="network-layer-div"></div><br/>' + habitatLegendHTML
					},{
			        	id: 'help-context-panel', 
			        	title: 'Help Context',
			        	bbar: ['->','<a href="#" onclick="Ext.getCmp(\'map-and-tabs\').setActiveTab(\'about-tab\'); return false;">Open FAQs</a>'],
			        	html: 'Watch here for for explanations on various parts of the application. Content of this box and its header should change based on user selections.', //TODO
			        	bodyStyle: "padding: 5px;",
			        	autoScroll: true,
			        	region: 'center'
			        }]
		},{
			id: 'ext-footer-banner',
			contentEl: 'footer',
			border: false,
			region: 'south'
		}]
	});
});