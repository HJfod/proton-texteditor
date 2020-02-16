ipc.on('logs', (event, arg) => {
	$('#logtext').text(arg.replace(/<br>/g,'\n'));
});

ipc.send('app','get-logs');