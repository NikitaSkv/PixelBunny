let __CLIENT_ID = undefined;
let __API_KEY = undefined;

const __DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const __SCOPES = 'profile https://www.googleapis.com/auth/drive.file';

let __tokenClient;
let __gapiInited = false;
let __gisInited = false;


function __gd_init(client_id, api_key) {
	console.log("gd_init");
	
	__CLIENT_ID = client_id;
	__API_KEY = api_key;
	
	/*
	let divIdOnLoad = document.createElement('div');
	divIdOnLoad.id = "g_id_onload";
	divIdOnLoad.setAttribute("data-client_id", __CLIENT_ID);
	divIdOnLoad.setAttribute("data-context", "signin");
	divIdOnLoad.setAttribute("data-ux_mode", "popup");
	divIdOnLoad.setAttribute("data-callback", "initClient");
	document.body.appendChild(divIdOnLoad);
	
	let divIdSignIn = document.createElement('div');
	divIdSignIn.setAttribute("class", "g_id_signin");
	divIdSignIn.setAttribute("data-type", "standart");
	divIdSignIn.setAttribute("data-shape", "rectangular");
	divIdSignIn.setAttribute("data-theme", "outline");
	divIdSignIn.setAttribute("data-text", "$ {button.text}");
	divIdSignIn.setAttribute("data-size", "large");
	divIdSignIn.setAttribute("data-logo_alignment", "left");
	document.body.appendChild(divIdSignIn);
	*/
	
	let scrGAPI = document.createElement("script");
	scrGAPI.setAttribute("async", "true");
	scrGAPI.setAttribute("defer", "true");
	scrGAPI.type = "text/javascript";
	scrGAPI.src = "https://apis.google.com/js/api.js";
	scrGAPI.onload=gapiLoaded;
	document.body.appendChild(scrGAPI);
	
	let scrClient = document.createElement("script");
	scrClient.setAttribute("async", "true");
	scrClient.setAttribute("defer", "true");
	scrClient.type = "text/javascript";
	scrClient.src = "https://accounts.google.com/gsi/client";
	scrClient.onload=gisLoaded;
	document.body.appendChild(scrClient);
}

function __gd_is_initialized() {
	return __gapiInited && __gisInited;
}

function gapiLoaded() {
	console.log('gapiLoaded');
	
	gapi.load('picker', intializePicker);
	gapi.load('client', initializeGapiClient);
}

let __pickerInited = false;
function intializePicker() {
	console.log('intializePicker');
	__pickerInited = true;
}

__oauth2Loaded = false;
async function initializeGapiClient() {
	console.log('initializeGapiClient');
	
	await gapi.client.init({
		apiKey: __API_KEY,
		discoveryDocs: [__DISCOVERY_DOC]
	});
	
	gapi.client.load('oauth2', 'v2', function(){
		__oauth2Loaded = true;
	});
	
	console.log('__gapiInited');
	__gapiInited = true;
	//maybeEnableButtons();
}


function gisLoaded() {
	console.log('gisLoaded');
	
	__tokenClient = google.accounts.oauth2.initTokenClient({
		client_id: __CLIENT_ID,
		scope: __SCOPES,
		callback: '' // defined later
	});
	
	__gisInited = true;
	//maybeEnableButtons();
}


let __userInfo = undefined;
function __gd_sign_in() {
	console.log('gd_sign_in');
	
	__tokenClient.callback = async (resp) => {
		if (resp.error !== undefined) {
			throw (resp);
		}
		
		if(__oauth2Loaded) {
			gapi.client.oauth2.userinfo.get().execute(function (resp) {
				const userInfo = {
					email: resp.email,
					name: resp.name,
					picture: resp.picture
				}
				__set_user_info(userInfo);
			});
		}
		//document.getElementById('signout_button').style.visibility = 'visible';
		//document.getElementById('authorize_button').innerText = 'Refresh';
	};

	if (gapi.client.getToken() === null) {
		// Prompt the user to select a Google Account and ask for consent to share their data
		// when establishing a new session.
		__tokenClient.requestAccessToken({prompt: 'consent'});
	} else {
		// Skip display of account chooser and consent dialog for an existing session.
		__tokenClient.requestAccessToken({prompt: ''});
	}
}

