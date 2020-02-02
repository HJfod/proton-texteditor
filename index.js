const { BrowserWindow, app } = require('electron');

let window_main;

app.on('ready', () => {
	const ipc = require('electron').ipcMain;
	
	window_main = new BrowserWindow({ frame: false, webPreferences: { nodeIntegration: true } });
	
	window_main.loadFile('main.html');
	
	ipc.on('app', (event, arg) => {
		switch (arg) {
			case 'toggle-fs':
				toggleFullscreen();
				break;
			case 'minimize':
				window_main.minimize();
		}
	});
	
	window_main.on('resize', () => {
		window_main.webContents.send('app','window-size=' + window_main.isMaximized());
	});
	
	window_main.on('closed', () => {
		app.quit();
	});
});

function toggleFullscreen() {
	if (window_main.isMaximized()){
		window_main.unmaximize();
	}else{
		window_main.maximize();
	}
}