
$(function(){
	window.timetInit();
	window.sele4();
})
// События
window.events = {
	start: 		"click.devicereadytimer_start",  		//  начало таймера
	afterstart: "click.devicereadytimer_afterstart", 	//  сразу после старта, как вычислятся путь
	end: 		"click.devicereadytimer_end"			//	окончание таймера
}


window.app = {

	// Application Constructor
	initialize: function() {
			
		this.bindEvents();  // биндим события
		return this;

	},

// инит массивов 
	arraysInit: function(){
		 // $('.likerstile').val( localStorage.getItem('metroname_select')?localStorage.getItem('metroname_select'):'metrosMOSCOW' ).change()

	    window.metro_item = window[$('.likerstile').val()];

	    localStorage.setItem('metroname', window.metro_item );

	    window.arrayCustomize();

		window.typeahead_one_Init();

		return this;
	},


	// инициализируем выбор города
	selectCity: function(){
	    if(localStorage.getItem('metroname_select') && localStorage.getItem('metroname_select') != null ){
			$('.likerstile').val(localStorage.getItem('metroname_select')).change();
	    }else{
			$('.likerstile option:first').prop('selected', true)
			$('.likerstile').change();
	    }
		return this;
	},

	// скрываем лоадер 
	hideLoading: function(){
	   setTimeout(function(){
	        $(".o-clocker-loading").addClass('animated fadeOut');
	        setTimeout(function(){
	            $(".o-clocker-loading").addClass('hidden');
	            $(".o-clocker-loading").remove();
	        }, 500 );
	    }, 700);

		return this;
	},


	// Обработка эмуляции кастомных событий
	customEvents: function(){

		var events = window.events,
			self = this;

		//  начало таймера
		$(document).off(events.start).on(events.start, '#timer_start', function(event){
			self.timeStart();
		});

		//  сразу после старта, как вычислятся путь
		$(document).off(events.afterstart).on(events.afterstart, "#timer_afterstart", function(event){
			self.timeAfterstart();
		});

		//	окончание таймера
		$(document).off(events.end).on(events.end, '#timer_end', function(event){
			self.timeEnd();
		});

		
		return this;
	},


	timeEnd: function(){

		// alert('timer_end')
		if( _TIMER.start ){
			$('.o-clocker-settings').removeClass('hidden animated fadeOutUp').addClass('animated fadeInUp');
			$('.o-clocker-sleep').removeClass('hidden animated fadeInUp').add('.o-clocker-settings-selects-item.to, .o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button').addClass('hidden')
		}
		_TIMER  = {
			start: false,
			timer: ''
		};
		var data = $('#timer_end').data("detail");
		$('#timer_end').data("detail", false)
		
		if(data){
			var o_to = $('.o-clocker-settings-selects-item.to'); 
			o_to.removeClass('fadeInLeft');
			o_to.addClass('animated fadeOut hidden');
			$('.o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button')
				.removeClass('hidden fadeInLeft')
				.addClass('animated fadeOut hidden');
				
			$('.typehead').val('');
			// window.cancelNotifications();
		}
		if( window.SET_GLOBAL_MINUTES(false) <= 0 ){
			clearInterval(_TIMER.timer);
			$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').html('');
			$('.bigtimer, .minutes').html('');
			$('.o-clocker-sleep-bigtimer .cell div.texttext').text('Просыпайтесь, скоро ваша станция!');
			window.sele4();
		}
		// window.cancelNotifications();

	},


	timeAfterstart: function(){

		
	},

	timeStart: function(){
		var data = $('#timer_start').data("detail");
		$('#timer_start').data("detail", false);
		$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').show();
		$('.bigtimer, .minutes').show();
		$('.o-clocker-sleep-bigtimer .cell div.texttext').text('');
		_TIMER  = {
			start: true,
			timer: setTimer(_Typeahead)
		};


		$("#timer_afterstart").data({detail: data}).click();
	},


	initDataMetro: function(){
		// инит метро, сокрытие лоадера
		this.hideLoading();
		return this.selectCity().arraysInit();
		
	},

	// приложние готово
	app_ready: function(){
		
		/**  РЕКЛААААМИ   **/
		if (! AdMob ) {
			// рекламы нет(
		}else{
			admobid = { // for Android
				interstitial: 'ca-app-pub-6869992474017983/1657046752'
			};
			// if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow: true} );
		}
		/******/



		cordova.plugins.notification.local.on("trigger", function (notification) {
			// alert('вибр')
			// вибро
			clearInterval(_TIMER.timer);
			$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').html('');
			$('.bigtimer, .minutes').html('');
			$('.o-clocker-sleep-bigtimer .cell div.texttext').text('Просыпайтесь, скоро ваша станция!');
			navigator.vibrate([5000, 100, 5000, 100, 5000]);
			window.app.prototype.timeEnd();
		});

		return this.initDataMetro().customEvents();
	
	},

	// Устанавливаем события
	bindEvents: function() {
		var self = this;

		document.addEventListener('deviceready', function(){ self.app_ready() }, false);
		

	
		return this;
		
	},

};


window._TIMERS_ID = [];

window._TIMERS_ID__index = 0;


window.setNotification = function(){

	window.cancelNotifications();

	var time = window.SET_GLOBAL_MINUTES(false);

    _TIMERS_ID.push(_TIMERS_ID__index);

    cordova.plugins.notification.local.schedule({
        id: _TIMERS_ID__index,
        title: "Будильник для метро",
        text: 'Просыпайтесь, скоро будет Ваша станция!',
        sound: 'file://audio.mp3',
        at: setDate(time),
    });

};


window.cancelNotifications = function(){
	for(var i = 0; i<_TIMERS_ID.length; i++){
	 	cordova.plugins.notification.local.cancel(_TIMERS_ID[i], function () {
			        // Notifications were cancelled
	    });
	}
    _TIMERS_ID = [];
    _TIMERS_ID.length = 0;
};
