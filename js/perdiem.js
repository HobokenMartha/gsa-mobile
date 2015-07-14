var baseURL = root + '/api/rs/perdiem/',
    data,
    topLevelData,
    stateAbbrev,
    theQuery,
    geocoder,
    geoZip,
    permaZip,
    urlVars,
    today,
    startDate,
    endDate,
    startYear,
    endYear,
    theRates,
    theMath,
    ratei,
    timer10,
    timer30;


$(function() {

    today = moment();

    $('#startDate').val(today.format('YYYY-MM-DD'));
    $('#endDate').val(today.add('days', 1).format('YYYY-MM-DD'));

    if (window.location.href.indexOf('?start') > 0) {
        permalink();
    }
    if (window.location.href.indexOf('?mylocation') > 0) {
        analytics('Geolocation');
        getLocation();
    }
    $('#search').click(function() {
        validateInput();
        return false;
    });
    $('#searchAgain').click(function() {
        $('#searchBox').show();
        if ($(window).width() < 699) {
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 500);
        }
    });
    $('#geoLocation').click(function() {
        $('#queryState,#queryCity,#queryZip').val('');
        analytics('Geolocation');
        getLocation();
        return false;
    });
    $('#saveSearch .link').click(function() {
        this.select();
    });
    $('#saveSearch button').click(function() {
        window.location.href = $(this).attr('href');
    });
});

function validateInput() {
    //State or ZIP
    if ($('#queryState').val().length > 0 || $('#queryZip').val().length > 0) {
        //Invalid ZIP
        if ($('#queryZip').val().length > 0 && !(/^\s*\d{5}\s*$/.test($('#queryZip').val()))) {
            $('form.perdiem .location').addClass('error');
            $('form.perdiem .location .help-inline').text('Please enter a valid 5 number Zip Code.');
        }
        //Valid Zip
        else {
            var zipTest = $('#queryZip').val()
            //GUAM, US VIRGIN ISLANDS, AMERICAN SAMOA, PUERTO RICO
            if (zipTest.inRange(96910, 96932) || zipTest === 96799 || zipTest.hasPrefix('008') || zipTest.hasPrefix('006') || zipTest.hasPrefix('007') || zipTest.hasPrefix('009')) {
                //SORRY BRO, THESE RATES ARE MAINTAINED BY THE DOD
                $('form.perdiem .location').addClass('error');
                $('form.perdiem .location .help-inline').html('Rates for this location are administrated by the <a href="http://www.defensetravel.dod.mil/site/perdiemCalc.cfm">Department of Defense.</a>');
                return false;
            } else {
                //Reset
                $('form.perdiem .location').removeClass('error');
                $('form.perdiem .location .help-inline').html('');

                //EndDate before StartDate
                if (moment($('#endDate').val()).isBefore(moment($('#startDate').val()))) {
                    $('form.perdiem .dates').addClass('error');
                    $('form.perdiem .dates .help-inline').text('End date cannot be set before start date.');
                    return false;
                } else {
                    //Valid Search Dates
                    if (moment($('#endDate').val(), 'YYYY-MM-DD').isBefore('2015-10-01')) {
                        perDiemSearch('main');
                        analytics('Calculator');
                        //Reset date errors
                        $('form.perdiem .dates').removeClass('error');
                        $('form.perdiem .dates .help-inline').html('');
                    }
                    //Invalid Search Dates
                    else {
                        $('form.perdiem .dates').addClass('error');
                        $('form.perdiem .dates .help-inline').text('Rates are not yet available for these dates.');
                        return false;
                    }

                }
            }
        }
    }
    //No State or ZIP
    else {
        $('form.perdiem .location').addClass('error');
        $('form.perdiem .location .help-inline').text('Please enter State or ZIP.');
    }
}

