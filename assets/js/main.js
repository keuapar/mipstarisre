
(function($) {

	// main DOM variables
	var $window = $(window),
		$body = $('body'),
		$main = $('.main'),
		$nav_list = $('.nav_list'),
		max_sec = 3;

	// navigation variables setup
	var $Bup = $('#Bup'),
		$Bnav = $('#Bnav'),
		$Bdown = $('#Bdown'),
		curr_sec = 0,
		nav_closed = true;

	$Bup.on('click', function() {
		if (curr_sec > 0) {
			curr_sec -= 1;
		}
		// scroll to curr_sec
	});

	$Bdown.on('click', function() {
		if (curr_sec < max_sec) {
			curr_sec += 1;
		}
		// scroll to curr_sec
	});

	// navigation window opening
	$Bnav.on('click', function() {
		if (nav_closed == true) {
			$main.removeClass('main_WIDE');
			$main.addClass('main_NARROW');
			$nav_list.removeClass('nav_CLOSED');
			$nav_list.addClass('nav_OPEN');
			$Bnav.removeClass('fa-angle-double-right');
			$Bnav.addClass('fa-angle-double-left');
			nav_closed = false;
		} else {
			$main.removeClass('main_NARROW');
			$main.addClass('main_WIDE');
			$nav_list.removeClass('nav_OPEN');
			$nav_list.addClass('nav_CLOSED');
			$Bnav.removeClass('fa-angle-double-left');
			$Bnav.addClass('fa-angle-double-right');
			nav_closed = true;
		}
	});

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
		'(a+b)^2 \\stackrel{?}{=} a^2 + b^2',
		'x^3-4x^2-7x+10 \\stackrel{?}{=} (x-1)(x+2)(x-5)',
		'(x-2)(y+x)(y-2x) \\stackrel{?}{=} xy^2 -2y^2 - x^2y + 4x^2 + 4xy',
		'(x+3)(x^2-6) \\stackrel{?}{=} x^3+3x^2-6x-18'
	];
	var truths = [true, false, true, false, true];
	var round = 0;
	var ans = 'none';

	/* on load display first equation */
	$(document).ready(function() {
		katex.render(polynomials[round], $('#EQ1')[0], {
			throwOnError: false
		});	
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
		round += 1;
		katex.render(polynomials[round], $('#EQ1')[0], {
			throwOnError: false
		});
		$EQ1A.text('.');
		ans = 'none';
	});

})(jQuery);