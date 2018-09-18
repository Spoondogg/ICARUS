// Set Global Modal animation
$('.modal').on('show.bs.modal', function(e) {
	$('.modal .modal-dialog').addClass('fadeOut').removeClass('fadeIn');
});
$('.modal').on('hide.bs.modal', function(e) {
	$('.modal .modal-dialog').addClass('fadeIn').remove('fadeOut');
});