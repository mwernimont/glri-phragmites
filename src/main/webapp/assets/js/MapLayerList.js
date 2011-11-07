WARP.view.MapLayerList = Ext.extend(Ext.Window, {
	title: 'Edit Map Layers...',
	id: 'edit-map-layers-window',
	modal: true,
	resizable: false,
	width: 600,
	height: 400,
	layout: 'border',
	map: this.map,

	initComponent: function() {
		this.controller = new WARP.controller.MapLayerList(this.map);
		Ext.apply(this, {
			items: {
				id: 'map-layers-panel',
				region: 'center',
				layout: 'anchor',
				autoScroll: true,
				border: false,
				bodyStyle: 'padding: 5px'
			},
			buttons: [{
				text: 'Done',
				handler: function() {
					Ext.getCmp('edit-map-layers-window').close();
				}
			}]
		
		});
		WARP.view.MapLayerList.superclass.initComponent.call(this);
	},

	show: function() {
		WARP.view.MapLayerList.superclass.show.call(this);
		this.controller.listLayers();
		this.doLayout();
	}
	

});







WARP.controller.MapLayerList = function(map) {
	this.map = map;
	
	
	this.listLayers = function() {
		//get layers
		this.mapLayers = this.map.layerManager.getAvailableLayers();
		var panel = Ext.getCmp('map-layers-panel');
		var _this = this;

		for (var i = 0; i < this.mapLayers.length; i++) {
			var l = this.mapLayers[i];

			if (!l.isHiddenFromUser || _this.map.layerManager.getActiveLayer(l.id)) {

				var layerHTML = '';
				layerHTML += '<div class="clearfix">';
				layerHTML += '<img style="float:left; border: dotted gray 1px; width: 150px;" src="' + l.legendUrl + '" alt="legend" />';
				layerHTML += '<div style="float:left; padding-left: 5px; width: 345px;">';
				layerHTML += '</div>';
				
				var descHTML = '<h2>' + l.title + '</h2>';
				descHTML += '<p>Description: ' + l.description + '</p>';
				descHTML += '</div>';
				
				//create a panel for this layer
				var p = new Ext.Panel({
					style: 'padding-bottom: 5px',
					bodyStyle: 'padding: 3px;',
					layout: 'column',
					layoutConfig: {columns: 2},
					items: [{
						width: 160,
						xtype: 'form',
						labelWidth: 50,
						border: false,
						items: [{
							xtype: 'panel',
							bodyStyle: 'padding: 3px',
							html: layerHTML,
							border: false
						},{
							xtype: 'checkbox',
							fieldLabel: 'On/Off',
							checked: !!(_this.map.layerManager.getActiveLayer(l.id)),
							hidden: l.isHiddenFromUser,
							hideLabel: l.isHiddenFromUser,
							layerId: l.id,
							listeners: {
								check: function(c,b) {
									if (b) {
										_this.map.appendLayer(c.layerId);									
									} else {
										_this.map.removeLayer(c.layerId);
									}
								}
							}
						},{
							xtype: 'slider',
							fieldLabel: 'Opacity',
							layerId: l.id,
						    width: 100,
						    value: l.opacity,
						    increment: 1,
						    minValue: 0,
						    maxValue: 100,
						    listeners: {
								change: function(s, v) {
									_this.map.layerManager.getMapLayer(s.layerId).setOpacity(v);
								}
							}
						}]
					},{
						html: descHTML,
						width: 350,
						border: false
					}]
				});
				panel.add(p);
			}
		}
		
	};
	
}