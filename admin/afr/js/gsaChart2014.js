//DECLARE VARS, INITIAL CHART VALUES
var theYear = '2014',
    theData = 'expenses',
    theBreakdown = 'byFund',
    theTable,
    isFundBreakdown = false,
    fundBreakdown,
    theColors,
    theDataDisplay,

//THE COLORS
    monoRed = new Array('#D5AC19', '#BB9915', '#967B0F','#DEC25D','#FAE391'), // yellow
    monoBlue =  new Array('#9E5239','#7B412E','#593123','#3D1E14','#D1866D'),// red
    monoLightBlue = new Array('#692052', '#A83384', '#E847B6','#FF7AD6','#4D183C'); // purple

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
            colors: ['#9E5239', '#D5AC19','#E847B6'],// [blue,green,orange]
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
            fontName: 'Arial',
            titleTextStyle: {
                fontSize: 18
            },
            sliceVisibilityThreshold: 0
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
            fontName: 'Arial',
            titleTextStyle: {
                fontSize: 18
            },
            sliceVisibilityThreshold: 0
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
            colors: ['#9E5239'],
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
            fontName: 'Arial'
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
            colors: ['#D5AC19'],
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
            fontName: 'Arial'
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
            colors: ['#D5AC19', '#9E5239'],
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
            fontName: 'Arial'
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
        } else if (fundBreakdown === 'otherFunds') {
            theColors = monoLightBlue;
        } else {
            theColors = monoBlue;
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
    $('#chartApp').delay('1000').fadeIn();
    $('#loading span').html('Loading Data...');

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
        return false;
    });
    $('#backNav a').bind('click', function() {
        isFundBreakdown = false;
        gvRun();
        return false;
    });
    $('#sideNav .type a').bind('click', function() {
        isFundBreakdown = false;
        theData = $(this).attr('id');
        gvRun();
        return false;
    });
    $('#sideNav .breakdown a').bind('click', function() {
        isFundBreakdown = false;
        theBreakdown = $(this).attr('id');
        gvRun();
        return false;
    });
    $('#sideNav #netCost,#sideNav #netPosition').bind('click', function() {
        $('#sideNav #overTime').click();
    });
    //MOUSEWHEEL=======================================================
    /*$('#main').bind('mousewheel', function(event, delta) {
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
    }*/
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
        return false;
    });
    //END
});
