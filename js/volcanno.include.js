"use strict";
/*
 * PIXEL INDUSTRY INCLUDE FILE
 * 
 * Includes functions necessary for proper theme work and some helper functions.
 * 
 */


/**
 * Function for converting to SVG
 * @param void
 * @return void
 */

function convertToSVG() {
    jQuery(".svg-animate").each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr("id");
        var imgClass = $img.attr("class");
        var imgURL = $img.attr("src");

        jQuery.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find("svg");

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== "undefined") {
                $svg = $svg.attr("id", imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== "undefined") {
                $svg = $svg.attr("class", imgClass + " replaced-svg");
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr("xmlns:a");

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, "xml");

    });
}

/**
 * Master slider blog - placing navigation buttons inside of pi-container
 * 
 * @returns void
 */
function blogSliderNavPosition() {
    var blogSliderPrevArrow = jQuery("#masterslider-blog .ms-nav-prev");

    var blogSliderNextArrow = jQuery("#masterslider-blog .ms-nav-next");
    var blogSliderContentContainer = jQuery(".master-slider.with-inner-nav .pi-container");
    var piContainerHeight = blogSliderContentContainer.height();
    var piContainerPosition = blogSliderContentContainer.position();
    var navPrevArrow = blogSliderPrevArrow.height();
    var navNextArrow = blogSliderNextArrow.height();
    jQuery("#masterslider-blog .ms-nav-prev, #masterslider-blog .ms-nav-next").css("height", piContainerHeight / 2);
    blogSliderPrevArrow.css("top", (piContainerPosition.top + piContainerHeight) - navPrevArrow);
    blogSliderNextArrow.css("top", (piContainerPosition.top + piContainerHeight - 2) - navNextArrow * 2);
}

/**
 * Runs on load only
 */

jQuery(window).on("load", function () {

    // convertToSVG init
    convertToSVG()

    jQuery("#loading-status").delay(500).fadeOut();
    jQuery("#loader").delay(1000).fadeOut("slow");
    setTimeout(function () {
        VolcannoInclude.triggerAnimation();
    }, 1000);


    // Read more animated button - width calculation
    var moreBtnWidth = jQuery(".more-btn").width();

    jQuery(".more-btn.btn-animated-hidden").css("left", -moreBtnWidth + 8);
    if (jQuery(".master-slider").hasClass("with-inner-nav")) {
        setTimeout(function () {
            blogSliderNavPosition();
        }, 1000);
    }
});

jQuery(window).on("resize", function () {
    if (jQuery(".master-slider").hasClass("with-inner-nav")) {
        blogSliderNavPosition();
    }
});

/**
 * Runs on both load and resize
 */
jQuery(window).on("load resize", function () {

    if (
            ((navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/iPad/i) !== null)
                    || (navigator.userAgent.match(/iPhone/i)) && (navigator.userAgent.match(/iPhone/i) !== null)
                    || (navigator.userAgent.match(/Android/i)) && (navigator.userAgent.match(/Android/i) !== null)
                    || (navigator.userAgent.match(/BlackBerry/i)) && (navigator.userAgent.match(/BlackBerry/i) !== null)
                    || (navigator.userAgent.match(/iemobile/i)) && (navigator.userAgent.match(/iemobile/i) !== null)
                    ) && (VolcannoInclude.isTouchDevice())
            )
    {
        jQuery(".more-btn.btn-animated-hidden").addClass("more-touch");
    }
    else {
        jQuery(".more-btn.btn-animated-hidden").removeClass("more-touch");
    }


    /**
     * Navigation
     */

    var windowWidth = jQuery(window).width(),
            dropdownItem = jQuery(".navbar-nav > li.dropdown");
    if (!VolcannoInclude.isTouchDevice() && (windowWidth >= 991)) {
        dropdownItem.addClass("hover");
    } else {
        dropdownItem.removeClass("hover");
    }

});


