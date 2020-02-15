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
let key = { ctrl: 17, sup: 186, sub: 189, shift: 16, tab: 9, s: 83, e: 63, o: 79, n: 78, f1: 112 };
let max_tabs = 40;
let toolbox_timeout;
let close_force = false;
let status_fadeout = 3000;

let url = new URL(window.location.href);

$(document).mousemove( (e) => {
	mouse_x = e.pageX;
	mouse_y = e.pageY;
	$('#toolbox').css('opacity','0');
});

$('#menu_window').hide();
$('#menu_select').hide();