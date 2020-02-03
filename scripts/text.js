function colourText(how = 0) {
	switch (how){
		case 0:
			let m = $('#menu_select');
			m.empty();
			let c = ['#fff','#f00','#0f0','#00f','#0ff'];
			for (let i = 0; i < c.length; i++){
				let n_o = document.createElement('button');
				n_o.innerHTML = '\u25a0';
				n_o.setAttribute('class','menu_option wide');
				n_o.setAttribute('style','color: ' + c[i]);
				n_o.setAttribute('onclick','document.execCommand("foreColor",false,"' + c[i] + '"); $("#menu_select").hide().empty()');
				m.append(n_o);
			}
			let l = Number($('#menu_window').css('left').replace('px','')) + Number($('#menu_window').css('width').replace('px',''));
			m.css('left',l).css('top',mouse_y);
			m.show();
			break;
		case 1:
			document.execCommand('bold');
			break;
		case 2:
			document.execCommand('italic');
			break;
		case 3:
			document.execCommand('underline');
			break;
	}
}