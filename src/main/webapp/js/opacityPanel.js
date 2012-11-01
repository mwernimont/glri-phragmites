opacityPanel = {};

opacityPanel.show = function () {

    var createOpacityBox = function(name, opacity, changeFnct) {
        return {
            xtype: 'numberfield',
            fieldLabel: name,
            labelWidth: 250,
            size: 5,
            value: opacity * 100,
            maxValue: 100,
            minValue: 20,
            step: 5,
            listeners: {
                change: {
                    fn: changeFnct
                }
            }
        };
    };

    var boxes = [];

    // Network layers should have the same opacity
    boxes.push(createOpacityBox(
        'Within reduced lake-level corridors',
        GLRI.ui.map.networkLayers[0].opacity,
        function(cmp, newValue, oldValue, eOpts){
            for (var i in GLRI.ui.map.networkLayers) {
                GLRI.ui.map.networkLayers[i].opacity = newValue / 100.0;
                var layerList = GLRI.ui.map.mainMap.getLayersByName(GLRI.ui.map.networkLayers[i].name);
                for (var k in layerList) {
                    layerList[k].setOpacity(GLRI.ui.map.networkLayers[i].opacity);
                }
            }
        }
    ));

    for (var i in GLRI.ui.map.habitatLayers) {
        boxes.push(createOpacityBox(
            GLRI.ui.map.habitatLayers[i].name,
            GLRI.ui.map.habitatLayers[i].opacity,
            function(cmp, newValue, oldValue, eOpts) {
                layerName = cmp.getFieldLabel();
                for (var j in GLRI.ui.map.habitatLayers) {
                    if (GLRI.ui.map.habitatLayers[j].name === layerName) {
                        GLRI.ui.map.habitatLayers[j].opacity = newValue / 100.0;
                        var layerList = GLRI.ui.map.mainMap.getLayersByName(layerName);
                        for (var k in layerList) {
                            layerList[k].setOpacity(GLRI.ui.map.habitatLayers[j].opacity);
                        }
                        return;
                    }
                }

            })
        );
    }
        
    Ext.create('Ext.window.Window', {
        title: 'Layer Opacity',
        height: 170,
        width: 350,
        layout: 'fit',
        items: [{
            xtype: 'container',
            padding: '10, 10, 10, 10',
            layout: 'column',
            autoScroll: true,
            items: boxes
        }]
    }).show();
};