function perDiemSearch(type) {

    $('#fail').html('');
    $('#load').show();
    if ($(window).width() < 699) {
        $('html, body').animate({
            scrollTop: $('#load').offset().top
        }, 500);
    }
    $('#chooseRates').hide();
    $('#results').hide();
    if (type !== 'permalink') {
        startDate = moment($('#startDate').val(), 'YYYY-MM-DD');
        endDate = moment($('#endDate').val(), 'YYYY-MM-DD');
    } else {
        startDate = moment(startDate, 'YYYY-MM-DD');
        endDate = moment(endDate, 'YYYY-MM-DD');
    }

    startYear = startDate.year();
    endYear = endDate.year();

    //BUILD QUERY
    if (type === 'geo') {
        theQuery = new Query(
            baseURL,
            geoZip,
            '',
            ''
        );
        startDate = today;
        endDate = today;
    }
    if (type === 'main') {
        theQuery = new Query(
            baseURL,
            $('#queryZip').val(),
            $('#queryCity').val(),
            stateAbbrev($('#queryState').val())
        );
    }
    if (type === 'permalink') {
        theQuery = new Query(
            baseURL,
            permaZip,
            permaCity,
            permaState
        );
    }

    data = [];

    if (startYear === 2015) {
        request();
    } else {
        request(2);

    }
    startTimers();

    function request(number) {
        $.getJSON(theQuery.request(), function(json) {
            if (json.rates[0] === undefined) {
                fail('Your search returned no results.', 'Please make sure your search query is valid, and try again.');
                return false;
            } else {
                result = json.rates[0];
            }
            data.push(json.rates[0]);
            if (number === 2) {
                secondRequest();
            } else {
                if (data[0].rate.length > 1) {
                    chooseRates(data);
                } else {
                    ratei = 0;
                    process();
                    /*if(startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD')){
						view(false);
					}
					else{
						view();
					}*/
                    view(type);
                }
            }
        })
            .error(function() {
                setTimeout(function() {
                    request(number);
                }, 5000)
            });
    }

    function secondRequest() {
        $.getJSON(theQuery.request1(), function(json) {
            if (json.rates[0] === undefined) {
                fail('Your search returned no results.', 'Please make sure your search query is valid, and try again.');
                return false;
            } else {
                result = json.rates[0];
                ratei = 0;
            }
            data.push(json.rates[0]);
        })
            .success(function() {
                if (data[0].rate.length > 1) {
                    chooseRates(data);
                } else {
                    process();
                    /*if(startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD')){
						view(false);
					}
					else{
						view();
					}*/
                    view(type);
                }
            })
            .error(function() {
                setTimeout(function() {
                    secondRequest();
                }, 5000)
            });
    }
}

function Query(baseURL, zip, city, state) {

    var year = 'year/' + startYear + '/',
        year1 = 'year/' + parseInt(startYear + 1) + '/', //pulls two years for each search..

        qCity = '',
        qState = '',
        qZip = '';

    if (city.length > 0) {
        qCity = 'city/' + city + '/'
    }

    if (state.length > 0) {
        qState = 'state/' + state + '/'
    }

    if (zip.length > 0) {
        qZip = 'zip/' + zip + '/',
        qCity = '';
        qState = '';
    }

    this.zip = function() {
        return zip
    };
    this.city = function() {
        return city
    };
    this.state = function() {
        return state
    };
    this.year = function() {
        return date.year()
    };
    this.request = function() {
        return baseURL + qCity + qState + qZip + year;
    };
    this.request1 = function() {
        return baseURL + qCity + qState + qZip + year1;
    };
};

