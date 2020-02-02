const ipc = require('electron').ipcRenderer;
const $ = require('jquery');
const html = document.documentElement;

var mouse_x = 0, mouse_y = 0;

let home_toggled = false;
let opened_project = '';

$(document).mousemove( (e) => {
	mouse_x = e.pageX;
	mouse_y = e.pageY;
});

$('#menu_window').hide();