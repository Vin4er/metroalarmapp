(function(){
	localStorage.setItem('activeline', false);
	localStorage.setItem('activename', false);

	
window.sele4 = function(){

	$(".o-clocker-settings").removeClass('hidden');


	// window.typeahead_one_Init();
	// window.arrayCustomize();

	$('body').off('change.likerstile').on('change.likerstile', '.likerstile', function(){

		window.metro_item = window[$(this).val()];


		localStorage.setItem('metroname', window.metro_item);

		localStorage.setItem('metroname_select', $(this).val() );



		$('.o-clocker-settings-selects-item.to').removeClass('fadeInLeft');
		$('.o-clocker-settings-selects-item.to').addClass('animated fadeOut');
		$('.o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button').removeClass('hidden fadeInLeft').addClass('animated fadeOut hidden');
		$('.typehead').val('');

		window.stepController(1);
		window.arrayCustomize();



	});
};
// Выставляем порядковые
window.arrayCustomize = function(){
	var metroLength = window.metro_item.length;
	for(var lineItem = 0; lineItem < metroLength; lineItem++ ){
		var goToLineLength = window.metro_item[lineItem].length;
		for(var item = 0; item < goToLineLength ; item++){
			if(window.metro_item[lineItem][item].place == undefined){
				window.metro_item[lineItem][item].time = parseInt(window.metro_item[lineItem][item].time)
				window.metro_item[lineItem][item].place = item
				window.metro_item[lineItem][item].line = window.metro_item[lineItem][item].line-1
			}
		}
	}
};

_Typeahead = _Handlebars = {};


window.tphd = [$('.o-clocker-settings-selects-item.from .typehead'), $('.o-clocker-settings-selects-item.to .typehead')];



// Переключает шаги внизу
window.stepController = function (step) {

	var step_item = $('.o-clocker-settings-steps-items .o-clocker-settings-steps-item');
	step_item.removeClass('active');
	step_item.slice(0, step).addClass('active');

	$('.o-clocker-settings-steps-line-item').css({width: step==3?"100%":step==2?"50%":0});

	if(step != 3 || stop == 1){
		$('#timer_end').trigger('click');
		// document.body.dispatchEvent(new CustomEvent('timer.end'))
	}
}

// поиск по массивам
var substringMatcher = function(strs) {
	return function findMatches(q, cb) {

	    var  matches = [],
	    	substrRegex = new RegExp(q, 'i'),
	    	metroLength = window.metro_item.length;

		for(var lineItem = 0; lineItem < metroLength; lineItem++ ){

			var goToLine = window.metro_item[lineItem],
				goToLineLength = goToLine.length;

			for(var item = 0; item < goToLineLength ; item++){

				if (substrRegex.test( goToLine[item].name  )) {
					
					if( localStorage.getItem('activeline') != "undefined" && localStorage.getItem('activeline')!="false" ){
						// отсекаем эту же станцию и выводим запросы по данной линии
						if( goToLine[item].line == localStorage.getItem('activeline') &&  goToLine[item].name != localStorage.getItem('activename')) {
							
							matches.push(goToLine[item]);
						}

					}else{

						matches.push(goToLine[item]);

					}
				}
			}
		}
		cb(matches);// выодим результат
	};
};


_Typeahead.modelSettings = function(){
	return {
		source: substringMatcher(),
		display: 'name',
		templates: {
			empty: '<div class="empty-message">Нет такой станции</div>',
			suggestion: _Handlebars.compile()
		}
	}
}
_Handlebars.compile = function(){
	return Handlebars.compile('<div style="color: {{color}}"  ><strong>{{name}}</strong></div>');
}


// инициализация и ипереиниицализация второй строки поиска
window.typeahead_two_Init = function(){

	window.tphd[1].val('').typeahead('destroy');
	window.tphd[1].off('input blur change typeahead:select');
	// инит тайпхеда
	window.tphd[1].typeahead({}, _Typeahead.modelSettings() );


	window.tphd[1].on('typeahead:select', function(ev, suggestion) {

		typeahead_two_Changed(suggestion);

	}).on('input', function(e) {
		// $(this).css({color: '#ffffff'})
		// слуашем все события
	}).on('input blur change', function(e) {
		// слуашем все события
		if(this.value=="" && $('.o-clocker-settings-selects-item.from .typehead').val() != "") {typeahead_two_Changed();  };

	});


};

	
window.typeahead_two_Changed = function(suggestion){

	if( suggestion ) {

		window.stepController(3);

		$('.o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button').removeClass('hidden fadeOut').addClass('animated fadeInLeft ');

		_Typeahead['TO'] = suggestion;

		$('#timer_start').data({detail: _Typeahead}).trigger('click');

	}else{
		window.stepController(2)
		$('.o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button').removeClass('hidden fadeInLeft').addClass('animated fadeOut hidden');
	}

}
// change первого селека
window.typeahead_one_Changed = function(suggestion){

	var obj = suggestion;

	console.log(suggestion);

	// Пишем в сторедж активные
	if( suggestion  ) {

		localStorage.setItem('activeline', suggestion.line);
		localStorage.setItem('activename', suggestion.name);

		$('.o-clocker-settings-selects-item.to').removeClass('hidden fadeOut').addClass('animated fadeInLeft ');

		typeahead_two_Init();

		window.stepController(2);

		_Typeahead['FROM'] = suggestion;

	}else{

		$('.o-clocker-settings-selects-item.to').removeClass('fadeInLeft ');

		$('.o-clocker-settings-selects-item.to').addClass('animated fadeOut hidden');
		$('.o-clocker-settings-timer, .o-clocker-settings-timer-time, .o-clocker-settings-timer-button').removeClass('hidden fadeInLeft').addClass('animated fadeOut hidden');

		window.tphd[1].val('').typeahead('destroy');
		window.tphd[1].off('input blur change typeahead:select');
		window.stepController(1)

		localStorage.setItem('activeline', false);
		localStorage.setItem('activename', false);
	}

};


window.typeahead_one_Init = function(){
	$('.o-clocker-settings-selects-item.to  .typehead').css({"color":'white'})

	// инит тайпхеда
	window.tphd[0].typeahead({}, _Typeahead.modelSettings());

	window.tphd[0].on('typeahead:select', function(ev, suggestion) {
		typeahead_one_Changed(suggestion);

		$('.typehead').css({color: suggestion.color})

	}).on('typeahead:open', function(ev, suggestion) {

		// когда открываем - очищаем сторедж и активный
		localStorage.setItem('activeline', false);
		localStorage.setItem('activename', false);

	}).on('input', function(e) {
		
		$('.typehead').css({color: '#ffffff'})
		// слуашем все события
	}).on('blur  change input', function(e) {
		// слуашем все события
		if(this.value=="") {  $('.typehead').css({color: '#ffffff'}); typeahead_one_Changed();  };

	});

}


})();
		