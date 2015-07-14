var currentPage,
    permanence,
    mobileServer,
    popup = "<div id='mobileForward'><div><h3 style='font-size:24px;'>GSA Mobile</h3><p>Use GSA's mobile site to find per diem rates, travel information, job listings, and more.</p><p>OR stay on the full site to find information not available on the mobile site.</p></div><div class='bottom'><button id='continue' class='mobileButton buttonBlue'>Mobile Site</button><button id='stay' class='mobileButton'>Full Site</button><div class='always'><input id='always' name='always' type='checkbox'/><label>Remember my decision</label></div></div></div>",
    viewport = "<meta name='viewport' content='width=device-width,minimum-scale=1,maximum-scale=1'>";

$(function() {

    //MOBILE DETECTION
    if (isMobile.any()) {

        currentPage = window.location.pathname;

        if (currentPage in mobilePages) {

            if ($.cookie('gsaMobileForward') === 'm') {
                if ($.cookie('gsaMobileForwardTemp') !== 'www') {
                    mobileForward(currentPage);
                } else {
                    _gaq.push(['_trackEvent', 'Mobile Forward', 'Linked from Mobile, Redirect Temp Disabled']);
                }
            } else if ($.cookie('gsaMobileForward') === 'www') {
                //nothing
            } else {
                $('head').append(viewport);
                $('body').prepend(popup);
                $('#mobileForward,#curtain').show();

                $('#mobileForward #continue').click(function() {
                    if ($('#mobileForward #always').attr('checked') === 'checked') {
                        $.cookie('gsaMobileForward', 'm', {
                            expires: 3650,
                            path: '/',
                            domain: '.gsa.gov'
                        });
                        permanence = 'Always';
                    } else {
                        permanence = 'Just Once';
                    }
                    //ANALYTICS
                    if (typeof(_gaq) !== 'undefined') {
                        _gaq.push(['_trackEvent', 'Mobile Forward', 'Mobile Site in Popup', permanence]);
                    }
                    mobileForward(currentPage);
                });

                $('#mobileForward #stay').click(function() {
                    if ($('#mobileForward #always').attr('checked') === 'checked') {
                        $.cookie('gsaMobileForward', 'www', {
                            expires: 3650,
                            path: '/',
                            domain: '.gsa.gov'
                        });
                        permanence = 'Always';
                    } else {
                        permanence = 'Just Once';
                    }
                    //ANALYTICS
                    if (typeof(_gaq) !== 'undefined') {
                        _gaq.push(['_trackEvent', 'Mobile Forward', 'Full Site in Popup', permanence]);
                    }
                    $('#mobileForward,#curtain').hide();
                });
            }
        }
    }

    //"MOBILE SITE" HEADER LINK FUNCTIONALITY:
    $('#mobileSite').click(function() {
        $.removeCookie('gsaMobileForward', {
            path: '/'
        });
        $.cookie('gsaMobileForward', 'm', {
            expires: 3650,
            path: '/',
            domain: '.gsa.gov'
        });

        if (typeof(_gaq) !== 'undefined') {
            _gaq.push(['_trackEvent', 'Mobile Forward', 'Mobile Site in Header']);
        }

        setTimeout(function() {
            window.location.href = 'http://m.gsa.gov/m/';
        }, 1000);
        return false;

    });

});

//ASSETS
function mobileForward(currentPage) {

    if (window.location.hostname.indexOf('dev') > -1) {
        mobileServer = 'http://dev.m.gsa.gov';
    } else if (window.location.hostname.indexOf('staging') > -1) {
        mobileServer = 'http://m.staging.gsa.gov';
    } else {
        mobileServer = 'http://m.gsa.gov';
    }

    if (mobilePages[currentPage] != undefined) {
        window.location.href = mobileServer + '/m' + mobilePages[currentPage];
    } else {
        //in case of false match, go to mobile home page
        window.location.href = mobileServer + '/m';
    }
}

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

