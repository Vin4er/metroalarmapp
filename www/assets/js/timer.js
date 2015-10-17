_TIMER  = {
	start: false,
	timer: ''
}

// $(function(){
window.timetInit = function(){


	$('body').off('click.off_default').on('click.off_default', '.o-clocker-settings-timer-button a', function(e){

		e.preventDefault();

		// 

		if( _TIMER.start ){

			$('.o-clocker-settings').removeClass('hidden').addClass('animated fadeOutUp hidden');
			$('.o-clocker-sleep').removeClass('hidden').addClass('animated fadeInUp');


			window.setNotification();
			

		}else{
			return false;
		}
	})

	// сброс
	.on('click.off_default', '.resetMetro', function(e){
		e.preventDefault();

			$('.o-clocker-settings-selects-item.to').removeClass('fadeInLeft');
			$('.o-clocker-settings-selects-item.to').addClass('animated fadeOut hidden');
			$('.o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button').removeClass('hidden fadeInLeft').addClass('animated fadeOut hidden');

		
			$('.typehead').val('');

			$('#timer_end').trigger('click');

			window.stepController(1)


			window.cancelNotifications();
	});


}




var DELTA  =  2; // 1 минут в минус
//склонение окончаний
function declension(num, expressions) {
	var result;
	count = num % 100;
	if (count >= 5 && count <= 20) {
		result = expressions['2'];
	} else {
		count = count % 10;
		if (count == 1) {
			result = expressions['0'];
		} else if (count >= 2 && count <= 4) {
			result = expressions['1'];
		} else {
			result = expressions['2'];
		}
	}
	return result;
}


//  t = минуты
var setDate = function(t){
	t = t*window.INTERVAL; //мллескекунды
	return  new Date(new Date().getTime() + t);
};


window.setTimer = function(data){

	window.calculate(data);
	window.___TIME =  window.SET_GLOBAL_MINUTES(false);

	$('.bigtimer, .minutes').text(window.SET_GLOBAL_MINUTES(false));
	
	clearInterval(_TIMER.timer);


	return setInterval(function(){

		window.___TIME--;
		// если ноль
		if( window.SET_GLOBAL_MINUTES(false)-1 == 0 ){
			
			$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').hide();
			$('.bigtimer, .minutes').hide();
			$('.o-clocker-sleep-bigtimer .cell div.texttext').text('Просыпайтесь, скоро ваша станция!');
		}else{
			$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').show();
			$('.bigtimer, .minutes').show();
			$('.o-clocker-sleep-bigtimer .cell div.texttext').text('');
		}
		if(window.___TIME <= 0){
			window.SET_GLOBAL_MINUTES(true, 0)
			// window.stepController(1)
			window.___TIME = 0
			// $('#timer_end').data( {detail: {finish: true}} ).trigger('click');
			$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').hide();
			$('.bigtimer, .minutes').hide();
			$('.o-clocker-sleep-bigtimer .cell div.texttext').text('Просыпайтесь, скоро ваша станция!');
		}else{
			$('.bigtimer, .minutes').text(window.___TIME);
			$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').html(declension(window.___TIME, ['минуту', 'минуты', 'минут']))
		}

		
	
	}, window.INTERVAL);
};


window.SET_GLOBAL_MINUTES = function(__true, ___ ){
	if( __true == true ){
		var delta = 0;
		var ___t = parseInt(___);
		if( ___t > 6 ){
			if( ___t <=  15){
					delta = 3
			}else{
				if( ___t >=  20){
					if( ___t >=  30){
						delta =  6
					}else{
						delta =  5
					}
				}else{
					delta =  4
				}
			}
		}else{
			if( ___t <=3  ){
				delta =  1
				if( ___t  == 1  ){
					delta =  0
				}
			}else{
				delta =  2
			}
		}
	   window.GLOBAL_MINUTES  = ___t - delta
	}
	return  window.GLOBAL_MINUTES;
};

window.calculate = function(data){


	var path = {
			from: {
				line:    data['FROM'].line,
				time:    data['FROM'].time,
				place:   data['FROM'].place,
				circle:  data['FROM'].circle?data['FROM'].circle:false,
			},
			to: {
				line:    data['TO'].line,
				time:    data['TO'].time,
				place:   data['TO'].place,
				circle:  data['TO'].circle?data['TO'].circle:false,
			}
		},
		a1 = path.from.place, 
		a2 = path.to.place, 
		rv = t = _t = m = h = 0, 
		a_bool = parseInt(a1)<parseInt(a2);
		a2=a_bool?parseInt(a1):parseInt(a2);
		a1=a_bool?path.to.place:parseInt(a1);

			// проверяем все варианты путей
		var _t = 0;

		
		for(var i=a2; i<a1; i++ ){
			_t += parseInt(window.metro_item[path.from.line][i].time);
		}

		var t = 0;

		if(path.to.circle ){
			var i = a2, length = window.metro_item[path.from.line].length
				do{
				i--;
				if(i == -1){ i = length-1  }
				t += parseInt(window.metro_item[path.from.line][i].time);
			}while( i != a1 );
		}
	  
		if( t == 0) {
			window.SET_GLOBAL_MINUTES(true, _t);
		}else{
			if( _t == 0) {
				window.SET_GLOBAL_MINUTES(true, t);
			}else{
				window.SET_GLOBAL_MINUTES(true, t>_t?_t:t );
			}
		}

		$(".o-clocker-sleep-metro-from").text(data['FROM'].name);
		$(".o-clocker-sleep-metro-to").text(data['TO'].name);
		$('.bigtimer, .minutes').text(window.SET_GLOBAL_MINUTES(false));
		$('.wrap-time b, .o-clocker-sleep-bigtimer .cell div.texttimer').html(declension(window.SET_GLOBAL_MINUTES(false), ['минуту', 'минуты', 'минут']))

};
