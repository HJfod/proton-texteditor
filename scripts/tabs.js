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
	$(n_t).attr('class','tab').attr('onclick','switch_doc('+t_c+')').text(nam).attr('id','tab'+t_c).mouseenter(hover_doc).attr('data-menu',String.raw`Rename (Ctrl + R)\\rename_doc(`+t_c+String.raw`)//Close (Ctrl + W)\\close_doc(`+t_c+`)`+String.raw`//Details (Ctrl + T)\\info_doc(`+t_c+`)`+String.raw`//Move left (Ctrl + Arrow left)\\move_doc(${t_c},-1)//Move right (Ctrl + Arrow right)\\move_doc(${t_c},1)`).insertBefore($('#tabnew'));
	documents[t_c] = { name: nam, contents: txt, path: pth, changed: false };
	if (t_c == 0 && txt != ''){
		$('#writing_area').html(txt.replace(/(?:\r\n|\r|\n)/g,'<br>'));
	}
	switch_doc(t_c);
}

function rename_doc(which,set = false) {
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			if (!set){
				let star = false;
				if ($(obj).text().endsWith('*')){
					$(obj).text($(obj).text().replace(/\*/g,''));
					star = true;
				}
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
					if (star){
						alert_doc(Number($(obj).attr('id').replace('tab','')),1)
					}
					if (documents[which].name != $(obj).text()){
						documents[which].path = '';
					}
					documents[which].name = $(obj).text();
					$('#writing_area').focus();
				});
			}else{
				$(obj).text(set);
			}
		}
	});
}

function info_doc(which){
	let doc = documents[which].contents;
	if (which === current){
		doc = $('#writing_area').html();
	}
	let div = document.createElement('div');
	let d = $(div).html(doc.replace(/<div>/g,'\n').replace(/<br>/g,'\n')).text();
	$(div).remove();
	
	let w_s = d.split(' ').length;
	if (d === ''){
		w_s = 0;
	}
	let c_s = d.length;
	let c_ns = d.replace(/\s/g,'').length;
	
	window.open('info.html?theme=' + theme_current + '&words=' + w_s + '&char=' + c_s + '&charns=' + c_ns + '&winb=' + $('#option_border').css('opacity') + '&path=' + documents[which].path,'','width=350,height=200');
}

function move_doc(which,where){
	let n_o = document.createElement('div');
	let index;
	
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			index = i;
		}
	});
	
	if (where > 0 && index >= $('#tabs').children().length-2){
		return true;
	}
	
	if (where < 0 && index < 2){
		return true;
	}
	
	if (where > 0){
		$(n_o).insertAfter($('#tabs').children().get(index+where));
	}else{
		$(n_o).insertBefore($('#tabs').children().get(index+where));
	}
	
	$('#tab'+which).insertAfter($(n_o));
	
	$(n_o).remove();
}

function close_doc(which) {
	if (documents[which].changed){
		ipc.send('app','confirm=Your changes have not been saved! Are you sure you want to close?='+which);
	}else{
		actually_close_doc(which);
	}
}

ipc.on('tabs',(event,arg) => {
	let a = arg.split('=');
	switch (a[0]) {
		case 'close':
			actually_close_doc(a[1]);
			break;
	}
});

function actually_close_doc(which) {
	documents[which] = { name: '', contents: '', path: '', changed: false }
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

function add_recent_doc(pth) {
	let r = $('#recent_files');
	if (recent.docs.length >= recent.limit){
		r.children().get(0).remove();
		recent.docs.splice(0,1);
	}
	let t = pth.split('\\').pop();
	if (t.length > 12){
		t = t.substring(0,9) + '...';
	}
	recent.docs[recent.docs.length] = pth;
	let n_r = document.createElement('button');
	$(n_r).text(t).attr('onclick','open_project("' + pth.replace(/\\/g,'bSlashChar') + '")').attr('data-tool',pth).attr('class','recent_file');
	r.append($(n_r));
}

function hover_doc(e) {
	let n_x = document.createElement('button');
	let wh = Number($(e.target).attr('id').replace('tab',''));
	let l = $(e.target).position().left + Number(($(e.target).css('width')).replace('px',''));
	$(n_x).text('\u2715').attr('class','tab_close').css('left',`calc(${l}px - var(--gui-size-tab-normal)`).click(() => { $(n_x).remove(); close_doc( wh ); }).insertBefore($(e.target));
	$(e.target).mouseleave(() => { if (!($(n_x).is(':hover'))){ $(n_x).remove() } });
	$(n_x).mouseleave(() => { $(n_x).remove() });
}

function alert_doc(which,y) {
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			if (y === 1){
				if (!($(obj).text().endsWith('*'))){
					$(obj).text($(obj).text()+'*');
				}
			}else{
				if ($(obj).text().endsWith('*')){
					$(obj).text($(obj).text().replace(/\*/g,''));
				}
			}
		}
	});
}