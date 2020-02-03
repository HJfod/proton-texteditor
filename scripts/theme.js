function switch_theme(to){
	theme_current = to;
	let scheme;
	switch (to) {
		case 'midnight': 
			scheme = {
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
				menubg: 'rgb(0,0,0)'
			};
			break;
		case 'ruska':
			scheme = {
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
				menubg: 'rgb(4,2,4)'
			};
			break;
		case 'light':
			scheme = {
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
				menubg: 'rgb(235,235,235)'
			};
			break;
	}
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
}