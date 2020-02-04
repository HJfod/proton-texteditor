const ipc = require('electron').ipcRenderer;
const $ = require('jquery');
const html = document.documentElement;
const fs = require('fs');

var mouse_x = 0, mouse_y = 0;

let home_toggled = false;
let opened_project = '';
let theme_current = 'midnight';
let fonts = '';
let default_fonts = ['Segoe UI Light','Roboto Light','Arial'];

$(document).mousemove( (e) => {
	mouse_x = e.pageX;
	mouse_y = e.pageY;
});

$('#menu_window').hide();
$('#menu_select').hide();
$('#markdown').hide();