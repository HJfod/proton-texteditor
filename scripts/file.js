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
	new_doc();
}

function save_project(e = 0) {
	if (e){
		download(documents[current].name, $('#writing_area').text());
	}else{
		download(documents[current].name, $('#writing_area').html());
	}
}

$('#project_loader').change( () => {
	load_project();
});

function load_project() {
	if ($('#project_loader').val() === ''){
		return;
	}
	
	let reader = new FileReader();
	let fi = document.getElementById('project_loader');
	
	for (let i = 0; i < fi.files.length; i++){
		let file = fi.files[i];
		let textType = /text.*/;
		
		reader.readAsText(file);
		reader.onload = function(e) {
			new_doc(file.name,reader.result,file.path);
		}
	}
	
	fi.value = null;
	return;
}