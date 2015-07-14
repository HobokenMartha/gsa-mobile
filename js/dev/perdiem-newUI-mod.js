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


var theCities = ["Aberdeen", "Abingdon", "Aiken", "Akron", "Albany", "Alexandria", "Allentown", "Anacortes", "Andover", "Ann Arbor", "Annapolis", "Antioch", "Appleton", "Arcata", "Arlington", "Asheville ", "Aspen", "Athens", "Atlanta", "Atlantic Beach", "Atlantic City", "Auburn Hills ", "Augusta", "Aurora", "Austin", "Bakersfield", "Baltimore City", "Baltimore County", "Bar Harbor", "Barstow", "Baton Rouge", "Battle Creek ", "Beaverton", "Bel Air", "Belcamp", "Belle Mead", "Bellevue", "Belmont", "Bend", "Benton Harbor", "Berwyn", "Bethlehem", "Beulah", "Big Sky", "Big Spring", "Binghamton", "Birmingham", "Blacksburg", "Bloomington ", "Boca Raton", "Bolingbrook", "Bonner's Ferry", "Boone County", "Boston", "Boulder", "Bradenton", "Breckenridge", "Brentwood", "Bridgeport", "Bristol", "Brookfield", "Broomfield", "Brunswick", "Bucks County", "Buffalo", "Burlington", "Burnsville", "Butte", "Cambridge", "Canton", "Cape May", "Carlsbad", "Carmel", "Cedar Rapids", "Centreville", "Chapel Hill", "Charleston", "Charlotte", "Charlottesville", "Chattanooga ", "Cherry Hill", "Chesapeake", "Chester", "Chicago", "Cincinnati", "Clackamas", "Cleveland", "Cocoa Beach", "Cody", "Coeur d'Alene", "College Station", "Collinsville", "Colorado Springs", "Columbia", "Columbus", "Concord", "Conway", "Corpus Christi", "Cortez", "Coupeville", "Covington", "Cranford", "Crested Butte", "Cromwell", "Dallas", "Dallas County", "Danbury", "Davis", "Dayton", "Daytona Beach", "De Funiak Springs", "Death Valley", "Delray Beach", "Denver", "Des Moines", "Detroit", "Dickinson", "District of Columbia", "Douglas County", "Dover", "Driggs", "Duluth", "Durango", "Durham", "Eagan", "East Greenwich", "East Lansing", "Easton", "Eatontown", "Edison", "El Paso", "Enid", "Erie", "Essington", "Eugene", "Eureka", "Evanston", "Everett", "Fairborn", "Fairview Heights", "Falmouth", "Fayetteville", "Flagstaff", "Flemington", "Floral Park", "Florence", "Fort Collins", "Fort Lauderdale", "Fort Myers", "Fort Walton Beach", "Fort Worth", "Foster City", "Franklin", "Frazer", "Frederick", "Fredericksburg", "Freehold", "Fresno", "Ft. Wayne", "Gainesville", "Galveston", "Garden City", "Gettysburg", "Gillette", "Glendive", "Glens Falls", "Glenwood Springs", "Grand Canyon", "Grand Junction", "Grand Rapids", "Grapevine", "Great Neck", "Greensboro", "Greenville", "Groton", "Gualala", "Gulf Breeze", "Gulf Shores", "Gunnison", "Hamilton", "Hammond", "Harrisburg", "Hartford", "Hattiesburg", "Havelock", "Helena", "Hershey", "Hilton Head", "Holland", "Hot Springs", "Houston (L.B. Johnson Space Center)", "Huntsville", "Hyannis", "Idaho Falls", "Incline Village", "Indianapolis", "Ithaca", "Jackson", "Jamestown", "Jekyll Island", "Jupiter", "Kalamazoo", "Kalispell", "Kansas City", "Kennebunk", "Kenton County", "Ketchum", "Key West", "Kill Devil", "Kingston", "Kittery", "Knoxville", "Laconia", "Lafayette", "Lake Geneva", "Lake Placid", "Lakeville", "Lancaster", "Lansing", "Laredo", "Las Cruces", "Las Vegas", "Laurel", "Lebanon", "Leesville", "Lemont", "Lemoore", "Leonardtown", "Lewes", "Lexington", "Lexington Park", "Lincoln", "Lincoln City", "Little Rock", "Los Alamos", "Los Angeles", "Loudoun County", "Louisville", "Loveland", "Lusby", "Lynchburg", "Lynnwood", "Mackinac Island", "Madison", "Malvern", "Mammoth Lakes", "Manassas", "Manchester", "Martha's Vineyard", "McAllen", "McKinleyville", "Mechanicsburg", "Medina", "Melville", "Memphis", "Mendota Heights", "Mentor", "Merrillville", "Miami", "Middlebury", "Middletown", "Midland", "Mill Valley", "Milwaukee", "Minneapolis", "Minot", "Missoula", "Moab", "Mobile", "Modesto", "Monterey", "Montgomery County", "Montpelier", "Montrose", "Moorestown", "Morehead City", "Morgantown", "Munster", "Muskegon", "Myrtle Beach", "Nantucket", "Napa", "Naples", "Nashville", "Natchitoches", "New Bedford", "New Bern", "New Haven", "New London", "New Orleans", "New Providence", "New Rochelle", "New York City (Manhattan", " Brooklyn", " the Bronx", " Queens and Staten Island)", "Newark", "Newport", "Niagara Falls", "Norfolk", "North Kingstown", "Northampton", "Novato", "Nyack", "O'Fallon", "Oak Brook Terrace", "Oak Harbor", "Oak Ridge", "Oakhurst", "Oakland", "Ocean City", "Ocean Shores", "Oklahoma City", "Old Saybrook", "Olympia", "Omaha", "Ontario", "Orlando", "Oswego", "Overland Park", "Owego", "Oxford", "Palisades", "Palm Springs", "Palo Alto", "Panama City", "Park City", "Parsippany", "Pasco", "Pearsall", "Pensacola ", "Petoskey", "Philadelphia", "Phoenix", "Pinedale", "Piscataway", "Pittsburgh", "Pittsfield", "Plano", "Plymouth", "Point Arena", "Polson", "Pontiac", "Port Angeles", "Port Townsend", "Portland", "Portsmouth", "Poughkeepsie", "Prince William County", "Princeton", "Providence", "Provo", "Punta Gorda", "Quincy", "Racine", "Radnor", "Raleigh", "Rapid City", "Reading", "Redding", "Reno", "Richland", "Richmond", "Ridgecrest", "Riverhead", "Roanoke", "Rochester", "Rock Springs", "Rockport", "Romeoville", "Romulus", "Ronkonkoma", "Round Rock ", "Sacramento", "Salisbury", "Salt Lake City", "San Antonio", "San Diego", "San Francisco", "San Jose", "San Luis Obispo", "San Mateo", "San Rafael", "Sandpoint", "Sandusky", "Sanford", "Santa Barbara", "Santa Cruz", "Santa Fe", "Santa Monica ", "Santa Rosa", "Sarasota", "Saratoga Springs", "Savannah", "Schenectady", "Scottsdale", "Scranton", "Seaside", "Seattle", "Sebring", "Sedona", "Sheboygan", "Sheridan", "Sidney", "Silverthorne", "Slidell", "South Bend", "South Haven", "South Lake Tahoe", "South Padre Island", "Southaven", "Sparks", "Spearfish ", "Spokane", "Springfield", "Springfield ", "St. Albans", "St. Augustine", "St. Joseph", "St. Louis", "St. Michaels", "St. Paul", "St. Petersburg", "Starkville ", "State College ", "Stateline", " Carson City", "Steamboat Springs", "Stevensville", "Stockton ", "Stowe ", "Stuart", "Sturgeon Bay", "Sturgis", "Suffolk", "Sun Valley", "Sunnyvale", "Syracuse", "Tacoma", "Tahoe City", "Tallahassee", "Tampa", "Taos", "Tarrytown", "Taunton", "Telluride", "Toms River", "Traverse City and Leland", "Trenton", "Troy ", "Truckee", "Tucson", "Tumwater", "Vail", "Vancouver", "Vero Beach", "Victorville", "Virginia Beach", "Visalia", "Waco", "Wallops Island", "Warrenton ", "Warwick", "Waterloo", "Watertown", "West Lafayette", "West Lebanon", "West Point", "West Sacramento", "West Yellowstone", "Wheeling", "White Plains", "White River Junction", "Wichita", "Williamsburg", "Williston", "Wilmington", "Wisconsin Dells", "Woburn", "Wooster", "Worcester", "York", "Yosemite National Park", "Youngstown"];


