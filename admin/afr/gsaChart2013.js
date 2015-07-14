//DECLARE VARS, INITIAL CHART VALUES
var theYear = '2013',
    theData = 'expenses',
    theBreakdown = 'byFund',
    theTable,
    isFundBreakdown = false,
    fundBreakdown,
    theColors,
    theDataDisplay,

//THE COLORS
    monoRed = new Array('#66CC33','#336600','#CCFFCC'),
    monoBlue = new Array('#3399CC', '#003366', '#99CCFF'),
    monoLightBlue = new Array('#FF9933', '#CC6600', '#FFCC99');

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
            colors: ['#3399CC', '#66CC33','#FF9933'],// [blue,green,NOT,NOT,orange
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
            colors: ['#66CC33'],
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
            colors: ['#3399CC'],
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
            colors: ['#3399CC', '#66CC33'],
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
