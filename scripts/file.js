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
	
}

function save_project(e = 0) {
	if (opened_project == ''){
		name = 'unnamed';
	}else{
		name = opened_project;
	}
	
	download(name, document.getElementById('writing_area').innerHTML);
}

function load_project() {
	if (document.getElementById("projectLoader").value === ""){
		return;
	}
	
	var reader = new FileReader();
	var fileInput = document.getElementById("projectLoader");
	
	var fileTypes = ["txt"];
	
	var file = fileInput.files[0];
	var textType = /text.*/;
	
	var extension = file.name.split('.').pop().toLowerCase(),  //file extension from input file
		isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
	
	if (isSuccess) { //yes
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(e) {
			textArea.value = reader.result;
			currentFilePath = file.path;
			opened_project = file.name;
		}
	}else{
		alert("File type invalid.");
	}
	
	fileInput.value = null;
	return;
}