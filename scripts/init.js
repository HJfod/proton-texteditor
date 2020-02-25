const ipc = require('electron').ipcRenderer;
const { shell } = require('electron');
const { dialog } = require('electron').remote;
const $ = require('jquery');
const html = document.documentElement;
const fs = require('fs');
const path = require('path');

var mouse_x = 0, mouse_y = 0;

let home_toggled = false;
let theme_current = 'Midnight';
let default_fonts = ['Segoe UI Light','Roboto Light','Arial'];
let fonts = '';
let colors = '';
let font_size = 16;
let documents = [];
let current = 0;
let key = { ctrl: 17, sup: 186, sub: 189, shift: 16, tab: 9, s: 83, e: 63, o: 79, n: 78, f1: 112, w: 87, left: 37, right: 39, h: 72, r: 82, t: 84 };
let max_tabs = 40;
let toolbox_timeout;
let close_force = false;
let status_fadeout = 3000;
let recent = { limit: 5, docs: [] };
let hovered_over = null;
let use_default_save_location = 1;
let remember_session = 1;

let url = new URL(window.location.href);

let dLoop = '';
dTesting: for (let i = 0; i < 5; i++) {
	try {
		fs.accessSync(path.join(__dirname + dLoop + '/resources'));
	} catch (err) {
		dLoop += '/..';
		continue dTesting;
	}
}

$(document).mousemove( (e) => {
	mouse_x = e.pageX;
	mouse_y = e.pageY;
	$('#toolbox').css('opacity','0');
	if (hovered_over != null){
		clearTimeout(toolbox_timeout);
		let ta = $(hovered_over);
		let y = ta.is(':hover');
		if (y) {
			let i = 0;
			while (ta.attr('data-tool') == undefined){
				if (i < 50){
					i++;
				}else{
					return false;
				}
				ta = ta.parent();
			}
			
			toolbox_timeout = setTimeout(() => {
				let m = $('#toolbox');
				m.text(ta.attr('data-tool')).css('opacity','1');
				let mex = mouse_x, mey = mouse_y + 15;
				if (mex > window.innerWidth - Number(m.css('width').replace('px',''))){
					mex = mouse_x - Number(m.css('width').replace('px',''));
				}
				if (mey > window.innerHeight - Number(m.css('height').replace('px',''))){
					mey = mouse_y - 15 - Number(m.css('height').replace('px',''));
				}
				m.css('left',mex + 'px').css('top',mey + 'px');
			},1000);
		}else{
			hovered_over = null;
		};
	}
});

$('#menu_window').hide();
$('#menu_select').hide();