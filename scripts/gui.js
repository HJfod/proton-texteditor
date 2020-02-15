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
	window.open('options.html?theme=' + theme_current + '&md=' + $('#markdown').css('opacity') + '&tbx=' + $('#toolbox').is(':visible') + '&fonts=' + fonts + '&colors=' + colors + '&winb=' + $('#option_border').css('opacity') + '&mtabs=' + max_tabs + '&size=' + font_size,'','width=400,height=400');
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
			$('#status').text('• ' + a[1]).css('color','#0f0').fadeIn(0).fadeOut(status_fadeout);
			documents[current].changed = false;
			break;
		case 'close-force':
			close_force = true;
			window.close();
			break;
	}
});

function resize_tabs() {
	if ($('#tabs')[0].scrollWidth > $('#tabs').innerWidth()) {
		html.style.setProperty('--gui-size-tab','var(--gui-size-tab-big)');
	}else{
		html.style.setProperty('--gui-size-tab','var(--gui-size-tab-normal)');
	}
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
	
	switch (Object.keys(map).join(',')) {
		case key.ctrl + ',' + key.sup:
			e.preventDefault();
			colourText(4);
			break;
		case key.ctrl + ',' + key.sub:
			e.preventDefault();
			colourText(5);
			break;
	}
}).keyup((e) => {
	delete map[e.which];
});

$('#writing_area').keyup(() => {
	if (documents[current].contents != $('#writing_area').html()){
		documents[current].changed = true;
	}
});

$('[data-tool]').mouseenter( (e) => {
	e.preventDefault();
	let ta = $(e.target);
	
	let i = 0;
	while (ta.attr('data-tool') == undefined){
		if (i < 50){
			i++;
		}else{
			return false;
		}
		ta = ta.parent();
	}
	
	toolbox_timeout = setTimeout(() => {
		$('#toolbox').css('left',mouse_x + 'px').css('top',(mouse_y + 15) + 'px').text(ta.attr('data-tool')).css('opacity','1');
	},1000);
}).mouseleave( (e) => {
	clearTimeout(toolbox_timeout);
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
	if (mouse_y > window.innerHeight - m.css('height')){
		mey = mouse_y - m.css('height');
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