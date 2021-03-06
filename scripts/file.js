function new_project() {
	new_doc();
}

function save_project(e = 0) {
	ipc.send('file','name=' + documents[current].name);
	let o;
	switch (e){
		case 0:
			let where = '';
			if (use_default_save_location && documents[current].path === ''){
				where = path.join(__dirname + '/userdata/projects/' + documents[current].name);
				fs.writeFileSync(where,'');
			}else{
				where = documents[current].path;
			}
			ipc.send('file','path=' + where);
			ipc.send('file-save',$('#writing_area').html());
			break;
		case 1:
			let doc = $('#writing_area').html();
			let div = document.createElement('div');
			let d = $(div).html(doc.replace(/<div>/g,'\n').replace(/<br>/g,'')).text();
			$(div).remove();
			o = { type: 'export', text: d }
			ipc.send('file-save-as',o);
			break;
		case 2:
			o = { type: '', text: $('#writing_area').html() }
			ipc.send('file-save-as',o);
			break;
	}
}

function open_project(w = '') {
	ipc.send('file','open=' + w);
}

ipc.on('file-open', (event, obj) => {
	new_doc(obj.path.split('\\').pop(), obj.text, obj.path);
	if (!obj.recent){
		add_recent_doc(obj.path);
	}
});