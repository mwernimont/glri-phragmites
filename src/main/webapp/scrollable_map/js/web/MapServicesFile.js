JMap.web.MapServicesFile = function(params) {
	this.url = params.url;
	this.name = params.name;
	this.isOnByDefault = params.isOnByDefault;
	if (this.isOnByDefault == undefined) {
		this.isOnByDefault = true;
	}
	this.isHiddenFromUser = params.isHiddenFromUser;
	this.onLoad = params.onLoad;
	var _this = this;
	
	new JMap.util.AjaxRequest({
		method: 'GET',
		url: this.url,
		paramString: 'nocache=' + (new Date()).getTime(),
		onData: function(arg) { _this._fileLoaded(arg); }
	});
}


JMap.web.MapServicesFile.prototype._fileLoaded = function(req) {
	var _this = this;
	var xml = req.getResponseXML();
	req = null;
	this.onLoad(xml, _this);
}