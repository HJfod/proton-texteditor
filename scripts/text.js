function colourText(how = 0) {
	let m = $('#menu_select');
	switch (how){
		case 0:
			m.empty();
			let c = colors.toString().replace(/%23/g,'#').split(';');
			c.splice(0,0,'var(--gui-color-text-default)');
			for (let i = 0; i < c.length; i++){
				let n_o = document.createElement('button');
				n_o.innerHTML = '\u25a0';
				n_o.setAttribute('class','menu_option wide');
				n_o.setAttribute('style','color: ' + c[i]);
				let d;
				if (!i){ d = 'getComputedStyle(html).getPropertyValue("' +  c[i].replace('var(','').replace(')','') + '")' }else{ d = '"' + c[i] + '"' }
				n_o.setAttribute('onmouseup','document.execCommand("foreColor",false,' + d + '); $("#menu_select").hide().empty()');
				m.append(n_o);
			}
			if ($('#menu_window').is(':hidden')){
				t = $('#textarea').css('top');
			}else{
				t = mouse_y;
			}
			let l = Number($('#menu_window').css('left').replace('px','')) + Number($('#menu_window').css('width').replace('px',''));
			m.css('left',l).css('top',t);
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
		case 6:
			document.execCommand('strikeThrough');
			break;
		case 7:
			m.empty();
			let f = ['Normal','Big','Large','Huge','Small','Tiny'];
			for (let i = 0; i < f.length; i++){
				let n_o = document.createElement('button');
				n_o.innerHTML = f[i];
				n_o.setAttribute('class','menu_option wide');
				n_o.setAttribute('onmouseup','changeFontSize("' + f[i] + '"); $("#menu_select").hide().empty()');
				m.append(n_o);
			}
			if ($('#menu_window').is(':hidden')){
				t = $('#textarea').css('top');
			}else{
				t = mouse_y;
			}
			m.css('left',mouse_x).css('top',$('#textarea').css('top'));
			m.show();
			break;
		case 8:
			document.execCommand('removeFormat');
			break;
	}
}

function selectUnicode() {
	let m = $('#menu_select');
	m.empty();
	m.addClass('unicode');
	let c = [
	'\u2022','\u2794','\u2690','\u00ab','\u00bb',				// bullet points
	'\u2190','\u2191','\u2192','\u2193',						// arrows
	'\u2bc5','\u2bc6','\u2bc7','\u2bc8',						// triangle arrows
	'\u21c7','\u21c8','\u21c9','\u21ca',						// double arrows
	'\u21c6','\u21c4','\u21c5','\u21f5',						// different direction arrows
	'\u2605','\u2606','\u{1f5d9}','\u{1f7a4}','\u25cf',			// stars, hearts, circles
	'\u2500','\u2502',											// box
	'\u2122','\u00a9','\u00ae','\u00a7','\u00b6',				// trademark sign, etc.
	'\u2713','\u2717','\u2318','\u2756','\u00a1','\u00bf',		// checkmark, etc.
	'\u03b1','\u03b2','\u03b4','\u03b5','\u03b8','\u0394',
	'\u03bb','\u03bc','\u03c0','\u03c6','\u03c8',
	'\u03a9','\u212f','\u221e','\u221a','\u2248',
	'\u2260','\u22c0','\u22c1','\u2221','\u00b1','\u00b0',		// math
	'\u{1f60e}','\u{1f60a}','\u{1f603}','\u{1f602}','\u{1f920}',
	'\u{1f921}','\u{1f609}','\u{1f61b}','\u{1f914}','\u{1f633}',
	'\u{1f622}','\u{1f62a}','\u{1f630}','\u{1f922}','\u{1f624}',
	'\u{1f525}','\u{1f4a1}','\u{1f4a9}','\u{1f4af}','\u{1f4a7}',
	'\u{1f44c}','\u{1f448}','\u{1f449}','\u{1f446}','\u{1f447}'	// emoji
	];
	for (let i = 0; i < c.length; i++){
		let n_o = document.createElement('button');
		n_o.innerHTML = c[i];
		n_o.setAttribute('class','menu_option unicode');
		n_o.setAttribute('onmouseup','$("writing_area").focus(); document.execCommand("insertText",false,"' + c[i] + '"); $("#menu_select").hide().empty(); $("#menu_select")');
		m.append(n_o);
	}
	m.css('left',mouse_x).css('top',$('#textarea').css('top'));
	m.show();
}

function changeFontSize(sz) {
	let selection = window.getSelection().toString();
	let wrappedselection = '<span class="ts_' + sz + '">' + selection + '</span>';
	document.execCommand('insertHTML', false, wrappedselection);
}