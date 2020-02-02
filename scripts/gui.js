function rs_window(method) {
	switch (method) {
		case 0:
			ipc.send('app','toggle-fs');
			break;
		case 1:
			ipc.send('app','minimize');
			break;
	}
}

function toggle_home() {
	if (home_toggled){
		html.style.setProperty('--gui-home-left','calc( var(--gui-home-width) - ( var(--gui-home-width) * 2 ) )');
		html.style.setProperty('--gui-home-opacity','0');
		home_toggled = false;
	}else{
		html.style.setProperty('--gui-home-left','0px');
		html.style.setProperty('--gui-home-opacity','1');
		home_toggled = true;
	}
}

ipc.on('app', (event, arg) => {
	let a = arg.split('=');
	switch (a[0]){
		case 'window-size':
			if (a[1] === 'true'){
				$('#menu_fs').text(`\u2610`);
			}else{
				$('#menu_fs').text(`\u2610`);
			}
			break;
	}
});

$(document).click( () => {
	close_menu();
});

$('[data-menu]').contextmenu( (e) => {
	let m = $('#menu_window');
	let t = m.is(':hidden');
	
	if (t){
		let v = $(e.target).attr('data-menu');
		v = v.split('//');
		
		for (let i = 0; i < v.length; i++){
			if (v[i] === '---'){
				let n_s = document.createElement('text');
				n_s.innerHTML = '───────────';
				n_s.setAttribute('class','menu_separator');
				m.append(n_s);
			}else{
				v[i] = v[i].split('\\');
				let n_o = document.createElement('button');
				n_o.innerHTML = v[i][0];
				n_o.setAttribute('class','menu_option');
				n_o.setAttribute('onclick',v[i][2]);
				m.append(n_o);
			}
		}
		
		let mex = mouse_x, mey = mouse_y;
		if (mouse_y > window.innerHeight - m.css('height')){
			mey = mouse_y - m.css('height');
		}
		m.css('left',mex + 'px').css('top',mey + 'px');
		
		m.show();
	}else{
		close_menu();
	};
});

function close_menu() {
	$('#menu_window').hide().empty();
}