$(function() {
    console.log('DOC READY')

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

    if (Modernizr.inputtypes.date) {
        $('#startDate,#endDate').prop('type', 'date');
    } else {
        //DATE PICKERS
        var $startDatePicker = $('#startDate').pickadate({
            format: 'yyyy-mm-dd',
            min: [2012, 1, 1],
            max: [2014, 8, 31],
            selectMonths: true
        });
        var $endDatePicker = $('#endDate').pickadate({
            format: 'yyyy-mm-dd',
            min: [2012, 1, 1],
            max: [2014, 8, 31],
            selectMonths: true
        });

        var startDatePicker = $startDatePicker.pickadate('picker');
        var endDatePicker = $endDatePicker.pickadate('picker');

        //$('#startDate_root .picker__frame').prepend('<h2>Start Date</h2>');
        //$('#endDate_root .picker__frame').prepend('<h2>End Date</h2>');

        startDatePicker.on({
            open: function() {
                this.$node.removeClass('pulse animated');
                $('#startDate_root .picker__frame').addClass('fadeInDownBig animated');
                $('body').css({
                    'width': '100%',
                    'height': '100%',
                    'overflow': 'hidden'
                });
            },
            set: function() {
                this.$node.addClass('pulse animated');
                setEndDateRange();
            },
            close: function() {
                $('body').css({
                    'width': 'auto',
                    'height': 'auto',
                    'overflow': 'scroll'
                });
            }
        });
        endDatePicker.on({
            open: function() {
                this.$node.removeClass('pulse animated');
                $('#endDate_root .picker__frame').addClass('fadeInDownBig animated');
                $('body').css({
                    'width': '100%',
                    'height': '100%',
                    'overflow': 'hidden'
                });
            },
            set: function() {
                this.$node.addClass('pulse animated');
                setStartDateRange()
            },
            close: function() {
                $('body').css({
                    'width': 'auto',
                    'height': 'auto',
                    'overflow': 'scroll'
                });
            }
        });

        function setStartDateRange() {
            var val = $('#endDate').val();
            val = val.split('-')
            for (i = 0; i < val.length; i++) {
                val[i] = parseFloat(val[i])
            };
            startDatePicker.set('max', val);
        }

        function setEndDateRange() {
            var val = $('#startDate').val();
            val = val.split('-')
            for (i = 0; i < val.length; i++) {
                val[i] = parseFloat(val[i])
            };
            endDatePicker.set('min', val);
        }
    }


    //CITY SELECT POPUP
    /*$('#chooseCityHTML').clone().prependTo('body');
    $('body > #chooseCityHTML').attr('id', 'chooseCity');
    $('#chooseCityHTML').remove();*/

    //AUTO COMPLETE
    $('#queryCity').autocomplete({
        lookup: theCities,
        lookupLimit: 5,
        appendTo: $('#queryCityAutocomplete')
    });


    /*$('#queryCity').on('click focus', function() {
        $('#queryCity').removeClass('pulse animated')
        $('#chooseCity').show()
        $('#chooseCity .form-search').addClass('fadeInDownBig animated')
        //FOCUS
        $('#autoCity')
            .focus()
            .select()
            .on('input', function() {
                $('#choose').removeAttr('disabled');
            });
        //ESCAPE KEY TO CLOSE
        $(document).keyup(function(e) {
            //ESCAPE
            if (e.keyCode == 27) {
                $('.popup').hide();
            }
            //ENTER
            if (e.keyCode == 13) {
                $('#choose').click();
            }
        });
        $(document).keypress(function(e) {
            //TAB
            if (e.keyCode == 9) {
                $('#choose').click();
                $('.popup').hide();
                $('#queryState').focus();
            }
        });
        /*$('#choose').on('click', function(e) {
            var theCity = $('#autoCity').val();
            $('#queryCity').val(theCity).addClass('pulse animated').off('focus').focus().on('blur', function() {
                $(this).on('focus', function() {

                })
            });
            $('.popup').hide();
            return false;
        });
        //AUTO COMPLETE
        $('#queryCity').autocomplete({
            lookup: theCities,
            lookupLimit: 5
        });
        //CLICK POPUP BACKGROUND TO CLOSE
        $('.popup').on('click', function() {
            $(this).hide();
        });
        $('.popup *').on('click', function(e) {
            e.stopPropagation();
        });
    });*/
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
                    if (moment($('#endDate').val(), 'YYYY-MM-DD').isBefore('2014-10-01')) {
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

    if (startYear === 2014) {
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
                }, 1000)
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
                }, 1000)
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
            zipObject = results[0].address_components.length - 1;
            geoZip = results[0].address_components[zipObject].long_name;
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
    }, 10000),
    timer30 = setTimeout(function() {
        fail('This seems to be taking a while...', "This app will continue trying to collect results until you search again, or navigate to another page.", false);
    }, 30000);
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