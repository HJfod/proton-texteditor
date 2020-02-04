function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	
	element.style.display = 'none';
	document.body.appendChild(element);
	
	element.click();
	
	document.body.removeChild(element);
}

function new_project() {
	$('#writing_area').text('');
}

function save_project(e = 0) {
	if (opened_project.name == ''){
		name = 'unnamed';
	}else{
		name = opened_project.name;
	}
	
	download(name, document.getElementById('writing_area').innerHTML);
}

$('#project_loader').change( () => {
	load_project();
});

function load_project() {
	if ($('#project_loader').val() === ''){
		return;
	}
	
	let reader = new FileReader();
	let fileInput = document.getElementById('project_loader');
	
	let file = fileInput.files[0];
	let textType = /text.*/;
	
	reader.readAsText(file);
	reader.onload = function(e) {
		document.getElementById('writing_area').innerHTML = reader.result;
		opened_project.path = file.path;
		opened_project.name = file.name;
	}
	
	fileInput.value = null;
	return;
}