function DoMath() {
    if (startYear === endYear) {
        var numOfMonths = Math.abs(endDate.month() - startDate.month());
    } else {
        var numOfMonths = Math.abs(endDate.month() + 12 - startDate.month());
    }

    var mathArray = [];

    //MONTH LOOP
    for (var i = 0; i <= numOfMonths; i++) {
        var nextMonth = moment(startDate).add('months', i);
        var m = nextMonth.month(),
            y = nextMonth.year(),
            d,
            l = theRates.lodging(m, y),
            mie = theRates.mie(y);

        //CALCULATE D
        if (i === 0) {
            if (startDate.month() === endDate.month()) {
                d = endDate.date() - startDate.date() + 1;
            } else {
                d = startDate.daysInMonth() - startDate.date() + 1;
            }
        } else if (i === numOfMonths) {
            d = endDate.date();
        } else {
            d = nextMonth.daysInMonth();
        }

        //CALCULATE TOTAL L
        if (i === numOfMonths) {
            var totalL = (d - 1) * l;
        } else {
            var totalL = d * l;
        }


        //CALCULATE TOTAL MIE
        if (startDate.month() === endDate.month()) {
            var totalMIE = (d - 2) * mie + mie * 0.75 * 2;
        } else {
            if (i === 0 || i === numOfMonths) {
                var totalMIE = (d - 1) * mie + mie * 0.75;
            } else {
                var totalMIE = d * mie;
            }
        }

        var totalMonth = totalMIE + totalL;

        mathArray.push([m, y, d, l, mie, totalL, totalMIE, totalMonth]);
    }

    var totalDays = 0;
    var totalLodging = 0;
    var totalMIE = 0;
    var totalTotal = 0;

    for (var i = 0; i < mathArray.length; i++) {
        if (i === 0) {
            totalDays = totalDays + mathArray[i][2] - 1;
        } else {
            totalDays = totalDays + mathArray[i][2] /*-1*/ ;
        }
        totalLodging = totalLodging + mathArray[i][5];
        totalMIE = totalMIE + mathArray[i][6];
        totalTotal = totalTotal + mathArray[i][7];
    }

    var last = mathArray.length - 1;

    totalTotal = totalMIE + totalLodging;

    //for view only
    var firstDayMIE = mathArray[0][4] * 0.75;
    var lastDayMIE = mathArray[last][4] * 0.75;

    this.firstDayMIE = function() {
        return firstDayMIE
    };
    this.lastDayMIE = function() {
        return lastDayMIE
    };
    this.array = function() {
        return mathArray
    };
    this.totalLodging = function() {
        return totalLodging
    };
    this.totalMIE = function() {
        return totalMIE
    };
    this.totalDays = function() {
        return totalDays
    };
    this.total = function() {
        return totalTotal
    };
}

function Rates() {
    this.lodging = function(m, y) {
        if (y !== startYear) {
            var n = 1
        } else {
            var n = 0
        };

        //handles fiscal year switch
        if (m > 8 && y === startYear) {
            var n = 1;
        }

        function findMonthRate(monthNum, monthArray) {
            for (i = 0; i < 12; i++) {
                if (monthArray[i]['number'] == monthNum) {
                    monthRate = parseInt(monthArray[i]['value']);
                    return monthRate;
                }
            }
        }
        var res = findMonthRate(m + 1, data[n].rate[ratei].months.month);
        return res;
    }
    this.mie = function(y) {
        var n = 0;
        if (y !== startYear) {
            var n = 1
        };

        return data[n].rate[ratei].meals;
    }
}

