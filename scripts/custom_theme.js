let url = new URL(window.location.href);

switch_theme(url.searchParams.get('theme').split('>'));

if (url.searchParams.get('winb') === '0'){
	$('#check_winborder').attr('checked',false);
	toggle_winborder();
}

$('#custom_theme_textarea').val(
"tb: rgb(0,0,0);\n" +
"bg: rgb(0,0,0);\n" +
"home: rgb(0,0,0);\n" +
"text: rgb(255,255,255);\n" +
"bt: rgb(255,255,255);\n" +
"title: rgb(255,255,255);\n" +
"titlen: rgba(255,255,255,0.3);\n" +
"shadow: rgba(30,30,30,0.5);\n" +
"menuop: rgb(255,255,255);\n" +
"menusep: rgba(255,255,255,0.2);\n" +
"menubg: rgb(0,0,0);\n" +
"cbox: rgb(100,100,100);\n" +
"cboxu: rgb(20,20,20);\n" +
"bhover: rgba(255,255,255,0.2);\n" +
"mhover: rgba(80,80,80,1)");

function apply_custom_theme() {
	ipc.send('app','custom-theme=' + $('#custom_theme_textarea').val());
	switch_theme('custom',$('#custom_theme_textarea').val());
}