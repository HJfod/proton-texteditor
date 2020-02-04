$('.option_tab').hide();
$('#o_tab0').show();
$('#font_select_c').hide();

let url = new URL(window.location.href);

function options_close() {
	let t = '';
	$('.selector.font').each((i,obj) => {
		if (i < 3 || i > $('.selector.font').length - 2){
			return true;
		}
		t += $(obj).text() + ',';
	});
	ipc.send("app","fonts=" + t);
	window.close();
}

function switch_tab(to){
	$('.tab').attr('class','tab');
	$('#o_btab' + to).attr('class','tab selected');
	$('.option_tab').hide();
	$('#o_tab' + to).show();
}

function option_switch_theme(to) {
	ipc.send('app','change-theme=' + to);
	switch_theme(to);
}

function switch_font(to) {
	if (to === 'Custom'){
		$('#font_select').hide();
		$('#font_select_c').show();
	}else{
		ipc.send('app','change-font=' + to);
	}
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

for (let i = 0; i < default_fonts.length; i++){
	add_font(default_fonts[i]);
}

$('.selector.font').each((i, obj) => { $(obj).css('font-family',$(obj).text()) });

switch_theme(url.searchParams.get('theme'));

if (url.searchParams.get('md') === '1'){
	$('#check_markdown').attr('checked',true);
}

let f = url.searchParams.get('fonts').split(',');
for (let i = 0; i < f.length-1; i++){
	add_font(f[i]);
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

$('#font_size_input').val(url.searchParams.get('size'));