function __gd_sign_out() {
	console.log('gd_sign_out');
	
	const token = gapi.client.getToken();
	if (token !== null) {
		google.accounts.oauth2.revoke(token.access_token);
		gapi.client.setToken('');
		__set_user_info(undefined);
		//document.getElementById('content').innerText = '';
		//document.getElementById('authorize_button').innerText = 'Authorize';
		//document.getElementById('signout_button').style.visibility = 'hidden';
	}
}

function __gd_is_signed_in() {
	return (gapi.client.getToken()!==null && gapi.client.getToken()!=='');
}

function __set_user_info(userInfo) {
	__userInfo = userInfo;
	console.log(__userInfo);
	if(__userInfoUpdatedCallback!=undefined) {
		__userInfoUpdatedCallback();
	}
}

function __gd_get_user_name() {
	return __userInfo!==undefined ? __userInfo.name : undefined;
}

function __gd_get_user_email() {
	return __userInfo!==undefined ? __userInfo.email : undefined;
}

function __gd_get_user_picture() {
	return __userInfo!==undefined ? __userInfo.picture : undefined;
}

__userInfoUpdatedCallback = undefined;
function __gd_bind_on_user_updated(callback) {
	__userInfoUpdatedCallback = callback;
}

async function createEmptyFile2(name, mimeType) {
	console.log('create file 2', name)
	
	console.log(gapi.client.drive)
	const resp = await prom(gapi.client.drive.files.create, {
		resource: {
		name: name,
			// для создания папки используйте
			// mimeType = 'application/vnd.google-apps.folder'
			mimeType: mimeType || 'text/plain',
			// вместо 'appDataFolder' можно использовать ID папки
			parents: ['root']
		},
		fields: 'id'
	})
	// функция возвращает строку — идентификатор нового файла
	return resp.result.id
}

function pickerCallback(data) {
	console.log('pickerCallback');
	console.log(data);
}

async function __gd_pick_file(title, mimeTypes, mode) {
	var view = new google.picker.DocsView()
		.setIncludeFolders(true)
		.setOwnedByMe(true)
		.setParent('root')
		.setMimeTypes('application/json')
		.setMode(google.picker.DocsViewMode.LIST);
	
	const token = gapi.client.getToken();
	
	let picker = new google.picker.PickerBuilder()
		.addView(view)
		.setOAuthToken(token.access_token)
		.setDeveloperKey(__API_KEY)
		.setCallback(pickerCallback)
		.setTitle(title)
		.build();
	picker.setVisible(true);
}

async function __gd_open_file() {
	console.log('gd_open_file');
	
	//createEmptyFile2('hello_world.txt', 'text/plain');
	
	//__gd_get_user_info();
	//var auth2 = google.accounts.oauth2; //gapi.auth2.getAuthInstance();
	//console.log();
	//var profile = auth2.currentUser.get().getBasicProfile();
	//console.log(profile.getName());
	//console.log(profile.getEmail());
	
	
	
	var view = new google.picker.DocsView()
		.setIncludeFolders(true)
		.setOwnedByMe(true)
		.setParent('root')
		//.setMimeTypes('application/json')
		.setMode(google.picker.DocsViewMode.LIST)
		.setSelectFolderEnabled(true);
	
	const token = gapi.client.getToken();
	
	let picker = new google.picker.PickerBuilder()
		.addView(view)
		.setOAuthToken(token.access_token)
		.setDeveloperKey(__API_KEY)
		.setCallback(pickerCallback)
		.setTitle('Select folder')
		.setSelectableMimeTypes('application/vnd.google-apps.folder')
		.build();
		
	picker.setVisible(true);
	
	/*
	var view = new google.picker.DocsView()
		.setIncludeFolders(true)
		.setOwnedByMe(true)
		.setParent('root')
		.setMimeTypes('application/json')
		.setMode(google.picker.DocsViewMode.LIST);
	
	const token = gapi.client.getToken();
	
	let picker = new google.picker.PickerBuilder()
		.addView(view)
		.setOAuthToken(token.access_token)
		.setDeveloperKey(__API_KEY)
		.setCallback(pickerCallback)
		.setTitle('Select Pixel-Bunny-Project file')
		.build();
	picker.setVisible(true);
	*/
}

