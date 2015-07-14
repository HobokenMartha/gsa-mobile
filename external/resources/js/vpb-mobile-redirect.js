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

var redirectToMobile = function(location){
	var url = location.replace(/(http|https)*(:\/\/)*(www\.)*(gsa.gov)+/g,'http://m.gsa.gov/m');
	window.location.href = url;
}

var locale = window.location.href;

if(locale.indexOf('gsa.gov') > -1){
	if (isMobile.any()) {
		redirectToMobile(locale);
	}
}