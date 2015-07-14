var root = window.location.href,
    mRoot = root,
    wwwRoot = 'http://dev.oagov.com:3333/portal',
    homePage = '',
    userStats = {},
    loadTimeout;

//ON-READY
if(window.location.href.indexOf('?_escaped_fragment_') === -1){
    $(function() {
        homePage = $('#home').html();
        bindings();
        $(window).resize(function() {
            backToTop();
        });
        emergencyBanner();
        initUserStats();
    });
}

//BINDINGS

function bindings() {

    routie({
        //home page
        '': Router.homePage,
        '!': Router.homePage,
        //backwards compatibility with old links
        //'!*': Router.removeBang,
        '/*': Router.addBang,
        '!/content/*': Router.addPortal,
        //external sources
        '!/portal/*': Router.fullSiteAJAX,
        '!/travel/smartpay*': Router.smartPayAJAX,
        //filesystem
        '!/*': Router.mobileSiteHTML
    });

    $('header button#menu').click(function() {
        $('#slider').toggle().toggleClass('active');
        $(this).toggleClass('active');
        return false;
    });

    $('#slider a').click(function() {
        $('#slider').toggle().toggleClass('active');
        $('header button#menu').toggleClass('active');
    });

    $('#container').on("click", ".accordion-item-title", function() {
        $(this).next('div').toggle();
        $(this).find('i').toggleClass('icon-chevron-down').toggleClass('icon-chevron-up');
        return false;
    }).on("click", ".alert span", function() {
        $(this).parent().remove();
    });

    $('.backToTop button').click(scrollToTop);

    $('#container').on('click', '.additionalTerms', function() {
        $('#additionalTerms').toggle();
        return false;
    });

    $('header #submitIcon').click(function() {
        $('#search_form').submit();
    });

    //SURVEY!
    //$('body').on('click', 'a', satisfactionSurvey);

    //NOW PART OF SURVEY SCRIPT
    $('#fullSite').click(function(){
        $.cookie('gsaMobileForward','www', { expires: 3650, path: '/', domain: '.gsa.gov' });
        window.location.href = wwwRoot;
    });
}



//WINDOW SIZE

function backToTop() {
    var windowHeight = $(window).height(),
        pageHeight = $('#container').height();

    if (pageHeight > (windowHeight * 1.5)) {
        $('.backToTop').show();
    } else {
        $('.backToTop').hide();
    }
}

//NEW ROUTES

var Router = {
    homePage: function() {
        preLoad();
        //console.log('HOMEPAGE\n==========');
        $('#container').html(homePage);
        setTitle('GSA Mobile');
        $('#homepageRFB').rfb();
        clearNav();
        postLoad();
    },

    mobileSiteHTML: function(params) {
        preLoad();
        console.log('MOBILESITEHTML\n==========');
        console.log('PATH TO AJAX= ' + params);
        $('#container').load(mRoot + '/' + params, function(data, textStatus) {
            if (textStatus === "error") {
                loadError();
            }
            highlightNav(params);
            //ANALYTICS REPORTING on production only
            analyticsMeta();
            postLoad(params);
        });
    },

    fullSiteAJAX: function(params) {
        preLoad();
        console.log('FULLSITEAJAX\n==========');
        console.log('PATH TO AJAX= ' + wwwRoot + '/' + params);
        //
        $('#container').load(wwwRoot + '/' + params + ' #content', function(data, textStatus) {
            if (textStatus !== "error") {
                cleanContent();
                cleanLinks('img', 'src');
                cleanLinks('a', 'href');
            } else {
                loadError('Failed to load data from the Full Site at <a href="http://gsa.gov">www.gsa.gov</a>.</div>');
            }
            clearNav();
            postLoad(params);
        });
    },


    smartPayAJAX: function(params) {
        preLoad();
        if(params === '' || params === '/'){
            $('#container').load(mRoot + '/travel/smartpay', function(data, textStatus) {
                if (textStatus === "error") {
                    loadError();
                }
                highlightNav(params);
                analyticsMeta();
                postLoad(params);
            });
        }
        else{
            $('#container').load('http://smartpay.gsa.gov/' + params + '?mobile=1' + ' #docBody', function(data, textStatus) {
                if (textStatus !== "error") {
                    cleanSmartPayContent();
                } else {
                    loadError("We're sorry. The SmartPay server could not be reached. Please try again later.");
                }
                highlightNav(params);
                postLoad(params);
            });
        }
    },
    removeBang: function(params) {
        //console.log('REMOVEBANG\n==========');
        window.location.hash = '#' + params;
    },
    addBang: function(params){
        window.location.hash = '#!/' + params; 
    },
    addPortal: function(params) {
        //console.log('ADDPORTAL\n===========');
        var hash = window.location.hash;
        if (hash.indexOf('content') > -1) {
            window.location.hash = '#' + '/portal/content/' + params;
        } else if (hash.indexOf('category') > -1) {
            window.location.hash = '#' + '/portal/category/' + params;
        }
    }
}