function view(type) {
    clearTimers();
    var array = theMath.array();

    $('#fail').hide();
    $('#results table tbody').html('');
    $('#results #totals ul').remove();
    $('#results #totals').hide();
    $('#results #today').hide();
    $('#chooseRates ul').html('');
    $('#chooseRates').hide();

    $('#results #yourSearch').html('Your search ' + searchedFor() + 'matches results for ' + data[0].rate[ratei].city + ', including ' + county(data[0].rate[ratei].county) + ':');

    //CURRENT RATE FOR MY LOCATION
    if (type === 'geo') {
        //nothing
    } else {
        //FIRST DAY - MULTIPLE DAYS
        if (startDate.format('YYYY-MM-DD') !== endDate.format('YYYY-MM-DD')) {
            $('#results table tbody').append('<tr class="firstLast"><td scope="row">First Day</td><td>$' + currency(array[0][3]) + '</td><td>$' + currency(theMath.firstDayMIE()) + '</td><td>$' + currency(array[0][3] + theMath.lastDayMIE()) + '</td>');
        }
        //FIRST DAY - SAME DAY
        else {
            $('#results table tbody').append('<tr class="firstLast"><td scope="row">First Day</td><td>N/A</td><td>$' + currency(theMath.firstDayMIE()) + '</td><td>$' + currency(theMath.firstDayMIE()) + '</td>');
        }
    }

    //Monthly Rate(s)

    //if(theMath.totalDays() > 1){
    $.each(array, function(i) {
        //if(i === 0 && array[0][2] <= 1){
        //nothing
        //}
        //else{
        $('#results table tbody').append('<tr><td scope="row">' + theMonths[array[i][0]] + ' Rate</td><td>$' + currency(array[i][3]) + '</td><td>$' + currency(array[i][4]) + '</td><td>$' + currency(array[i][3] + array[i][4]) + '</td>');
        //}
    });
    //}

    //LAST DAY
    if (startDate.format('YYYY-MM-DD') !== endDate.format('YYYY-MM-DD')) {
        $('#results table tbody').append('<tr class="firstLast"><td scope="row">Last Day</td><td>-</td><td>$' + currency(theMath.lastDayMIE()) + '</td><td>$' + currency(theMath.lastDayMIE()) + '</td>');
    }

    //TOTALS
    if (type === 'geo') {
        $('#today').show();
    } else {
        if (startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD')) {
            //$('#results #totals').hide();
            $('#totals h4 strong').html('$' + currency(theMath.lastDayMIE()));
            $('#totals').append('<ul class="unstyled"><li>Lodging <strong>N/A</strong></li><br><li>M&amp;IE <strong>$' + currency(theMath.lastDayMIE()) + '</strong></li></ul>').show();
        } else {
            $('#totals h4 strong').html('$' + currency(theMath.total()));
            $('#totals').append('<ul class="unstyled"><li>Lodging <strong>$' + currency(theMath.totalLodging()) + '</strong></li><br><li>M&amp;IE <strong>$' + currency(theMath.totalMIE()) + '</strong></li></ul>').show();
        }
    }

    //permalink
    if (type === 'geo') {
        $('#results #saveSearch .link').val(mRoot + '/#!/travel/perdiem/?mylocation');

        $('#saveSearch .email').attr('href', 'mailto:?subject=My%20Per%20Diem%20Rates&body=http%3A%2F%2Fm.gsa.gov%2Fm%2F%23%21%2Ftravel%2Fperdiem%2F%3Fmylocation');
    } else {
        $('#results #saveSearch .link').val(mRoot + '/#!/travel/perdiem/?start=' + startDate.format('YYYY-MM-DD') + '&end=' + endDate.format('YYYY-MM-DD') + '&zip=' + theQuery.zip() + '&city=' + theQuery.city() + '&state=' + theQuery.state());

        $('#saveSearch .email').attr('href', 'mailto:?subject=My%20Per%20Diem%20Rates&body=http%3A%2F%2Fm.gsa.gov%2Fm%2F%23%21%2Ftravel%2Fperdiem%2F%3Fstart%3D' + startDate.format('YYYY-MM-DD') + '%26end%3D' + endDate.format('YYYY-MM-DD') + '%26zip%3D' + theQuery.zip() + '%26city%3D' + theQuery.city() + '%26state%3D' + theQuery.state());
    }

    $('#load').hide();
    $('#results').css('opacity', '0').show().addClass('fadeInDown animated');
    if ($(window).width() < 699) {
        $('html, body').animate({
            scrollTop: $('#results').offset().top
        }, 500);
    }
};



function analytics(type) {
    if (typeof(_gaq) !== 'undefined') {
        _gaq.push(['_trackEvent', 'Per Diem', type]);
    }
}

