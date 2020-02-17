colors = '%23f00;%230f0;%2300f;%230ff';

let dir = path.join(__dirname + '/..' + '/savedata.txt');
console.log(dir);
try {
	fs.accessSync(dir);
	
	let savedata = fs.readFileSync(dir).toString();

	if (savedata != undefined){
		savedata = savedata.split('\n');
		
		let sett = savedata[0].split('&');
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
			}
		}
		
		let n = Number(savedata[1]);
		
		for (let i = 2; i < 2 + n; i++){
			add_recent_doc(savedata[i]);
		}
		
		for (let i = n + 2; i < savedata.length; i++){
			let file = savedata[i].split(';docSeparator;');
			try {
				fs.accessSync(file[1]);
				new_doc(file[0],fs.readFileSync(file[1]).toString(),file[1]);
			} catch (err) {
				show_status('File ' + file[0] + ' failed to load!',1);
				console.error(err);
			};
		}
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