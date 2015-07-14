//DECLARE VARS, INITIAL CHART VALUES
var theYear = '2011',
	theData = 'expenses',
	theBreakdown = 'byFund',
	theTable,
	isFundBreakdown = false,
	fundBreakdown,
	theColors,
	theDataDisplay,
	
	//THE COLORS
	monoRed = new Array('#81050f', '#b50716', '#e8091c', '#1c0103', '#4f0309', '#820510', '#9a1a25', '#e8091c', '#660a11', '#47090e'),
	monoBlue = new Array('#27368c', '#364abf', '#445ef2', '#0b0f26', '#192359', '#4959b2', '#525e9f', '#6379f2','#1e2030', '#3d4163', '#5c6396', '#7b84c9', '#9aa5fc'),
	monoLightBlue = new Array('#5c6396', '#7b84c9', '#9aa5fc', '#1e2030', '#3d4163', '#5c6396', '#7b84c9', '#9aa5fc', '#0b0f26', '#192359', '#4959b2', '#525e9f', '#6379f2');

//FORMATTER MOVED BACK TO GVCHART.JS

//FUNCTIONS
function gvPie() {
	$('#main table').gvChart({
		chartType: 'PieChart',
		gvSettings: {
			width: 580,
			height: 380,
			chartArea: {
				left: 60,
				top: 60,
				width: "100%",
				height: "100%"
			},
			is3D: true,
			colors: ['#27368C', '#81050F', '#5C6396', '#122459', '#C4D4F2'],
			backgroundColor: {
				fill: 'transparent'
			},
			pieSliceText: 'value',
			pieSliceTextStyle: {
				fontSize: 14,
				fontName: 'Arial'
			},
			tooltip: {
				showColorCode: true
			},
			forceIFrame: false,
			fontName: 'Alright Sans',
			titleTextStyle: {
				fontSize: 18
			}
		}
	});
}

function gvPieSub() {
	$('#main table').gvChart({
		chartType: 'PieChart',
		gvSettings: {
			width: 580,
			height: 380,
			chartArea: {
				left: 60,
				top: 60,
				width: "100%",
				height: "100%"
			},
			is3D: true,
			colors: theColors,
			backgroundColor: {
				fill: 'transparent'
			},
			pieSliceText: 'value',
			pieSliceTextStyle: {
				fontSize: 14,
				fontName: 'Arial'
			},
			tooltip: {
				showColorCode: true
			},
			forceIFrame: false,
			fontName: 'Alright Sans',
			titleTextStyle: {
				fontSize: 18
			}
		}
	});
}

function gvBarNeg() {
	$('#main table').gvChart({
		chartType: 'BarChart',
		gvSettings: {
			width: 580,
			height: 380,
			chartArea: {
				left: 60,
				top: 60,
				width: "100%",
				height: "100%"
			},
			colors: ['#81050F'],
			backgroundColor: {
				fill: 'transparent'
			},
			vAxis: {
				title: 'Year'
			},
			hAxis: {
				baseline: 0
			},
			titleTextStyle: {
				fontSize: 18
			},
			forceIFrame: false,
			fontName: 'Alright Sans'
		}
	});
}

function gvBarPos() {
	$('#main table').gvChart({
		chartType: 'BarChart',
		gvSettings: {
			width: 580,
			height: 380,
			chartArea: {
				left: 60,
				top: 60,
				width: "100%",
				height: "100%"
			},
			colors: ['#27368C'],
			backgroundColor: {
				fill: 'transparent'
			},
			vAxis: {
				title: 'Year'
			},
			hAxis: {
				baseline: 0
			},
			titleTextStyle: {
				fontSize: 18
			},
			forceIFrame: false,
			fontName: 'Alright Sans'
		}
	});
}

function gvBarStacked() {
	$('#main table').gvChart({
		chartType: 'BarChart',
		gvSettings: {
			width: 580,
			height: 380,
			chartArea: {
				left: 60,
				top: 60,
				width: "100%",
				height: "100%"
			},
			colors: ['#27368C', '#81050F'],
			backgroundColor: {
				fill: 'transparent'
			},
			vAxis: {
				title: 'Year'
			},
			isStacked: 'true',
			titleTextStyle: {
				fontSize: 18
			},
			forceIFrame: false,
			fontName: 'Alright Sans'
		}
	});
}
//RUN
//=========================================================================================================

