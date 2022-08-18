let __wai_icon = undefined;

function __wai_set(filename) {
	if(__wai_icon===undefined) {
		let icon = document.createElement('link');
		icon.href = filename;
		icon.setAttribute("rel", "apple-touch-icon");
		document.head.appendChild(icon);
		__wai_icon = icon;
	} else {
		var icon = __wai_icon;
		icon.href = filename;
	}
}

