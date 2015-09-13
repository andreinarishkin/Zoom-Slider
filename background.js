// do some stuff in install and update
chrome.runtime.onInstalled.addListener(function(details)
{
	if (details.reason === "install" || details.reason === "update")
	{
		// insert context menu items into browserAction
		chrome.contextMenus.create({type: "normal", id: "zoom_slider.reset", contexts: ["browser_action"], title: chrome.i18n.getMessage("context_menu_reset")});
		chrome.contextMenus.create({type: "separator", id: "zoom_slider.separator", contexts: ["browser_action"]});
		chrome.contextMenus.onClicked.addListener(function(info, tab)
		{
			if (info.menuItemId === "zoom_slider.reset")
			{
				chrome.tabs.getZoomSettings(function(zoomSettings)
				{
					chrome.tabs.setZoom(zoomSettings.defaultZoomFactor);
				});
			}
		});
		
		// update browserAction
		getZoom(true);
		
		// throw notification
		var title = chrome.i18n.getMessage("notification_" + details.reason + "_title");
		var body = chrome.i18n.getMessage("notification_" + details.reason + "_body");
		var options = 
		{
			tag : "zoom_slider", 
			dir : "auto",
			lang : window.navigator.language,
			icon : "icons/icon48.png", 
			body : body
		};
		var n = new Notification(title, options);
		n.onclick = function()
		{
			chrome.runtime.openOptionsPage();
		};
	}
});

// disable browserAction on pages where extensions are not allowed to run
function handleButton()
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if (tabs.length === 1)
		{
			var protocol = tabs[0].url.slice(0, tabs[0].url.indexOf(":"));
			if (/addons.opera.com/.test(tabs[0].url) === true)
			{ // Opera addon catalog
				chrome.browserAction.disable(tabs[0].id);
				chrome.contextMenus.update("zoom_slider.reset", {enabled: false});
			}
			else if (protocol === "opera" || protocol === "chrome" || protocol === "browser" || protocol === "about" || protocol === "chrome-extension" || protocol === "chrome-devtools")
			{ // internal pages
				chrome.browserAction.disable(tabs[0].id);
				chrome.contextMenus.update("zoom_slider.reset", {enabled: false});
			}
			else
			{
				chrome.browserAction.enable(tabs[0].id);
				chrome.contextMenus.update("zoom_slider.reset", {enabled: true});
			}
		}
	});
}

// deal with browserAction
function getZoom(checkButton)
{
	// handle the button
	if (checkButton === true)
	{
		handleButton();
	}
	
	// update the badge
	chrome.tabs.getZoom(function(zoomFactor)
	{
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
		{
			if (tabs.length > 0) // chrome-devtools and chrome-extensions don't have tabs
			{
				var zoom = Math.round(zoomFactor * 100);
				chrome.browserAction.setBadgeText({text: zoom.toString(), tabId: tabs[0].id});
			}
		});
	});
}

// catch events when we have to check the zoom level changes
chrome.runtime.onStartup.addListener(function(tab) // opening the browser
{
	getZoom(true);
});

chrome.tabs.onUpdated.addListener(function(tab) // navigating from page
{
	getZoom(true);
});

chrome.tabs.onActivated.addListener(function(tab) // opening and switching tabs
{
	getZoom(true);
});

chrome.tabs.onZoomChange.addListener(function(zoomChangeInfo) // zooming initiated by the user
{
	getZoom(false);
});