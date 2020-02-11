function switch_doc(to){
	documents[current].contents = $('#writing_area').html();
	$('.tab').attr('class','tab');
	$('#tab' + to).attr('class','tab selected');
	$('.option_tab').hide();
	$('#tab' + to).show();
	current = to;
	$('#writing_area').html(documents[to].contents.replace(/(?:\r\n|\r|\n)/g,'<br>'));
}

function new_doc(nam = 'Unnamed.txt', txt = '', pth = ''){
	if ($('#tabs').children().length-2 >= max_tabs){
		return true;
	}
	
	let t_c = 0;
	for (let i = 1; i < $('#tabs').children().length; i++){
		if ($($('#tabs').children().get(i-1)).attr('id') == 'tab' + t_c){
			t_c += 1;
			i = 0;
		}
	}
	let n_t = document.createElement('button');
	$(n_t).attr('class','tab').attr('onclick','switch_doc('+t_c+')').text(nam).attr('id','tab'+t_c).attr('data-menu',String.raw`Rename\\rename_doc(`+t_c+String.raw`)//Close\\close_doc(`+t_c+`)`+String.raw`//Details\\info_doc(`+t_c+`)`).insertBefore($('#tabnew'));
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

function info_doc(which){
	let doc = documents[which].contents;
	if (which === current){
		doc = $('#writing_area').html();
	}
	let div = document.createElement('div');
	let d = $(div).html(doc.replace(/<div>/g,'\n')).text();
	$(div).remove();
	
	let w_s = d.split(' ').length;
	if (d === ''){
		w_s = 0;
	}
	let c_s = d.length;
	let c_ns = d.replace(/\s/g,'').length;
	
	window.open('info.html?theme=' + theme_current + '&words=' + w_s + '&char=' + c_s + '&charns=' + c_ns + '&winb=' + $('#option_border').css('opacity') + '&path=' + documents[which].path,'','width=350,height=200');
}

function close_doc(which) {
	documents[which] = { name: '', contents: '', path: '' }
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			$(obj).remove();
		}
	});
	if ($('#tabs').children().length == 2){
		$('#writing_area').text('');
		new_doc();
	}
	
	let j = which+1;
	while (!($('#tab'+j).length)){
		j -= 1;
		if (j < 0){
			console.log('h');
			j = Number(($($('#tabs').children().get(1)).attr('id')).toString().replace('tab',''));
			console.log(j);
			break;
		}
	}
	
	switch_doc(j);
}