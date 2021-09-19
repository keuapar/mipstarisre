
(function($) {

	var $window = $(window),
		$body = $('body');

	var $B1 = $('#B1'),
		$B2 = $('#B2'),
		$B3 = $('#B3'),
		$B4 = $('#B4'),
		$B5 = $('#B5'),
		$B6 = $('#B6'),
		$EQ1 = $('#EQ1');


	var polynomials = [
		'x^3-4x^2-7x+10\\stackrel{?}{=}(a+b)(a-b)',
		'(x+3)(x^2-6)\\stackrel{?}{=}x^3+3x^2-6x-18'
	];
	var round = 0;

	$B3.on('click', function() {
		katex.render(polynomials[round], document.getElementById('EQ1'), {
			throwOnError: false
		});
		round += 1;
	});

})(jQuery);