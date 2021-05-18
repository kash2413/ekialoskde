
'use strict';

(function($) {

	$(document).on('ready', function() {

		setup_sc_gbaner();

		function setup_sc_gbaner() {

			var $all_baners = $('.sc-gbaner');
			$all_baners.each(function() {

				var $baner = $(this);

				var $sl = $baner.find('.slider');
				var $holder = $sl.find('.holder');
				var $mover = $sl.find('.mover');
				var $slides = $sl.find('.slide');
				var $btn_prev = $sl.find('.btn-prev');
				var $btn_next = $sl.find('.btn-next');
				var autoplay_time_handle = null;

				if(!$slides.length) { return; }

				function is_locked() { return ($sl.data('locked') == true); }
				function lock() { $sl.data('locked', true); }
				function unlock() { $sl.data('locked', false); }

				$btn_prev.on('click', function() {

					switch_slide('next');
				});

				$btn_next.on('click', function() {

					switch_slide('prev');
				});				

				function autoplay_start() {

					if($sl.hasClass('autoplay')) {
					
						clearTimeout(autoplay_time_handle);
						autoplay_time_handle = setTimeout(function() { switch_slide('next'); }, 5000);
					}	
				}

				function autoplay_stop() {

					if($sl.hasClass('autoplay')) {
					
						clearTimeout(autoplay_time_handle);
					}
				}

				function switch_slide(mode) {

					if(is_locked()) { return; }					
					if(mode == undefined) { mode = 'next'; }
					autoplay_stop();
					lock();
					var offset_x = $sl.outerWidth();

					// do animation
					if(mode == 'next') {

						$mover.stop(true).animate({left:-offset_x}, 300, function() {

							$mover.css({left:0});
							var $items = $sl.find('.slide').slice(0, 1);
							$mover.append($items);
							distribute_slides();

							unlock();
							autoplay_start();
						});
					} else {

						$mover.css({left:-offset_x});
						var $items = $sl.find('.slide').slice(-1);
						$mover.prepend($items);
						distribute_slides();

						$mover.stop(true).animate({left:0}, 300, function() {

							unlock();
							autoplay_start();
						});					
					}					
				}

				function reset() {

					autoplay_stop();
					$slides.stop(true);
					$mover.stop(true);
					$mover.css({left:0});
					distribute_slides();
					calc_sl_size();
					unlock();
					autoplay_start();										
				}

				function setup() {

					reset();

					if($slides.length < 2) {

						$btn_prev.remove();
						$btn_next.remove();
					}
				}
				
				function distribute_slides() {

					var sl_w = $sl.outerWidth();
					$slides.each(function() {

						var $this = $(this);
						var idx = $this.index();						

						$this.css({left:idx*sl_w, width:sl_w});
					});
					$slides.css({display:'block', opacity:1});
				}

				function laod_images() {
		
					var images_data = [];
					$slides.each(function() {

						var $this = $(this);
						var url_full_desktop = $this.data('url-full-desktop');
						var desktop_alt = $this.data('desktop-alt');
						var desktop_title = $this.data('desktop-title');

						var url_full_tablet = $this.data('url-full-tablet');
						var tablet_alt = $this.data('tablet-alt');
						var tablet_title = $this.data('tablet-title');

						var url_full_phone = $this.data('url-full-phone');
						var phone_alt = $this.data('phone-alt');
						var phone_title = $this.data('phone-title');						

						if(url_full_desktop == undefined) { url_full_desktop = ''; }
						if(url_full_tablet == undefined) { url_full_tablet = ''; }
						if(url_full_phone == undefined) { url_full_phone = ''; }

						if(!url_full_tablet.length) { url_full_tablet = url_full_desktop; }
						if(!url_full_phone.length) { url_full_phone = url_full_tablet; }

						var obj = {};
						obj.$slide = $this;
						obj.idx = $this.index();
						obj.url_full_desktop = url_full_desktop;
						obj.desktop_alt = desktop_alt;
						obj.desktop_title = desktop_title;

						obj.url_full_tablet = url_full_tablet;
						obj.tablet_alt = tablet_alt;
						obj.tablet_title = tablet_title;


						obj.url_full_phone = url_full_phone;
						obj.phone_alt = phone_alt;
						obj.phone_title = phone_title;						

						images_data.push(obj);
					});					

					var counter = 0;
					var images_to_load = images_data.length*3;

					for(var i = 0; i < images_data.length; i++) {

		 				var dekstop = new Image();
						// dekstop.onload = onload;
						dekstop.addEventListener('load', onload);
						dekstop.src = images_data[i].url_full_desktop;

		 				var tablet = new Image();
						// tablet.onload = onload;
						tablet.addEventListener('load', onload);
						tablet.src = images_data[i].url_full_tablet;

		 				var phone = new Image();
						// phone.onload = onload;
						phone.addEventListener('load', onload);
						phone.src = images_data[i].url_full_phone;												
					}

					function onload() {

						counter++;
						if(counter == images_to_load) {

							for(var i = 0; i < images_data.length; i++) {

								images_data[i].$slide.append($('<img>', {
									class:'desktop', 
									src:images_data[i].url_full_desktop, 
									alt:images_data[i].desktop_alt,
									title:images_data[i].desktop_title, 
								}));
								images_data[i].$slide.append($('<img>', {
									class:'tablet', 
									src:images_data[i].url_full_tablet,
									alt:images_data[i].tablet_alt,
									title:images_data[i].tablet_title,
								}));
								images_data[i].$slide.append($('<img>', {
									class:'phone', 
									src:images_data[i].url_full_phone,
									alt:images_data[i].phone_alt,
									title:images_data[i].phone_title,									
								}));

								images_data[i].$slide.removeAttr('data-url-full-desktop');
								images_data[i].$slide.removeAttr('data-url-full-tablet');
								images_data[i].$slide.removeAttr('data-url-full-phone');

								images_data[i].$slide.removeAttr('data-desktop-alt');
								images_data[i].$slide.removeAttr('data-desktop-title');
								images_data[i].$slide.removeAttr('data-tablet-alt');
								images_data[i].$slide.removeAttr('data-tablet-title');
								images_data[i].$slide.removeAttr('data-phone-alt');
								images_data[i].$slide.removeAttr('data-phone-title');
							}

							setup();
						}
					}
				}

				$(window).on('resize', function() {

					reset();
				});

				function calc_sl_size() {

					var sl_w = $sl.outerWidth();
					$mover.css({width:sl_w*$slides.length});

					var $slide = $slides.eq(0);

					var use_desktop_img = $slide.find('img.desktop').css('display') == 'block' ? true : false;
					var use_tablet_img = $slide.find('img.tablet').css('display') == 'block' ? true : false;
					var use_phone_img = $slide.find('img.phone').css('display') == 'block' ? true : false;

					if(use_desktop_img) { set_h($slide.find('img.desktop')); } else
					if(use_tablet_img) { set_h($slide.find('img.tablet')); } else
					if(use_phone_img) { set_h($slide.find('img.phone')); }
					
					function set_h($img) {

						if(!$img.length) { return; }


						var w = $img[0].naturalWidth;
						var h = $img[0].naturalHeight;
						var sl_w = $sl.outerWidth();

						var ratio = h/w;
						var sl_h = Math.ceil(sl_w*ratio);

						$sl.css({height:sl_h});
					}

					var button_size = Math.ceil(sl_w/15);
					if(button_size < 24) { button_size = 24; }
					if(button_size > 52) { button_size = 52; }
					$btn_next.css({width:button_size, height:button_size});
					$btn_prev.css({width:button_size, height:button_size});
				}				

				function start() {

					laod_images();
				}				
				start();	

			});
		}
	});		

})(jQuery);