(jQuery)(function ($) {

    /**
     * Search animation
     */
    if (!VolcannoInclude.isTouchDevice() || jQuery(".header-wrapper").hasClass("header-style-03") || (jQuery(window).width() > 992) && VolcannoInclude.isTouchDevice()) {
        jQuery("#header").on("click", "#search", function (e) {
            e.preventDefault();

            jQuery(this).find("#m_search").slideDown(200).focus();
        });

        jQuery("#m_search").focusout(function (e) {
            jQuery(e.target).slideUp();
        });
    }

    /**
     * Subnavigation
     */
    (function () {

        jQuery("ul.dropdown-menu [data-toggle=dropdown]").on("click", function (event) {
            // Avoid following the href location when clicking
            event.preventDefault();
            // Avoid having the menu to close when clicking
            event.stopPropagation();
            // If a menu is already open we close it
            jQuery(this).closest(".dropdown-submenu").toggleClass("open");
            console.log("dropdown");
        });
    })();

    /**
     * Set footer as static if there isn't enough content
     */
    if (jQuery(window).height() > jQuery('body').height()) {
        jQuery('#footer-wrapper').addClass('static');
    }
    
    /**
     * Content tabs
     */
    (function () {
        jQuery(".tabs").each(function () {
            var $tabLis = jQuery(this).find("li");
            var $tabContent = jQuery(this).next(".tab-content-wrap").find(".tab-content");

            $tabContent.hide();
            $tabLis.first().addClass("active").show();
            $tabContent.first().show();
        });

        jQuery(".tabs").on("click", "li", function (e) {
            var $this = jQuery(this);
            var parentUL = $this.parent();
            var tabContent = parentUL.next(".tab-content-wrap");

            parentUL.children().removeClass("active");
            $this.addClass("active");

            tabContent.find(".tab-content").hide();
            var showById = jQuery($this.find("a").attr("href"));
            tabContent.find(showById).fadeIn();

            e.preventDefault();
        });
    })();

    // Init scripts on page load
    VolcannoInclude.init();

});

