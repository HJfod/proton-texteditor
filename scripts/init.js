const ipc = require('electron').ipcRenderer;
const { shell } = require('electron');
const $ = require('jquery');
const html = document.documentElement;
const fs = require('fs');

var mouse_x = 0, mouse_y = 0;

let home_toggled = false;
let theme_current = 'midnight';
let default_fonts = ['Segoe UI Light','Roboto Light','Arial'];
let fonts = '';
let colors = '';
let font_size = 16;
let documents = [];
let current = 0;
let key = { ctrl: 17, sup: 186, sub: 189, shift: 16, tab: 9 };
let max_tabs = 5;

let url = new URL(window.location.href);

$(document).mousemove( (e) => {
	mouse_x = e.pageX;
	mouse_y = e.pageY;
});

$('#menu_window').hide();
$('#menu_select').hide();