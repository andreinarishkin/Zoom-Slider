// set zoom level on the slider
function getZoom()
{
	chrome.tabs.getZoom(function(zoomFactor)
	{
		var zoom = Math.round(zoomFactor * 100);
		document.getElementById("slider").value = zoom;
	});
}

// apply zoom to the page
function setZoom(value)
{
	chrome.tabs.setZoom(value / 100);
}

// stuff to do on popup load
window.addEventListener("DOMContentLoaded", function()
{
	// get UI color
	chrome.storage.local.get("uiColor", function(settings)
	{
		document.body.className = settings.uiColor;
	});
	
	// get the default zoom level and set it on the slider
	chrome.tabs.getZoomSettings(function(zoomSettings)
	{
		document.getElementById("default").text = Math.round(zoomSettings.defaultZoomFactor * 100);
		document.getElementById("steps").style.bottom = Math.round(zoomSettings.defaultZoomFactor * 100) - 15 + "px";
	});
	
	// set zoom level on the slider
	getZoom();
	
	// bind event listener to the slider
	document.getElementById("slider").addEventListener("input", function()
	{
		setZoom(document.getElementById("slider").value);
	}, false);
}, false);

// handle mouse wheel to zoom
window.addEventListener("wheel", function(e)
{
	if (e.deltaY < 0)
	{
		document.getElementById("slider").stepUp(); // zoom in by 1%
	}
	else
	{
		document.getElementById("slider").stepDown(); // zoom out by 1%
	}
	setZoom(document.getElementById("slider").value);
}, false);

// catch zoom change initiated from outside the extension
chrome.tabs.onZoomChange.addListener(function(ZoomChangeInfo)
{
	getZoom();
});