function searchedFor() {
    var searchArea;
    if ($('#queryCity').val().length > 0) {
        searchArea = capitalize($('#queryCity').val());
    } else if ($('#queryCity').val().length === 0 && $('#queryZip').val().length === 0) {
        //searchArea = geoZip;
    } else {
        searchArea = $('#queryZip').val();
    }

    if (searchArea != undefined) {
        searchArea = 'for "' + searchArea + '" ';
    } else {
        searchArea = '';
    }
    return searchArea;
};

function county(c) {
    if (c.indexOf(',') > 0 && c.indexOf('counties') === 0) {
        return c + ' counties'
    } else if (c.indexOf('(') > 0 || c.indexOf(';') > 0) {
        return c;
    } else {
        return c + ' county'
    }
};

function process() {
    theRates = new Rates();
    theMath = new DoMath();
}

function fail(h4, p, load) {
    $('#fail').hide();
    if (load !== false) {
        $('#load').hide();
    }
    $('#results').hide();
    if (h4 === undefined) {
        $('#fail').html('').append('<div class="alert alert-error"><h4>Your Search Returned No Results.</h4><br><p>Please try again.</p></div>');
    } else {
        $('#fail').html('').append('<div class="alert alert-error"><h4>' + h4 + '</h4><br><p>' + p + '</p></div>');
    }
    if ($(window).width() < 699) {
        $('html, body').animate({
            scrollTop: $('#fail').offset().top
        }, 500);
    }
    $('#fail').show();
}

function chooseRates(data) {
    $('#chooseRates ul').html('');
    $.each(data[0].rate, function(i) {
        if (data[0].rate[i].city === '') {
            $('#chooseRates ul').append('<li><a href="#">All other locations</a></li>');
        } else {
            $('#chooseRates ul').append('<li><a href="#">' + data[0].rate[i].city + '</a></li>');
        }
    });
    $('#chooseRates').css('opacity', '0').show().addClass('fadeInDown animated');
    $('#load').hide();
    if ($(window).width() < 699) {
        $('html, body').animate({
            scrollTop: $('#chooseRates').offset().top
        }, 500);
    }
    $('#chooseRates li').click(function() {
        var i = $(this).index();
        ratei = i;
        data.push(data[0]);
        $('#load').show();
        process();
        if (startDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD')) {
            view(false);
        } else {
            view();
        }
        return false;
    });
    clearTimers();
}

function stateAbbrev(s) {
    s = s.toLowerCase();
    if (s.length > 2) {
        if (theStates[s] != undefined) {
            return theStates[s];
        } else {
            return '';
        }
    } else {
        return s.toUpperCase();
    }
}

function daysInMonth(m, y) {
    return new Date(y, m, 0).getDate();
}

function currency(n) {
    if (n.toString().indexOf('.') !== -1) {
        return n.toFixed(2);
    } else {
        return n + '.00';
    }
}
String.prototype.inRange = function(min, max) {
    var n = parseInt(this);
    return n > min && n < max;
};
String.prototype.hasPrefix = function(prefix) {
    var stringPrefix = this.substring(0, 3)
    if (stringPrefix === prefix) {
        return true
    } else {
        return false;
    }
};

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getLocation() {
    if (Modernizr.geolocation) {
        navigator.geolocation.getCurrentPosition(reverseGeocode, geocodeError);
        geocoder = new google.maps.Geocoder();
        $('#load').show();
        if ($(window).width() < 699) {
            $('html, body').animate({
                scrollTop: $('#load').offset().top
            }, 500);
        }

    } else {
        $('#geoLocation').addClass('disabled').html('Geolocation is not available on this device');
    }
}

