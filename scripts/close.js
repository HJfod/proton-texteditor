window.onbeforeunload = (e) => {
	let data = 'theme_current=' + theme_current + '&markdown=' + $('#markdown').css('opacity') + '&toolbox=' + $('#toolbox').is(':visible') + '&fonts=' + fonts + '&colors=' + colors + '&winb=' + $('#option_border').css('opacity') + '&mtabs=' + max_tabs + '&size=' + font_size + '&save_session=' + remember_session + '&saveloc=' + use_default_save_location;
	
	let recentdata = '\n' + recent.docs.length.toString();
	
	for (let i in recent.docs){
		recentdata += '\n' + recent.docs[i];
	}
	
	let docdata = '';
	for (let i in documents){
		if (documents[i].path == ''){
			continue;
		}
		docdata += '\n' + documents[i].path;
	}
	
	let dir = path.join(__dirname + dLoop + '/userdata');
	
	fs.writeFileSync(dir + '/savedata.txt', data + recentdata + docdata);
	
	console.log(dir);
	
	let t = false;
	for (let i in documents){
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