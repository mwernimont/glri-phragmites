Ext.onReady(function() {	
	new Ext.Viewport({
		layout: 'border',
		border: false,
		plain: true,
		items: [{
			id: 'ext-header-banner',
			region: 'north',
			contentEl: 'header',
			xtype: 'panel',
			border: false
		},{
			id: 'map-and-tabs',
			layout: 'border',
			region: 'center',
			style: 'padding: 5px',
			plain: true,
			border: false,
			items: [{
				id: 'tabs-area',
				xtype: 'tabpanel',
				region: 'north',
				activeTab: 1,
				height: 100,
				items: [{
					title: 'About the DSS (FAQs)',
					contentEl: 'mapper-intro',
					bodyStyle: 'padding: 5px;',
					autoScroll: true
				},{
					xtype: 'form',
					id: 'prediction-form',
					bodyStyle: 'padding: 10px',
					title: 'Predicting Concentrations',
					layout: 'column',
					defaults: {
						border: false,
						labelWidth: 180
					},
					items: [{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.5,
						items: [{
							fieldLabel: 'Choose an Annual Statistic',
							id: 'annual-stat',
							xtype: 'combo',
							anchor: '90%',
							minListWidth: 300,
							triggerAction: 'all',
							lazyRender:true,
							forceSelection: true,
							value: 'none,none',
							editable: false,
							mode: 'local',
							store: new Ext.data.ArrayStore({
								id: 0,
								fields: [
								         'modelRunConc',
								         'displayText'
								         ],
								         data: [
								                ['none,none', 'Map Off'],
								                ['-801,MEAN', 'Mean'], 
								                ['-802,P50', 'Median'], 
								                ['-803,P95', 'P95-tile'], 
								                ['-804,MAX', 'Maximum'],
								                ['-805,21D', '21 Day Moving Avg'],
								                ['-806,60D', '60 Day Moving Avg'],
								                ['-807,90D', '90 Day Moving Avg']
								                ]	
							}),
							valueField: 'modelRunConc',
							displayField: 'displayText',
							listeners: {
								select: function(c,r,i) { 
									var layerId = r.data.modelRunConc.split(',')[0];
									Ext.getCmp('wq-benchmark').setValue('Select Benchmark');
									Ext.getCmp('threshold').setValue(null);
									appendDataLayer(layerId); 
								}
							}
						},{
							xtype: 'button',
							id: 'conc-map-button',
							text: 'Turn Off Map',
							hidden: true
						}]
					},{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.5,
						items: [{
							id: 'predictor-conc-tab',
							fieldLabel: 'Predictor Variables',
							xtype: 'combo',
							triggerAction: 'all',
							forceSelection: true,
							anchor: '90%',
							minListWidth: 300,
							lazyRender:true,
							mode: 'local',
							value: 'none',
							editable: false,
							store: new Ext.data.ArrayStore({
								id: 0,
								fields: [
								         'modelFactorId',
								         'displayText'
								         ],
								         data: [['none', 'None Mapped'], [-100, 'Atrazine Use (lbs/mi2) in 2007'], [-101, 'Soil erodibility factor (USLE K)'], [-102, 'Rainfall and runoff factor (USLE R)'], [-103, 'Dunne Overland Flow (%)'], [-105, 'Precipitation (inches) May and June 2007']]
							}),
							valueField: 'modelFactorId',
							displayField: 'displayText',
							listeners: {
								select: function(c,r,i) {
									appendPredictorLayer(r.data.modelFactorId);
								},
								focus: function() {
									loadHelpTip(0);
								}
							}
						},{
							fieldLabel: 'Show Model Development Sites',
							xtype: 'checkbox',
							id: 'sites-conc-tab',
							listeners: {
								check: function(c,b) {
									toggleSitesLayer(b,c);
								},
								focus: function() {
									loadHelpTip(5);
								}
							}
						},{
							xtype: 'hidden',
							id: 'threshold',
							name: 'threshold'
						},{
							xtype: 'hidden',
							id: 'model_output',
							name: 'model_output'
						}]
					}]
				},{
					title: 'Probability of Exceeding Benchmarks',
					listeners: {activate: function() { loadHelpTip(2); }},
					bodyStyle: 'padding: 10px',
					xtype: 'form',
					id: 'probability-form',
					layout: 'column',
					autoHeight: true,
					defaults: {
						border: false,
						labelWidth: 180
					},
					items: [{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.5,
						items: [{
							fieldLabel: 'Water Quality Benchmark',
							xtype: 'trigger',
							id: 'wq-benchmark',
							readOnly: true,
							editable: false,
							value: 'Select Benchmark',
							anchor: '90%',
							onTriggerClick: function() { benchmarkWindow.show(); loadHelpTip(2); }
						},{
							xtype: 'button',
							id: 'prob-map-button',
							text: 'Turn Off Map',
							hidden: true
						}]
					},{
						xtype: 'fieldset',
						autoHeight: true,
						columnWidth: 0.5,
						items: [{
							id: 'predictor-prob-tab',
							fieldLabel: 'Predictor Variables',
							xtype: 'combo',
							triggerAction: 'all',
							lazyRender:true,
							anchor: '90%',
							minListWidth: 300,
							forceSelection: true,
							value: 'none',
							editable: false,
							mode: 'local',
							store: new Ext.data.ArrayStore({
								id: 0,
								fields: [
								         'modelFactorId',
								         'displayText'
								         ],
								         data: [['none', 'None Mapped'], [-100, 'Atrazine Use (lbs/mi2) in 2007'], [-101, 'Soil erodibility factor (USLE K)'], [-102, 'Rainfall and runoff factor (USLE R)'], [-103, 'Dunne Overland Flow (%)'], [-105, 'Precipitation (inches) May and June 2007']]
							}),
							valueField: 'modelFactorId',
							displayField: 'displayText',
							listeners: {
								select: function(c,r,i) {
									appendPredictorLayer(r.data.modelFactorId);
								},
								focus: function() {
									loadHelpTip(0);
								}
							}
						},{
							fieldLabel: 'Show Model Development Sites',
							xtype: 'checkbox',
							id: 'sites-prob-tab',
							listeners: {
								check: function(c,b) {
									toggleSitesLayer(b,c);
								},
								focus: function() {
									loadHelpTip(5);
								}
							}										
						}]
					}]
				}] // end tabs
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
						if (t.hasClass('x-tool-maximize')) {
							t.removeClass('x-tool-maximize');
							t.addClass('x-tool-restore');
						} else {
							t.removeClass('x-tool-restore');
							t.addClass('x-tool-maximize');
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
						if (map1) map1.resize(w-2,h-2);
					}
				}
			}]
		},{
			id: 'sidebar-area',
			region: 'east',
			border: false,
			width: 300,
			layout: 'border',
			style: 'padding-top: 5px; padding-right: 5px;',
			defaults: {
				style: 'padding-bottom: 5px'
			},
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
			region: 'south',
			collapsed: true
		}]
	});
});