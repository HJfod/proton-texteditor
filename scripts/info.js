let url = new URL(window.location.href);

switch_theme(url.searchParams.get('theme'));

if (url.searchParams.get('winb') === '0'){
	$('#check_winborder').attr('checked',false);
	toggle_winborder();
}

$('#i_word_count').text(url.searchParams.get('words'));
$('#i_char_count').text(url.searchParams.get('char'));
$('#i_chns_count').text(url.searchParams.get('charns'));
$('#i_path').text(url.searchParams.get('path'));

