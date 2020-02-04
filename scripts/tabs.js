function switch_doc(to){
	documents[current] = $('#writing_area').text();
	$('.tab').attr('class','tab');
	$('#tab' + to).attr('class','tab selected');
	$('.option_tab').hide();
	$('#tab' + to).show();
	current = to;
	$('#writing_area').text() = documents[to];
}

function new_doc(){
	let t_c = 0;
	for (let i = 0; i < $('#tabs').children().length - 1; i++){
		if ($($('#tabs').children().get(i)).attr('id') == 'tab' + t_c){
			t_c += 1;
			i = 0;
		}
	}
	let n_t = document.createElement('button');
	$(n_t).attr('class','tab').attr('onclick','switch_doc('+t_c+')').attr('id','tab'+t_c).text('New file').attr('data-menu',String.raw`Close\\close_doc(`+t_c+`)`).insertBefore($('#tabnew'));
	switch_doc(t_c);
}

function close_doc(which) {
	$('#tabs').children().each((i,obj) => {
		if ($(obj).attr('id') === 'tab'+which){
			$(obj).remove();
		}
	});
	switch_doc(0);
}