$('.option_tab').hide();
$('#o_tab0').show();

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

let url = new URL(window.location.href);
switch_theme(url.searchParams.get('theme'));