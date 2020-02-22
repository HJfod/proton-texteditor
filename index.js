const { BrowserWindow, app, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let window_main;
let file_name;
let file_path;
let logs = '';
let logwind = null;
let setwind = null;
let current_settings;

process.env.NODE_ENV = 'production';

let dLoop = '';
dTesting: for (let i = 0; i < 5; i++) {
	try {
		fs.accessSync(path.join(__dirname + dLoop + '/resources'));
	} catch (err) {
		dLoop += '/..';
		continue dTesting;
	}
}

let required_dir = ['/userdata','/userdata/projects','/userdata/themes'];
for (let i in required_dir){
	let dir = path.join(__dirname + dLoop + required_dir[i]);
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
		if (required_dir[i].endsWith('themes')){
			createDefaultThemes(dir);
		}
	}
	console.log(dir);
}

app.on('ready', () => {
	const ipc = require('electron').ipcMain;
	
	window_main = new BrowserWindow({ icon: 'resources/icon.png', frame: false, webPreferences: { nodeIntegration: true, zoomFactor: 1.0 } });
	
	window_main.loadFile('main.html');
	
	ipc.on('app', (event, arg) => {
		let a = arg.split('=');
		switch (a[0]) {
			case 'toggle-fs':
				toggleFullscreen();
				break;
			case 'minimize':
				window_main.minimize();
				break;
			case 'confirm':
				let c = dialog.showMessageBox({ type: 'warning', buttons: ['Yes','Cancel'], title: 'Confirm action', message: a[1] });
				c.then((e) => {
					if (e.response == 0){
						if (a[2]){
							window_main.webContents.send('tabs','close='+a[2]);
						}else{
							window_main.webContents.send('app','close-force');
						}
					}
				});
				break;
			case 'open-logs':
				if (logwind == null){
					logwind = new BrowserWindow({ icon: 'resources/icon.png', frame: false, webPreferences: { nodeIntegration: true, zoomFactor: 1.0 } });
					logwind.loadFile('logs.html');
					logwind.on('closed', () => {
						logwind = null;
					});
				}
				break;
			case 'get-logs':
				logwind.webContents.send('logs',logs);
				break;
			case 'new-log':
				let d = new Date();
				logs += d.toString() + ': ' + a[1] + '<br>';
				break;
			case 'open-settings':
				if (setwind == null){
					setwind = new BrowserWindow({ icon: 'resources/icon.png', show: false, width: 400, height: 400, frame: false, webPreferences: { nodeIntegration: true, zoomFactor: 1.0 } });
					setwind.loadFile('options.html');
					setwind.once('ready-to-show', () => {
						setwind.show();
					});
					setwind.on('closed', () => {
						setwind = null;
					});
				}
				break;
			case 'get-settings':
				setwind.webContents.send('settings',current_settings);
				break;
			case 'new-image':
				let s = dialog.showOpenDialog({});
				s.then((o) => {
					if (!o.canceled){
						if (o.filePaths[0].match(/(.png)|(.jpg)/g) == null){
							dialog.showMessageBox({ type: 'error', title: 'Illegal format', message: 'Supported image formats: .png, .jpg' });
						}else{
							console.log('Opening image ' + o.filePaths[0]);
							window_main.webContents.send('app','image=' + o.filePaths[0]);
						}
					}else{
						console.log('Image cancelled');
					}
				});
				break;
			default:
				window_main.webContents.send('app',arg);
		}
	});
	
	ipc.on('set-settings', (event, arg) => {
		current_settings = arg;
	});
	
	ipc.on('file', (event, arg) => {
		let a = arg.split('=');
		switch (a[0]) {
			case 'open':
				if (a[1] === ''){
					let s = dialog.showOpenDialog({});
					s.then((o) => {
						if (!o.canceled){
							fs.readFile(o.filePaths[0], (err, data) => {
								if (err) throw err;
								console.log('Opening file ' + o.filePaths[0]);
								if (path.extname(o.filePaths[0]) == '.html'){
									let c = dialog.showMessageBox({ type: 'warning', buttons: ['Yes','Cancel'], title: 'Confirm action', message: 'Opening .html files will likely end up with the file not loading properly and may damage the app! Are you sure you want to do this?' });
									c.then((e) => {
										if (e.response == 0){
											openFile(o.filePaths[0],data.toString(),false);
										}
									});
								}else{
									openFile(o.filePaths[0],data.toString(),false);
								}
							});
						}else{
							console.log('File open cancelled');
						}
					});
				}else{
					let aa = a[1].replace(/bSlashChar/g,'\\');
					console.log(aa);
					fs.readFile(aa, (err, data) => {
						if (err) throw err;
						console.log('Opening file ' + aa);
						openFile(aa,data.toString(),true);
					});
				}
				break;
			case 'name':
				file_name = a[1];
				break;
			case 'path':
				file_path = a[1];
				break;
		}
	});
	
	ipc.on('file-save', (event, arg) => {
		let f = fs.access(file_path, (err) => {
			if (err){
				saveFile(arg);
			}else{
				fs.writeFile(file_path, arg, (err2) => {
					if (err2) throw err2;
					console.log('File succesfully saved at ' + file_path);
					window_main.webContents.send('app','file-save=' + file_path);
				});
			}
		});
	});
	
	ipc.on('file-save-as', (event, arg) => {
		saveFile(arg);
	});
	
	window_main.on('resize', () => {
		window_main.webContents.send('app','window-size=' + window_main.isMaximized());
	});
	
	window_main.on('closed', () => {
		app.quit();
	});
	
	const m = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(m);
});

