function colourText(how = 0) {
	switch (how){
		case 0:
			let m = $('#menu_select');
			m.empty();
			let c = ['var(--gui-color-text-default)','#f00','#0f0','#00f','#0ff'];
			for (let i = 0; i < c.length; i++){
				let n_o = document.createElement('button');
				n_o.innerHTML = '\u25a0';
				n_o.setAttribute('class','menu_option wide');
				n_o.setAttribute('style','color: ' + c[i]);
				let d;
				if (!i){ d = 'getComputedStyle(html).getPropertyValue("' +  c[i].replace('var(','').replace(')','') + '")' }else{ d = '"' + c[i] + '"' }
				n_o.setAttribute('onmouseup','document.execCommand("foreColor",false,' + d + '); $("font").attr("data-menu",$("#writing_area").attr("data-menu")); $("#menu_select").hide().empty()');
				console.log($(n_o).attr('onmouseup'));
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
		case 4:
			document.execCommand('superscript');
			break;
		case 5:
			document.execCommand('subscript');
			break;
	}
}