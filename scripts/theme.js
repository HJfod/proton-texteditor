function switch_theme(to){
	let dir = path.join(__dirname + dLoop + '/userdata/themes/' + to + '.pthm');
	try {
		fs.accessSync(dir);
		
		console.log(dir);
		
		let data = fs.readFileSync(dir).toString();
		let scheme = {};
		
		data = data.split('\n');
		
		for (let i in data){
			scheme[data[i].split('=').shift()] = data[i].split('=').pop();
		}
		
		console.log(scheme);
		
		html.style.setProperty('--gui-color-titlebar',scheme.tb);
		html.style.setProperty('--gui-color-background',scheme.bg);
		html.style.setProperty('--gui-color-home',scheme.home);
		html.style.setProperty('--gui-color-text-default',scheme.text);
		html.style.setProperty('--gui-color-button-text',scheme.bt);
		html.style.setProperty('--gui-color-title-text',scheme.title);
		html.style.setProperty('--gui-color-title-new',scheme.titlen);
		html.style.setProperty('--gui-color-shadow',scheme.shadow);
		html.style.setProperty('--gui-color-menu-option',scheme.menuop);
		html.style.setProperty('--gui-color-menu-separator',scheme.menusep);
		html.style.setProperty('--gui-color-menu-background',scheme.menubg);
		html.style.setProperty('--gui-color-checkbox',scheme.cbox);
		html.style.setProperty('--gui-color-checkbox-unchecked',scheme.cboxu);
		html.style.setProperty('--gui-color-button-hover',scheme.bhover);
		html.style.setProperty('--gui-color-menu-hover',scheme.mhover);
		
		show_status('Succesfully loaded theme!',0);
		theme_current = to;
	} catch (err) {
		show_status('Theme ' + to + '.pthm does not exist!',1);
	}
}