function toggleFullscreen() {
	if (window_main.isMaximized()){
		window_main.unmaximize();
	}else{
		window_main.maximize();
	}
}

function saveFile(arg) {
	let s = dialog.showSaveDialog({ defaultPath: file_name });
	s.then((o) => {
		if (!o.canceled){
			fs.writeFile(o.filePath, arg, (err) => {
				if (err) throw err;
				console.log('The file has been saved at ' + o.filePath);
				window_main.webContents.send('app','file-save=' + o.filePath);
			});
		}else{
			console.log('File save cancelled!');
		}
	});
}

function openFile(p,t,r){
	let n_o = {
		path: p,
		text: t,
		recent: r
	};
	window_main.webContents.send('file-open',n_o);
	window_main.webContents.send('app','file=Succesfully opened ' + p + ' !');
}

function createDefaultThemes(dir) {
	let themes = [];
	themes[0] = {
		scheme: {
			tb: 'rgb(0,0,0)', 
			bg: 'rgb(0,0,0)', 
			home: 'rgb(0,0,0)', 
			text: 'rgb(255,255,255)', 
			bt: 'rgb(255,255,255)',
			title: 'rgb(255,255,255)',
			titlen: 'rgba(255,255,255,0.3)',
			shadow: 'rgba(30,30,30,0.5)',
			menuop: 'rgb(255,255,255)',
			menusep: 'rgba(255,255,255,0.2)',
			menubg: 'rgb(0,0,0)',
			cbox: 'rgb(100,100,100)',
			cboxu: 'rgb(20,20,20)',
			bhover: 'rgba(255,255,255,0.2)',
			mhover: 'rgba(80,80,80,1)'
		},
		name: 'Midnight'
	};
	themes[1] = {
		scheme: {
			tb: 'linear-gradient(to right,rgb(30,0,10),rgb(30,15,0))',
			bg: 'rgb(2,2,2)',
			home: 'rgb(4,2,4)',
			text: 'rgb(255,255,255)',
			bt: 'rgb(255,255,255)',
			title: 'rgb(255,255,255)',
			titlen: 'rgba(255,255,255,0.3)',
			shadow: 'rgba(25,25,25,0.5)',
			menuop: 'rgb(255,255,255)',
			menusep: 'rgba(255,200,220,0.2)',
			menubg: 'rgb(4,2,4)',
			cbox: 'rgb(120,30,45)',
			cboxu: 'rgb(20,20,20)',
			bhover: 'rgba(255,235,255,0.2)',
			mhover: 'rgba(100,80,85,1)'
		},
		name: 'Ruska'
	};
	themes[2] = {
		scheme: {
			tb: 'rgb(200,200,200)',
			bg: 'rgb(255,255,255)',
			home: 'rgb(225,225,225)',
			text: 'rgb(0,0,0)',
			bt: 'rgb(0,0,0)',
			title: 'rgb(0,0,0)',
			titlen: 'rgba(0,0,0,0.5)',
			shadow: 'rgba(0,0,0,0.5)',
			menuop: 'rgb(0,0,0)',
			menusep: 'rgba(0,0,0,0.5)',
			menubg: 'rgb(235,235,235)',
			cbox: 'rgb(200,200,200)',
			cboxu: 'rgb(230,230,230)',
			bhover: 'rgba(120,120,120,0.2)',
			mhover: 'rgba(180,180,180,1)'
		},
		name: 'Light'
	};
	themes[3] = {
		scheme: {
			tb: 'linear-gradient(to right,rgb(0,10,60),rgb(5,50,70))',
			bg: 'rgb(2,4,8)',
			home: 'rgb(0,3,14)',
			text: 'rgb(255,255,255)',
			bt: 'rgb(255,255,255)',
			title: 'rgb(255,255,255)',
			titlen: 'rgba(255,255,255,0.3)',
			shadow: 'rgba(0,0,0,0.5)',
			menuop: 'rgb(255,255,255)',
			menusep: 'rgba(255,200,220,0.2)',
			menubg: 'rgb(0,3,14)',
			cbox: 'rgb(15,50,150)',
			cboxu: 'rgb(20,20,20)',
			bhover: 'rgba(255,255,255,0.2)',
			mhover: 'rgba(80,80,105,1)'
		},
		name: 'Ocean'
	};
	themes[4] = {
		scheme: {
			tb: 'linear-gradient(to right,rgb(60,50,40),rgb(60,45,60),rgb(41,70,65),rgb(55,60,45))',
			bg: 'rgb(15,15,15)',
			home: 'rgb(25,25,25)',
			text: 'rgb(255,255,255)',
			bt: 'rgb(255,255,255)',
			title: 'rgb(255,255,255)',
			titlen: 'rgba(255,255,255,0.3)',
			shadow: 'rgba(0,0,0,0.5)',
			menuop: 'rgb(255,255,255)',
			menusep: 'rgba(255,200,220,0.2)',
			menubg: 'rgb(25,25,25)',
			cbox: 'rgb(81,110,105)',
			cboxu: 'rgb(50,50,50)',
			bhover: 'rgba(255,255,255,0.2)',
			mhover: 'rgba(80,105,105,1)'
		},
		name: 'Spring'
	};
	for (let i in themes){
		fs.writeFileSync(dir + '/' + themes[i].name + '.pthm', rov(themes[i].scheme));
	}
}

function rov(obj) {	// return object values
	let str = '';
	for (let i = 0; i < Object.keys(obj).length; i++){
		str += (Object.keys(obj)[i] + '=' + Object.values(obj)[i] + '\n');
	}
	return str;
}

const mainMenuTemplate = [
	{
		label:'Home',
		submenu: [
			{
				label: 'Fullscreen',
				accelerator: 'F11',
				click(){
					toggleFullscreen();
				}
			},
			{
				label: 'Minimize',
				accelerator: process.platform == 'darwin' ? 'Command+M' : 'Ctrl+M',
				click(){
					window_main.minimize();
				}
			},
			{
				label: 'Dev Tools',
				accelerator: process.platform == 'darwin' ? 'Command+Shift+I' : 'Ctrl+Shift+I',
				click(){
					window_main.toggleDevTools();
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];