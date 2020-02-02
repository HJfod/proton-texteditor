const ipc = require('electron').ipcRenderer;
const $ = require('jquery');

var mouse_x = 0, mouse_y = 0;

$(document).mousemove( (e) => {
	mouse_x = e.pageX;
	mouse_y = e.pageY;
});

$('#menu_window').hide();