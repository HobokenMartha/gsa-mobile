art = [];//variable for search results. change my name!
var item;//for individually loaded item


$(function(){
	if(window.location.hash === ''){
		$('#fail').show();
	}
	else{
		routes();
	}
	$(window).hashchange(function(){
		routes();
	});
	
	clicks();
	
});

//ROUTING

function routes(){
	if(window.location.hash.indexOf('#results') !== -1){
		loadResults();
	}
	if(window.location.hash.indexOf('#item') !== -1){
		loadItem();
	}
}

function clicks(){
	$('#results').on('click','.cell img', function(){
		var objID = $(event.srcElement).parent().attr('id');
		window.location.hash = '#item='+objID;
	});
	$('#item').on('click', function(){
		$('#item').hide().html('');
		$('#results').fadeIn();
		window.location.hash = '#results'
	});
}




//API FUNCTIONS

function loadResults(){
	$('#load').show();
	$('#item').hide();
	$('#results').html('');
	$('#fail').hide();
	
	var req = 'http://159.142.125.32:8080/emuseum/api/search/objects?classification=painting&region=Region%208&keyword=red';
	
	$.ajax({
		url : req,
		dataType : "jsonp",
		timeout : 5000
	})
	.success(function(json){
		art.push(json);
		$('#load').hide();
		$('#results').append('<h1>Red Paintings in Region 8</h1>');
		$.each(art[0].results, function(i){
			$('#results').append('<div class="cell" id="'+art[0].results[i].id+'"><img src="http://lorempixel.com/270/135/nature"><h3>'+art[0].results[i].title+'</h1><ul></ul></div>');
			//$('#preload').load(function(){
			setTimeout(function(){
				$('#results .cell').eq(i)
					.append('<li class="artist">'+art[0].results[i].artist+'</li>')
					.append('<li>'+capitalize(art[0].results[i].classification)+'</li>')
					.append('<li>'+art[0].results[i].displayDate+'</p>')
					;
				$('.cell').eq(i).addClass('fadeIn');
				$('#results .cell ul,#results .cell img').fadeIn(100*i);//for the crap browsers
			},i*50);
			//});
		});
	})
	.error(function(){
		console.log('fail');
	});
};


function loadItem(){
	$('#load').show();
	$('#item').html('');
	$('#fail').hide();

	var hash = window.location.hash.split('=');
	
	var objID = hash[1];
	
	var req = 'http://159.142.125.32:8080/emuseum/api/id/objects/'+objID;
	
	if(isNaN(objID)){
		fail('This Request is Not Valid.','Item ID must be a number, and should look like this: #item=3606.')
	}
	else{
		$.ajax({
			url : req,
			dataType : "jsonp",
			timeout : 5000
		})
		.success(function(json){
			item = json;
			if(item.total_results === 0){
				$('#item').html('').show();
				fail('This Item Could Not Be Found','We should confirm that it\'s in the API.');
			}
			else{
				$('#item')
					.show()
					.append('<h2>'+item.results.title+'</h2>')
					.append('<h3>'+item.results.artist+'</h3>')
					.append('<img src="http://lorempixel.com/400/300/nature">')
					.append('<ul/>')
					.append('<div class="share"/>')
					;
				$('#item ul')
					.append('<li>'+item.results.dimensions+'</li>')
					.append('<li>'+item.results.displayDate+'</li>')
					.append('<li>'+item.results.region+'</li>')
					.append('<li>'+item.results.ObjTextEntries.textEntry+'</li>')
					.append('<li>'+item.results.ObjectsPeople[0].displayName+'</li>')
					;
				$('#item .share')
					.append('<h3>Share</h3>')
					.append('<input class="link" type="text"/>')
					.append('<div class="qr"/>')
					;
				$('#item .qr').qrcode({
					render: 'div',
					width: 100,
					height: 100,
					fill: '#eee',
					text: 'http://dev.m.gsa.gov/m/sandbox/emuseum-branch/#item='+objID
				});
				$('#item .link').val(window.location.hostname+'/m/sandbox/emuseum-branch/#item='+objID);
				$('#results,#load').hide();
			}
		})
		.error(function(){
			fail('This Item Could Not Be Found','We should confirm that it\'s in the API.');
		});	
	}	
}

//ERROR REPORTING

function fail(message,description){
	if(message === null){
		message = 'ERROR';
	}
	if(description === null){
		description === '';
	}
	$('#fail').html('').append('<h3>'+message+'</h3>').append('<p>'+description+'</p>').show();
	$('#load,').hide();
}