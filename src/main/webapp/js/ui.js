Ext.onReady(function() {	
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
					contentEl: 'mapper-intro',
					bodyStyle: 'padding: 5px;',
					autoScroll: true
				},{
				id: 'tabs-area',
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
						columnWidth: 0.5,
						style: 'border-width: 0px',
						items: [{
							fieldLabel: 'Corridor Network',
							id: 'phragmitesNetwork',
							xtype: 'combo',
							anchor: '90%',
							minListWidth: 300,
							triggerAction: 'all',
							lazyRender:true,
							forceSelection: true,
							value: 'none,none',
							editable: false,
							mode: 'local',
							labelWidth: 180,
							store: new Ext.data.ArrayStore({
								id: 0,
								fields: [
								         'network',
								         'displayText'
								         ],
								         data: [
								                ['stuff', 'Network'] //TODO hardcode or load this store
								                ]	
							}),
							valueField: 'network',
							displayField: 'displayText'
						}]
					},{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.5,
						style: 'border-width: 0px',
						items: [{
							id: 'habitatSuitability',
							fieldLabel: 'Habitat Suitability',
							xtype: 'combo',
							triggerAction: 'all',
							forceSelection: true,
							anchor: '90%',
							minListWidth: 300,
							lazyRender:true,
							mode: 'local',
							value: 'none',
							editable: false,
							labelWidth: 180,
							store: new Ext.data.ArrayStore({
								id: 0,
								fields: [
								         'service',
								         'displayText'
								         ],
								         data: [
								                ['none', 'A Service'] //TODO hardcode or load store
								         ]
							}),
							valueField: 'service',
							displayField: 'displayText'
						},{
							fieldLabel: 'Show Lidar Availability Layer',
							xtype: 'checkbox',
							labelWidth: 180,
							id: 'showLidarAvailability'
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
								t.className ='x-tool-restore';'x-tool-maximize'
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
			        	id: 'help-context-panel', 
			        	title: 'Help Context',
			        	bbar: ['->','<a href="#" onclick="Ext.getCmp(' + "'" + 'tabs-area' + "'" + ').activate(0); return false;">Open FAQs</a>'],
			        	html: 'Watch here for for explanations on various parts of the application.',
			        	bodyStyle: 'padding: 5px',
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