
(function($) {

	var $window = $(window),
		$body = $('body');

	var $B1 = $('#B1'),
		$B2 = $('#B2'),
		$B3 = $('#B3'),
		$B4 = $('#B4'),
		$B5 = $('#B5'),
		$B6 = $('#B6'),
		$EQ1 = $('#EQ1'),
		$EQ1A = $('#EQ1A');

	var polynomials = [
		'a^2 - b^2 \\stackrel{?}{=} (a+b)(a-b)',
		'x^3-4x^2-7x+10\\stackrel{?}{=}(a+b)(a-b)',
		'(x+3)(x^2-6)\\stackrel{?}{=}x^3+3x^2-6x-18'
	];
	var truths = [true, true, true];
	var round = 0;
	var ans = 'none';

	/* on load display first equation */
	$(document).ready(function() {
		katex.render(polynomials[round], $('#EQ1')[0], {
			throwOnError: false
		});	
		round += 1;
	});

	function check(bt) {
		corrbt = bt == truths[round];
		console.log(bt);
		console.log(truths[round]);
		console.log(corrbt);

		if (corrbt && (ans == 'none' || ans == 'wrong')) {
			$EQ1A.text('You are right!');
			ans = 'right';
		} else if (!corrbt && (ans == 'none' || ans == 'right')) {
			$EQ1A.text('Think about that ;)');
			ans = 'wrong';
		}
	};

	$B5.on('click', function() {
		check(true)
	});
	$B6.on('click', function() {
		check(false)
	});

	/* on demand display next equation */
	$B3.on('click', function() {
		katex.render(polynomials[round], $('#EQ1')[0], {
			throwOnError: false
		});
		round += 1;
		ans = 'none';
	});

})(jQuery);