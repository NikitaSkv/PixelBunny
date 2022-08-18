let __wad_return_0 = undefined;
let __wad_return_1 = undefined;
let __wad_return_2 = undefined;

function __wad_reset_return() {
	__wad_return_0 = undefined;
	__wad_return_1 = undefined;
	__wad_return_2 = undefined;
}

function __wad_return(index=0) {
	if(index==1) {
		return __wad_return_1;
	} else if(index==2) {
		return __wad_return_2;
	}
	return __wad_return_0;
}

let __wad_div = undefined;
let __wad_input = undefined;
let __wad_onOk = undefined;
let __wad_onCancel = undefined;

function __wad_create_root_div() {
	let rootDiv = document.createElement('div');
	rootDiv.style.width = "100%";
	rootDiv.style.height = "100%";
	rootDiv.style.background = "#000000BB";
	rootDiv.style.opacity = "0.9999";
	rootDiv.style.display = "flex";
	rootDiv.style.flexDirection = "column";
	rootDiv.style.alignItems = "center";
	return rootDiv;
}

function __wad_get_string(caption, content, onOk, onCancel) {
	
	__wad_onOk = onOk;
	__wad_onCancel = onCancel;
	
	if(__wad_div!=undefined) {
		__wad_div.remove();
	}
	
	document.getElementsByTagName("html")[0].style.height = "100%";
	document.body.style.height = "100%";
	document.body.style.display = "flex";
	
	// root
	let rootDiv = document.createElement('div');
	rootDiv.style.width = "100%";
	rootDiv.style.height = "100%";
	rootDiv.style.background = "#000000BB";
	rootDiv.style.opacity = "0.9999";
	rootDiv.style.display = "flex";
	rootDiv.style.flexDirection = "column";
	rootDiv.style.alignItems = "center";
	__wad_div = rootDiv;
	
	// div
	let div = document.createElement('div');
	div.style.width = "50%";
	div.style.height = "fit-content";
	div.style.background = "#FFFFFF";
	div.style.display = "flex";
	div.style.alignItems = "center";
	div.style.flexDirection = "column";
	div.style.margin = "16px";
	div.style.padding = "16px";
	div.style.border = "#FF5a11";
	div.style.borderStyle = "solid";
	div.style.borderWidth = "thick";
	div.style.color = "#000077";
	
	__wad_div.appendChild(div);
	
	//div.style.display = "flex";
	//div.style.flexDirection = "column";
	//div.style.alignItems = "center";
	
	let h = document.createElement('h1');
	div.appendChild(h);
	h.innerHTML = caption;
	h.style.fontFamily = "Lucida Console";
	h.style.fontStyle = "normal";
	h.style.fontSize = "24px";
	
	let p = document.createElement('h1');
	div.appendChild(p);
	p.innerHTML = "A file with the following name will be downloaded to your device:";
	p.style.fontFamily = "Lucida Console";
	p.style.fontStyle = "normal";
	p.style.fontSize = "16px";
	
	let inputDiv = document.createElement("div");
	inputDiv.style.display = "flex";
	inputDiv.style.alignItems = "center";
	inputDiv.style.flexWrap = "wrap";
	inputDiv.style.flexDirection = "row";
	
	
	let input = document.createElement('input');
	input.type = 'text';
	input.value = content;
	
	__wad_input = input;
	input.style.height = "32px";
	input.style.fontFamily = "Lucida Console";
	input.style.fontStyle = "normal";
	input.style.fontSize = "24px";
	inputDiv.appendChild(input);
	
	let formatStr = document.createElement('p');
	formatStr.innerHTML = ".json";
	formatStr.style.fontFamily = "Lucida Console";
	formatStr.style.fontStyle = "normal";
	formatStr.style.fontSize = "24px";
	inputDiv.appendChild(formatStr);
	
	div.appendChild(inputDiv);
	
	let buttonsDiv = document.createElement('div');
	//buttonsDiv.style.background = "#00FF00";
	
	let btnOk = document.createElement('button');
	btnOk.innerHTML = "Ok";
	btnOk.onclick = function() {
		__wad_reset_return();
		if(__wad_onOk!=undefined) {
			__wad_return_0 = __wad_input.value;
			__wad_onOk();
		}
		__wad_div.remove();
	};
	btnOk.style.width = "96px";
	btnOk.style.height = "32px";
	btnOk.style.margin = "8px";
	
	let btnCancel = document.createElement('button');
	btnCancel.innerHTML = "Cancel";
	btnCancel.onclick = function() {
		__wad_reset_return();
		if(__wad_onCancel!=undefined) {
			__wad_onCancel();
		}
		__wad_div.remove();
	}
	btnCancel.style.width = "96px";
	btnCancel.style.height = "32px";
	btnCancel.style.margin = "8px";
	
	buttonsDiv.appendChild(btnCancel);
	buttonsDiv.appendChild(btnOk);
	div.appendChild(buttonsDiv);
	
	document.body.appendChild(__wad_div);
	
	document.getElementById('canvas').blur();
	
	input.focus();
}

