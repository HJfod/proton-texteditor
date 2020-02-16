const ipc = require('electron').ipcRenderer;
const { shell } = require('electron');
const $ = require('jquery');
const html = document.documentElement;
const fs = require('fs');
const path = require('path');

var mouse_x = 0, mouse_y = 0;

let home_toggled = false;
let theme_current = 'midnight';
let default_fonts = ['Segoe UI Light','Roboto Light','Arial'];
let fonts = '';
let colors = '';
let font_size = 16;
let documents = [];
let current = 0;
let key = { ctrl: 17, sup: 186, sub: 189, shift: 16, tab: 9, s: 83, e: 63, o: 79, n: 78, f1: 112, w: 87, left: 37, right: 39 };
let max_tabs = 40;
let toolbox_timeout;
let close_force = false;
let status_fadeout = 3000;
let recent = { limit: 5, docs: [] };
let hovered_over = null;

let url = new URL(window.location.href);

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
				$('#toolbox').css('left',mouse_x + 'px').css('top',(mouse_y + 15) + 'px').text(ta.attr('data-tool')).css('opacity','1');
			},1000);
		}else{
			hovered_over = null;
		};
	}
});

$('#menu_window').hide();
$('#menu_select').hide();