

function unDisplayActiveLabel() {
	var popup = document.getElementById('ncp-popup');
	if (popup) {
		document.body.removeChild(popup);
		document.onmousemove = null;
	}
}


function displayActiveLabel(which, text) {
	document.onmousemove = showPopup;
	popup = document.createElement('div');
	popup.id = 'ncp-popup';
	popup.className = 'ncp-hover';
	popup.style.display = 'none';
	popup.innerHTML = text;
	document.body.appendChild(popup);
}

function showPopup(event) {
	event = event || window.event;
	var popup = document.getElementById('ncp-popup');
	popup.style.display = 'block';
	var x = event.clientX;
	var y = event.clientY;
	
	var pWid = Ext.get('ncp-popup').getComputedWidth();
	var pHei = Ext.get('ncp-popup').getComputedHeight();
	
	popup.style.left = (x - Math.floor(pWid/2)) + 'px';
	popup.style.top = (y + Math.floor(pHei * (3/4))) + 'px';
}