// NEW ROUTER ASSET FUNCTIONS
    function preLoad() {
        loadTimeout = setTimeout(function() {
            $('footer,.footer').hide();
            $('#container').html('');
            $('#load').show();
            //console.log('loadTimeout!')
        }, 500);
    }
    //param needed for survey only
    function postLoad( /*hashURL*/ ) {

        clearTimeout(loadTimeout);
        $('footer,.footer').show();
        $('#load').hide();

        $('#slider').hide().removeClass('active');
        $('#menu').removeClass('active');

        setTitle();

        inPageAjax();

        //SURVEY STYLE (no bueno)
        /*if (hashURL !== undefined) {
            if (hashURL.indexOf('survey') !== -1) {
                $('body').addClass('greyed');
            } else {
                $('body').removeClass('greyed');
            }
        } else {
            $('body').removeClass('greyed');
        }*/

    }

    function loadError(error) {
        $('#container').html('');
        if (!error) {
            var error = "We're Sorry. The content you've requested can not be loaded at this time.";
        }
        var alert = '<div class="alert alert-error" style="margin-bottom:20px;">' + error + '</div>';
        $('#container').prepend(alert);
    }

    function inPageAjax(){
        if($('#container .ajax')){
            $('#container .ajax').each(function(){
                var req = $(this).attr('data-url')+' '+$(this).attr('data-selector');
                $(this).load(req,function(){
                    cleanContent($(this))
                    $(this).removeClass('load');
                })
            })
        }
    }

    function initUserStats() {
        if (!$.cookie('gsaMobileUserStats')) {
            //TRANSFER OVER OLD COOKIE VALUE IF APPLICABLE
            if ($.cookie('gsaMobileSurvey') === 'never' || $.cookie('gsaMobileSurvey') === 'completed') {
                var gsaMobileSurvey = $.cookie('gsaMobileSurvey');
            } else {
                var gsaMobileSurvey = null;
            }

            $.removeCookie('gsaMobileSurvey', {
                path: '/',
                domain: '.gsa.gov'
            });

            //CREATE STAT OBJECT
            userStats = {
                pageViews: 0,
                externalLinks: 0,
                survey: {
                    status: gsaMobileSurvey,
                    counter: 0
                },
                userAgent: navigator.userAgent
            };
        }
        //IF COOKIE EXISTS
        else {
            //READ
            userStats = JSON.parse($.cookie('gsaMobileUserStats'));
        }
        //REPLACES SURVEY STATUS PROPERTY WITH SURVEY OBJECT, if necessary
        if (userStats.surveyStatus !== undefined) {
            var newStatus = userStats.surveyStatus;
            userStats.survey = {
                status: newStatus,
                counter: 0
            };
            delete userStats.surveyStatus;
        }

        userStats.pageViews = userStats.pageViews + 1;
        //WRITE TO COOKIE
        $.cookie('gsaMobileUserStats', JSON.stringify(userStats), {
            expires: 3650,
            path: '/',
            domain: '.gsa.gov'
        });
    }

    /*function satisfactionSurvey() {

        var linkURL = $(this).attr('href');

        //CONFIG

        //Pages before user is asked to participate in survey
        var firstPrompt = 3;
        //Additional pages before user is presented with survey
        var secondPrompt = 10;

        //EXTERNAL LINKS
        if (linkURL.indexOf('#') === -1 && linkURL.indexOf('mailto:') === -1 && linkURL.indexOf('tel:') === -1 && $(this).attr('class') !== 'surveyExempt') {
            userStats.externalLinks = userStats.externalLinks + 1;

            //SET gsaMobileForwardTemp COOKIE FOR ALL FULL SITE LINKS
            if (linkURL.indexOf('gsa.gov') > -1) {
                $.cookie('gsaMobileForwardTemp', 'www', {
                    expires: 3650,
                    path: '/',
                    domain: '.gsa.gov'
                });
            }

            window.open(linkURL);
        }

        //MOBILE PAGE VIEWS
        else if (linkURL.indexOf('#') > -1) {

            userStats.pageViews = userStats.pageViews + 1;
            userStats.survey.counter = userStats.survey.counter + 1;

            if (userStats.survey.counter === firstPrompt && userStats.survey.status !== 'never' && userStats.survey.status !== 'completed') {
                var linkTitle = $(this).text();
                var referTitle = document.title;
                goSatisfaction(linkTitle, linkURL, referTitle, window.location.href);
            } else if (userStats.survey.counter >= firstPrompt + secondPrompt && userStats.survey.status !== 'never' && userStats.survey.status !== 'completed') {
                var linkTitle = $(this).text();
                var referTitle = document.title;
                goSatisfaction(linkTitle, linkURL, referTitle, window.location.href);
            } else {
                window.location.href = linkURL;
            }
        }

        //OTHER
        else {
            window.location.href = linkURL;
        }

        $.cookie('gsaMobileUserStats', JSON.stringify(userStats), {
            expires: 3650,
            path: '/',
            domain: '.gsa.gov'
        });

        return false;
    }*/

    function scrollToTop() {
        $('html, body').animate({
            scrollTop: $('body').offset().top
        }, 1);
    }

    function setTitle(custom) {
        if (custom === undefined) {
            var title = $('#container h1:first-child').text();
            if (title.length > 0) {
                document.title = title + ' - GSA Mobile';
            } else {
                document.title = 'GSA Mobile';
            }
        } else {
            document.title = custom;
        }
    }

    function clearNav() {
        $('#tabs a').removeClass('active');
    }

    function highlightNav(hashURL) {
        console.log(hashURL)
        $('#tabs a').removeClass('active');
        if (hashURL.indexOf('travel') > -1) {
            $('#tabs a.travel').addClass('active');
        }
        if (hashURL.indexOf('buildings') > -1) {
            $('#tabs a.buildings').addClass('active');
        }
        if (hashURL.indexOf('buy-sell') > -1) {
            $('#tabs a.buy-sell').addClass('active');
        }
        if (hashURL.indexOf('regulations') > -1) {
            $('#tabs a.regulations').addClass('active');
        }
        if (hashURL.indexOf('about-gsa') > -1) {
            $('#tabs a.about-gsa').addClass('active');
        }
    }

    function cleanContent($obj){
        if(!$obj){
            var $obj = $('#container')
        }
        $obj.find('*[style]').removeAttr('style');
        $obj.find('img').removeAttr('align');
        $obj.find('script,#container span.stylesheet').remove();
        $obj.find('table').addClass('table');

        $obj.find('.Subtitle').each(function() {
            var pHeadline = $(this).html();
            $(this).replaceWith('<h3>' + pHeadline + '</h3>');
        });

        $obj.find('> div').addClass('ajaxed');
        $obj.find('a[href*="#"]').remove();

        $obj.find('li span:empty').parents('ul').remove();
        $obj.find('li:empty').remove();
        $obj.find('a').attr('target', '_blank');
        $obj.find('table').attr('border', '0');
        $obj.find('h1,h2,h3,h4,h5,h6').filter(function() {
            return $.trim($(this).text()) === '' && $(this).children().length === 0;
        }).remove();

        $obj.find('.SectionTitle').each(function() {
            var sectionTitle = $(this).html();
            $(this).replaceWith('<h4>' + sectionTitle + '</h4>');
        });
        responsiveTables($obj)
    }

    function responsiveTables($obj){
        $obj.find('table').each(function(){
            $(this).addClass('table-responsive');
            var $parentTable = $(this);
            $(this).find('td').each(function(i){
                var col = $(this).parent().children().index($(this));
                var header = $parentTable.find('th').eq(col).text();
                $(this).attr('data-header',header);
            });
        });
    }

    function cleanSmartPayContent() {
        var smartPayContent = $('table td:first-child').html();
        $('table').remove();
        $('h2').after('<div class="smartPayContent">' + smartPayContent + '</div>');
    }

    function cleanLinks(element, attr) {
        $('#container ' + element).each(function() {
            if($(this).attr(attr)){
                var linkSrc = $(this).attr(attr);
                if (linkSrc.indexOf(':') > -1) {
                    return false;
                } else {
                    $(this).attr(attr, 'http://gsa.gov' + linkSrc);
                }
            }
        });
    }



    //SURVEY ASSETS
    /*function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function goSatisfaction(linkTitle, linkURL, referTitle, referURL) {

        var linkTitle = linkTitle.replace('&', '$');
        var referTitle = referTitle.replace('&', '$');

        window.location.href = mRoot + '/#!/survey?' + linkTitle + '&' + linkURL + '&' + referTitle + '&' + referURL;
    }*/

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //EMERGENCY BANNER PLUGIN 0.2
    /*function emergencyBanner() {
        $('#banner-ER-stage').load('http://dev.m.gsa.gov/portal/content/117474 .banner-feed-wrap', function() {
            var status = $('.banner-ER-status .disGoes').text().toLowerCase();
            if (status === 'active') {
                var ERtitle = $('.banner-ER-title .disGoes').text().toUpperCase();
                var ERcolor = $('.banner-ER-theme-color .disGoes').text().toLowerCase();
                var ERmessage = $('.banner-ER-message .disGoes').text();
                var ERlink = $('.banner-ER-link .disGoes').text();

                if (ERcolor === 'red') {
                    $('header').append('<div class="container"><div id="banner-ER-live" class="alert alert-danger"></div></div>');
                }
                if (ERcolor === 'yellow') {
                    $('header').append('<div class="container"><div id="banner-ER-live" class="alert alert-warning"></div></div>');
                }
                if (ERcolor === 'green') {
                    $('header').append('<div class="container"><div id="banner-ER-live" class="alert alert-success"></div></div>');
                }

                $('#banner-ER-live').append('<h4>' + ERtitle + '</h4><br><p>' + ERmessage + '</p><a class="surveyExempt" href="http://gsa.gov' + ERlink + '">READ MORE&gt;&gt;</a>');

            }
        });
    };*/

