$(function(){

	console.log(window.location.href);

	var url = window.location.href.split('?');
	
	var vpbCode = url[0]
				.replace(/[^0-9]/g, '');
				;
				
	
	if(isMobile.any()){
		window.location.href = 'http://m.gsa.gov/m/vpb/'+vpbCode;
	}
	else{
		window.location.href = 'http://gsa.gov/vpb/'+vpbCode;
	}
	
});

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};