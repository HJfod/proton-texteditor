const { BrowserWindow, app, dialog, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let window_main;
let file_name;
let file_path;
let logs = '';
let logwind;

process.env.NODE_ENV = 'production';

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
				logwind = new BrowserWindow({ icon: 'resources/icon.png', frame: false, webPreferences: { nodeIntegration: true, zoomFactor: 1.0 } });
				logwind.loadFile('logs.html');
				logwind.on('closed', () => {
					console.log('yess');
					logwind = null;
				});
				break;
			case 'get-logs':
				logwind.webContents.send('logs',logs);
				break;
			case 'new-log':
				let d = new Date();
				logs += d.toString() + ': ' + a[1] + '<br>';
				break;
			default:
				window_main.webContents.send('app',arg);
		}
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
		console.log(file_path);
		let f = fs.access(file_path, (err) => {
			if (err){
				saveFile(arg);
			}else{
				fs.writeFile(file_path, arg, (err2) => {
					if (err2) throw err2;
					console.log('File succesfully saved at ' + file_path);
					window_main.webContents.send('app','file=Succesfully saved at ' + file_path + '!');
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
				window_main.webContents.send('app','file=Succesfully saved at ' + o.filePath + '!');
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