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
		// Return a list of checkbox objects that represent the layers
		// and can be used to turn on/off the visibility of that layer.
		var dataArray = [];
		for (var i = 0; i < layers.length; i++){
			dataArray.push({
				boxLabel: layers[i].name,
				xtype: 'checkbox',
				listeners: {
					change: function(checkbox, newValue, oldValue) {
						GLRI.ui.toggleLayerMap(checkbox.boxLabel, newValue);
						GLRI.ui.toggleLegend(checkbox.boxLabel, GLRI.ui.map.habitatLayers, newValue);
					}
				}
			});
		};
		return dataArray;
	};
	
	var createLegendDiv = function (layers) {
		// Create the div elements to be used to display legends for each layer in layers.
		// Assumes that there is a legendDivId property for each object in the layers list.
		var html = '';
		for (var i = 0; i < layers.length; i++){
			html += '<div id="' + layers[i].legendDivId + '"></div>';
		}
		return html;
	};
	
	var otherCheckBoxes = createLayerCheckBoxes(GLRI.ui.map.habitatLayers.slice(0, 1));
	var habitatCheckBoxes = createLayerCheckBoxes(GLRI.ui.map.habitatLayers.slice(1));
	var habitatLegendDiv = createLegendDiv(GLRI.ui.map.habitatLayers);
	
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
			activeTab: 1,
			margin: '3 0 3 3',
			bodyborder: true,
			items: [{
				title: 'About the DSS (FAQs)',
				id: 'about-tab',
				contentEl: 'mapper-intro',
				bodyStyle: 'padding: 5px;',
				autoScroll: true
				},
				{
				region: 'north',
				layout: 'border',
				title: 'Vulnerability Assessment',
				items: [{
					xtype: 'form',
					id: 'phragmites-map-form',
					bodyStyle: 'padding: 10px',
					title: 'Vulnerability Assessment',
					layout: 'column',
					region: 'north',
					split: true,
					height: 110,
					border: 0,
					items: [{
						xtype: 'fieldset',
						columnWidth: 0.50,
						style: 'border-width: 0px',
						items: [{
							anchor: '80% 50%',
							fieldLabel: 'Reduced Lake Level Corridors',
							labelStyle: 'text-wrap: none;',
							labelWidth: 170,
							id: 'phragmitesNetwork',
							name: 'phragmitesNetwork', // Test to see if this fixes IE 7 display issues
							xtype: 'combo',
							triggerAction: 'all',
							lazyRender:true,
							forceSelection: true,
							value: 'Map Off',
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
								}
							},
							valueField: 'network',
							displayField: 'network'
						},
						{
							style: 'padding-top: 10px',
							id: 'otherSuitability',
							xtype: 'fieldcontainer',
							items: otherCheckBoxes
						}]
					},{
						xtype: 'fieldset',
						columnWidth: 0.50,
						style: 'border-width: 0px',
						items: [{
							id: 'habitatSuitability',
							xtype: 'fieldcontainer',
							items: habitatCheckBoxes
						}]
					}]
				},{
					contentEl: 'map-area',
					id: 'ext-map-area',
					title: 'Click and drag the map around.',
					region: 'center',
					layout: 'fit',
					border: 0,
					toolTemplate: new Ext.Template('<div title="{title}" class="x-tool x-tool-{id}">&#160;</div>'),
					tools: [{
						id: 'maximize',
						title: 'toggle map area size',
						handler: function(e,t,p,c) {
							// Using the toggleCollapse method didn't work because the element
							// toggled last would be overlaid by the map.
							if (t.className == 'x-tool-maximize') {
								t.className ='x-tool-restore';
								
								Ext.getCmp('ext-header-banner').collapse();
								Ext.getCmp('ext-footer-banner').collapse();
								
								GLRI.ui.map.mainMap.updateSize();
							} else {
								t.className ='x-tool-maximize';
								
								Ext.getCmp('ext-header-banner').expand();
								Ext.getCmp('ext-footer-banner').expand();
							}
						}
					}],
					listeners: {
						bodyresize: function(p,w,h) {
							if (GLRI.ui.map.mainMap){
								GLRI.ui.map.mainMap.updateSize();
							}
						}					
					}
				}] // end tabs
			}]
		},{
			id: 'sidebar-area',
			region: 'east',
			border: 0,
			width: 300,
			layout: 'border',
			margin: 3,
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
						html: '<div id="network-layer-div"></div>' + habitatLegendDiv
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
			border: 0,
			region: 'south'
		  }
		]
	});
});