import {TweenMax, Power2, TimelineLite} from "gsap";
import anime from 'animejs';

export default {
	init() {
		this.homeFunction(this);
		this.redrawMenu();
		this.hamburger();
	},
	homeFunction(self){

        var $mainMenu = $('.main-menu'),
            $menuItems = $mainMenu.find('li');

        $menuItems.each(function(){
            $(this).animate({ 'left': $('#hamburger').position().left, 'top': $('#hamburger').position().top, 'opacity': 0 }, 500);
        });

        $('#hamburger').on('click', function(){
            if(!$(this).hasClass('is-open')){
                $menuItems.each(function(){
                    $(this).animate({ 'left': $(this).attr('data-x'), 'top': $(this).attr('data-y'), 'opacity': 1 }, 500);
                });
            } else {
                $menuItems.each(function(){
                    $(this).animate({ 'left': $('#hamburger').position().left, 'top': $('#hamburger').position().top, 'opacity': 0 }, 500);
                });
            }
        });

        $(window).resize(function(){
            self.redrawMenu($(this).width());
        });

        $menuItems.each(function(){
            $(this).hover(function(){
                TweenMax.to($(this), 0.1, { x: "+=2", yoyo: true, repeat: 5 });
            }, function(){
                TweenMax.to($(this), 0.1, { x: 0, yoyo: true, repeat: 5 });
            });
        });

        var basicTimeline = anime.timeline();

        basicTimeline.add({
            targets: '.main-logo .path-1',
            strokeOpacity: 0.5,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 500
        }).add({
            targets: '.main-logo .path-2',
            strokeOpacity: 0.5,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 500
        }).add({
            targets: '.main-logo .path-3',
            strokeOpacity: 0.5,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 500
        });

        // var tl = new TimelineMax();
        //
        // tl.fromTo( '.main-logo .path-1', 0.5, { "stroke-opacity": 0, "stroke-dashoffset": 100 }, { "stroke-opacity": 0.5, "stroke-dashoffset": 0 })
        //   .fromTo( '.main-logo .path-2', 0.5, { "stroke-opacity": 0, "stroke-dashoffset": 100 }, { "stroke-opacity": 0.5, "stroke-dashoffset": 0 })
        //   .fromTo( '.main-logo .path-3', 0.5, { "stroke-opacity": 0, "stroke-dashoffset": 100 }, { "stroke-opacity": 0.5, "stroke-dashoffset": 0 });
    },

	redrawMenu(radius = $(window).width()){

		var $mainMenu = $('.main-menu'),
            $menuItems = $mainMenu.find('li');

        var angle = 110,
        	step = (2.5 * Math.PI/4 * -1) / $menuItems.length,
			drawCenter = { x: $mainMenu.width() + 200, y: $mainMenu.height() + 50 },
			radius = (radius / 5 > 150) ? radius / 5 : 150;

        $menuItems.each(function(){
            var x = drawCenter.x / 2 + radius * Math.cos(angle);
            var y = drawCenter.y / 2 + radius * Math.sin(angle);
            angle += step;
            $(this).attr('data-x', x).attr('data-y', y).css({ 'left': x, 'top': y });
        });
	},

	hamburger(){
        var trigger = $('#hamburger'),
            isClosed = false;

        trigger.click(function () {
            burgerTime();
        });

        function burgerTime() {
            if (isClosed == true){
                trigger.removeClass('is-open');
                trigger.addClass('is-closed');
                isClosed = false;
            } else {
                trigger.removeClass('is-closed');
                trigger.addClass('is-open');
                isClosed = true;
            }
        }
	}
};