function analyticsMeta() {
    if (root === 'http://m.gsa.gov') {
        var cvTitle = $('#container meta[name="title"]').attr('content'),
            cvOrg = $('#container meta[name="organization"]').attr('content'),
            cvProgram = $('#container meta[name="program"]').attr('content');
        if (typeof _gaq != 'undefined') {
            //CUSTOM VARIABLES
            if (cvTitle != (undefined || null || '')) {
                _gaq.push(['_setCustomVar', 1, 'title', cvTitle, 3]);
            }
            if (cvOrg != (undefined || null || '')) {
                _gaq.push(['_setCustomVar', 2, 'organization', cvOrg, 3]);
            }
            if (cvProgram != (undefined || null || '')) {
                _gaq.push(['_setCustomVar', 3, 'program', cvProgram, 3]);
            }
            //TRACK PAGEVIEW
            _gaq.push(['_trackPageview', '/' + window.location.hash]);
        }
    }
}


//RFB PLUGIN 0.9.2
//NOTE: #rfb is not an appropriate id for the wrapper.

(function($) {
    jQuery.fn.rfb = function(settings) {
        var config = {
            rfbchunk: '192869'
        };
        if (settings) {
            $.extend(config, settings);
        }
        return this.each(function() {
            $(this).addClass('rfb well').load(wwwRoot + '/rfbchunk/' + config.rfbchunk, function(data, textStatus) {
                if (textStatus !== "error") {
                    $('#screenreader').remove();
                    $('#rfb').addClass('swipe rfb');
                    $('#rfb ul').addClass('swipe-wrap');
                    $('#rfb .navigation,#rfb .contentBG,#rfb p').remove();
                    $('#rfb h2,.slides').unwrap();
                    $('#rfb h2').each(function() {
                        var a = $(this).prev(),
                            text = $(this).children('a').text();
                        a.append('<h5>' + text + '</h5>');
                        $(this).remove();
                    });
                    $('#rfb .slides li').removeAttr('style').removeClass('slide');
                    $('#rfb .slides').removeClass('slides');
                    $('#rfb a').attr('target', '_blank');
                    window.rfb = new Swipe(document.getElementById('rfb'), {
                        auto: 7000,
                        callback: function(i) {
                            $('#rfb nav li.on').removeClass('on');
                            $('#rfb nav li:eq(' + i + ')').addClass('on');
                        }
                    });
                    var nav = '<nav><ul id="position"></ul></nav>';
                    var slides = window.rfb.getNumSlides();
                    $('#rfb').append(nav);
                    for (var i = 1; i <= slides; i++) {
                        $('#rfb nav ul').append('<li></li>');
                    }
                    $('#rfb nav ul li:first-child').addClass('on');
                    $('#rfb nav ul li').click(function() {
                        var i = $(this).index();
                        window.rfb.slide(i, 400);
                    });
                } else {
                    //var alert = '<div class="alert alert-error" style="margin-bottom:20px;">This content could not be loaded. Please check your internet connection and try again.<span class="close">&#215;</span></div>';
                    //$('.rfb').prepend(alert);
                }
            });
        });
    };
})(jQuery);

