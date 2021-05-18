var $ = window.jQuery;

var countdown = {
    $rootElem: $('.countdown'),
    getRemainingTime: function(endtime){
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    },
    init: function ($elem) {
        if($elem) {
            this.$element = $elem;
        } else {
            this.$element = this.$el;
        }

//         if (this.$element.parents('.sale-timer').css('display') === 'none'){
//             return true;
//         }

        var finishTimeData = this.$element.data('finish-time');
        finishTimeData && (this.finishTimeString = finishTimeData);

        // DOM
        this.dom = {
            days: this.$element.find('.bloc-time.hours .figure'),
            minutes: this.$element.find('.bloc-time.min .figure'),
            seconds: this.$element.find('.bloc-time.sec .figure')
        };

        var testDeadline = new Date(new Date().getTime() + (2+1/6)*60000), // for testing: now + 2 minutes 10 seconds
            oldDeadlineFormat = 'August 31 2018 23:59:59 GMT+0200', // for future reference
            deadline = this.finishTimeString || testDeadline,
            remaining = this.getRemainingTime(deadline);
        // Init countdown values
        this.values = {
            days: remaining.days,
            hours: remaining.hours,
            minutes: remaining.minutes,
            seconds: remaining.seconds
        };

        // initalize total seconds
        this.total_seconds = remaining.total / 1000;
        // this.values.days * 60 * 60 + (this.values.minutes * 60) + this.values.seconds;

        // Animate countdown to the end
        this.count();

        return true;
    },
    count: function () {

        var that = this,
            $hour_1 = this.dom.days.eq(0),
            $hour_2 = this.dom.days.eq(1),
            $min_1 = this.dom.minutes.eq(0),
            $min_2 = this.dom.minutes.eq(1),
            $sec_1 = this.dom.seconds.eq(0),
            $sec_2 = this.dom.seconds.eq(1);

        this.countdown_interval = setInterval(
            function () {
                if (that.total_seconds > 0) {

                    --that.values.seconds;

                    if (that.values.minutes >= 0 && that.values.seconds < 0) {

                        that.values.seconds = 59;
                        --that.values.minutes;
                    }

                    if (that.values.hours >= 0 && that.values.minutes < 0) {

                        that.values.minutes = 59;
                        --that.values.hours;
                    }

                    if (that.values.days >= 0 && that.values.hours < 0) {

                        that.values.hours = 23;
                        --that.values.days;
                    }

                    // Update DOM values
                    // Hours
                    that.checkHour(that.values.days, $hour_1, $hour_2);

                    // Minutes
                    that.checkHour(that.values.hours, $min_1, $min_2);

                    // Seconds
                    that.checkHour(that.values.minutes, $sec_1, $sec_2); // TODO

                    --that.total_seconds;
                }
                else {
                    clearInterval(that.countdown_interval);

                    that.checkHour(0, $hour_1, $hour_2);
                    that.checkHour(0, $min_1, $min_2);
                    that.checkHour(0, $sec_1, $sec_2);
                }
            }, 1000
        );
		
		setTimeout(function() {
			$('.sale-timer').show();
		},2000);
    },
    animateFigure: function ($el, value) {

        var elHeight = $el.height(),
            heightRatio = 300/110,
            transformPerspective = elHeight * heightRatio;

        var that = this,
            $top = $el.find('.top'),
            $bottom = $el.find('.bottom'),
            $back_top = $el.find('.top-back'),
            $back_bottom = $el.find('.bottom-back');

        // Before we begin, change the back value
        $back_top.find('span').html(value);

        // Also change the back bottom value
        $back_bottom.find('span').html(value);

        // Then animate
        TweenMax.to($top, 0.8, {
            rotationX: '-180deg',
            transformPerspective: transformPerspective,
            ease: Quart.easeOut,
            onComplete: function () {

                $top.html(value);

                $bottom.html(value);

                TweenMax.set($top, {rotationX: 0});
            }
        });

        TweenMax.to($back_top, 0.8, {
            rotationX: 0,
            transformPerspective: transformPerspective,
            ease: Quart.easeOut,
            clearProps: 'all'
        });
    },
    checkHour: function (value, $el_1, $el_2) {

        var val_1 = value.toString().charAt(0),
            val_2 = value.toString().charAt(1),
            fig_1_value = $el_1.find('.top').html(),
            fig_2_value = $el_2.find('.top').html();

        if (value >= 10) {

            // Animate only if the figure has changed
            if (fig_1_value !== val_1) this.animateFigure($el_1, val_1);
            if (fig_2_value !== val_2) this.animateFigure($el_2, val_2);
        }
        else {

            // If we are under 10, replace first figure with 0
            if (fig_1_value !== '0') this.animateFigure($el_1, 0);
            if (fig_2_value !== val_1) this.animateFigure($el_2, val_1);
        }
    }
};

$(document).ready(function(){
    countdown.init(countdown.$rootElem)
});