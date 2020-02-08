function switch_theme(to,cont=''){
	if (Array.isArray(to)){
		cont = to[1];
		to = to[0].toString();
		console.log(to);
		console.log(cont);
	}
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
				menubg: 'rgb(0,0,0)',
				cbox: 'rgb(100,100,100)',
				cboxu: 'rgb(20,20,20)',
				bhover: 'rgba(255,255,255,0.2)',
				mhover: 'rgba(80,80,80,1)'
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
				menubg: 'rgb(4,2,4)',
				cbox: 'rgb(120,30,45)',
				cboxu: 'rgb(20,20,20)',
				bhover: 'rgba(255,235,255,0.2)',
				mhover: 'rgba(100,80,85,1)'
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
				menubg: 'rgb(235,235,235)',
				cbox: 'rgb(200,200,200)',
				cboxu: 'rgb(230,230,230)',
				bhover: 'rgba(120,120,120,0.2)',
				mhover: 'rgba(180,180,180,1)'
			};
			break;
		case 'ocean':
			scheme = {
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
			};
			break;
		case 'spring':
			scheme = {
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
			};
			break;
		case 'custom':
			scheme = {};
			theme_current = 'custom>' + cont;
			cont = cont.replace(/\s/g, '');
			cont = cont.split(';');
			for (let i = 0; i < cont.length; i++) {
				cont[i] = cont[i].split(':');
				scheme[cont[i][0]] = cont[i][1];
			}
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
	html.style.setProperty('--gui-color-checkbox',scheme.cbox);
	html.style.setProperty('--gui-color-checkbox-unchecked',scheme.cboxu);
	html.style.setProperty('--gui-color-button-hover',scheme.bhover);
	html.style.setProperty('--gui-color-menu-hover',scheme.mhover);
}