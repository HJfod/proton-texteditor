$('.option_tab').hide();
$('#o_tab0').show();
$('#font_select_c').hide();
$('#color_select_c').hide();

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
	if (to === 'custom'){
		window.open('theme.html?theme=' + theme_current + '&winb=' + $('#option_border').css('opacity'),'','width=350,height=350');
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
	$(n_o).text('\u25a0');
	$(n_o).attr('data-menu',String.raw`Delete\\delete_color("` + t + `")`);
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
		if ($(obj).css('color') == t){
			$(obj).remove();
		}
	});
}

for (let i = 0; i < default_fonts.length; i++){
	add_font(default_fonts[i]);
}

$('.selector.font').each((i, obj) => { $(obj).css('font-family',$(obj).text()) });

switch_theme(url.searchParams.get('theme').split('>'));

if (url.searchParams.get('md') === '1'){
	$('#check_markdown').attr('checked',true);
}

let f = url.searchParams.get('fonts').split(',');
for (let i = 0; i < f.length-1; i++){
	add_font(f[i]);
}

let c = url.searchParams.get('colors').split(';');
for (let i = 0; i < c.length; i++){
	add_color(c[i]);
}

if (url.searchParams.get('winb') === '0'){
	$('#check_winborder').attr('checked',false);
	toggle_winborder();
}

$('#check_markdown').change( () => {
	ipc.send('app','toggle-markdown');
});

$('#check_winborder').change( () => {
	toggle_winborder();
	ipc.send('app','toggle-winborder');
});

$('#font_size_input').keyup( () => {
	ipc.send('app','font-size=' + $('#font_size_input').val() );
});

$('#tab_size_input').keyup( () => {
	ipc.send('app','max-tabs=' + $('#tab_size_input').val() );
});

$('#font_size_input').val(url.searchParams.get('size'));
$('#tab_size_input').val(url.searchParams.get('mtabs'));