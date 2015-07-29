chrome.runtime.onInstalled.addListener(function(details)
{
	if (details.reason === "install" || details.reason === "update")
	{
		// throw notification
		var title = chrome.i18n.getMessage("notification_" + details.reason + "_title");
		var body = chrome.i18n.getMessage("notification_" + details.reason + "_body");
		var n = new Notification(title,
		{
			tag : "site_settings_sidebar", 
			dir : "auto",
			lang : window.navigator.language,
			icon : "icons/icon48.png", 
			body : body
		});
		n.onclick = function()
		{
			chrome.runtime.openOptionsPage();
		};
	}
});

// disable browserAction on pages where extensions are not allowed to run
function disableButton()
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if (tabs.length === 1)
		{
			var protocol = tabs[0].url.slice(0, tabs[0].url.indexOf(":"));
			if (/addons.opera.com/.test(tabs[0].url) === true)
			{
				chrome.browserAction.disable(tabs[0].id);
			}
			else if (protocol === "opera" || protocol === "chrome" || protocol === "browser" || protocol === "chrome-extension")
			{
				chrome.browserAction.disable(tabs[0].id);
			}
			else
			{
				chrome.browserAction.enable(tabs[0].id);
			}
		}
	});
}

function getZoom(ZoomChangeInfo)
{
	chrome.tabs.getZoom(function(zoomFactor)
	{
		var zoom = Math.floor(zoomFactor * 100);
		chrome.browserAction.setBadgeText({text: zoom.toString()});
	});
}

window.addEventListener("load", function()
{
	disableButton();
	getZoom();
}, false);

chrome.tabs.onUpdated.addListener(function(tab)
{
	disableButton();
	getZoom();
});
chrome.tabs.onActivated.addListener(function(tab)
{
	disableButton();
	getZoom();
});

chrome.tabs.onZoomChange.addListener(function(ZoomChangeInfo)
{
	getZoom();
});