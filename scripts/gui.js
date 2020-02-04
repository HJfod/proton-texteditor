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

function open_settings() {
	window.open('options.html?theme=' + theme_current + '&md=' + $('#markdown').is(':visible') + '&fonts=' + fonts,'','width=400,height=400');
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
		case 'change-theme':
			switch_theme(a[1]);
			break;
		case 'toggle_markdown':
			if ($('#markdown').is(':hidden')){
				$('#markdown').show();
				html.style.setProperty('--gui-size-markdown','var(--gui-size-markdown-length)');
			}else{
				$('#markdown').hide();
				html.style.setProperty('--gui-size-markdown','0px');
			}
		case 'change-font':
			html.style.setProperty('--gui-text-font',a[1]);
			break;
		case 'fonts':
			fonts = a[1];
			console.log(fonts);
			break;
	}
});

$(document).mouseup( () => {
	close_menu();
}).keypress( () => {
	close_menu();
});

$('[data-menu]').contextmenu( (e) => {
	let m = $('#menu_window');
	
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
			n_o.setAttribute('onmouseup',v[i][2]);
			m.append(n_o);
		}
	}
	
	let mex = mouse_x, mey = mouse_y;
	if (mouse_y > window.innerHeight - m.css('height')){
		mey = mouse_y - m.css('height');
	}
	m.css('left',mex + 'px').css('top',mey + 'px');
	
	m.show();
});

function close_menu() {
	let t = $('#menu_select').is(':hidden'), t2 = $('#menu_window').is(':hover');
	if (t || !t2){
		$('#menu_window').hide().empty();
		$('#menu_select').hide().empty();
	}
}