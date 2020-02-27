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

function show_status(t,type) {
	type ? type = '#f00' : type = '#0f0';
	$('#status').text('• ' + t).css('color',type).fadeIn(0).fadeOut(status_fadeout);
	ipc.send('app','new-log=' + t);
}

function toggle_winborder() {
	if ($('#option_border').css('opacity') === '1'){
		$('#option_border').css('opacity',0);
	}else{
		$('#option_border').css('opacity',1);
	}
}

function toggle_markdown() {
	if ($('#markdown').css('opacity') === '0'){
		$('#markdown').css('opacity','1');
		html.style.setProperty('--gui-size-markdown','var(--gui-size-markdown-length)');
	}else{
		$('#markdown').css('opacity','0');
		html.style.setProperty('--gui-size-markdown','0px');
	}
}

function open_settings() {
	const data = {
		theme: theme_current,
		md: $('#markdown').css('opacity'),
		tbx: $('#toolbox').is(':visible'),
		fonts: fonts,
		colors: colors,
		winb: $('#option_border').css('opacity'),
		mtabs: max_tabs,
		size: font_size,
		save_session: remember_session,
		save_in_projects: use_default_save_location
	}
	ipc.send('set-settings',data);
	ipc.send('app','open-settings');
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
		case 'toggle-markdown':
			toggle_markdown();
			break;
		case 'toggle-toolbox':
			$('#toolbox').is(':hidden') ? $('#toolbox').show() : $('#toolbox').hide();
			break;
		case 'change-font':
			html.style.setProperty('--gui-text-font',a[1]);
			break;
		case 'fonts':
			fonts = a[1];
			break;
		case 'colors':
			colors = a[1];
			break;
		case 'toggle-winborder':
			toggle_winborder();
			break;
		case 'font-size':
			html.style.setProperty('--gui-size-text',a[1] + 'px');
			font_size = a[1];
			break;
		case 'custom-theme':
			switch_theme('custom',a[1]);
			break;
		case 'max-tabs':
			max_tabs = a[1];
			break;
		case 'file':
			show_status(a[1],0);
			break;
		case 'file-save':
			let f = a[1].substring(1);
			let t = Number(a[1].substring(0,1));
			show_status('File succesfully saved at ' + f,0);
			documents[current].name = f.split('\\').pop();
			documents[current].path = f;
			documents[current].changed = false;
			documents[current].contents = $('#writing_area').html();
			alert_doc(current,0);
			rename_doc(current,f.split('\\').pop());
			if (!t){
				add_recent_doc(f);
			}
		case 'toggle-session-save':
			remember_session ? remember_session = 0 : remember_session = 1;
			break;
		case 'toggle-save-location':
			use_default_save_location ? use_default_save_location = 0 : use_default_save_location = 1;
			break;
		case 'close-force':
			close_force = true;
			window.close();
			break;
		case 'image':
			try {
				$('#writing_area').focus();
				let pics = document.getElementsByClassName('pic');
				let id = 'pic' + (Math.round(Math.random()*3456));	// random number for id
				for (let i in pics){
					if (pics[i].id === id){
						id = 'pic' + (Math.round(Math.random()*3456));
						i = 0;
					}
				}
				document.execCommand('insertHTML',0,'<img src="' + a[1] + '" class="pic" id="' + id + `" data-menu='` + String.raw`Remove\\delete_image("` + id + `")'></img>`);
			} catch (err) {
				throw err;
			}
	}
});

function resize_tabs() {
	if ($('#tabs')[0].scrollWidth > $('#tabs').innerWidth()) {
		html.style.setProperty('--gui-size-tab','var(--gui-size-tab-big)');
	}else{
		html.style.setProperty('--gui-size-tab','var(--gui-size-tab-normal)');
	}
}

function delete_image(which) {
	$(`#${which}`).remove();
}

$('#tabs').bind('DOMSubtreeModified', () => {
	resize_tabs();
});

window.onresize = () => {
	resize_tabs();
};

var map = {};
$(document).mouseup( () => {
	close_menu();
}).keydown((e) => {
	close_menu();
	map[e.which] = true;
	
	let th = true;
	switch (Object.keys(map).join(',')) {
		case key.ctrl + ',' + key.sup:
			e.preventDefault();
			colourText(4);
			break;
		case key.ctrl + ',' + key.sub:
			e.preventDefault();
			colourText(5);
			break;
		case key.ctrl + ',' + key.s:
			save_project(0);
			break;
		case key.ctrl + key.shift + ',' + key.s:
			save_project(2);
			break;
		case key.ctrl + ',' + key.e:
			save_project(1);
			break;
		case key.ctrl + ',' + key.o:
			open_project();
			break;
		case key.ctrl + ',' + key.n:
			new_project();
			break;
		case key.f1.toString():
			open_settings();
			break;
		case key.ctrl + ',' + key.w:
			close_doc(current);
			break;
		case key.ctrl + ',' + key.left:
			move_doc(current,-1);
			th = false;
			break;
		case key.ctrl + ',' + key.right:
			move_doc(current,1);
			th = false;
			break;
		case key.ctrl + ',' + key.h:
			toggle_home()
			break;
		case key.ctrl + ',' + key.t:
			info_doc(current);
			break;
		case key.ctrl + ',' + key.r:
			rename_doc(current);
			break;
		default:
			th = false;
	}
	if (th){
		map = {};
	}
}).keyup((e) => {
	delete map[e.which];
});

$('#writing_area').keyup(() => {
	if (documents[current].contents != $('#writing_area').html()){
		documents[current].changed = true;
		alert_doc(current,1);
	}
});

$('[data-tool]').mouseenter((e) => {
	hovered_over = e.target;
});

$('[data-menu]').contextmenu( (e) => {
	e.preventDefault();
	let m = $('#menu_window');
	
	let ta = $(e.target);
	
	let i = 0;
	while (ta.attr('data-menu') == undefined){
		if (i < 50){
			i++;
		}else{
			return false;
		}
		ta = ta.parent();
	}
	
	let v = ta.attr('data-menu');
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
	if (mouse_x > window.innerWidth - Number(m.css('width').replace('px',''))){
		mex = mouse_x - Number(m.css('width').replace('px',''));
	}
	if (mouse_y > window.innerHeight - Number(m.css('height').replace('px',''))){
		mey = mouse_y - Number(m.css('height').replace('px',''));
	}
	m.css('left',mex + 'px').css('top',mey + 'px');
	
	m.show();
});

function close_menu() {
	let t = $('#menu_select').is(':hidden'), t2 = $('#menu_window').is(':hover'), t3 = $('#menu_window').is(':hidden');
	if (t || !t2 || t3){
		$('#menu_window').hide().empty();
		$('#menu_select').hide().empty();
		if ($('#menu_select').hasClass('unicode')){ $('#menu_select').removeClass('unicode') }
	}
}