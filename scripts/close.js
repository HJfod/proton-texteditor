window.onbeforeunload = (e) => {
	let data = 'theme_current=' + theme_current + '&markdown=' + $('#markdown').css('opacity') + '&toolbox=' + $('#toolbox').is(':visible') + '&fonts=' + fonts + '&colors=' + colors + '&winb=' + $('#option_border').css('opacity') + '&mtabs=' + max_tabs + '&size=' + font_size;
	
	let recentdata = '';
	
	
	
	let docdata = '';
	for (let i = 0; i < documents.length; i++){
		if (documents[i].path == ''){
			continue;
		}
		docdata += '\n' + documents[i].name + ';docSeparator;' + documents[i].path;
	}
	
	fs.writeFile('resources/savedata.txt', data + docdata, (err) => {
		if (err) throw err;
	});
	
	let t = false;
	for (let i = 0; i < documents.length; i++){
		if (documents[i].changed){
			t = true;
		}
	}
	
	if (close_force){
		e.preventDefault();
	}
	
	if (t && !close_force){
		ipc.send('app','confirm=Your changes have not been saved! Are you sure you want to close?');
		return false;
	}else{
		e.preventDefault();
	}
};