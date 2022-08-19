let __waf_picker = undefined;
let __waf_name = undefined;
let __waf_data = undefined;
let __waf_callback = undefined;

// export
function __waf_get_name() {
	return __waf_name;
}

// export
function __waf_get_data() {
	return __waf_data;
}

// export
function __waf_open_file(mimeType, callback) {
	const input = document.createElement('input');
	input.type = 'file';
	input.multiple = false;
	input.accept = mimeType;
	
	if(__waf_picker!==undefined) {
		__waf_picker.remove();
	}
	__waf_picker = input;
	__waf_callback = callback;
	
	input.onchange = _ => {
		const files = Array.from(__waf_picker.files);
		__waf_file_picked(files[0]);
	};
	input.click();
}

// private
function __waf_file_picked(file) {
	const blob = new Blob([file], { type: file.type } );
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	reader.onload = function() {
		__waf_name = file.name;
		__waf_data = reader.result;
		if(__waf_callback!=undefined) {
			__waf_callback()
		};
	};
}

// export
function __waf_save_file(name, data) {
	const output = document.createElement('a');
	output.download = name;
	output.target="_blank";
	output.href = data;
	output.click();
	output.href = "";
}


let __waf_div = undefined;
let __waf_input = undefined;
let __waf_extension = "";

// export
function __waf_get_save_name(caption, message, mimeType, name, callback) {
	
	__waf_callback = callback;
	
	const splitedMimeType = mimeType.split('/');
	const extension = splitedMimeType.length > 1 ? '.' + splitedMimeType[1] : "";
	
	const splitedFilename = name.split('.');
	const basename = splitedFilename[0];
	
	__waf_extension = extension;
	
	if(__waf_div!=undefined) {
		__waf_div.remove();
	}
	
	document.getElementsByTagName("html")[0].style.height = "100%";
	document.body.style.height = "100%";
	document.body.style.display = "flex";
	
	// root
	const rootDiv = document.createElement('div');
	rootDiv.style.width = "100%";
	rootDiv.style.height = "100%";
	rootDiv.style.background = "#000000BB";
	rootDiv.style.opacity = "0.9999";
	rootDiv.style.display = "flex";
	rootDiv.style.flexDirection = "column";
	rootDiv.style.alignItems = "center";
	__waf_div = rootDiv;
	
	// div
	const div = document.createElement('div');
	div.style.width = "50%";
	div.style.height = "fit-content";
	div.style.background = "#FFFFFF";
	div.style.display = "flex";
	div.style.alignItems = "center";
	div.style.flexDirection = "column";
	div.style.margin = "0";
	div.style.padding = "0";
	div.style.border = "#FF5a11";
	div.style.borderStyle = "solid";
	div.style.borderWidth = "thick";
	div.style.color = "#000077";
	
	__waf_div.appendChild(div);
	
	//div.style.display = "flex";
	//div.style.flexDirection = "column";
	//div.style.alignItems = "center";
	
	const h = document.createElement('h1');
	div.appendChild(h);
	h.innerHTML = caption;
	h.style.fontFamily = "Lucida Console";
	h.style.fontStyle = "normal";
	h.style.fontSize = "24px";
	
	if(message!="") {
		const p = document.createElement('p');
		div.appendChild(p);
		p.innerHTML = message;
		p.style.fontFamily = "Lucida Console";
		p.style.fontStyle = "normal";
		p.style.fontSize = "16px";
	}
	
	const inputDiv = document.createElement("div");
	inputDiv.style.display = "flex";
	inputDiv.style.alignItems = "center";
	inputDiv.style.flexWrap = "wrap";
	inputDiv.style.flexDirection = "row";
	
	
	const input = document.createElement('input');
	input.type = 'text';
	input.value = basename;
	
	__waf_input = input;
	input.style.height = "32px";
	input.style.fontFamily = "Lucida Console";
	input.style.fontStyle = "normal";
	input.style.fontSize = "24px";
	inputDiv.appendChild(input);
	
	const formatStr = document.createElement('p');
	formatStr.innerHTML = extension;
	formatStr.style.fontFamily = "Lucida Console";
	formatStr.style.fontStyle = "normal";
	formatStr.style.fontSize = "24px";
	formatStr.style.margin = "0";
	inputDiv.appendChild(formatStr);
	
	div.appendChild(inputDiv);
	
	const buttonsDiv = document.createElement('div');
	//buttonsDiv.style.background = "#00FF00";
	
	const btnOk = document.createElement('button');
	btnOk.innerHTML = "Ok";
	btnOk.onclick = function() {
		if(__waf_callback!=undefined) {
			__waf_name = __waf_input.value + __waf_extension;
			__waf_callback();
		}
		__waf_div.remove();
		__waf_div = undefined;
	};
	btnOk.style.width = "96px";
	btnOk.style.height = "32px";
	btnOk.style.margin = "8px";
	
	const btnCancel = document.createElement('button');
	btnCancel.innerHTML = "Cancel";
	btnCancel.onclick = function() {
		if(__waf_callback!=undefined) {
			__waf_name = "";
			__waf_callback();
		}
		__waf_div.remove();
		__waf_div = undefined;
	}
	btnCancel.style.width = "96px";
	btnCancel.style.height = "32px";
	btnCancel.style.margin = "8px";
	
	buttonsDiv.appendChild(btnCancel);
	buttonsDiv.appendChild(btnOk);
	div.appendChild(buttonsDiv);
	
	document.body.appendChild(__waf_div);
	
	input.focus();
}

