colors = '%23f00;%230f0;%2300f;%230ff';
fonts = 'Segoe UI Light,Roboto Light,Arial';

let dir = path.join(__dirname + dLoop + '/userdata/savedata.txt');
console.log(dir);

try {
	fs.accessSync(dir);
	
	let savedata = fs.readFileSync(dir).toString();
	
	if (savedata != undefined){
		savedata = savedata.split('\n');
		
		let sett = savedata[0].split('&');
		console.log(sett);
		for (let i in sett){
			let s = sett[i].split('=');
			
			switch(s[0]){
				case 'theme_current':
					theme_current = s[1];
					break;
				case 'markdown':
					if (s[1] === '1'){
						toggle_markdown();
					}
					break;
				case 'toolbox':
					if (s[1] === 'false'){
						$('#toolbox').hide();
					}
					break;
				case 'fonts':
					fonts = s[1];
					break;
				case 'colors':
					colors = s[1];
					break;
				case 'winb':
					if (s[1] === '0'){
						toggle_winborder();
					}
					break;
				case 'mtabs':
					max_tabs = s[1];
					break;
				case 'size':
					font_size = s[1];
					break;
				case 'saveloc':
					use_default_save_location = Number(s[1]);
					break;
				case 'save_session':
					remember_session = Number(s[1]);
					break;
				case 'check_updates':
					check_updates_on_startup = Number(s[1]);
					break;
			}
		}
		
		let n = Number(savedata[1]);
		
		if (remember_session){
			for (let i = 2; i < 2 + n; i++){
				add_recent_doc(savedata[i]);
			}
			
			for (let i = n + 2; i < savedata.length; i++){
				let file = savedata[i];
				try {
					fs.accessSync(file);
					new_doc(file.split('\\').pop(),fs.readFileSync(file).toString(),file);
				} catch (err) {
					show_status('File ' + file + ' failed to load!',1);
					console.error(err);
				};
			}
		}
		show_status('User data loaded succesfully!',0);
	}else{
		show_status('There was an error loading user data',1);
	}
} catch (err) {
	show_status('User data could not be found!',1);
	console.error(err);
};

switch_theme(theme_current);
html.style.setProperty('--gui-size-text',font_size + 'px');

if (documents.length == 0){
	new_doc();
}

if (check_updates_on_startup && ($('display-status').length)){
	check_update();
}