var mobilePages = {
    // REMOVED 6-10-13
    '/portal/category/100000': '',
    '/portal/content/156673': '',
    '/portal/category/26429': '/#!/travel/',
    '/portal/content/105307': '/#!/travel/',
    '/portal/category/104711': '/#!/travel/perdiem/',
    '/portal/content/104877': '/#!/travel/perdiem/',
    '/portal/content/100021': '/#!/travel/airfares/',
    '/portal/content/100715': '/#!/travel/mileage/',
    '/portal/category/104715': '/#!/travel/mileage/',
    //'/portal/content/100064':'/#!/travel/fleet/',
    '/portal/content/100039': '/#!/travel/fleet/parts-service.html',
    '/portal/category/100759': '/#!/travel/fleet/find-fleet-center.html',
    '/portal/content/194821': '/#!/travel/fleet/find-fleet-center.html',
    '/portal/category/100759': '/#!/travel/fleet/find-fleet-center.html',
    '/portal/content/194821': '/#!/travel/fleet/find-fleet-center.html',
    '/portal/content/196805': '/#!/content/196805',
    '/portal/content/195845': '/#!/content/195845',
    '/portal/content/195969': '/#!/content/195969',
    '/portal/content/196321': '/#!/content/196321',
    '/portal/content/196513': '/#!/content/196513',
    '/portal/content/196685': '/#!/content/196685',
    '/portal/content/196753': '/#!/content/196753',
    '/portal/content/196865': '/#!/content/196865',
    '/portal/content/196889': '/#!/content/196889',
    '/portal/content/196965': '/#!/content/196965',
    '/portal/content/197001': '/#!/content/197001',
    //'/portal/category/27087':'/#!/travel/resources/fedrooms.html',
    //'/portal/content/105396':'/#!/travel/resources/fedrooms.html',
    '/portal/content/104347': '/#!/travel/resources/travel-card.html',
    '/portal/content/103882': '/#!/travel/resources/baggage.html',
    //'/portal/content/104206':'/#!/travel/resources/faq.html',
    '/portal/category/20982': '/#!/about-gsa/',
    '/portal/content/110209': '/#!/about-gsa/',
    '/portal/content/100882': '/#!/about-gsa/executive-staff/',
    '/portal/content/105311': '/#!/about-gsa/careers/',
    '/portal/category/26561': '/#!/about-gsa/careers/',
    '/portal/content/102507': '/#!/about-gsa/payroll/',
    '/staffDirectory/searchStaffDirectory': '/#!/about-gsa/contact-gsa/',
    /*'/staffDirectory/searchStaffDirectory': '/#!/about-gsa/contact-gsa/staff-directory.html',
    '/staffDirectory/searchStaffDirectory': '/#!/about-gsa/contact-gsa/key-contacts.html',
    '/staffDirectory/searchStaffDirectory': '/#!/about-gsa/contact-gsa/topics.html',*/
    '/portal/category/20987': '/#!/buildings/',
    '/portal/category/21426': '/#!/buildings/facilities/r1.html',
    '/portal/content/104759': '/#!/buildings/facilities/r1.html',
    '/portal/category/21437': '/#!/buildings/facilities/r2.html',
    '/portal/content/104749': '/#!/buildings/facilities/r2.html',
    '/portal/category/21446': '/#!/buildings/facilities/r3.html',
    '/portal/content/104704': '/#!/buildings/facilities/r3.html',
    '/portal/category/21459': '/#!/buildings/facilities/r4.html',
    '/portal/content/197185': '/#!/buildings/facilities/r4.html',
    '/portal/category/21457': '/#!/buildings/facilities/r5.html',
    '/portal/content/104777': '/#!/buildings/facilities/r5.html',
    '/portal/category/21477': '/#!/buildings/facilities/r6.html',
    '/portal/content/104662': '/#!/buildings/facilities/r6.html',
    '/portal/category/21490': '/#!/buildings/facilities/r7.html',
    '/portal/content/104855': '/#!/buildings/facilities/r7.html',
    '/portal/category/21502': '/#!/buildings/facilities/r8.html',
    '/portal/content/104722': '/#!/buildings/facilities/r8.html',
    '/portal/category/21519': '/#!/buildings/facilities/r9.html',
    '/portal/content/104709': '/#!/buildings/facilities/r9.html',
    '/portal/category/21251': '/#!/buildings/facilities/r10.html',
    '/portal/content/104795': '/#!/buildings/facilities/r10.html',
    '/portal/category/22431': '/#!/buildings/facilities/r11.html',
    '/portal/content/105037': '/#!/buildings/facilities/r11.html',
    /*'/portal/category/21426':'/#!/category/21426',
	'/portal/content/104759':'/#!/content/104759',
	'/portal/category/21437':'/#!/category/21437',
	'/portal/content/104749':'/#!/content/104749',
	'/portal/category/21446':'/#!/category/21446',
	'/portal/content/104704':'/#!/content/104704',
	'/portal/category/21459':'/#!/category/21459',
	'/portal/content/197185':'/#!/content/197185',
	'/portal/category/21457':'/#!/category/21457',
	'/portal/content/104777':'/#!/content/104777',
	'/portal/category/21477':'/#!/category/21477',
	'/portal/content/104662':'/#!/content/104662',
	'/portal/category/21490':'/#!/category/21490',
	'/portal/content/104855':'/#!/content/104855',
	'/portal/category/21502':'/#!/category/21502',
	'/portal/content/104722':'/#!/content/104722',
	'/portal/category/21519':'/#!/category/21519',
	'/portal/content/104709':'/#!/content/104709',
	'/portal/category/21251':'/#!/category/21251',
	'/portal/content/104795':'/#!/content/104795',
	'/portal/category/21530':'/#!/category/21530',
	'/portal/content/104727':'/#!/content/104727',*/
    '/portal/content/101490': '/#!/content/101490',
    '/portal/category/22396': '/#!/category/22396',
    '/portal/content/104866': '/#!/content/104866',
    '/portal/category/22380': '/#!/category/22380',
    '/portal/content/104730': '/#!/content/104730',
    '/portal/category/21491': '/#!/category/21491',
    '/portal/content/104767': '/#!/content/104767',
    '/portal/category/22381': '/#!/category/22381',
    '/portal/content/104731': '/#!/content/104731',
    '/portal/category/21503': '/#!/category/21503',
    '/portal/content/105001': '/#!/content/105001',
    '/portal/category/22232': '/#!/category/22232',
    '/portal/content/104957': '/#!/content/104957',
    '/portal/content/132543': '/#!/content/132543',
    '/portal/category/22431': '/#!/category/22431',
    '/portal/content/105037': '/#!/content/105037',
    '/portal/content/101492': '/#!/content/101492',
    '/portal/content/101493': '/#!/content/101493',
    '/portal/category/22382': '/#!/category/22382',
    '/portal/content/104732': '/#!/content/104732',
    '/portal/category/22397': '/#!/category/22397',
    '/portal/content/104867': '/#!/content/104867',
    '/portal/category/21464': '/#!/category/21464',
    '/portal/content/104993': '/#!/content/104993',
    '/portal/category/21465': '/#!/category/21465',
    '/portal/content/105042': '/#!/content/105042',
    '/portal/category/21478': '/#!/category/21478',
    //'/portal/category/104862':'/#!/category/104862',
    '/portal/category/21479': '/#!/category/21479',
    '/portal/content/104863': '/#!/content/104863',
    '/portal/content/101494': '/#!/content/101494',
    '/portal/category/21492': '/#!/category/21492',
    '/portal/content/104765': '/#!/content/104765',
    '/portal/category/22233': '/#!/category/22233',
    '/portal/content/104958': '/#!/content/104958',
    '/portal/content/132547': '/#!/content/132547',
    '/portal/category/22432': '/#!/category/22432',
    '/portal/content/105038': '/#!/content/105038',
    '/portal/category/22234': '/#!/category/22234',
    '/portal/content/104959': '/#!/content/104959',
    '/portal/category/21458': '/#!/category/21458',
    '/portal/content/105041': '/#!/content/105041',
    '/portal/category/21466': '/#!/category/21466',
    '/portal/content/104799': '/#!/content/104799',
    '/portal/content/101495': '/#!/content/101495',
    '/portal/category/21480': '/#!/category/21480',
    '/portal/content/104861': '/#!/content/104861',
    '/portal/category/21507': '/#!/category/21507',
    '/portal/content/104744': '/#!/content/104744',
    '/portal/category/21481': '/#!/category/21481',
    '/portal/content/104864': '/#!/content/104864',
    '/portal/category/22383': '/#!/category/22383',
    '/portal/content/104733': '/#!/content/104733',
    '/portal/category/22235': '/#!/category/22235',
    '/portal/category/22255': '/#!/category/22255',
    '/portal/content/104787': '/#!/content/104787',
    '/portal/content/132551': '/#!/content/132551',
    '/portal/category/21493': '/#!/category/21493',
    '/portal/content/104768': '/#!/content/104768',
    '/portal/category/22256': '/#!/category/22256',
    '/portal/content/104784': '/#!/content/104784',
    '/portal/content/101496': '/#!/content/101496',
    '/portal/category/22363': '/#!/category/22363',
    '/portal/content/104745': '/#!/content/104745',
    '/portal/category/21467': '/#!/category/21467',
    '/portal/content/104898': '/#!/content/104898',
    '/portal/category/21494': '/#!/category/21494',
    '/portal/content/104766': '/#!/content/104766',
    '/portal/category/22398': '/#!/category/22398',
    '/portal/content/104868': '/#!/content/104868',
    '/portal/content/132559': '/#!/content/132559',
    '/portal/category/22258': '/#!/category/22258',
    '/portal/content/104785': '/#!/content/104785',
    '/portal/category/21427': '/#!/category/21427',
    '/portal/content/101497': '/#!/content/101497',
    '/portal/category/22364': '/#!/category/22364',
    '/portal/content/104746': '/#!/content/104746',
    '/portal/content/101498': '/#!/content/101498',
    '/portal/category/21497': '/#!/category/21497',
    '/portal/content/104769': '/#!/content/104769',
    '/portal/category/22259': '/#!/category/22259',
    '/portal/content/104786': '/#!/content/104786',
    '/portal/category/21509': '/#!/category/21509',
    '/portal/content/104747': '/#!/content/104747',
    '/portal/category/22238': '/#!/category/22238',
    '/portal/content/132555': '/#!/content/132555',
    '/portal/category/22433': '/#!/category/22433',
    '/portal/content/121809': '/#!/content/121809',
    '/portal/category/22399': '/#!/category/22399',
    '/portal/content/104869': '/#!/content/104869',
    '/portal/content/132563': '/#!/content/132563',
    '/portal/category/21468': '/#!/category/21468',
    '/portal/content/104798': '/#!/content/104798',
    '/portal/category/21510': '/#!/category/21510',
    '/portal/content/104748': '/#!/content/104748',
    '/portal/content/104494': '/#!/buildings/child-care/',
    '/portal/category/21987': '/#!/buildings/child-care/',
    '/portal/content/101933': '/#!/content/101933',
    '/portal/content/100876': '/#!/content/100876',
    '/portal/content/101934': '/#!/content/101934',
    '/portal/content/101935': '/#!/content/101935',
    '/portal/content/101936': '/#!/content/101936',
    '/portal/content/101937': '/#!/content/101937',
    '/portal/content/101938': '/#!/content/101938',
    '/portal/content/101939': '/#!/content/101939',
    '/portal/content/101940': '/#!/content/101940',
    '/portal/content/101941': '/#!/content/101941',
    '/portal/content/101942': '/#!/content/101942',
    '/portal/category/26760': '/#!/buy-sell/how-to-buy/',
    '/portal/content/105343': '/#!/buy-sell/how-to-buy/',
    '/portal/category/26759': '/#!/buy-sell/how-to-sell/',
    '/portal/content/105344': '/#!/buy-sell/how-to-sell/',
    '/portal/category/100611': '/#!/buy-sell/schedules-contracts/',
    '/portal/content/197989': '/#!/buy-sell/schedules-contracts/',
    '/portal/content/196585': '/#!/buy-sell/list-schedules/',
    '/portal/content/103476': '/#!/buy-sell/small-business/',
    '/portal/category/21220': '/#!/regulations/',
    '/portal/content/104647': '/#!/regulations/',
    'staffDirectory/searchStaffDirectory': '/#!/about-gsa/contact-gsa/',
    '/portal/content/116609': '/#!/privacy/',

    //ADDED 6-10-13
    '/portal/content/104223': '/#!/travel/fleet/',
    '/portal/category/21211': '/#!/travel/fleet/',
    '/portal/content/104624': '/#!/travel/fleet/',
    '/portal/category/26429': '/#!/travel/resources.html',
    '/portal/content/105307': '/#!/travel/resources.html',
    '/portal/content/104419': '/#!/travel/resources/fedrooms.html',
    '/portal/content/104208': '/#!/travel/resources/faq.html',
    '/portal/content/110081': '/#!/buildings/index.html',
    '/portal/content/104862': '/#!/content/104862'
};