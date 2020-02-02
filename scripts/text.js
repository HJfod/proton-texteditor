function colourText(how = 0) {
	if (window.getSelection().toString() != ''){
		switch (how){
			case 1:
				document.execCommand('bold');
				break;
			case 2:
				document.execCommand('italic');
				break;
		}
	}
}