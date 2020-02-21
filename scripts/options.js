$('.option_tab').hide();
$('#o_tab0').show();
$('#font_select_c').hide();
$('#color_select_c').hide();

function open_logs() {
	ipc.send('app','open-logs');
}

function options_close() {
	let t = '';
	let c = '';
	$('.selector.font').each((i,obj) => {
		if (i < default_fonts.length || i > $('.selector.font').length - 2){
			return true;
		}
		t += $(obj).text() + ',';
	});
	$('.selector.color').each((i,obj) => {
		if (i > $('.selector.color').length - 2){
			return true;
		}
		c += $(obj).css('color');
		if (i < $('.selector.color').length - 2){
			c += ';';
		}
	});
	ipc.send("app","fonts=" + t);
	ipc.send("app","colors=" + c);
	window.close();
}

function switch_tab(to){
	$('.tab').attr('class','tab');
	$('#o_btab' + to).attr('class','tab selected');
	$('.option_tab').hide();
	$('#o_tab' + to).show();
}

function option_switch_theme(to) {
	if (to === true){
		window.open('themeinfo.html','','width=350,height=120');
	}else{
		ipc.send('app','change-theme=' + to);
		switch_theme(to);
	}
}

function switch_font(to) {
	if (to === 'Custom'){
		$('#font_select').hide();
		$('#font_select_c').show();
	}else{
		ipc.send('app','change-font=' + to);
	}
}

function add_color(t) {
	if (t === 'Custom'){
		$('#color_select').hide();
		$('#color_select_c').show();
		return true;
	}
	t = t.replace(/%23/g,'#');
	$('#color_select').show();
	$('#color_select_c').hide();
	let n_o = document.createElement('button');
	$(n_o).attr('class','selector color');
	$(n_o).attr('id','clr'+t.replace(/#/g,''));
	$(n_o).text('\u25a0');
	$(n_o).attr('data-menu',String.raw`Delete\\delete_color("` + t.replace(/#/g,'') + `")`);
	$(n_o).css('color',t);
	$(n_o).insertBefore($('#c_cu'));
}

function add_font(t) {
	$('#font_select').show();
	$('#font_select_c').hide();
	let n_o = document.createElement('button');
	$(n_o).attr('class','selector font');
	$(n_o).text(t);
	$(n_o).attr('onclick','switch_font("' + t + '")');
	$(n_o).attr('data-menu',String.raw`Delete\\delete_font("` + t + `")`);
	$(n_o).css('font-family',t);
	$(n_o).insertBefore($('#f_cu'));
}

function delete_font(t) {
	$('.selector.font').each((i,obj) => {
		if ($(obj).text() == t){
			$(obj).remove();
		}
	});
}

function delete_color(t) {
	$('.selector.color').each((i,obj) => {
		if ($(obj).attr('id') == 'clr' + t){
			$(obj).remove();
		}
	});
}

for (let i = 0; i < default_fonts.length; i++){
	add_font(default_fonts[i]);
}

$('.selector.font').each((i, obj) => { $(obj).css('font-family',$(obj).text()) });

ipc.on('settings', (event, data) => {
	console.log(data);
	
	switch_theme(data.theme);
	
	if (data.md === '1'){
		$('#check_markdown').attr('checked',true);
	}
	if (data.tbx === true){
		$('#check_toolbox').attr('checked',true);
	}
	if (data.winb === '0'){
		$('#check_winborder').attr('checked',false);
		toggle_winborder();
	}
	if (data.save_in_projects === 0){
		$('#check_savelocation').attr('checked',false);
	}
	if (data.save_session === 0){
		$('#check_remember').attr('checked',false);
	}
	let f = data.fonts.split(',');
	for (let i = 0; i < f.length-1; i++){
		add_font(f[i]);
	}
	let c = data.colors.split(';');
	for (let i = 0; i < c.length; i++){
		add_color(c[i]);
	}
	$('#font_size_input').val(data.size);
	$('#tab_size_input').val(data.mtabs);
});

$(':input').change( (e) => {
	switch (e.target.id){
		case 'check_toolbox':
			ipc.send('app','toggle-toolbox');
			break;
		case 'check_markdown':
			ipc.send('app','toggle-markdown');
			break;
		case 'check_remember':
			ipc.send('app','toggle-session-save');
			break;
		case 'check_savelocation':
			ipc.send('app','toggle-save-location');
			break;
		case 'check_winborder':
			toggle_winborder();
			ipc.send('app','toggle-winborder');
			break;
	}
});

$('#font_size_input').keyup( () => {
	ipc.send('app','font-size=' + $('#font_size_input').val() );
});

$('#tab_size_input').keyup( () => {
	ipc.send('app','max-tabs=' + $('#tab_size_input').val() );
});

let dir = path.join(__dirname + dLoop + '/userdata/themes');
let files = fs.readdirSync(dir).toString().split(',');
for (let i in files){
	files[i] = files[i].replace('.pthm','');
	let n_o = document.createElement('button');
	$(n_o).attr('class','selector').text(files[i]).attr('onclick','option_switch_theme("' + files[i] + '")').insertBefore($('#theme_help'));
}

ipc.send('app','get-settings');