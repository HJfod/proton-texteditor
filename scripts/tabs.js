function switch_doc(to){
	documents[current].contents = $('#writing_area').html();
	$('.tab').attr('class','tab');
	$('#tab' + to).attr('class','tab selected');
	$('.option_tab').hide();
	$('#tab' + to).show();
	current = to;
	$('#writing_area').html(documents[to].contents.replace(/(?:\r\n|\r|\n)/g,'<br>'));
}

function new_doc(nam = 'New', txt = '', pth = ''){
	let t_c = 0;
	for (let i = 0; i < $('#tabs').children().length; i++){
		if ($($('#tabs').children().get(i-1)).attr('id') == 'tab' + t_c){
			t_c += 1;
			i = 0;
		}
	}
	let n_t = document.createElement('button');
	$(n_t).attr('class','tab').attr('onclick','switch_doc('+t_c+')').text(nam).attr('id','tab'+t_c).attr('data-menu',String.raw`Rename\\rename_doc(`+t_c+String.raw`)//Close\\close_doc(`+t_c+`)`).insertBefore($('#tabnew'));
	documents[t_c] = { name: nam, contents: txt, path: pth };
	switch_doc(t_c);
}

function rename_doc(which) {
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			$(obj).attr('contenteditable','true').focus();
			document.execCommand('selectAll', false, null);
			$(obj).keypress((e) => {
				if (e.which === 13) {
					$(obj).focusout();
				}
			});
			$(document).click(() => {
				$(obj).focusout()
			});
			$(obj).focusout(() => {
				$(obj).attr('contenteditable','false');
				documents[which].name = $(obj).text();
				$('#writing_area').focus();
			});
		}
	});
}

function close_doc(which) {
	documents[which] = { name: '', contents: '', path: '' }
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			$(obj).remove();
		}
	});
	if ($('#tabs').children().length == 1){
		new_doc();
	}
	switch_doc(0);
}