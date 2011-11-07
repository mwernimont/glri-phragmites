WARP.view.Legend = Ext.extend(Ext.Panel, {
	title: 'Legend',
	id: 'legend-panel',
	height: 200,
	anchor: '100%',
	autoScroll: true,
	region: 'north',
	html: '<div id="data-layer-div"></div><div id="predictor-layer-div"></div>',
	initComponent: function() {
		this.controller = new WARP.controller.Legend();
		WARP.view.Legend.superclass.initComponent.call(this);
	}

});

WARP.controller.Legend = function() {
	
	
	this.tpl = new Ext.Template(
		'<div id="legend_{id}" class="legend-item">',
			'<div title="{title}">{shortTitle}</div>',
			'<img src="{src}" alt="legend item"/>',
		'</div>'
	);
	
	
	this.appendLegendItem = function(layer) {		
		var params = {
			id: layer.id,	
			src: layer.legendUrl,
			title: layer.title,
			shortTitle: layer.title //Ext.util.Format.ellipsis(layer.title, 35, true)
		}
		
		if (!params.src) params.src = 'assets/images/blank.gif';
		if (!document.getElementById('legend_' + params.id)) {
			if (params.id <= -800 && params.id >= -816) {
				var tpl = new Ext.Template(
					'<div id="legend_{id}" class="legend-item">',
						'<div title="{title}">{shortTitle}</div>',
						'<img id="datalayer-legend" src="{src}" alt="legend item"/>',
					'</div>'
				);
				//data layer
				tpl.insertBefore(document.getElementById('data-layer-div'), params);
			} else if (params.id <= -90 && params.id > -800) {
				//predictor layer
				this.tpl.insertBefore(document.getElementById('predictor-layer-div'), params);
			} else {
				//everything else
				this.tpl.insertAfter(document.getElementById('predictor-layer-div'), params);
			}
		}
	};
	
	this.removeLegendItem = function(id) {
		var legend = Ext.get('legend-panel');
		var legendItem = document.getElementById('legend_' + id);
		if (legendItem) legendItem.parentNode.removeChild(legendItem);
	};
	
}