//JQUERY.COOKIE.JS 1.3.1

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) {}
    }
    var config = $.cookie = function(key, value, options) {
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }
            value = config.json ? JSON.stringify(value) : String(value);
            return (document.cookie = [config.raw ? key : encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
        }
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));
            if (key && key === name) {
                result = converted(cookie);
                break;
            }
            if (!key) {
                result[name] = converted(cookie);
            }
        }
        return result;
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) !== undefined) {
            $.cookie(key, '', $.extend({}, options, {
                expires: -1
            }));
            return true;
        }
        return false;
    };
}));

//JQUERY HASHCHANGE

(function($, e, b) {
    var c = "hashchange",
        h = document,
        f, g = $.event.special,
        i = h.documentMode,
        d = "on" + c in e && (i === b || i > 7);

    function a(j) {
        j = j || location.href;
        return "#" + j.replace(/^[^#]*#?(.*)$/, "$1")
    }
    $.fn[c] = function(j) {
        return j ? this.bind(c, j) : this.trigger(c)
    };
    $.fn[c].delay = 50;
    g[c] = $.extend(g[c], {
        setup: function() {
            if (d) {
                return false
            }
            $(f.start)
        },
        teardown: function() {
            if (d) {
                return false
            }
            $(f.stop)
        }
    });
    f = (function() {
        var j = {}, p, m = a(),
            k = function(q) {
                return q
            }, l = k,
            o = k;
        j.start = function() {
            p || n()
        };
        j.stop = function() {
            p && clearTimeout(p);
            p = b
        };

        function n() {
            var r = a(),
                q = o(m);
            if (r !== m) {
                l(m = r, q);
                $(e).trigger(c)
            } else {
                if (q !== m) {
                    location.href = location.href.replace(/#.*/, "") + q
                }
            }
            p = setTimeout(n, $.fn[c].delay)
        }
        $.browser.msie && !d && (function() {
            var q, r;
            j.start = function() {
                if (!q) {
                    r = $.fn[c].src;
                    r = r && r + a();
                    q = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
                        r || l(a());
                        n()
                    }).attr("src", r || "javascript:0").insertAfter("body")[0].contentWindow;
                    h.onpropertychange = function() {
                        try {
                            if (event.propertyName === "title") {
                                q.document.title = h.title
                            }
                        } catch (s) {}
                    }
                }
            };
            j.stop = k;
            o = function() {
                return a(q.location.href)
            };
            l = function(v, s) {
                var u = q.document,
                    t = $.fn[c].domain;
                if (v !== s) {
                    u.title = h.title;
                    u.open();
                    t && u.write('<script>document.domain="' + t + '"<\/script>');
                    u.close();
                    q.location.hash = v
                }
            }
        })();
        return j
    })()
})(jQuery, this);

//FeedEk jQuery RSS/ATOM Feed Plugin v1.1.2 (revised)

(function(e) {
    e.fn.FeedEk = function(t) {
        var n = e.extend({
            FeedUrl: "http://rss.cnn.com/rss/edition.rss",
            MaxCount: 5,
            ShowDesc: true,
            ShowPubDate: true,
            CharacterLimit: 0,
            TitleLinkTarget: "_blank",
        }, t);
        var r = e(this).attr("id");
        var i;
        e("#" + r).empty().append('<img src="img/load.gif" />');
        e.ajax({
            url: "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + n.MaxCount + "&output=json&q=" + encodeURIComponent(n.FeedUrl) + "&hl=en&callback=?",
            dataType: "json",
            success: function(t) {
                e("#" + r).empty();
                var s = "";
                e.each(t.responseData.feed.entries, function(e, t) {
                    s += '<a class="accordion-item-title">' + t.title + '<i class="icon-chevron-down"></i></a>';
                    if (n.ShowPubDate) {
                        i = new Date(t.publishedDate);
                        s += '<div class="itemDate">' + i.toLocaleDateString() + "</div>"
                    }
                    if (n.ShowDesc) {
                        if (n.DescCharacterLimit > 0 && t.content.length > n.DescCharacterLimit) {
                            s += '<div class="itemContent">' + t.content.substr(0, n.DescCharacterLimit) + "...</div>"
                        } else {
                            s += "<div>" + t.content + '<br><br><a href="' + t.link + '" target="' + n.TitleLinkTarget + '" ><span class="btn">More Detail</span></a><br></div>'
                        }
                    }
                });
                e("#" + r).append('<div class="simple-accordion">' + s + "</div>", function() {
                    e('font[color=#007fc2]').replaceWith('font[color=#333]')
                })
            }
        })
    }
})(jQuery);