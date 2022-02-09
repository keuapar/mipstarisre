
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

	// UTILITY FUNCTIONS
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
	// get a normal distribution sample by joshuakcockrell
	// @ https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
	function rand_norm(min = -1, max = 1) {
		let u = 0, v = 0;
		while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
		while(v === 0) v = Math.random()
		let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
		
		num = num / 10.0 + 0.5 // Translate to 0 -> 1
		if (num > 1 || num < 0) 
		  num = randn_bm(min, max) // resample between 0 and 1 if out of range
		
		else{
		  num *= max - min // Stretch to fill range
		  num += min // offset to min
		}
		return num
	}
	// N choose K utility by Mike Pomax Kamermans
	// @ https://stackoverflow.com/questions/37679987/efficient-computation-of-n-choose-k-in-node-js
	var binomial_coeffs = [
		[1],
		[1,1],
		[1,2,1],
		[1,3,3,1],
		[1,4,6,4,1],
		[1,5,10,10,5,1],
		[1,6,15,20,15,6,1],
		[1,7,21,35,35,21,7,1],
		[1,8,28,56,70,56,28,8,1]
	];
	function binomial(n,k) {
		while(n >= binomial_coeffs.length) {
		  let s = binomial_coeffs.length;
		  let nextRow = [];
		  nextRow[0] = 1;
		  for(let i=1, prev=s-1; i<s; i++) {
			nextRow[i] = binomial_coeffs[prev][i-1] + binomial_coeffs[prev][i];
		  }
		  nextRow[s] = 1;
		  binomial_coeffs.push(nextRow);
		}
		return binomial_coeffs[n][k];
	}
	// clock timer inspired by the clock timer
	// @ https://jsfiddle.net/wizajay/rro5pna3/305/
	class clock {
		constructor(id, div) {
			this.id = id;
			this.div = div;
			this.time = 0;
			// create important elements
			this.min = $('<span></span>').text('00');
			this.sec = $('<span></span>').text('00');
			this.msec = $('<span></span>').text('00');
			// build the clock
			div.append(this.min, ':', this.sec, ':', this.msec);
		}
		// starts the clock & updates it as it runs
		start() {
			this.div.css({'color': 'white'});
			if (!this.interval) {
				function pad(val) { return val > 9 ? val : "0" + val; }
				// reference to 'this' changed inside the interval
				var self = this;
				this.interval = setInterval(function () {
					self.time += 1;
			
					if (self.time >= 6000) {
						self.min.text(pad(Math.floor(self.time / 6000 % 60)))
					}
			
					self.sec.text(pad(Math.floor(self.time / 100 % 60)));
					self.msec.text(pad(parseInt(self.time % 100)));
				}, 10);
			}
		}
		// resets the clock
		reset() {
			this.div.css({'color': 'white'});
			this.time = 0; 
			clearInterval(this.interval);
			this.min.text("00");
			this.sec.text("00");
			this.msec.text("00");
			delete this.interval;
		}
		// other convenience methods
		pause(green = false) {
			// on successful completion of some activity turn green
			if (green == true) {
				this.div.css({'color': '#00FA9A'});
			}
			clearInterval(this.interval);
			delete this.interval;
		}
		resume() {
			this.start();
		}
		restart() {
			this.reset();
			this.start();
		}
	}
	// shake function using shaking utility by elrumordelaluz - details in CSS
	function shake(elem, time = 500, col = null) {
		if (col) {
			elem.css({'color': col});
		}
		elem.addClass('shake-hard shake-constant');
		setTimeout(function() {
			elem.removeClass('shake-hard shake-constant');
			if (col) {
				elem.css({'color': 'white'})
			}
		}, time);

	}
	// random integer @ https://www.w3schools.com/js/js_random.asp
	function randInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}
	// array rotator by WesleyAC
	// @ https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
	function Rotate(arr, n) {
		if (n === 0) {
		  return arr;
		}
	  
		var left = n < 0;
		n = Math.abs(left ? n : arr.length - n);
	  
		return arr.map(() => {
		  n = n < arr.length ? n : 0;
	  
		  return arr[n++];
		});
	}
	  

	// PLOTTING UTILITIES
	// plot update function, on adding new points
	// expl changes behaviour if the user already clicked the explain button
	function update(plot, dta, dta_full, expl, xmax = null, ymax = null) {
		if (expl == false) {
			plot.setData([dta]);
			if (xmax) {
				plot.getAxes().xaxis.options.max = Math.max(xmax +1, 10);
			}
			if (ymax) {
				plot.getAxes().yaxis.options.max = Math.max(ymax +1, 10);
			}
			plot.setupGrid();
			plot.draw();
		} else {
			plot.setData(dta_full);
			plot.draw();
		}
	}

	// plot points of different scaling
	var flot_n2 = [],
		flot_nlogn = [],
		flot_ncrexp = [],
		flot_max = 33,
		flot_divisor = 100;

	function sugar(n) {
		return n*(1 + rand_norm()/3)/flot_divisor
	}

	for (let i=0; i <= flot_max; i++) {
		flot_n2.push([i, sugar(i**2)]);
		flot_nlogn.push([i, sugar(i*Math.log2(i))]);
		flot_ncrexp.push([i, sugar(binomial(2*i+5,2*i))/100]);
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
	// also close any open overlays
	$window.scrollEnd(function() {
		var sec = Math.round(this.scrollY / $window.height());
		history.replaceState(undefined, undefined, '#'+sec_arr[sec]);
		if (bexplain == true) {
			$('.overlay_explains').toggleClass('visible');
			$('.b-explain').text('EXPLAIN');
			bexplain = false;
		}
		if (blinks == true) {
			$('.overlay_links').toggleClass('visible');
			$('.b-link').text('LINKS');
			blinks = false;
		}
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

	// 01: SORTING
	var num_books = 5,
		// plot axis elements
		s01_pts = [],
		s01_xmax = 1,
		s01_ymax = 1,
		book_names = [],
		picked = [],
		$library = $('.s01_wrap');

	var s01_clock = new clock(1, $('.s01_timer'));

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
			ver_space = $library.height(),
			book_ids = Array.from(Array(num_books).keys()),
			book_id = 0;
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
					'height': 150 + book_id*(ver_space-150)/num_books,
					//'height': 150 + 100*(1+book_id)/num_books,
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
		onStart: function() {s01_clock.start()}
	});
	// $library.sortable();

	// call whenever user drops a book into the library
	// checks if it is sorted and ends the game if so
	function s01_check() {
		var arr = []
		$('.s01_book').each(function(i, item) {
			arr.push($(item).data('bookid'));
		})
		// console.log(arr);
		if (sorted(arr)) {
			s01_clock.pause(green = true);
			time = s01_clock.time/100;
			// save the user time for display in plot
			s01_pts.push([num_books, time]);
			s01_xmax = Math.max(s01_xmax, num_books);
			s01_ymax = Math.max(s01_ymax, time);
			// redraw plot
			update(s01_plt, s01_pts, s01_pts_full, s01_expl, s01_xmax, s01_ymax);
		} else {
			shake($('.s01_timer'), 200);
		}
	};

	// library buttons functionality
	function resetlibrary() {
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
	var s01_opt = {
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
	var s01_pts_full = [{
		'label': 'O(n*n)',
		'data': flot_n2,
		'points': { fillColor: 'purple' }
	},{
		'label': 'O(n*log(n))',
		'data': flot_nlogn,
		'points': { fillColor: 'blue' }
	},{
		'label': 'Your algorithm',
		'data': s01_pts,
		'points': { fillColor: 'red' }
	}];
	var s01_opt_full = {
		series: {
			lines: { show: false },
			points: { 
				show: true, 
				radius: 3, 
				lineWidth: 0,
			}
		},
		legend: {
			show: true,
			position: 'nw',
			margin: [50, 5]
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

	var s01_plt = $.plot('#s01_plot', [s01_pts], s01_opt);

	// SECTION 02: Polynomial Identity Testing
	var polynomials = [
		'k^2 - l^2 \\stackrel{?}{=} (k+l)(k-l)',
		'(a+b)^2 \\stackrel{?}{=} a^2 + b^2',
		'x^3-4x^2-7x+10 \\stackrel{?}{=} (x-1)(x+2)(x-5)',
		'(x-2)(y+x)(y-2x) \\stackrel{?}{=} xy^2 -2y^2 - x^2y + 4x^2 + 4xy',
		'(x+3)(x^2-6) \\stackrel{?}{=} x^3+3x^2-6x-18'
		],
		poly_animations = [
			['k^2 - l^2 &\\stackrel{?}{=} k^2 + kl - kl - l^2',
			 'k^2 - l^2 &\\stackrel{?}{=} k^2 - l^2',
			 '0 &= 0'],
			['(a+b)^2 &\\stackrel{?}{=} a^2 + b^2',
			 'a^2 + ab + ab + b^2 &\\stackrel{?}{=} a^2 + b^2',
			 'a^2 + 2ab + b^2 &\\stackrel{?}{=} a^2 + b^2',
			 '2ab &\\neq 0'],
			 [''],
			 [''],
			 ['']
		],
		truths = [true, false, true, false, true],
		s02_round = -1,
		s02_pts = [[4, 6], [4, 7], [5, 10], [4, 15], [5, 8]],
		ans = 'none';

	function check(bt) {
		corrbt = bt == truths[s02_round];
		if (corrbt && (ans == 'none' || ans == 'wrong')) {
			s02_clock.pause(green = true);
			ans = 'right';
			poly_animate();
			// redraw plot
			let pts = s02_pts.slice(0, s02_round+1);
			update(s02_plt, pts, s02_pts_full, s02_expl);
		} else {
			// used to say / if (!corrbt && (ans == 'none' || ans == 'right'))
			shake($('.s02_timer'), time = 300, col = 'red');
			ans = 'wrong';
		}
	}

	function poly_animate() {
		let anims = poly_animations[s02_round],
			count = 0,
			mx = anims.length;
		var intro = $('<p></p>')
				.text('What steps does the computer take?')
				.css({'font-size': '0.8em'});
		
		// change later -- append intro if there's text
		if (mx > 1) {
			$('.s02_anim').append(intro);
		}
		
		s02int = setInterval(function() {
			var div = $('<div></div>');
			let txt = '\\begin{aligned}'
					+ anims.slice(0, count+1).join(' \\\\')
					+ '\\end{aligned}';

			katex.render(txt, $('.s02_anim')[0], {
				throwOnError: false
			});
			$('.s02_anim').append(div);
			count++;
			if (count >= mx) {
				clearInterval(s02int);
			}
		}, 888)
	}

	$('.s02_true').on('click', function() {check(true)});
	$('.s02_false').on('click', function() {check(false)});

	// on demand display next equation
	$('.s02_next').on('click', function() {
		s02_round += 1;
		s02_clock.restart();
		$('.s02_anim').empty();
		katex.render(polynomials[s02_round], $('.s02_eq')[0], {
			throwOnError: false
		});
		ans = 'none';
	});

	// clock s02
	var s02_clock = new clock(2, $('.s02_timer'));
	$('.s02_reset').on('click', function() {s02_clock.start()});
	$('.s02_harder').on('click', function() {s02_clock.pause(green = true)});

	// plot for Section 02
	var s02_opt = {
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
			max: 20
		},
		axisLabels: {
			show: true
		},
		xaxes: [{
			axisLabel: '~ highest degree + n. variables',
		}],
		yaxes: [{
			position: 'left',
			axisLabel: '~ steps to decide (FLOPS)',
		}]
	};
	var s02_pts_full = [{
		'label': 'O(n*n)',
		'data': flot_n2,
		'points': { fillColor: 'purple' }
	},{
		'label': 'O((n+d)choose(n))',
		'data': flot_ncrexp,
		'points': { fillColor: 'blue' }
	},{
		'label': 'Our experiment',
		'data': s02_pts,
		'points': { fillColor: 'red' }
	}];
	var s02_opt_full = {
		series: {
			lines: { show: false },
			points: { 
				show: true, 
				radius: 3, 
				lineWidth: 0,
			}
		},
		legend: {
			show: true,
			position: 'nw',
			margin: [50, 5]
		},
		axisLabels: {
			show: true
		},
		xaxes: [{
			axisLabel: '~ highest degree + n. variables',
		}],
		yaxes: [{
			position: 'left',
			axisLabel: '~ steps to decide (FLOPS)',
		}]
	};

	// ochcavka kdyz chci nic nezobrazovat protoze musi byt [s02_pts]
	var s02_plt = $.plot('#s02_plot', s02_pts, s02_opt);

	// SECTION 03: arthur-merlin
	var s03_coin = 'G1',
		s03_permuted = false,
		s03_restarted = true,
		s03_round = 0
		s03_rounds = [true, true, true, false];

	// graph general descriptions
	var s03_style = [
		{ selector: 'node',
		  style: {'label': 'data(id)',
				  'text-valign': 'center',
				  'text-halign': 'center'}},
		{ selector: 'edge',
		  style: {'width': 3, 'line-color': '#333'}}
		],
		s03_style_perm = [
			{ selector: 'node', style: {'width': '2em',
										'height': '2em',
										'background-color': 'black'}},
			{ selector: 'edge',
			  style: {'width': 3, 'line-color': '#333'}}
		],
		g1_elems = [
		{ data: { id: 'A' },
		  style: { 'background-color': 'cyan'} },
		{ data: { id: 'B' },
		  style: { 'background-color': 'beige'} },
		{ data: { id: 'C' },
		  style: { 'background-color': 'mediumpurple'} },
		{ data: { id: 'D' },
		  style: { 'background-color': 'pink'} },
		{ data: { id: 'E' },
		  style: { 'background-color': 'yellow'} },
		{ data: { id: 'AB', source: 'A', target: 'B' } },
		{ data: { id: 'AC', source: 'A', target: 'C' } },
		{ data: { id: 'BC', source: 'B', target: 'C' } },
		{ data: { id: 'CD', source: 'C', target: 'D' } },		
		{ data: { id: 'CE', source: 'C', target: 'E' } },
		{ data: { id: 'DE', source: 'D', target: 'E' } }
		],
		g2_elems = [
			{ data: { id: '1' },
			  style: { 'background-color': 'peru'} },
			{ data: { id: '2' },
			  style: { 'background-color': 'deeppink'} },
			{ data: { id: '3' },
			  style: { 'background-color': 'greenyellow'} },
			{ data: { id: '4' },
			  style: { 'background-color': 'lightskyblue'} },
			{ data: { id: '5' },
			  style: { 'background-color': 'orangered'} },
			{ data: { id: '12', source: '1', target: '2' } },
			{ data: { id: '13', source: '1', target: '3' } },
			{ data: { id: '14', source: '1', target: '4' } },
			{ data: { id: '15', source: '1', target: '5' } },
			{ data: { id: '25', source: '2', target: '5' } },
			{ data: { id: '34', source: '3', target: '4' } }		
		];
	// graphs
	var g1 = cytoscape({
		container: $('.s03_g1'),
		elements: g1_elems,
		style: s03_style,
		layout: { name: 'concentric' }
	});
	var g2 = cytoscape({
		container: $('.s03_g2'),
		elements: g2_elems,
		style: s03_style,
		layout: { name: 'circle' }
	});

	// coin flip by Le Liu
	// @ https://codepen.io/le0864/pen/pbmoVQ
	function coinflip() {
		var flipResult = Math.random();
		$('#coin').removeClass();
		setTimeout(function(){
		  if(flipResult <= 0.5){
			$('#coin').addClass('heads');
			s03_coin = 'G1';
		  }
		  else{
			$('#coin').addClass('tails');
			s03_coin = 'G2';
		  }
		}, 100);
	}

	// functions guiding the activity
	$('.s03_flip').on('click', coinflip);
	$('.s03_permute').on('click', function() {
		s03_permuted = true;
		if (s03_restarted) {
			// permute the right graph
			if (s03_coin == 'G2') {
				$('.s03_gq').css({'background-color':'gold'});
				var gq = cytoscape({
					container: $('.s03_gq'),
					elements: g2_elems,
					style: s03_style_perm,
					layout: {name: 'cose'}
				});
				gq.nodes().style('background-color', 'black');
			} else {
				$('.s03_gq').css({'background-color':'silver'});
				var gq = cytoscape({
					container: $('.s03_gq'),
					elements: g1_elems,
					style: s03_style_perm,
					layout: {name: 'cose'}
				});
				gq.nodes().style('background-color', 'black');
			}
		} else {
			shake($('.s03_restart'), 300);
		}
	});
	$('.s03_send').on('click', function() {
		if (s03_permuted && s03_restarted) {
			$('.s03_arthurtext').css({'opacity':'1'});
			// let merlinsays = Math.random() > 0.5 ? 'G1' : 'G2';
			let s03_notcoin = 'G1' == s03_coin ? 'G2' : 'G1';
			let merlinsays = s03_rounds[s03_round] ? s03_coin : s03_notcoin;
			s03_round++;
			$('.s03_merlintext').text('My magic tells me that it is from ' + merlinsays);
			var gq_left = $('.s03_gq').offset().left,
				ga_left = $('.s03_ga').offset().left;
			setTimeout(function() {
				let dist = ga_left-gq_left + 'px';
				$('.s03_gq').css({left: dist});
				$('.fa-magic').addClass('loading');
				setTimeout(function() {
					$('.fa-magic').removeClass('loading');
					$('.s03_merlintext').css({'opacity':'1'});
					// update the plot
					s03_plt.setData([s03_pts.slice(0, s03_round+1)]);
					s03_plt.draw();
				}, 3000)
			}, 500);
			s03_restarted = false;
		} else if (s03_permuted) {
			// let the user know they need to restart
			shake($('.s03_restart'), 300);
		} else {
			// let the user know they need to permute
			shake($('.s03_permute'), 300);
		}
	});
	$('.s03_restart').on('click', function() {
		$('.s03_gq').css({'background-color': 'rgba(0, 0, 0, 0)', 'transition': '0s'});
		$('.s03_gq').empty();
		$('.s03_gq').css({left: 0});
		$('.s03_text').css({opacity: 0});
		s03_restarted = true;
		s03_permuted = false;
		setTimeout(function() {$('.s03_gq').css({'transition': '1s'});}, 1000);
	});

	// plotting for s03
	var s03_pts = [[0, 0.5], [1, 0.5], [2, 0.75], [3, 0.875], [4, 0]];
	var s03_opt = {
		series: {
			lines: { show: true },
			points: { 
				show: true, 
				radius: 8, 
				fillColor: 'blue',
				lineWidth: 0 
			}
		},
		xaxis: {
			autoScale: false,
			min: 0,
			max: 5,
			showMinorTicks: false,
			tickDecimals: 0
		},
		yaxis: {
			autoScale: false,
			min: 0,
			max: 1
		},
		axisLabels: {
			show: true
		},
		xaxes: [{
			axisLabel: 'number of rounds',
		}],
		yaxes: [{
			position: 'left',
			axisLabel: 'your certainty of non-isomorphism',
		}]
	};

	var s03_plt = $.plot('#s03_plot', [s03_pts.slice(0,1)], s03_opt);

	// SECTION 04: CHSH GAME
	var tbl = $('.s04_table');
	var strats = [{0:0, 1:0}, {0:0, 1:1}, {0:1, 1:0}, {0:1, 1:1}];
	var stratchanged = true;
	var s04_i = 10;
	var s04_colors = ['green', 'purple', 'red', 'blue', 'orange', 'black'];

	// randomly give Alice and Bob a starting strategy
	var alicestrat = randInt(0, 3);
	$('.s04_a .strat').eq(alicestrat).css('background-color', 'blue');
	var bobstrat = randInt(0, 3);
	$('.s04_b .strat').eq(bobstrat).css('background-color', 'blue');
	
	// controls picking strategies
	$('.s04_a .strat').on('click', function() {
		$('.s04_a .strat').css('background-color', 'darkblue');
		$(this).css('background-color', 'blue');
		alicestrat = $(this).data('s');
		stratchanged = true;
		tbl.find('p').slice(6).remove();
	});
	$('.s04_b .strat').on('click', function() {
		$('.s04_b .strat').css('background-color', 'darkblue');
		$(this).css('background-color', 'blue');
		bobstrat = $(this).data('s');
		stratchanged = true;
		tbl.find('p').slice(6).remove();
	});
	
	// playing the CHSH game
	function chsh() {
		if (s04_i > 20) {
			clearInterval(s04_int);
			s04_i = 0;
		}
		var s04_x = randInt(0, 1),
			s04_y = randInt(0, 1),
			s04_a = strats[alicestrat][s04_x],
			s04_b = strats[bobstrat][s04_y],
			s04_win = (s04_x && s04_y) == (s04_a ^ s04_b) ? 1 : 0;

		// check for table being too full
		if (tbl[0].childElementCount > 36) {
			tbl.find('p').slice(6, 12).remove();
		}

		if (s04_win) {
			var s04_col = 'rgba(30, 250, 50, 0.5)';
		} else {
			var s04_col = 'rgba(250, 30, 50, 0.5)';
		}

		var t1 = $('<p></p>').text(s04_x).css('background', s04_col).hide(),
			t2 = $('<p></p>').text(s04_y).css('background', s04_col).hide();
			t3 = $('<p></p>').text(s04_a).css('background', s04_col).hide();
			t4 = $('<p></p>').text(s04_b).css('background', s04_col).hide();
			t5 = $('<p></p>').text(s04_x && s04_y).css('background', s04_col).hide();
			t6 = $('<p></p>').text(s04_a ^ s04_b).css('background', s04_col).hide();

		tbl.append([t1, t2, t3, t4, t5, t6]);
		t1.show('fast');
		t2.show('fast');
		t3.show('fast');
		t4.show('fast');
		t5.show('fast');
		t6.show('fast');

		// store the result of the game for plots
		var s04_pt = s04_pts[alicestrat][bobstrat];
		if (s04_pt.length == 0) {
			s04_pts[alicestrat][bobstrat].push([1, s04_win]);
		} else {
			var s04_newx = s04_pt.length+1;
			if (s04_opt['xaxis']['max'] < s04_newx) {
				s04_opt['xaxis']['max'] = s04_newx;
			}
			var s04_newy = (s04_pt.length*s04_pt[s04_pt.length-1][1]+s04_win)/s04_newx;
			s04_pts[alicestrat][bobstrat].push([s04_newx, s04_newy]);
		}
		// adjust the strategies displayed
		if (stratchanged) {
			if (s04_idxs.length > 5) {
				s04_idxs.shift();
			}
			// make sure colours also rotate
			s04_colors = Rotate(s04_colors, 1);
			s04_pts_full[4*alicestrat+bobstrat]['points'].fillColor = s04_colors[0];
			s04_idxs.push(4*alicestrat+bobstrat);
			stratchanged = false;
		}
		s04_plt = $.plot('#s04_plot', s04_idxs.map(i => s04_pts_full[i]), s04_opt);
	}
	$('.s04_play1').on('click', chsh);
	$('.s04_playon').on('click', function() {
		s04_int = setInterval(function() {
			chsh();
			s04_i++;
		}, 100);
	});

	// s04 plot
	var s04_pts = [[[], [], [], []], [[], [], [], []], [[], [], [], []], [[], [], [], []]];
	var s04_pts_full = [];
	for (a=0;a<4;a++) {
		for (b=0;b<4;b++) {
			var s04_lbl = 'A' + String(a+1) + ' B' + String(b+1);
			s04_pts_full.push({'label': s04_lbl, 'data': s04_pts[a][b], 'points': {fillColor: s04_colors[b]}});
		}
	}
	var s04_idxs = [];

	var s04_opt = {
		series: {
			lines: { show: false },
			points: { 
				show: true, 
				radius: 3, 
				lineWidth: 0,
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
			max: 1
		},
		legend: {
			show: true,
			position: 'ne',
			margin: [30, 5]
		},
		axisLabels: {
			show: true
		},
		xaxes: [{
			axisLabel: 'number of games',
		}],
		yaxes: [{
			position: 'left',
			axisLabel: 'percentage of games won',
		}]
	};
	var s04_opt_empty = {
		xaxis: {
			autoScale: false,
			min: 0,
			max: 10
		},
		yaxis: {
			autoScale: false,
			min: 0,
			max: 1
		},
		legend: {
			show: false,
		},
		axisLabels: {
			show: true
		},
		xaxes: [{
			axisLabel: 'number of games',
		}],
		yaxes: [{
			position: 'left',
			axisLabel: 'percentage of games won',
		}]
	};

	var s04_plt = $.plot('#s04_plot', s04_pts, s04_opt_empty);


	// OVERLAYS
	var bexplain = false,
		blinks = false,
		s01_expl = false,
		s02_expl = false,
		s04_expl = false;

	$('.b-explain-01').on('click', function() {
		if (s01_expl == false) {
			s01_expl = true;
			s01_plt = $.plot('#s01_plot', s01_pts_full, s01_opt_full);
		}
		toggle_explains();
	});
	$('.b-explain-02').on('click', function() {
		if (s02_expl == false) {
			s02_expl = true;
			s02_plt = $.plot('#s02_plot', s02_pts_full, s02_opt_full);
		}
		toggle_explains();
	});
	$('.b-explain-03').on('click', function() {
		if (s03_round < 4) { 
			s03_plt.setData([s03_pts]);
			s03_plt.draw();
		}
		toggle_explains();
	});
	$('.b-explain-04').on('click', function() {
		if (s04_expl == false) {
			s04_expl = true;
			s04_plt = $.plot('#s04_plot', s04_pts_full, s04_opt_full);
		}
		toggle_explains();
	});

	function toggle_explains() {
		$('.overlay_explains').toggleClass('visible');
		if (bexplain == false) {
			if (blinks == true) {
				$('.overlay_links').toggleClass('visible');
				$('.b-link').text('LINKS');
				blinks = false;
			}
			$('.b-explain').text('CLOSE');
			bexplain = true;
		} else {
			$('.b-explain').text('EXPLAIN');
			bexplain = false;
		}
	}
	$('.b-links').on('click', toggle_links);
	function toggle_links() {
		$('.overlay_links').toggleClass('visible');
		if (blinks == false) {
			if (bexplain == true) {
				$('.overlay_explains').toggleClass('visible');
				$('.b-explain').text('EXPLAIN');
				bexplain = false;
			}
			$('.b-link').text('CLOSE');
			blinks = true;
		} else {
			$('.b-link').text('LINKS');
			blinks = false;
		}
	}


})(jQuery);