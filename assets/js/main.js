/*
	Author       : Theme-Family
	Template Name:	Al-Muqit - Cv/Resume Portfolio Html Template
	Version      : 1.0
*/

(function($) {
    "use strict";
	
		/*PRELOADER JS*/
			$(window).on('load', function() { 
				$('.atf-status').fadeOut();
				$('.atf-preloader').delay(350).fadeOut('slow'); 
			}); 
		/*END PRELOADER JS*/
		
		// Navbar menu-top
		
			var nav = $('nav');
			var navHeight = nav.outerHeight();

			$('.navbar-toggler').on('click', function () {
				if (!$('#menu-top').hasClass('navbar-collaps')) {
					$('#menu-top').addClass('navbar-collaps');
				}
			});		

		// Navbar Menu Reduce
		
			$(window).trigger('scroll');
			$(window).on('scroll', function () {
				var pixels = 50;
				var top = 1200;
				if ($(window).scrollTop() > pixels) {
					$('.navbar-expand-md').addClass('navbar-collaps');
					$('.navbar-expand-md').removeClass('navbar-expend');
				} else {
					$('.navbar-expand-md').addClass('navbar-expend');
					$('.navbar-expand-md').removeClass('navbar-collaps');
				}
				if ($(window).scrollTop() > top) {
					$('.scrolltop-atf').fadeIn(1000, "easeInOutExpo");
				} else {
					$('.scrolltop-atf').fadeOut(1000, "easeInOutExpo");
				}
			});


		//  Star Scrolling nav
	
			$('a.page-scroll[href*="#"]:not([href="#"])').on("click", function () {
				if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
					if (target.length) {
						$('html, body').animate({
							scrollTop: (target.offset().top - navHeight + 30)
						}, 1000, "easeInOutExpo");
						return false;
					}
				}
			});

		// Closes responsive menu when a scroll trigger link is clicked
		
			$('.page-scroll').on("click", function () {
				$('.navbar-collapse').collapse('hide');
			});

		// Activate scrollspy to add active class to navbar items on scroll
			$('body').scrollspy({
				target: '#menu-top',
				offset: navHeight
			});
        

		//**================= Sticky =====================**//
  
			$(window).on('scroll', function() {
				if ($(window).scrollTop() > 50) {
					$('.navbar-expand-md').addClass('navbar-collaps');
					$('.atf-back-to-top').addClass('open');
				} else {
					$('.atf-header-area').removeClass('navbar-collaps');
					$('.atf-back-to-top').removeClass('open');
				}
			});
		  
		//**===================Scroll UP ===================**//

			if ($('.atf-back-to-top').length) {
			  $(".atf-back-to-top").on('click', function () {
				var target = $(this).attr('data-targets');
				// animate
				$('html, body').animate({
				  scrollTop: $(target).offset().top
				}, 1000);

			  });
			}
			

			  
		//**===================Typed-word ===================**//	
		
			var typed = new Typed('.typed-word', {
				strings: ["Ui/Ux Designer","Web Developer."," Web Designer."],
				typeSpeed: 40,
				backSpeed: 40,
				backDelay: 2000,
				startDelay: 1500,
				loop: true,
				showCursor: true
			});
			
		
		
			
			 /* WOW Scroll Spy
			========================================================*/
			 var wow = new WOW({
				  //disabled for mobile
					mobile: false
				});

			wow.init();
		
		
			
	
        
})(jQuery);
