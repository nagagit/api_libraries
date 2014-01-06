/**
 * Flickr URL that will give us lots and lots of whatever we're looking for.
 * 
 * See http://www.flickr.com/services/api/flickr.photos.search.html for details
 * about the construction of this URL.
 * 
 * @type {string}
 * @private
 */
var fetchLiveScores_ = "http://pipes.yahoo.com/pipes/pipe.run?_id=KHkpIfCz3BGVw853JxOy0Q&_render=rss";
var notID = 0;

// List of sample notifications. These are further customized
// in the code according the UI settings.
var notOptions_ = [ {
	type : "basic",
	title : "Basic Notification",
	message : "Short message part",
	expandedMessage : "Longer part of the message",
}, {
	type : "image",
	title : "Image Notification",
	message : "Short message plus an image",
}, {
	type : "list",
	title : "List Notification",
	message : "List of items in a message",
	items : []
}, {
	type : "progress",
	title : "Progress Notification",
	message : "Short message plus an image",
	progress : 60
}

];

/**
 * Sends an XHR GET request to grab photos of lots and lots of kittens. The
 * XHR's 'onload' event is hooks up to the 'listMatches_' method.
 * 
 * @public
 */
function requestScores() {
	$.get(this.fetchLiveScores_, listMatches_);
};

/**
 * Handle the 'onload' event of our kitten XHR request, generated in
 * 'requestScores', by generating 'img' elements, and stuffing them into the
 * document for display.
 * 
 * @param {ProgressEvent}
 *            e The XHR ProgressEvent.
 * @private
 */
function listMatches_(result) {
	var title = null;
	var $singleItem = null;
	var imageLink = null;
	var options = null;
	$(result).find('item').each(function() {
		$singleItem = $(this);
		title = $singleItem.find('title').text();
		imageLink = $singleItem.find('media\\:content, content').attr('url');
		link = $singleItem.find('link').text();
		if (imageLink != null && imageLink != 'undefined') {
			options = notOptions_[1];
			options.iconUrl = chrome.runtime.getURL("icon.png");
			options.title = "";
			options.message = title;
			getImageSynchronousReq(imageLink, options);
		} else {
			options = notOptions_[0];
			options.iconUrl = chrome.runtime.getURL("icon.png");
			options.title = "";
			options.message = title;
			showNotification(options);
		}
		options = null;
	});

};

function showNotification(options) {
	chrome.notifications.create("id" + notID++, options, creationCallback_);
	chrome.notifications.onClicked.addListener(function() {
		console.log(link);
		window.open(options.link);
	});
}

function openTab(url) { 
    var a = document.createElement('a'); 
    a.href = url; 
    a.target='_blank'; 
    a.click(); 
}

function getImageSynchronousReq(imageLink, options) {
	var img = null;
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("image/png");
	xhr.open('GET', imageLink, true);
	xhr.responseType = 'blob';
	xhr.onload = function(e) {
		img = document.createElement('img');
		img.src = window.webkitURL.createObjectURL(this.response);
		options.imageUrl = img.src;
		console.log(options.imageUrl);
		showNotification(options);
	};
	xhr.send();
}

function creationCallback_(notID) {
	console.log("Succesfully created " + notID + " notification");
}

$(document).ready(function() {
	document.getElementById("sample").addEventListener("click", doSomething);
});

function doSomething() {
	requestScores();
	setInterval(requestScores, 60000);
}