function reverseGeocode(position) {
    var latitude = position.coords.latitude,
        longitude = position.coords.longitude;

    var latlong = new google.maps.LatLng(latitude, longitude);
    geocoder.geocode({
        'latLng': latlong
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var addressComponents = results[0].address_components;
            for(i in addressComponents){
                if(addressComponents[i].types[0] === 'postal_code'){
                    geoZip = addressComponents[i].long_name;
                }
            }
            perDiemSearch('geo');
            $('#geoLocation').addClass('disabled');
        } else {
            fail('Your location could not be determined.', 'Try searching manually, or set your device to allow location access.');
        }
    });
}

function geocodeError(error) {
    var message = "";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "<h4>You have disallowed access to your location.</h4><br><p>Try searching manually, or set your device to allow location access.</p>";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "<h4>Your location could not be determined.</h4><br><p>Try searching manually, or enabling your device's data, WiFi, and location services.</p>";
            break;
        case error.PERMISSION_DENIED_TIMEOUT:
            message = "<div class='alert alert-error'><h4>Your location could not be determined.</h4><br><p>Try searching manually, or enabling your device's data, WiFi, and location services.</p></div>";
            break;
    }

    if (message == "") {
        message = "<h4>Your location could not be determined due to an unknown error.</h4><br><p>Try searching manually, or enabling your device's data, WiFi, and location services.</p>";
    }
    $('#fail').html('');
    $('#results').hide();
    $('#fail').append("<div class='alert alert-error'>" + message + "</div>").show();
    $('#load').hide();
}

function permalink() {
    var url = window.location.href.split('?');
    urlVars = url[1].split('&');
    startDate = urlVars[0].replace('start=', ''),
    endDate = urlVars[1].replace('end=', ''),
    permaZip = urlVars[2].replace('zip=', '');
    permaCity = urlVars[3].replace('city=', '');
    permaState = urlVars[4].replace('state=', '');

    if (permaCity !== '') {
        $('#queryCity').val(permaCity);
    }
    if (permaState !== '') {
        $('#queryState').val(permaState);
    }
    if (permaZip !== '') {
        $('#queryZip').val(permaZip);
    }
    $('#startDate').val(startDate /*.format('YYYY-MM-DD')*/ );
    $('#endDate').val(endDate /*.format('YYYY-MM-DD')*/ );

    perDiemSearch('permalink');
    analytics('Permalink');
}

function startTimers() {
    timer10 = setTimeout(function() {
        fail('This seems to be taking a while...', "Loading results requires an internet connection. If you're mobile, make sure you are still connected to 3G/4G/WiFi.", false);
    }, 11000),
    timer30 = setTimeout(function() {
        fail('This seems to be taking a while...', "This app will continue trying to collect results until you search again, or navigate to another page.", false);
    }, 31000);
}

function clearTimers() {
    clearTimeout(timer10);
    clearTimeout(timer30);
}


//MONTH ORDER

var theMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];


var theStates = {
    'alabama': 'al',
    'alaska': 'ak',
    'arizona': 'az',
    'arkansas': 'ar',
    'california': 'ca',
    'colorado': 'co',
    'connecticut': 'ct',
    'delaware': 'de',
    'florida': 'fl',
    'georgia': 'ga',
    'hawaii': 'hi',
    'idaho': 'id',
    'illinois': 'il',
    'indiana': 'in',
    'iowa': 'ia',
    'kansas': 'ks',
    'kentucky': 'ky',
    'louisiana': 'la',
    'maine': 'me',
    'maryland': 'md',
    'massachusetts': 'ma',
    'michigan': 'mi',
    'minnesota': 'mn',
    'mississippi': 'ms',
    'missouri': 'mo',
    'montana': 'mn',
    'nebraska': 'ne',
    'nevada': 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    'ohio': 'oh',
    'oklahoma': 'ok',
    'oregon': 'or',
    'pennsylvania': 'pa',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    'tennessee': 'tn',
    'texas': 'tx',
    'utah': 'ut',
    'vermont': 'vt',
    'virginia': 'va',
    'washington': 'wa',
    'west virginia': 'wv',
    'wisconsin': 'wi',
    'wyoming': 'wy',
};