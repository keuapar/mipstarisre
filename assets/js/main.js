
// extension by Stephan Muller
// from https://stackoverflow.com/questions/3701311/event-when-user-stops-scrolling
$.fn.scrollEnd = function(callback, timeout) {          
	$(this).on('scroll', function(){
	  var $this = $(this);
	  if ($this.data('scrollTimeout')) {
		clearTimeout($this.data('scrollTimeout'));
	  }
	  $this.data('scrollTimeout', setTimeout(callback,timeout));
	});
  };

(function($) {

	// main DOM variables
	var $window = $(window),
		$main = $('.main'),
		$nav_list = $('.nav_list'),
		sec_arr = $.map($('section'), function(n, i){return n.id;}),
		max_sec = $('section').length;

	// plot update function, on adding new points
	function update(plot, pts, xmax, ymax) {
		plot.setData([pts]);
		plot.getAxes().xaxis.options.max = Math.max(xmax +1, 10);
		plot.getAxes().yaxis.options.max = Math.max(ymax +1, 10);
		plot.setupGrid();
		plot.draw();
	}

	// NAVIGATION
	// variables setup
	var $Bup = $('#Bup'),
		$Bnav = $('#Bnav'),
		$Bdown = $('#Bdown'),
		nav_closed = true;

	// "all the way down"
	$('#Bdowndown').attr('href', '#' + sec_arr[max_sec -1])

	// scrolling buttons
	$Bup.on('click', function(event) {
		window.scrollBy(0, -1*$window.height());
		event.preventDefault();
	});
	$Bdown.on('click', function(event) {
		window.scrollBy(0, $window.height());
		event.preventDefault();
	});

	// update hash on scroll
	$window.scrollEnd(function() {
		var sec = Math.round(this.scrollY / $window.height());
		history.replaceState(undefined, undefined, '#'+sec_arr[sec]);
	}, 200);

	// navigation window opening
	$Bnav.on('click', function() {
		// navigation is opening
		if (nav_closed == true) {
			$main.removeClass('main_WIDE');
			$main.addClass('main_NARROW');
			$nav_list.removeClass('nav_CLOSED');
			$nav_list.addClass('nav_OPEN');
			$Bnav.removeClass('fa-angle-double-right');
			$Bnav.addClass('fa-angle-double-left');
			nav_closed = false;
		} else {
			// navigation is closing
			$main.removeClass('main_NARROW');
			$main.addClass('main_WIDE');
			$nav_list.removeClass('nav_OPEN');
			$nav_list.addClass('nav_CLOSED');
			$Bnav.removeClass('fa-angle-double-left');
			$Bnav.addClass('fa-angle-double-right');
			nav_closed = true;
		}
	});

	// shuffling utility by communitywiki
	// @ https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array) {
		let currentIndex = array.length,  randomIndex;
	  
		// While there remain elements to shuffle...
		while (currentIndex != 0) {
	  
		  // Pick a remaining element...
		  randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex--;
	  
		  // And swap it with the current element.
		  [array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
		}
	  
		return array;
	}
	// sorted utility by zer00ne
	// @ https://stackoverflow.com/questions/53833139/check-array-in-js-is-list-sorted/53833620
	function sorted(array) {
		return array.every(function(num, idx, arr) {
		  return (num <= arr[idx + 1]) || (idx === arr.length - 1) ? 1 : 0;
		});
	}
	// get a random dark colour by Zaheer Ahmed
	// @ https://stackoverflow.com/questions/20114469/javascript-generate-random-dark-color
	function getDarkColor() {
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += Math.floor(Math.random() * 10);
		}
		return color;
	}

	// 01: SORTING
	var num_books = 5,
		// plot axis elements
		s01_pts = [],
		s01_xmax = 1,
		s01_ymax = 1,
		book_names = [],
		picked = [],
		running = false,
		$library = $('.s01_wrap');

	// clock timer adapted from the clock timer
	// @ https://jsfiddle.net/wizajay/rro5pna3/305/
	var s01_clock = {
		totalSeconds: 0,
		start: function () {
			if (!this.interval) {
				var self = this;
				function pad(val) { return val > 9 ? val : "0" + val; }
				this.interval = setInterval(function () {
				self.totalSeconds += 1;
		
				if (self.totalSeconds >= 6000) {
					$("#s01_min").text(pad(Math.floor(self.totalSeconds / 6000 % 60)))
				}
		
				$("#s01_sec").text(pad(Math.floor(self.totalSeconds / 100 % 60)));
				$("#s01_msec").text(pad(parseInt(self.totalSeconds % 100)));
				}, 10);
			}
		},
		
		reset: function () {
			s01_clock.totalSeconds = null; 
			clearInterval(this.interval);
			$("#s01_min").text("00");
			$("#s01_sec").text("00");
			$("#s01_msec").text("00");
			delete this.interval;
		},
		pause: function () {
			clearInterval(this.interval);
			delete this.interval;
		},
		
		resume: function () {
			this.start();
		},
		
		restart: function () {
				this.reset();
			s01_clock.start();
		}
	};

	// method for picking a random book
	book_names.random = function() {
		var bk = this[Math.floor(Math.random()*this.length)];
		while (picked.includes(bk) || bk.length > 30) {
			bk = this[Math.floor(Math.random()*this.length)];
		}
		picked.push(bk);
		return bk;
	};

	// call to set up the div of books to be sorted
	function build_library(num_books) {
		var book = 'x',
			hor_space = $library.width()/num_books,
			book_ids = Array.from(Array(num_books).keys()),
			book_id = 0;
		
		console.log(book_ids);
		shuffle(book_ids);
			
		for (let i = 0; i < num_books; i++) {
			book_id = book_ids[i];
			book = $('<li></li>')
			.attr({
				'class': 's01_book',
				'data-bookid': book_id
			})
			.text(book_names.random())
			.css({
				'width': Math.min(60, hor_space),
				'height': 150 + 100*(1+book_id)/num_books,
				'background-color': getDarkColor()
			});
			$library.append(book);
		}

		picked = [];
	};

	// 100 best books by benoitvallon 
	// @ https://github.com/benoitvallon/100-best-books/blob/master/books.json
	$.getJSON('/assets/activities/books.json')
		.done(function(data) {
			$.each(data, function(key, value) {
				book_names.push(value.title);
			});
			build_library(num_books);
		});
		// .fail() here as fallback

	// two options for how to make the list sortable - both functional
	// SortableJS @ https://github.com/SortableJS/Sortable
	new Sortable(s01_wrap, {
		animation: 300,
		ghostClass: 'sortable-ghost',
		onEnd: s01_check,
		onStart: s01_start
	});

	// call to start timer
	function s01_start() {
		if (running == false) {
			$('.s01_timer').css({'color': 'white'});
			running == true;
			s01_clock.start();
		}
	};

	// call whenever user drops a book into the library
	// checks if it is sorted and ends the game if so
	function s01_check() {
		var arr = []
		$('.s01_book').each(function(i, item) {
			arr.push($(item).data('bookid'));
		})
		// console.log(arr);
		if (sorted(arr)) {
			$('.s01_timer').css({'color': '#00FA9A'});
			running = false;
			s01_clock.pause();
			time = s01_clock.totalSeconds/100;
			// save the user time for display in plot
			s01_pts.push([num_books, time]);
			s01_xmax = Math.max(s01_xmax, num_books);
			s01_ymax = Math.max(s01_ymax, time);
			// redraw plot
			update(s01_plt, s01_pts, s01_xmax, s01_ymax);
		}
	};
	// $library.sortable();

	// library buttons functionality
	function resetlibrary() {
		$('.s01_timer').css({'color': 'white'});
		s01_clock.reset();
		$library.children().replaceWith();
		build_library(num_books);
	};
	$('.s01_reset').on('click', resetlibrary);
	$('.s01_harder').on('click', function() {
		max_books = Math.floor($library.width()/70);
		num_books = Math.min(num_books + 2, max_books);
		num_books = Math.max(num_books, 3);
		resetlibrary();
	})

	// plot for Section 01
	var s01_options = {
			series: {
				lines: { show: false },
				points: { 
					show: true, 
					radius: 5, 
					fillColor: 'red',
					lineWidth: 0 
				}
			},
			xaxis: {
				autoScale: false,
				min: 0,
				max: 10
			},
			yaxis: {
				autoScale: false,
				min: 0,
				max: 10
			},
			axisLabels: {
				show: true
			},
			xaxes: [{
				axisLabel: 'number of books',
			}],
			yaxes: [{
				position: 'left',
				axisLabel: 'time to sort (seconds)',
			}]
		};

	var s01_plt = $.plot('#s01_plot', [s01_pts], s01_options);

	/* OVERLAYS */
	var btext = false;
	$('.b-overlay').on('click', function() {
		$('.overlay').toggleClass('hide');
		if (btext == false) {
			$('.b-text').text('CLOSE');
			btext = true;
		} else {
			$('.b-text').text('EXPLAIN');
			btext = false;
		}
	});

	/* page buttons */
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