function gvRun() {
	if (isFundBreakdown === true) {
		theTable = $('#tableStaging > div[dataType=' + theData + '] > div[breakdown=' + theBreakdown + '] > div[year=' + theYear + '] div.fundBreakdown > table[fund=' + fundBreakdown + ']').html();
		//BREAKDOWN MONOCHROMATIC COLORS
		if (fundBreakdown === 'federalBuildingsFund') {
			theColors = monoRed;
		} else if (fundBreakdown === 'aquisitionServicesFund') {
			theColors = monoBlue;
		} else {
			theColors = monoLightBlue;
		}
	} else {
		//FIND THE TABLE, STORE IN VARIABLE
		if (theBreakdown === 'byFund') {
			theTable = $('#tableStaging > div[dataType=' + theData + '] > div[breakdown=byFund] > div[year=' + theYear + '] > table').html();
		} else {
			theTable = $('#tableStaging > div[dataType=' + theData + '] > div[breakdown=overTime] > table').html();
		}
		//ENABLE/DISABLE BUTTONS
		if ((theData === 'expenses') || (theData === 'liabilities') || (theData === 'revenues') || (theData === 'assets')) {
			$('#sideNav a#byFund').removeClass('disabled');
		} else if ((theData === 'netCost') || (theData === 'netPosition')) {
			$('#topNav a,#sideNav a#byFund').addClass('disabled');
		}
	}
	//RELOAD MAIN DIV
	$('#main').hide().html('').delay('200').fadeIn();
	//CALL GC API, ASSEMBLE PRESENATION
	if (isFundBreakdown === false) {
		$('#chartApp #backNav').fadeOut(200);
	}
	setTimeout(function() {
		$('#topNav a,#sideNav a').removeClass('on');
		if (theBreakdown === 'byFund') {
			$('#topNav #' + theYear).addClass('on');
			$('#topNav a').removeClass('disabled');
		}
		$('#sideNav .type #' + theData).addClass('on');
		$('#sideNav .breakdown #' + theBreakdown).addClass('on');
		$('#main').html('<table class="' + theYear + '">' + theTable + '</table>');
		if (theBreakdown === 'byFund') {
			if (isFundBreakdown === false) {
				gvPie();
			} else {
				gvPieSub();
			}
		} else if (theBreakdown === 'overTime') {
			if ((theData === 'expenses') || (theData === 'liabilities')) {
				gvBarNeg();
			} else if ((theData === 'revenues') || (theData === 'assets')) {
				gvBarPos();
			} else if ((theData === 'netCost') || (theData === 'netPosition')) {
				gvBarStacked();
			}
			$('#topNav a').removeClass('on');
			$('#topNav a').addClass('disabled');
		}
	}, 350);
	return false;
}
//ON READY/LOAD
//====================================================================================================================
$(function() {
	$('#loading span').html('Loading Data...');
	
	$('#tableStaging').load('data.html', function() {
		//LOADING SCREEN
		setTimeout(function() {
			$('#loading span').html('Creating Charts...');
		}, 300);
		//LOAD INITIAL CHART
		gvRun();
		//DONE LOADING
		$('#chartApp #loading').delay(1000).fadeOut();
		//CLICK FUNCTIONS===================================================
		$('#topNav a').bind('click', function() {
			//isFundBreakdown = false;
			theYear = $(this).attr('id');
			gvRun();
		});
		$('#backNav a').bind('click', function() {
			isFundBreakdown = false;
			gvRun();
		});
		$('#sideNav .type a').bind('click', function() {
			isFundBreakdown = false;
			theData = $(this).attr('id');
			gvRun();
		});
		$('#sideNav .breakdown a').bind('click', function() {
			isFundBreakdown = false;
			theBreakdown = $(this).attr('id');
			gvRun();
		});
		$('#sideNav #netCost,#sideNav #netPosition').bind('click', function() {
			$('#sideNav #overTime').click();
		});
		//MOUSEWHEEL=======================================================
		$('#main').bind('mousewheel', function(event, delta) {
			var dir = delta > 0 ? 'Up' : 'Down',
				vel = Math.abs(delta);
			if (dir === 'Up') {
				$("#topNav a.on").next().click();
			} else {
				$("#topNav a.on").prev().click();
			}
			return false;
		});
		//IE7 AND MOUSEWHEEL DON'T MIX
		if ($.browser.msie && parseInt($.browser.version, 10) === 7) {
			$('#topNav span.hint').html('[period/comma]');
		}
		//KEYBOARD CONTROL=================================================
		$(document).bind('keypress', 'e', function() {
			$('#expenses').click();
		}).bind('keypress', 'r', function() {
			$('#revenues').click();
		}).bind('keypress', 'c', function() {
			$('#netCost').click();
		}).bind('keypress', 'a', function() {
			$('#assets').click();
		}).bind('keypress', 'l', function() {
			$('#liabilities').click();
		}).bind('keypress', 'p', function() {
			$('#netPosition').click();
		}).bind('keypress', 't', function() {
			$('#overTime').click();
		}).bind('keypress', 'f', function() {
			$('#byFund').click();
		}).bind('keypress', '.', function() {
			$("#topNav a.on").next().click();
		}).bind('keypress', ',', function() {
			$("#topNav a.on").prev().click();
		});
		$('#hints').bind('click', function() {
			if ($(this).html() === 'Keyboard Controls') {
				$('span.hint').fadeIn(200);
				$(this).html('Hide Keyboard Controls');
			} else {
				$('span.hint').hide();
				$(this).html('Keyboard Controls');
			}
		});
		//END
	});
});