//fix g_WebAudioContext exception
g_WebAudioContext._m21 = function(){}


// Java Script File System

let _result_name_ = "";
let _result_base64_ = "";
let _result_data_ = "";

function jsfs_result_name() {
	return _result_name_;
}

function jsfs_result_base64() {
	return _result_base64_;
}

function jsfs_result_data() {
	return _result_data_;
}

async function jsfs_open_text_file(type, callback) {
	let file = await selectFilePrivate(type, false);
	let blob = new Blob([file], { type: type } );
	let reader = new FileReader();
	reader.readAsText(blob);
	
	reader.onload = function() {
		_result_name_ = file.name;
		_result_data_ = reader.result;
		callback();
	}
}

async function jsfs_save_text_file(name, str, type) {
	saveFilePrivateText(name, str, type);
}


async function jsfs_open_file(type, callback) {
	let file = await selectFilePrivate(type, false);
	let blob = new Blob([file], { type: type } );
	let reader = new FileReader();
	reader.readAsDataURL(blob);
	
	reader.onload = function() {
		_result_name_ = file.name;
		_result_base64_ = reader.result;
		callback();
	};
}

async function jsfs_save_file(name, base64, type) {
	saveFilePrivate(name, base64, type);
}

// ---- function definition ----
function selectFilePrivate(contentType, multiple) {

	return new Promise(resolve => {
		let input = document.createElement('input');
		input.type = 'file';
		input.multiple = multiple;
		input.accept = contentType;

		input.onchange = _ => {
			let files = Array.from(input.files);
			
			if (multiple)
				resolve(files);
			else
				resolve(files[0]);
		};

		input.click();
	});
}

function saveFilePrivate(name, base64, contentType) {
	let output = document.createElement('a');
	output.download = name;
	output.target="_blank";
	output.href = base64;
	output.click();
	output.href = "";
}



function saveFilePrivateText(name, str, contentType) {
	
	let base64 = "data:text/plain;base64," + btoa(str);
	
	let output = document.createElement('a');
	output.download = name;
	output.target="_blank";
	output.href = base64;
	output.click();
	output.href = "";
}