/*
async function saveFile(callback) {
	console.log('save file');
	
	let view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
		.setIncludeFolders(true)
		.setOwnedByMe(true)
		.setParent('root')
		.setSelectFolderEnabled(true)
		.setMode(google.picker.DocsViewMode.LIST);
	
	let picker = new google.picker.PickerBuilder()
		.addView(view)
		.setOAuthToken(_access_token_)
		.setDeveloperKey(__API_KEY)
		.setCallback(pickerCallback)
		.setTitle('Select folder')
		.build();
	picker.setVisible(true);
}
*/

function prom(gapiCall, argObj) {
	return new Promise((resolve, reject) => {
		gapiCall(argObj).then(resp => {
			if (resp && (resp.status < 200 || resp.status > 299)) {
				console.log('GAPI call returned bad status', resp)
				reject(resp)
			} else {
				resolve(resp)
			}
		}, err => {
			console.log('GAPI call failed', err)
			reject(err)
		})
	})
}

/*
function prom(gapiCall, argObj) {
	return new Promise((resolve, reject) => {
		gapiCall(argObj).then(resp => {
			if (resp && (resp.status < 200 || resp.status > 299)) {
				console.log('GAPI call returned bad status', resp)
				reject(resp)
			} else {
				resolve(resp)
			}
		}, err => {
			console.log('GAPI call failed', err)
			reject(err)
		})
	})
}

async function createEmptyFile(name, mimeType) {
	console.log('create file', name)
	const resp = await prom(gapi.client.drive.files.create, {
		resource: {
			name: name,
			// для создания папки используйте
			// mimeType = 'application/vnd.google-apps.folder'
			mimeType: mimeType || 'text/plain',
			// вместо 'appDataFolder' можно использовать ID папки
			parents: ['appDataFolder']
		},
		fields: 'id'
	})
	// функция возвращает строку — идентификатор нового файла
	return resp.result.id
}

async function upload(fileId, content) {
	// функция принимает либо строку, либо объект, который можно сериализовать в JSON
	return prom(gapi.client.request, {
		path: `/upload/drive/v3/files/${fileId}`,
		method: 'PATCH',
		params: {uploadType: 'media'},
		body: typeof content === 'string' ? content : JSON.stringify(content)
	})
}

async function download(fileId) {
	const resp = await prom(gapi.client.drive.files.get, {
		fileId: fileId,
		alt: 'media'
	})
	// resp.body хранит ответ в виде строки
	// resp.result — это попытка интерпретировать resp.body как JSON.
	// Если она провалилась, значение resp.result будет false
	// Т.о. функция возвращает либо объект, либо строку
	return resp.result || resp.body
}

async function find(query) {
	let ret = []
	let token
	do {
		const resp = await prom(gapi.client.drive.files.list, {
			// вместо 'appDataFolder' можно использовать ID папки
			spaces: 'appDataFolder',
			fields: 'files(id, name), nextPageToken',
			pageSize: 100,
			pageToken: token,
			orderBy: 'createdTime',
			q: query
		})
		ret = ret.concat(resp.result.files)
		token = resp.result.nextPageToken
	} while (token)
	// результат: массив объектов вида [{id: '...', name: '...'}], 
	// отсортированных по времени создания
	return ret
}

async function deleteFile(fileId) {
	try {
		await prom(gapi.client.drive.files.delete, {
			fileId: fileId
		})
		return true
	} catch (err) {
		if (err.status === 404) {
			return false
		}
		throw err
	}
}
*/