var VolcannoInclude = {
    /**
     * Init function
     * @param void
     * @return void
     */
    init: function () {
        VolcannoInclude.scrollToTop();
        VolcannoInclude.smoothScroll();
        VolcannoInclude.placeholderFix();
        VolcannoInclude.hamburgerToggle();


        if (jQuery("#gallery-items").length) {
            VolcannoInclude.gallery();
        }
        if (jQuery(".btn-slide-down").length) {
            VolcannoInclude.slideDown();
        }

        if ((!VolcannoInclude.isTouchDevice() || !VolcannoInclude.isIOSDevice()) || ((VolcannoInclude.isTouchDevice() || VolcannoInclude.isIOSDevice()) && jQuery(window).width() > 991)) {
            jQuery(window).on("load resize", function () {
                var window_y = jQuery(document).scrollTop();
                if (window_y > 0) {
                    VolcannoInclude.setStaticHeader(window_y);
                }
            });

            var header_height_top_bar = jQuery(".header-wrapper.header-transparent .top-bar-wrapper").outerHeight();

            if (jQuery(".header-wrapper.header-transparent").next().hasClass("page-title")) {
                jQuery(".header-wrapper.header-transparent").next().css("margin-top", header_height_top_bar);
            }

            jQuery(window).scroll(function () {
                var position = jQuery(this).scrollTop();
                VolcannoInclude.setStaticHeader(position);
            });
        }

    },
    /**
     * Set static header
     * @param position
     * @return void
     */
    setStaticHeader: function (position) {
        var header_height = jQuery(".header-wrapper.header-transparent").height();
        var top_bar_height = jQuery(".top-bar-wrapper").outerHeight();

        if (position > header_height) {
            jQuery(".header-wrapper.header-transparent").addClass("solid-color");
        } else {
            jQuery(".header-wrapper.header-transparent").removeClass("solid-color");
        }

        if (position > header_height) {

            jQuery(".header-wrapper").stop().animate({
                top: -top_bar_height
            }, 30);
        } else {
            jQuery(".header-wrapper").stop().animate({
                top: "0px"
            }, 30);
        }
    },
    /**
     * Trigger animation function
     */
    triggerAnimation: function () {
        if (!VolcannoInclude.isTouchDevice()) {

            // ANIMATED CONTENT
            if (jQuery(".animated")[0]) {
                jQuery(".animated").css("opacity", "0");
            }

            var currentRow = -1;
            var counter = 1;

            jQuery(".triggerAnimation").waypoint(function () {
                var $this = jQuery(this);
                var rowIndex = jQuery(".row").index(jQuery(this).closest(".row"));
                if (rowIndex !== currentRow) {
                    currentRow = rowIndex;
                    jQuery(".row").eq(rowIndex).find(".triggerAnimation").each(function (i, val) {
                        var element = jQuery(this);
                        setTimeout(function () {
                            var animation = element.attr("data-animate");
                            element.css("opacity", "1");
                            element.addClass("animated " + animation);
                        }, (i * 500));
                    });

                }

                //counter++;

            },
                    {
                        offset: "80%",
                        triggerOnce: true
                    }
            );
        }
    },
    /**
     * Contact forms AJAX submit
     * @param id
     * @return data
     */
    contactFormAjax: function (id) {
        // Show recaptcha on form click
        jQuery("form").on("click", function (event) {
            jQuery(".g-recaptcha", this).addClass("recaptcha-visible");
        });
        // Forms
        switch (id) {
            // Contact us form
            case "contact-us":

                jQuery(".wpcf7-submit").on("click", function (event) {
                    event.preventDefault();

                    var action = jQuery('input[name="action"]').val(id);

                    var form = jQuery(event.target).closest("form");
                    var inputFields = form.find('input:not([type="submit"])');
                    var textArea = form.find(".wpcf7-textarea");

                    var data = new FormData(form[0]);

                    jQuery.ajax({
                        type: "POST",
                        url: "contact.php",
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: data
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            inputFields.each(function (index, el) {
                                jQuery(this).val("");
                            });

                            textArea.each(function (index, el) {
                                jQuery(this).val("");
                            });

                            grecaptcha.reset();
                        }
                        alert(data);
                    });
                });
                break;

            case "comment-form":

                jQuery(".wpcf7-submit").on("click", function (event) {
                    event.preventDefault();

                    var action = jQuery('input[name="action"]').val(id);

                    var form = jQuery(event.target).closest("form");
                    var inputFields = form.find('input:not([type="submit"])');
                    var textArea = form.find(".wpcf7-textarea");

                    var data = new FormData(form[0]);

                    jQuery.ajax({
                        type: "POST",
                        url: "contact.php",
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: data
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            inputFields.each(function (index, el) {
                                jQuery(this).val("");
                            });

                            textArea.each(function (index, el) {
                                jQuery(this).val("");
                            });

                            grecaptcha.reset();
                        }
                        alert(data);
                    });
                });
                break;

                // Newsletter form
            case "newsletter":
                jQuery(".newsletter .submit").on("click", function (event) {
                    event.preventDefault();
                    var action = jQuery('input[name="action"]').val(id);

                    var form = jQuery(event.target).closest("form");
                    var inputFields = form.find('input:not([type="submit"])');

                    var data = new FormData(form[0]);

                    jQuery.ajax({
                        type: "POST",
                        url: "contact.php",
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: data
                    }).done(function (data) {
                        if (data === "Message sent succesfully.") {
                            inputFields.each(function (index, el) {
                                jQuery(this).val("");
                            });

                        }
                        alert(data);
                    });
                });
                break;

            default:
                // statements_def
                break;
        }
    },
    /**
     * Function to check is user is on touch device
     * @param void
     * @return bool
     */
    isTouchDevice: function () {
        return Modernizr.touch;
    },
    /**
     * Function to check is user is on iOS Device
     * @param void
     * @return bool
     */
    isIOSDevice: function () {
        if (
                (navigator.userAgent.match(/iPad/i)) && (navigator.userAgent.match(/iPad/i) !== null)
                || (navigator.userAgent.match(/iPhone/i)) && (navigator.userAgent.match(/iPhone/i) !== null)
                || (navigator.userAgent.match(/Android/i)) && (navigator.userAgent.match(/Android/i) !== null)
                || (navigator.userAgent.match(/BlackBerry/i)) && (navigator.userAgent.match(/BlackBerry/i) !== null)
                || (navigator.userAgent.match(/iemobile/i)) && (navigator.userAgent.match(/iemobile/i) !== null)
                )
        {
            return true;
        } else {
            return false;
        }
    },
    /**
     * Function for scrool to top
     * @param void
     * @return void
     */
    scrollToTop: function () {
        var scrollUp = jQuery(".scroll-up");
        jQuery(window).scroll(function () {
            if (jQuery(this).scrollTop() > 100) {
                scrollUp.removeClass('hide-scroll').addClass('show-scroll');
            } else {
                scrollUp.removeClass('show-scroll').addClass('hide-scroll');
            }
        });

        scrollUp.on("click", function () {
            jQuery("html, body").animate({
                scrollTop: 0
            }, 600, jQuery.bez([1, 0, 0, 1]));
            return false;
        });
    },
    /**
     * Slide down to the next section
     * @param void
     * @return void
     */
    slideDown: function () {
        jQuery('.btn-slide-down').on("click", function (e) {
            jQuery('html,body').animate({
                scrollTop: jQuery(this.hash).offset().top - 150
            }, 800);

            return false;

            e.preventDefault();
        });
    },
    /**
     * Function for smooth scroll
     * @param void
     * @return void
     */
    smoothScroll: function () {
        var $window = jQuery(window);        //Window object
        var scrollTime = 0.5;           //Scroll time
        var scrollDistance = 380;       //Distance. Use smaller value for shorter scroll and greater value for longer scroll

        $window.on("mousewheel DOMMouseScroll", function (event) {

            event.preventDefault();

            var delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
            var scrollTop = $window.scrollTop();
            var finalScroll = scrollTop - parseInt(delta * scrollDistance);

            TweenMax.to($window, scrollTime, {
                scrollTo: {y: finalScroll, autoKill: true},
                ease: Power1.easeOut, //For more easing functions see http://api.greensock.com/js/com/greensock/easing/package-detail.html
                autoKill: true,
                overwrite: 5
            });
        });
    },
    /**
     * Function for old browsers placeholder fix
     * 
     * @returns void
     */
    placeholderFix: function () {
        jQuery("input, textarea").placeholder();
    },
    /**
     * Instagram stream
     * 
     * @returns void
     */
    instagramStream: function () {
        // INSTAGRAM STREAM START 
        jQuery('.instagram-stream').instagramstream({
            limit: 8, // number of images to fetch
            username: 'pixelindustrythemes_resources', // your username
            overlay: true, // add overlay layer of hover effect
            textContainer: '', // default: '.is-text', pass jQuery object or selector
            textPosition: '', // place that at this position
            textSize: '', // size of text e.g. 1 - has size like one image; 2 - has size of two images etc.
            imageQuality: 'standard', // standard | low | thumbnail; standard: 640 x 640px; low: 320 x 320px; thumbnail: 150 x 150px
            accessToken: '4535594042.407e0cd.22af940ed17347f5bebc30c12ece3281' // your access token
        });
    },
    /**
     * Function for countdown animation
     * @param void
     * @return void
     */
    counterInit: function () {
        jQuery('#events-single').county({
            endDateTime: new Date('2018/12/27 10:00:00'),
            reflection: false,
            animation: 'scroll'
        });
    },
    /**
     * Function for facebook share plugin init
     * @param void
     * @return void
     */
    sharrreFacebookInit: function () {
        jQuery('.sharrre-facebook').sharrre({
            share: {
                facebook: true
            },
            enableHover: false,
            enableTracking: true,
            template: '<a class="box" href="#"><div class="share"><span></span></div></a>',
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('facebook');
            }
        });
    },
    /**
     * Function for facebook share plugin init
     * @param void
     * @return void
     */
    sharrreTwitterInit: function () {
        jQuery('.sharrre-twitter').sharrre({
            share: {
                facebook: true
            },
            enableHover: false,
            enableTracking: true,
            template: '<a class="box" href="#"><div class="share"><span></span></div></a>',
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('twitter');
            }
        });
    },
    /**
     * Function for facebook share plugin init
     * @param void
     * @return void
     */
    sharrreGooglePlusInit: function () {
        jQuery('.sharrre-google-plus').sharrre({
            share: {
                facebook: true
            },
            enableHover: false,
            enableTracking: true,
            template: '<a class="box" href="#"><div class="share"><span></span></div></a>',
            click: function (api, options) {
                api.simulateClick();
                api.openPopup('googlePlus');
            }
        });
    },
    /**
     * Function for Master Slider initialisation
     * @param id
     * @return void
     */
    masterSliderInit: function (id) {
        switch (id) {
            case "masterslider-artist":
                var slider = new MasterSlider();
                slider.setup("masterslider-artist", {
                    width: 1140, // slider standard width
                    height: 950, // slider standard height
                    space: 0,
                    speed: 30,
                    layout: "fullscreen",
                    centerControls: false,
                    loop: false,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                // adds navigation control to the custom tabs.
                jQuery(".master-slider-custom-nav li").on("click", function () {
                    var customNavTab = jQuery(".master-slider-custom-nav li");
                    var clickedTab = customNavTab.index(this); // get ordinal number of clicked item
                    slider.api.gotoSlide(clickedTab++); // go to the matching slide

                    jQuery(this).addClass("active"); // add active class to the clicked tab
                    jQuery(this).siblings().removeClass("active"); // remove active class from any other tab
                });
                jQuery(".master-slider-custom-nav li:first-child").addClass("active"); // first tab has the active class
                var masterSliderHeight = jQuery(".master-slider-custom-nav").closest(".master-slider").height(); // get the height of slider
                jQuery(".master-slider-custom-nav").css("width", masterSliderHeight); // custom navigation container has width of the slider's height

                break;
            case "masterslider-band":
                var slider = new MasterSlider();
                slider.setup("masterslider-band", {
                    width: 1140, // slider standard width
                    height: 1000, // slider standard height
                    space: 0,
                    speed: 30,
                    layout: "fullscreen",
                    centerControls: false,
                    loop: false,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                break;
            case "masterslider-blog":
                var slider = new MasterSlider();
                slider.setup("masterslider-blog", {
                    width: 1920, // slider standard width
                    height: 1000, // slider standard height
                    space: 0,
                    speed: 30,
                    layout: "fullscreen",
                    centerControls: true,
                    loop: false,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });

                slider.control("arrows", {autohide: false});

                break;
            case "masterslider-store":
                var slider = new MasterSlider();
                slider.setup("masterslider-store", {
                    width: 1140, // slider standard width
                    height: 700, // slider standard height
                    space: 0,
                    speed: 30,
                    layout: "fullwidth",
                    centerControls: false,
                    loop: false,
                    autoplay: false
                            // more slider options goes here...
                            // check slider options section in documentation for more options.
                });
                break;
            default:
                // statements_def
                break;
        }
    },
    isotopeReviews: function () {
        // init Isotope
        var $grid = jQuery('.reviews-grid').isotope({
            itemSelector: '.isotope-item',
            percentPosition: true,
            layoutMode: 'fitRows'

        });
        // layout Isotope after each image loads
        $grid.imagesLoaded().progress(function () {
            $grid.isotope('layout');
        });

        // filter functions
        var filterFns = {
        };
        // bind filter button click
        jQuery('.filters-button-group').on('click', '.filter-button', function () {
            var filterValue = jQuery(this).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[ filterValue ] || filterValue;
            $grid.isotope({filter: filterValue});
        });
        // change is-checked class on buttons
        jQuery('.button-group').each(function (i, buttonGroup) {
            var $buttonGroup = jQuery(buttonGroup);
            $buttonGroup.on('click', '.filter-button', function () {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                jQuery(this).addClass('is-checked');
            });
        });
    },
    /**
     * forEach implementation for Objects/NodeLists/Arrays, automatic type loops and context options
     *
     * @private
     * @author Todd Motto
     * @link https://github.com/toddmotto/foreach
     * @param {Array|Object|NodeList} collection - Collection of items to iterate, could be an Array, Object or NodeList
     * @callback requestCallback      callback   - Callback function for each iteration.
     * @param {Array|Object|NodeList} scope=null - Object/NodeList/Array that forEach is iterating over, to use as the this value when executing callback.
     * @returns void
     */

    hamburgerToggle: function () {

        var forEach = function (t, o, r) {
            if ("[object Object]" === Object.prototype.toString.call(t))
                for (var c in t)
                    Object.prototype.hasOwnProperty.call(t, c) && o.call(r, t[c], c, t);
            else
                for (var e = 0, l = t.length; l > e; e++)
                    o.call(r, t[e], e, t)
        };

        var hamburgers = document.querySelectorAll(".hamburger");
        if (hamburgers.length > 0) {
            forEach(hamburgers, function (hamburger) {
                hamburger.addEventListener("click", function () {
                    this.classList.toggle("is-active");
                }, false);
            });
        }
    },
    /**
     * Function for manific popup initialisation
     * @param id
     * @return void
     */
    magnificPopupInit: function (id) {
        switch (id) {
            // Portfolio gallery
            case "gallery-items":
                //PORTFOLIO IMAGE LIGHTBOX
                jQuery('.gallery-trigger').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                });
                // VIDEO POST
                jQuery('.video-post-trigger').magnificPopup({
                    type: 'iframe',
                    iframe: {
                        markup: '<div class="mfp-iframe-scaler">' +
                                '<div class="mfp-close"></div>' +
                                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                                '</div>'
                    }
                });
                break;

            case "video-item":

                // VIDEO POST
                jQuery('.video-item-trigger').magnificPopup({
                    type: 'iframe',
                    iframe: {
                        markup: '<div class="mfp-iframe-scaler">' +
                                '<div class="mfp-close"></div>' +
                                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                                '</div>'
                    }
                });
                break;
            case "newsletter-popup":

                jQuery('.newsletter-popup-trigger').magnificPopup({
                    type: 'inline'
                });
                break;
            case "audio-popup":

                jQuery('.listen-audio-popup-trigger').magnificPopup({
                    type: 'inline'
                });
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Function for owl carousel initialisation
     * @param id
     * @return void
     */
    owlCarouselInit: function (id) {
        switch (id) {

            // Testimonial carousel
            case "testimonial-carousel":
                jQuery(".testimonial-carousel").owlCarousel({
                    items: 1,
                    dots: true,
                    nav: false,
                    navText: ['', ''],
                    loop: true,
                    autoplay: true,
                    autoHeight: true,
                    autoplayTimeout: 5000,
                    autoplayHoverPause: true,
                    margin: 0,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        1000: {
                            items: 1
                        }
                    }
                });
                break;
                // Latest posts carousel style 01
            case "latest-posts-carousel-01":
                jQuery(".latest-posts-carousel-01").owlCarousel({
                    items: 3,
                    dots: true,
                    nav: false,
                    navText: ['', ''],
                    margin: 30,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 3
                        }
                    }
                });
                break;
                // Latest posts carousel style 02
            case "latest-posts-carousel-02":
                jQuery(".latest-posts-carousel-02").owlCarousel({
                    items: 2,
                    dots: true,
                    nav: false,
                    navText: ['', ''],
                    margin: 30,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 2
                        }
                    }
                });
                break;
                // Latest posts carousel style 03
            case "latest-posts-carousel-03":
                jQuery(".latest-posts-carousel-03").owlCarousel({
                    items: 3,
                    dots: true,
                    nav: false,
                    navText: ['', ''],
                    margin: 30,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 3
                        }
                    }
                });
                break;

                // Latest portfolio carousel
            case "latest-portfolio-carousel":
                jQuery(".latest-portfolio-carousel").owlCarousel({
                    items: 4,
                    dots: true,
                    nav: false,
                    navText: ['', ''],
                    margin: 30,
                    mouseDrag: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 2
                        },
                        1000: {
                            items: 4
                        }
                    }
                });
                break;
            default:
                // statements_def
                break;
        }
    },
    /**
     * Gallery on touch devices
     * @param void
     * @return void
     */
    gallery: function () {
        // VERFIFY IF USER IS ON TOUCH DEVICE

        if (is_touch_device()) {
            jQuery(".gallery-item-container").on('click', function (e) {
                jQuery(this).find('.mask').show();
            });
        }

        // function to check is user is on touch device
        function is_touch_device() {
            return 'ontouchstart' in window // works on most browsers 
                    || 'onmsgesturechange' in window; // works on ie10
        }
    }
};
