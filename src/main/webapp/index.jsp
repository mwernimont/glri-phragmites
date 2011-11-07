<html>
	<head>
		<title>USGS NAWQA WARP Web Map</title>

  
		<script type="text/javascript" src="scrollable_map/JMap-header.js"></script>
		<script type="text/javascript" src="scrollable_map/JMap-base.js"></script>
		<script type="text/javascript" src="scrollable_map/JMap-all.js"></script>

		<link rel="stylesheet" href="scrollable_map/css/scrollable_map.css"/>


		<script type="text/javascript" src="assets/js/js_custom/ncp.js"></script>
	
	
		<script src="ext_js/adapter/ext/ext-base.js"></script>
		<script src="ext_js/ext-all.js"></script>
		<script type="text/javascript" src="assets/js/js_custom/custom.js"></script>
	

	
		<script type="text/javascript">

		
			Ext.ns("WARP");
			Ext.ns("WARP.view");
			Ext.ns("WARP.controller");
			var map1, benchmarkWindow;
			Ext.onReady(function() {
				
				//create map
				map1 = new JMap.web.Map({
					containerEl: 'map-area',
					numTilesX: 7,
					numTilesY: 5,
					minZoom: 1,
					centerLat: 37,
					centerLon: -96,
					zoomLevel: 3,
					mapWidthPx: 600,
					mapHeightPx: 400,
					cacheTiles: true,
					projection: new JMap.projection.PlateCarree(),
					HUD: {
						zoomSlider: true, 
						scaleRake: true,
					 	overviewMap: {
							layersFile: {
								url: 'wms/wms_default.xml'
							}
						}
					},
					layersFile: {
						url: 'wms/wms_default.xml'
					},
					listeners: {
						onLayerAppend: appendLayerCB,
						onLayerRemove: removeLayerCB
					}				
				});
				map1.layerManager.loadMapLayerServicesFile({
					url: 'wms/wms_cache.xml',
					isHiddenFromUser: true,
					isOnByDefault: false
				});
				map1.layerManager.loadMapLayerServicesFile({
					url: 'wms/wms_nmc.xml',
					isHiddenFromUser: false,
					isOnByDefault: false
				});

				benchmarkWindow = new Ext.Window({
					title: 'Select a Benchmark',
					contentEl: 'benchmarks-text',
					bodyStyle: 'padding: 5px; background-color: white',
					modal: true,
					height: 400,
					width: 800,
					initHidden: true,
					draggable: false,
					autoScroll: true,
					resizable: false,
					closeAction: 'hide',
					buttons: [{
						text: 'Close',
						handler: function() {benchmarkWindow.hide()}
					}]
				});

				
				new Ext.ButtonGroup({
					renderTo: 'map-tools',
					id: 'map-tool-buttons',
					columns: 7,
					defaults: {
						iconAlign: 'top',
						tooltipType: 'title',
						style: 'padding: 0px',
						scale: 'medium'
					},
					items: [{
						tooltip: 'Drag Map',
						iconCls: 'hand-drag-icon',
						pressed: true,
						enableToggle: true,
						toggleGroup: 'map-tool-buttons',
						handler: function(b) {
							setMapTitle('Click and drag map around.');
							map1.setMouseAction(null);
						}
					},{
						tooltip: 'Identify Reach',
						iconCls: 'id-reach-icon',
						enableToggle: true,
						toggleGroup: 'map-tool-buttons',
						handler: function(b) {
							setMapTitle('Click on a stream of interest to view further details.');
							map1.setMouseAction(identifyPoint);
						}
					},{
						tooltip: 'Zoom In',
						iconCls: 'zoom-in-icon',
						enableToggle: true,
						toggleGroup: 'map-tool-buttons',
						handler: function(b) {
							setMapTitle('Click to zoom in on a point on the map or draw a bounding box to zoom in on.');
							map1.setMouseAction(JMap.util.Tools.zoomIn);
						}
					},{
						tooltip: 'Zoom Out',
						iconCls: 'zoom-out-icon',
						enableToggle: true,
						toggleGroup: 'map-tool-buttons',
						handler: function(b) {
							setMapTitle('Click to zoom out from a point on the map.');
							map1.setMouseAction(JMap.util.Tools.zoomOut)
						}
					},{
						tooltip: 'Edit Map Layers',
						iconCls: 'map-layers-icon',
						handler: function() {
							(new WARP.view.MapLayerList({map: map1})).show();
						}
					},{
						tooltip: 'Save Map',
						iconCls: 'map-save-icon',
						handler: SaveMap
					},{
						id: 'export-button',
						tooltip: 'Export Data',
						iconCls: 'map-export-icon',
						disabled: true,
						handler: function() {
							loadHelpTip(8);
							exportData();
						}
					}]
				});
						

				
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
								title: 'About WARP (FAQs)',
								contentEl: 'mapper-intro',
								bodyStyle: 'padding: 5px;',
								autoScroll: true,
								listeners: {
									activate: openFAQ,
									deactivate: closeFAQ
								}
							},{
								xtype: 'form',
								id: 'prediction-form',
								bodyStyle: 'padding: 10px',
								title: 'Predicting Concentrations',
								listeners: {activate: function() { loadHelpTip(1); }},
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
											},
											focus: function() {loadHelpTip(7);}
										}
									},{
										xtype: 'button',
										id: 'conc-map-button',
										text: 'Turn Off Map',
										handler: removeDataLayer,
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
										handler: removeDataLayer,
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
							new WARP.view.Legend(),
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

		</script>
		<script type="text/javascript" src="assets/js/Legend.js"></script>
		<script type="text/javascript" src="assets/js/MapLayerList.js"></script>
		
	
	
		<link rel="stylesheet" href="ext_js/resources/css/ext-all.css"/>
		<link rel="stylesheet" href="assets/css/custom.css"/>
		<link rel="stylesheet" href="assets/css/usgs_style_main.css"/>
	
	</head>

	<body>
	
		<div id="header" class="x-hidden">
			<div id="banner-area">
			     
				<h1>US Geological Survey</h1><!-- Not actually visible unless printed -->
				<div id="usgs-header-logo">
					<a title="Link to the US Geological Survey main web page" href="http://www.usgs.gov">
						<img src="assets/images/USGS_web_logo.gif" alt="USGS Logo"/>
					</a>
				</div>
				
				<div class="print-only" id="usgsPrintCommHeader">
					<h3 id="printCommType">Web Page Hardcopy</h3>
					<p class="hide">The section 'Web Page Hardcopy' is only visible when printed.  Ignore if viewing with style sheets turrned off</p>
					<p id="printCommDate">
						<script type="text/javascript">document.write(new Date().toLocaleString());</script>Wed Jul 22 15:17:15 2009
					</p>
					<p id="printCommPrintFrom">Printed From: <script type="text/javascript">document.write(document.location.href);</script>http://infotrek.er.usgs.gov/warp/</p>
					<p>
					  This print version of the page is optimized to print only the
					  content portions of the web page your were viewing and is not
					  intended to have the same formatting as the original page.
					</p>
				</div>
				
				<div id="ccsa-area">
					<h4 class="access-help">Top Level USGS Links</h4>
					<br/>
					<a title="Link to main USGS page" href="http://www.usgs.gov/">USGS Home</a>
					<br/>
					<a title="Link to main USGS contact page" href="http://www.usgs.gov/ask/index.html">Contact USGS</a>
					<br/>
					<a title="Link to main USGS search (not publications search)" href="http://search.usgs.gov/">Search USGS</a>
					<br/>
				</div>
			</div><!-- End content -->
				
			<div class="access-help" id="quick-links">
				<h4>Quick Page Navigation</h4>
				<ul title="links to portions of this page.  Details:  Not normally visible and intended for screen readers.  Page layout has the content near top. Links opening new windows are noted in titles.">
					<li><a title="Main content of this page.  Starts with the pages name." href="#page-content">Page Main Content</a></li>
					<li><a title="Short list of top pages within the site.  Before page content." href="#site-top-links">Top Pages Within This Site</a></li>
					<li><a title="Complete list of page within the site.  After page content." href="#site-full-links">All Pages Within This Site</a></li>
					<li><a title="Pages within the site and external links.  After page content." href="#full-navigation">All Site Pages Plus External Links</a></li>
					<li><a title="HTML and CSS validation links for this page.  After page content." href="#validation-info">HTML and CSS Validation Info</a></li>
					<li><a title="Mainenance info, general USGS links.  Bottom of page, after content." href="#footer">Misc. Page Info</a></li>
				</ul>
			</div>
			
			<h2 id="site-title">
			  Watershed Regressions for Pesticides (WARP) Atrazine Model
			</h2>
		<!--<h3 id="internal-only">For Internal USGS Access Only</h3>-->
		</div>
	
	
		<div id="map-area" class="x-hidden">
			<div id="map-tools" class="map-tools"></div>
		</div>
		<img class="x-hidden" src="assets/images/blank.gif" alt="blank"/>
		
		<div id="mapper-intro" class="x-hidden"><jsp:include page="warpFAQ.jsp" /></div>
		
		<div id="benchmarks-text" class="x-hidden"><jsp:include page="benchmarks.jsp"/></div>
		
		<div style="width: 100%; margin-right: -1em;" id="footer" class="x-hidden">
			<div id="usgs-policy-links">
				<h4 class="access-help">USGS Policy Information Links</h4>
				<ul class="hnav">
					<li><a title="USGS web accessibility policy" href="http://www.usgs.gov/accessibility.html">Accessibility</a></li>
					<li><a title="USGS Freedom of Information Act information" href="http://www.usgs.gov/foia/">FOIA</a></li>
					<li><a title="USGS privacy policies" href="http://www.usgs.gov/privacy.html">Privacy</a></li>
					<li><a title="USGS web policies and notices" href="http://www.usgs.gov/policies_notices.html">Policies and Notices</a></li>
				</ul>
			</div><!-- end usgs-policy-links -->
   
			<div class="content">
				<div id="page-info">
					<p id="footer-doi-links">
						<span class="vcard">
							<a title="Link to the main DOI web site" href="http://www.doi.gov/" class="url fn org">U.S. Department of the Interior</a>
							<span class="adr">
								<span class="street-address">1849 C Street, N.W.</span><br/>
								<span class="locality">Washington</span>, 
								<span class="region">DC</span>
								<span class="postal-code">20240</span>
							</span>
							<span class="tel">202-208-3100</span>
						</span><!-- vcard -->
         				|
						<span class="vcard">
							<a title="Link to the main USGS web site" href="http://www.usgs.gov" class="url fn org">U.S. Geological Survey</a>
							<span class="adr">
								<span class="post-office-box">Box 25286</span><br/>
								<span class="locality">Denver</span>, 
								<span class="region">CO</span>
								<span class="postal-code">8022</span>
							</span>
						</span><!-- vcard -->
      				</p>
					<p>USGS General Information Product 59</p>
					<p id="footer-page-url">URL: http://infotrek.er.usgs.gov/warp/</p>
					<p id="footer-contact-info">
						  Page Contact Information:
						<a href="mailto:nlbooth@usgs.gov?subject=WARP Map Comments" title="Contact Email">webmaster</a>
					</p>
       				<p id="footer-page-modified-info">Page Last modified: <script type="text/javascript">document.write(document.lastModified);</script>07/22/2009 15:17:12</p>
				</div><!-- /page-info -->
				<div id="gov-buttons">
					<a href="http://firstgov.gov/" title="link to the official US Government web portal">
						<img alt="FirstGov button" src="http://infotrek.er.usgs.gov/docs/nawqa_www/nawqa_public_template/assets/footer_graphic_firstGov.jpg"/>
					</a>
					<a href="http://www.takepride.gov/" title="Link to Take Pride in America, a volunteer organization that helps to keep America's public lands beautiful.">
						<img alt="Take Pride in America button" src="http://infotrek.er.usgs.gov/docs/nawqa_www/nawqa_public_template/assets/footer_graphic_takePride.jpg"/>
					</a>
				</div><!-- /gov-buttons -->
			</div><!-- /content -->
		</div>
	

		<form id="save_map_form" method="POST" action="http://infotrek.er.usgs.gov/map_save_servlet/SaveMap" class="x-hidden">
			<input type="hidden" id="xml_req" name="xml_req" value=""/>
		</form>
		
	</body>
</html>