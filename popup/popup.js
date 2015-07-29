function getZoom()
{
	chrome.tabs.getZoom(function(zoomFactor)
	{
		var zoom = Math.round(zoomFactor * 100);
		document.getElementById("slider").value = zoom;
		chrome.browserAction.setBadgeText({text: zoom.toString()});
	});
}

function setZoom(value)
{
	chrome.tabs.setZoom(value/100);
	chrome.browserAction.setBadgeText({text: value});
}

window.addEventListener("DOMContentLoaded", function()
{
	window.devicePixelRatio = 1.0;
	chrome.tabs.getZoomSettings(function(zoomSettings)
	{
		document.getElementById("default").text = zoomSettings.defaultZoomFactor*100;
	});
	getZoom();
	document.getElementById("slider").addEventListener("input", function()
	{
		setZoom(document.getElementById("slider").value);
	}, false);
	
}, false);

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

chrome.tabs.onZoomChange.addListener(function(ZoomChangeInfo)
{
	getZoom();
});