// update browserAction badge
function getZoom()
{
	chrome.tabs.getZoom(function(zoomFactor)
	{
		var zoom = Math.round(zoomFactor * 100);
		document.getElementById("slider").value = zoom;
		chrome.browserAction.setBadgeText({text: zoom.toString()});
	});
}

// set the zoom level
function setZoom(value)
{
	chrome.tabs.setZoom(value / 100);
}

// stuff to do on popup load
window.addEventListener("DOMContentLoaded", function()
{
	// get the default zoom level
	chrome.tabs.getZoomSettings(function(zoomSettings)
	{
		document.getElementById("default").text = Math.round(zoomSettings.defaultZoomFactor * 100);
		document.getElementById("steps").style.bottom = Math.round(zoomSettings.defaultZoomFactor * 100) - 15 + "px";
	});
	
	// update browserAction badge
	getZoom();
	
	// bind listener to the slider
	document.getElementById("slider").addEventListener("input", function()
	{
		setZoom(document.getElementById("slider").value);
	}, false);
}, false);

// use the mouse wheel to zoom
window.addEventListener("wheel", function(e)
{
	if (e.deltaY < 0)
	{
		document.getElementById("slider").stepUp();
	}
	else
	{
		document.getElementById("slider").stepDown();
	}
	setZoom(document.getElementById("slider").value);
}, false);

// catch zoom change initiated from outside the extension
chrome.tabs.onZoomChange.addListener(function(ZoomChangeInfo)
{
	getZoom();
});