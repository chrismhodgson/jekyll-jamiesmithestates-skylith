/*!-----------------------------------------------------------------
    Name: Skylith - Viral & Creative Multipurpose HTML Template
    Version: 1.0.3
    Author: nK, unvab
    Website: https://nkdev.info/, http://unvab.com/
    Purchase: https://themeforest.net/item/skylith-viral-creative-multipurpose-html-template/21214857?ref=_nK
    Support: https://nk.ticksy.com/
    License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
    Copyright 2018.
-------------------------------------------------------------------*/
    /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*------------------------------------------------------------------

  Utility

-------------------------------------------------------------------*/
var $ = jQuery;
var tween = window.TweenMax;
var isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(navigator.userAgent || navigator.vendor || window.opera);
var isTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;

/**
 * window size
 */
var $wnd = $(window);
var $doc = $(document);
var $body = $('body');
var $html = $('html');
var wndW = 0;
var wndH = 0;
var docH = 0;
function getWndSize() {
    exports.wndW = wndW = $wnd.width();
    exports.wndH = wndH = $wnd.height();
    exports.docH = docH = $doc.height();
}
getWndSize();
$wnd.on('resize load orientationchange', getWndSize);

// add 'is-mobile' or 'is-desktop' classname to html tag
$html.addClass(isMobile ? 'is-mobile' : 'is-desktop');

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout = void 0;
function debounceResized() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        if (resizeArr.length) {
            for (var k = 0; k < resizeArr.length; k++) {
                resizeArr[k]();
            }
        }
    }, 50);
}
$wnd.on('ready load resize orientationchange', debounceResized);
debounceResized();

function debounceResize(func) {
    if (typeof func === 'function') {
        resizeArr.push(func);
    } else {
        window.dispatchEvent(new Event('resize'));
    }
}

/**
 * Throttle scroll
 * thanks: https://jsfiddle.net/mariusc23/s6mLJ/31/
 */
var hideOnScrollList = [];
var didScroll = void 0;
var lastST = 0;

$wnd.on('scroll load resize orientationchange', function () {
    if (hideOnScrollList.length) {
        didScroll = true;
    }
});

function hasScrolled() {
    var ST = $wnd.scrollTop();

    var type = ''; // [up, down, end, start]

    if (ST > lastST) {
        type = 'down';
    } else if (ST < lastST) {
        type = 'up';
    } else {
        type = 'none';
    }

    if (ST === 0) {
        type = 'start';
    } else if (ST >= docH - wndH) {
        type = 'end';
    }

    hideOnScrollList.forEach(function (value) {
        if (typeof value === 'function') {
            value(type, ST, lastST, $wnd);
        }
    });

    lastST = ST;
}

setInterval(function () {
    if (didScroll) {
        didScroll = false;
        window.requestAnimationFrame(hasScrolled);
    }
}, 250);

function throttleScroll(callback) {
    hideOnScrollList.push(callback);
}

/**
 * Body Overflow
 * Thanks https://jsfiddle.net/mariusc23/s6mLJ/31/
 * Usage:
 *    // enable
 *    bodyOverflow(1);
 *
 *    // disable
 *    bodyOverflow(0);
 */
var bodyOverflowEnabled = void 0;
var isBodyOverflowing = void 0;
var scrollbarWidth = void 0;
var originalBodyStyle = void 0;
var $header = $('.nk-header');
var $fullNavbar = $('.nk-navbar-full');
var stopOverflowing = $('.nk-fullpage').length;
function isBodyOverflowed() {
    return bodyOverflowEnabled;
}
function bodyGetScrollbarWidth() {
    // thx d.walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'nk-body-scrollbar-measure';
    $body[0].appendChild(scrollDiv);
    var result = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    $body[0].removeChild(scrollDiv);
    return result;
}
function bodyCheckScrollbar() {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
        // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect();
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    isBodyOverflowing = $body[0].clientWidth < fullWindowWidth;
    scrollbarWidth = bodyGetScrollbarWidth();
}
function bodySetScrollbar() {
    if (typeof originalBodyStyle === 'undefined') {
        originalBodyStyle = $body.attr('style') || '';
    }

    var originalBodyPadding = parseFloat($body.css('padding-right')) || 0;

    if (isBodyOverflowing) {
        $body.css('paddingRight', scrollbarWidth + originalBodyPadding + 'px');
        $header.filter(':not(.nk-header-opaque)').children().add($header.filter('.nk-header-opaque').children('.nk-navbar-fixed')).add($fullNavbar).css('paddingRight', scrollbarWidth + 'px');
    }
}
function bodyResetScrollbar() {
    $body.attr('style', originalBodyStyle);
    $header.children().add($fullNavbar).css('paddingRight', '');
}
function bodyOverflow(enable) {
    if (stopOverflowing) {
        return;
    }

    if (enable && !bodyOverflowEnabled) {
        bodyOverflowEnabled = 1;
        bodyCheckScrollbar();
        bodySetScrollbar();
        $html.css('overflow', 'hidden');
    } else if (!enable && bodyOverflowEnabled) {
        bodyOverflowEnabled = 0;
        $html.css('overflow', '');
        bodyResetScrollbar();
    }
}

/**
 * In Viewport checker
 * return visible percent from 0 to 1
 */
function isInViewport($item, returnRect) {
    var rect = $item[0].getBoundingClientRect();
    var result = 1;

    if (rect.right <= 0 || rect.left >= wndW) {
        result = 0;
    } else if (rect.bottom < 0 && rect.top <= wndH) {
        result = 0;
    } else {
        var beforeTopEnd = Math.max(0, rect.height + rect.top);
        var beforeBottomEnd = Math.max(0, rect.height - (rect.top + rect.height - wndH));
        var afterTop = Math.max(0, -rect.top);
        var beforeBottom = Math.max(0, rect.top + rect.height - wndH);
        if (rect.height < wndH) {
            result = 1 - (afterTop || beforeBottom) / rect.height;
        } else if (beforeTopEnd <= wndH) {
            result = beforeTopEnd / wndH;
        } else if (beforeBottomEnd <= wndH) {
            result = beforeBottomEnd / wndH;
        }
        result = result < 0 ? 0 : result;
    }
    if (returnRect) {
        return [result, rect];
    }
    return result;
}

/**
 * Scroll To
 */
function scrollTo($to, callback) {
    var scrollPos = false;
    var speed = this.options.scrollToAnchorSpeed / 1000;

    if ($to === 'top') {
        scrollPos = 0;
    } else if ($to === 'bottom') {
        scrollPos = Math.max(0, docH - wndH);
    } else if (typeof $to === 'number') {
        scrollPos = $to;
    } else {
        scrollPos = $to.offset ? $to.offset().top : false;
    }

    if (scrollPos !== false && $wnd.scrollTop() !== scrollPos) {
        tween.to($wnd, speed, {
            scrollTo: {
                y: scrollPos,

                // disable autokill on iOs (buggy scrolling)
                autoKill: !isIOs
            },
            ease: Power2.easeOut,
            overwrite: 5
        });
        if (callback) {
            tween.delayedCall(speed, callback);
        }
    } else if (typeof callback === 'function') {
        callback();
    }
}

exports.$ = $;
exports.tween = tween;
exports.isIOs = isIOs;
exports.isMobile = isMobile;
exports.isTouch = isTouch;
exports.$wnd = $wnd;
exports.$doc = $doc;
exports.$body = $body;
exports.wndW = wndW;
exports.wndH = wndH;
exports.docH = docH;
exports.debounceResize = debounceResize;
exports.throttleScroll = throttleScroll;
exports.bodyOverflow = bodyOverflow;
exports.isBodyOverflowed = isBodyOverflowed;
exports.isInViewport = isInViewport;
exports.scrollTo = scrollTo;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
var options = {
    enableShortcuts: true,
    scrollToAnchorSpeed: 700,
    parallaxSpeed: 0.8,

    templates: {
        sliderAuthor: 'Author: {{name}}',
        navbarBackItem: 'Back',

        plainVideoIcon: '<span class="nk-video-icon"><span><span class="nk-play-icon"></span></span></span>',
        plainVideoLoadIcon: '<div class="nk-video-icon nk-video-icon-loading"></div>',
        fullscreenVideoClose: '<span class="nk-icon-close"></span>',

        instagram: '<div class="col-3">\n                <a href="{{link}}" target="_blank">\n                    <img src="{{image}}" alt="{{caption}}" class="nk-img-stretch">\n                </a>\n            </div>',
        instagramLoadingText: 'Loading...',
        instagramFailText: 'Failed to fetch data',
        instagramApiPath: 'php/instagram/instagram.php',

        twitter: '<div class="nk-twitter">\n                <span class="nk-twitter-icon fa fa-twitter"></span>\n                <div class="nk-twitter-text">\n                   {{tweet}}\n                </div>\n            </div>',
        twitterLoadingText: 'Loading...',
        twitterFailText: 'Failed to fetch data',
        twitterApiPath: 'php/twitter/tweet.php'
    },

    shortcuts: {
        closeFullscreenVideo: 'esc',

        postScrollToComments: 'c',

        toggleSideLeftNavbar: 'alt+l',
        openSideLeftNavbar: '',
        closeSideLeftNavbar: 'esc',

        toggleSideRightNavbar: 'alt+r',
        openSideRightNavbar: '',
        closeSideRightNavbar: 'esc',

        toggleFullscreenNavbar: 'alt+f',
        openFullscreenNavbar: '',
        closeFullscreenNavbar: 'esc',

        toggleLeftNavbar: 'alt+n',
        openLeftNavbar: '',
        closeLeftNavbar: 'esc'
    }
};

exports.options = options;

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

/* Plugins */


var _options = __webpack_require__(1);

var _utility = __webpack_require__(0);

var _setOptions2 = __webpack_require__(6);

var _shortcuts = __webpack_require__(7);

var _initNavbar2 = __webpack_require__(8);

var _initNavbarSide2 = __webpack_require__(9);

var _initNavbarFullscreen2 = __webpack_require__(10);

var _initNavbarItemsEffect2 = __webpack_require__(11);

var _initNavbarDropEffect3 = __webpack_require__(12);

var _initNavbarDropEffect4 = __webpack_require__(13);

var _initHeaderTitle2 = __webpack_require__(14);

var _initCounters2 = __webpack_require__(15);

var _initAnchors2 = __webpack_require__(16);

var _initVideoBlocks2 = __webpack_require__(17);

var _initFullPage2 = __webpack_require__(18);

var _initHoverImage2 = __webpack_require__(19);

var _initPortfolio2 = __webpack_require__(20);

var _initShop2 = __webpack_require__(21);

var _initStretch2 = __webpack_require__(22);

var _initSlider2 = __webpack_require__(23);

var _initForms2 = __webpack_require__(24);

var _initTeamBlock2 = __webpack_require__(25);

var _initGmaps2 = __webpack_require__(26);

var _initInstagram2 = __webpack_require__(27);

var _initTwitter2 = __webpack_require__(28);

var _initPluginObjectFitImages2 = __webpack_require__(29);

var _initPluginStickySidebar2 = __webpack_require__(30);

var _initPluginNano2 = __webpack_require__(31);

var _initPluginJarallax2 = __webpack_require__(32);

var _initPluginFlickity2 = __webpack_require__(33);

var _initPluginIsotope2 = __webpack_require__(34);

var _initPluginPhotoswipe2 = __webpack_require__(35);

var _initPluginJustifiedGallery2 = __webpack_require__(36);

var _initPluginBootstrap2 = __webpack_require__(37);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*------------------------------------------------------------------

  Skylith Class

-------------------------------------------------------------------*/
var SKYLITH = function () {
    function SKYLITH() {
        _classCallCheck(this, SKYLITH);

        this.options = _options.options;
    }

    _createClass(SKYLITH, [{
        key: 'init',
        value: function init() {
            // prt:sc:dm

            var self = this;
            self.initNavbar();
            self.initNavbarSide();
            self.initNavbarFullscreen();
            self.initNavbarItemsEffect1();
            self.initNavbarDropEffect1();
            self.initNavbarDropEffect2();
            self.initHeaderTitle();
            self.initCounters();
            self.initAnchors();
            self.initVideoBlocks();
            self.initFullPage();
            self.initHoverImage();
            self.initPortfolio();
            self.initShop();
            self.initStretch();
            self.initSlider();
            self.initForms();
            self.initTeamBlock();
            self.initGmaps();
            self.initInstagram();
            self.initTwitter();
            self.initShortcuts();

            // init plugins
            self.initPluginObjectFitImages();
            self.initPluginStickySidebar();
            self.initPluginNano();
            self.initPluginJarallax();
            self.initPluginFlickity();
            self.initPluginIsotope();
            self.initPluginPhotoswipe();
            self.initPluginJustifiedGallery();
            self.initPluginBootstrap();

            return self;
        }
    }, {
        key: 'setOptions',
        value: function setOptions(newOpts) {
            return _setOptions2.setOptions.call(this, newOpts);
        }
    }, {
        key: 'debounceResize',
        value: function debounceResize(func) {
            return _utility.debounceResize.call(this, func);
        }
    }, {
        key: 'throttleScroll',
        value: function throttleScroll(callback) {
            return _utility.throttleScroll.call(this, callback);
        }
    }, {
        key: 'bodyOverflow',
        value: function bodyOverflow(type) {
            return _utility.bodyOverflow.call(this, type);
        }
    }, {
        key: 'isInViewport',
        value: function isInViewport($item, returnRect) {
            return _utility.isInViewport.call(this, $item, returnRect);
        }
    }, {
        key: 'scrollTo',
        value: function scrollTo($to, callback) {
            return _utility.scrollTo.call(this, $to, callback);
        }
    }, {
        key: 'key',
        value: function key(name, callback) {
            return _shortcuts.key.call(this, name, callback);
        }
    }, {
        key: 'initShortcuts',
        value: function initShortcuts() {
            return _shortcuts.initShortcuts.call(this);
        }
    }, {
        key: 'initHeaderTitle',
        value: function initHeaderTitle() {
            return _initHeaderTitle2.initHeaderTitle.call(this);
        }
    }, {
        key: 'initNavbar',
        value: function initNavbar() {
            return _initNavbar2.initNavbar.call(this);
        }
    }, {
        key: 'initNavbarSide',
        value: function initNavbarSide() {
            return _initNavbarSide2.initNavbarSide.call(this);
        }
    }, {
        key: 'initNavbarFullscreen',
        value: function initNavbarFullscreen() {
            return _initNavbarFullscreen2.initNavbarFullscreen.call(this);
        }
    }, {
        key: 'initNavbarItemsEffect1',
        value: function initNavbarItemsEffect1() {
            return _initNavbarItemsEffect2.initNavbarItemsEffect1.call(this);
        }
    }, {
        key: 'initNavbarDropEffect1',
        value: function initNavbarDropEffect1() {
            return _initNavbarDropEffect3.initNavbarDropEffect1.call(this);
        }
    }, {
        key: 'initNavbarDropEffect2',
        value: function initNavbarDropEffect2() {
            return _initNavbarDropEffect4.initNavbarDropEffect2.call(this);
        }
    }, {
        key: 'initCounters',
        value: function initCounters() {
            return _initCounters2.initCounters.call(this);
        }
    }, {
        key: 'initAnchors',
        value: function initAnchors() {
            return _initAnchors2.initAnchors.call(this);
        }
    }, {
        key: 'initVideoBlocks',
        value: function initVideoBlocks() {
            return _initVideoBlocks2.initVideoBlocks.call(this);
        }
    }, {
        key: 'initFullPage',
        value: function initFullPage() {
            return _initFullPage2.initFullPage.call(this);
        }
    }, {
        key: 'initHoverImage',
        value: function initHoverImage() {
            return _initHoverImage2.initHoverImage.call(this);
        }
    }, {
        key: 'initPortfolio',
        value: function initPortfolio() {
            return _initPortfolio2.initPortfolio.call(this);
        }
    }, {
        key: 'initShop',
        value: function initShop() {
            return _initShop2.initShop.call(this);
        }
    }, {
        key: 'initStretch',
        value: function initStretch() {
            return _initStretch2.initStretch.call(this);
        }
    }, {
        key: 'initSlider',
        value: function initSlider() {
            return _initSlider2.initSlider.call(this);
        }
    }, {
        key: 'initForms',
        value: function initForms() {
            return _initForms2.initForms.call(this);
        }
    }, {
        key: 'initTeamBlock',
        value: function initTeamBlock() {
            return _initTeamBlock2.initTeamBlock.call(this);
        }
    }, {
        key: 'initGmaps',
        value: function initGmaps() {
            return _initGmaps2.initGmaps.call(this);
        }
    }, {
        key: 'initInstagram',
        value: function initInstagram() {
            return _initInstagram2.initInstagram.call(this);
        }
    }, {
        key: 'initTwitter',
        value: function initTwitter() {
            return _initTwitter2.initTwitter.call(this);
        }
    }, {
        key: 'initPluginObjectFitImages',
        value: function initPluginObjectFitImages() {
            return _initPluginObjectFitImages2.initPluginObjectFitImages.call(this);
        }
    }, {
        key: 'initPluginStickySidebar',
        value: function initPluginStickySidebar() {
            return _initPluginStickySidebar2.initPluginStickySidebar.call(this);
        }
    }, {
        key: 'initPluginNano',
        value: function initPluginNano($context) {
            return _initPluginNano2.initPluginNano.call(this, $context);
        }
    }, {
        key: 'initPluginJarallax',
        value: function initPluginJarallax() {
            return _initPluginJarallax2.initPluginJarallax.call(this);
        }
    }, {
        key: 'initPluginFlickity',
        value: function initPluginFlickity() {
            return _initPluginFlickity2.initPluginFlickity.call(this);
        }
    }, {
        key: 'initPluginIsotope',
        value: function initPluginIsotope() {
            return _initPluginIsotope2.initPluginIsotope.call(this);
        }
    }, {
        key: 'initPluginPhotoswipe',
        value: function initPluginPhotoswipe() {
            return _initPluginPhotoswipe2.initPluginPhotoswipe.call(this);
        }
    }, {
        key: 'initPluginJustifiedGallery',
        value: function initPluginJustifiedGallery() {
            return _initPluginJustifiedGallery2.initPluginJustifiedGallery.call(this);
        }
    }, {
        key: 'initPluginBootstrap',
        value: function initPluginBootstrap() {
            return _initPluginBootstrap2.initPluginBootstrap.call(this);
        }
    }]);

    return SKYLITH;
}();

/*------------------------------------------------------------------

  Init Skylith

-------------------------------------------------------------------*/


window.Skylith = new SKYLITH();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setOptions = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Set Custom Options

-------------------------------------------------------------------*/
function setOptions(newOpts) {
    var self = this;

    var optsTemplates = _utility.$.extend({}, this.options.templates, newOpts && newOpts.templates || {});
    var optsShortcuts = _utility.$.extend({}, this.options.shortcuts, newOpts && newOpts.shortcuts || {});

    self.options = _utility.$.extend({}, self.options, newOpts);
    self.options.templates = optsTemplates;
    self.options.shortcuts = optsShortcuts;
}

exports.setOptions = setOptions;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initShortcuts = exports.key = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Shortcuts
  https://github.com/madrobby/keymaster

-------------------------------------------------------------------*/
function key(name, fn) {
    if (typeof window.key === 'undefined') {
        return;
    }
    name = this.options && this.options.shortcuts && this.options.shortcuts[name];

    if (name) {
        window.key(name, fn);
    }
}
function initShortcuts() {
    if (typeof window.key === 'undefined' || !this.options.enableShortcuts) {
        return;
    }

    var self = this;

    // FullScreen Video
    self.key('closeFullscreenVideo', function () {
        if (self.closeFullScreenVideo) {
            self.closeFullScreenVideo();
        }
    });

    // post single
    self.key('postScrollToComments', function () {
        var $comments = (0, _utility.$)('#comments');
        if ($comments.length) {
            self.scrollTo($comments);
        }
    });

    // Side Left Navbar
    var $leftSide = (0, _utility.$)('.nk-navbar-left-side');
    self.key('toggleSideLeftNavbar', function () {
        self.toggleSide($leftSide);
    });
    self.key('openSideLeftNavbar', function () {
        self.openSide($leftSide);
    });
    self.key('closeSideLeftNavbar', function () {
        self.closeSide($leftSide);
    });

    // Side Right Navbar
    var $rightSide = (0, _utility.$)('.nk-navbar-right-side');
    self.key('toggleSideRightNavbar', function () {
        self.toggleSide($rightSide);
    });
    self.key('openSideRightNavbar', function () {
        self.openSide($rightSide);
    });
    self.key('closeSideRightNavbar', function () {
        self.closeSide($rightSide);
    });

    // Fullscreen Navbar
    self.key('toggleFullscreenNavbar', function () {
        self.toggleFullscreenNavbar();
    });
    self.key('openFullscreenNavbar', function () {
        self.openFullscreenNavbar();
    });
    self.key('closeFullscreenNavbar', function () {
        self.closeFullscreenNavbar();
    });

    // Left Navbar
    self.key('toggleLeftNavbar', function () {
        self.toggleLeftNavbar();
    });
    self.key('openLeftNavbar', function () {
        self.openLeftNavbar();
    });
    self.key('closeLeftNavbar', function () {
        self.closeLeftNavbar();
    });

    // ESC - use also inside form elements
    window.key.filter = function (event) {
        var _ref = event.target || event.srcElement,
            tagName = _ref.tagName;

        var isContentEditable = (event.target || event.srcElement).getAttribute('contenteditable');
        var isESC = window.key.isPressed('esc');
        return isESC || !(isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA');
    };
}

exports.key = key;
exports.initShortcuts = initShortcuts;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initNavbar = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Navbar

-------------------------------------------------------------------*/
function initNavbar() {
    var self = this;
    var $navbarTop = (0, _utility.$)('.nk-navbar-top');

    // add mobile navbar
    var $mobileNavItems = (0, _utility.$)('[data-nav-mobile]');
    if ($mobileNavItems.length) {
        $mobileNavItems.each(function () {
            var $nav = (0, _utility.$)((0, _utility.$)(this).html());
            var $mobileNav = (0, _utility.$)((0, _utility.$)(this).attr('data-nav-mobile'));

            // insert into mobile nav
            $mobileNav.find('.nk-navbar-mobile-content > ul.nk-nav').append($nav);
        });

        var $nav = (0, _utility.$)('.nk-navbar-mobile-content > ul.nk-nav');

        // remove background images
        $nav.find('.bg-image, .bg-video').remove();

        // remove mega menus
        $nav.find('.nk-mega-item > .dropdown').each(function () {
            var $drop = (0, _utility.$)(this).children('ul').addClass('dropdown');

            // fix mega menu columns
            $drop.find('> li > ul').each(function () {
                var $this = (0, _utility.$)(this);
                var $parent = $this.parent();
                var $label = $this.prev('label');

                // if label exists - make dropdown
                if ($label.length) {
                    $this.addClass('dropdown');
                    $parent.addClass('nk-drop-item');
                    $label.replaceWith((0, _utility.$)('<a href="#"></a>').html($label.html()));
                } else {
                    $this.children('li').each(function () {
                        $parent.before((0, _utility.$)(this));
                    });
                    $parent.remove();
                }
            });

            (0, _utility.$)(this).replaceWith($drop);
        });
        $nav.find('.nk-mega-item').removeClass('nk-mega-item');
    }

    // collapsed navbar
    var $navCollapsed = $navbarTop.find('.nk-nav-collapsed');
    var $navCollapsedToggle = (0, _utility.$)('.nk-navbar-collapsed-toggle');
    $navCollapsedToggle.on('click', function (e) {
        e.preventDefault();
        if ($navCollapsed.hasClass('showed')) {
            _utility.tween.staggerTo($navCollapsed.children(), 0.2, {
                y: -10,
                opacity: 0
            }, 0.04, function () {
                _utility.tween.set($navCollapsed.children(), {
                    visibility: 'hidden'
                });
            });
            $navCollapsedToggle.removeClass('active');
        } else {
            _utility.tween.set($navCollapsed.children(), {
                y: -10,
                opacity: 0,
                visibility: 'visible'
            });
            _utility.tween.staggerTo($navCollapsed.children(), 0.2, {
                y: 0,
                opacity: 1
            }, 0.04);
            $navCollapsedToggle.addClass('active');
        }
        $navCollapsed.toggleClass('showed');
    });

    // sticky navbar
    var navbarTop = $navbarTop.length ? $navbarTop.offset().top : 0;
    // fake hidden navbar to prevent page jumping on stick
    var $navbarFake = (0, _utility.$)('<div>').hide();
    function onScrollNav() {
        var stickyOn = _utility.$wnd.scrollTop() >= navbarTop;

        if (stickyOn) {
            $navbarTop.addClass('nk-navbar-fixed');
            $navbarFake.show();
        } else {
            $navbarTop.removeClass('nk-navbar-fixed');
            $navbarFake.hide();
        }
    }
    if ($navbarTop.hasClass('nk-navbar-sticky')) {
        _utility.$wnd.on('scroll resize', onScrollNav);
        onScrollNav();

        $navbarTop.after($navbarFake);
        self.debounceResize(function () {
            $navbarFake.height($navbarTop.innerHeight());
        });
    }

    // correct dropdown position
    function correctDropdown($item) {
        if ($item.parent().is('.nk-nav')) {
            var $dropdown = $item.children('.dropdown');
            var $parent = $item.parents('.nk-navbar:eq(0)');
            var $parentContainer = $parent.children('.container');
            $parentContainer = $parentContainer.length ? $parentContainer : $parent;

            // fix right value when sub menu is not hidden
            var css = {
                marginLeft: '',
                marginRight: '',
                marginTop: 0
            };

            $dropdown.css(css);

            var rect = $dropdown[0].getBoundingClientRect();
            var rectContainer = $parentContainer[0].getBoundingClientRect();
            var itemRect = $item[0].getBoundingClientRect();

            // move dropdown from right corner (right corner will check in nav container)
            if (rect.right > rectContainer.right) {
                css.marginLeft = rectContainer.right - rect.right;
                $dropdown.css(css);
                rect = $dropdown[0].getBoundingClientRect();
            }

            // move dropdown from left corner
            if (rect.left < 0) {
                css.marginLeft = -rect.left;
                $dropdown.css(css);
                rect = $dropdown[0].getBoundingClientRect();
            }

            // check if dropdown not under item
            var currentLeftPost = rect.left + (css.marginLeft || 0);
            if (currentLeftPost > itemRect.left) {
                css.marginLeft = (css.marginLeft || 0) - (currentLeftPost - itemRect.left);
            }

            // correct top position
            // 10 - transform value
            css.marginTop = $parent.innerHeight() - $dropdown.offset().top + $parent.offset().top + 10;

            $dropdown.css(css);
        }
    }
    $navbarTop.on('mouseenter', 'li.nk-drop-item', function () {
        correctDropdown((0, _utility.$)(this));
    });

    // correct on page load.
    $navbarTop.find('li.nk-drop-item').each(function () {
        correctDropdown((0, _utility.$)(this));
    });

    // hide / show
    // add / remove solid color
    var $autohideNav = $navbarTop.filter('.nk-navbar-autohide');
    self.throttleScroll(function (type, scroll) {
        var start = 400;
        var hideClass = 'nk-onscroll-hide';
        var showClass = 'nk-onscroll-show';

        // hide / show
        if (type === 'down' && scroll > start) {
            $autohideNav.removeClass(showClass).addClass(hideClass);
        } else if (type === 'up' || type === 'end' || type === 'start') {
            $autohideNav.removeClass(hideClass).addClass(showClass);
        }

        // add solid color
        if ($navbarTop.hasClass('nk-navbar-transparent') && $navbarTop.hasClass('nk-navbar-sticky')) {
            $navbarTop[(scroll > 70 ? 'add' : 'remove') + 'Class']('nk-navbar-solid');
        }
    });

    // left navbar
    var $navbarLeft = (0, _utility.$)('.nk-navbar-left');
    var isOpenedLeft = void 0;
    var $overlay = (0, _utility.$)('<div class="nk-navbar-overlay">').appendTo(_utility.$body);

    self.fullscreenNavbarIsOpened = function () {
        return isOpenedLeft;
    };

    self.toggleLeftNavbar = function () {
        self[isOpenedLeft ? 'closeLeftNavbar' : 'openLeftNavbar']();
    };
    self.openLeftNavbar = function () {
        if (isOpenedLeft || !$navbarLeft.length) {
            return;
        }
        isOpenedLeft = 1;

        // active all togglers
        (0, _utility.$)('.nk-navbar-left-toggle').addClass('active');

        // open
        $navbarLeft.addClass('open');

        // show overlay
        if ($navbarLeft.hasClass('nk-navbar-overlay-content')) {
            _utility.tween.to($overlay, 0.3, {
                opacity: 0.6,
                display: 'block'
            });
        }

        // prevent body scrolling
        self.bodyOverflow(1);

        // trigger event
        _utility.$wnd.trigger('nk-open-left-navbar', [$navbarLeft]);
    };
    self.closeLeftNavbar = function (dontTouchBody) {
        if (!isOpenedLeft || !$navbarLeft.length) {
            return;
        }
        isOpenedLeft = 0;

        // deactive all togglers
        (0, _utility.$)('.nk-navbar-left-toggle').removeClass('active');

        // open
        $navbarLeft.removeClass('open');

        // hide overlay
        if ($navbarLeft.hasClass('nk-navbar-overlay-content')) {
            _utility.tween.to($overlay, 0.3, {
                opacity: 0,
                display: 'none'
            });
        }

        // restore body scrolling
        if (!dontTouchBody) {
            self.bodyOverflow(0);
        }

        // trigger event
        _utility.$wnd.trigger('nk-close-left-navbar', [$navbarLeft]);
    };

    // overlay
    _utility.$doc.on('click', '.nk-navbar-overlay', function () {
        self.closeLeftNavbar();
    });

    _utility.$doc.on('click', '.nk-navbar-left-toggle', function (e) {
        self.toggleLeftNavbar();
        e.preventDefault();
    });

    _utility.$wnd.on('nk-open-share-place', self.closeLeftNavbar);
}

exports.initNavbar = initNavbar;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initNavbarSide = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Navbar Side

-------------------------------------------------------------------*/
function initNavbarSide() {
    var self = this;
    var $overlay = (0, _utility.$)('<div class="nk-navbar-overlay">').appendTo(_utility.$body);

    // side navbars
    var $leftSide = (0, _utility.$)('.nk-navbar-left-side');
    var $rightSide = (0, _utility.$)('.nk-navbar-right-side');
    var $sideNavs = (0, _utility.$)('.nk-navbar-side');

    self.sideNavbarIsOpened = function () {
        return $sideNavs.hasClass('open');
    };

    // toggle navbars
    function updateTogglers() {
        (0, _utility.$)('[data-nav-toggle]').each(function () {
            var active = (0, _utility.$)((0, _utility.$)(this).attr('data-nav-toggle')).hasClass('open');
            (0, _utility.$)(this)[(active ? 'add' : 'remove') + 'Class']('active');
        });
    }
    self.toggleSide = function ($side, speed) {
        self[$side.hasClass('open') ? 'closeSide' : 'openSide']($side, speed);
    };
    self.openSide = function ($side, speed) {
        if ($side.css('display') === 'none') {
            return;
        }

        $side.addClass('open');

        // show sidebar
        _utility.tween.to($side, speed || 0.4, {
            x: $side.hasClass('nk-navbar-left-side') ? '100%' : '-100%'
        });

        // show overlay
        if ($side.hasClass('nk-navbar-overlay-content')) {
            _utility.tween.to($overlay, 0.3, {
                opacity: 0.6,
                display: 'block'
            });
        }

        updateTogglers();
    };
    self.closeSide = function ($side, speed) {
        $side.each(function () {
            (0, _utility.$)(this).removeClass('open');

            // hide sidebar
            _utility.tween.to(this, speed || 0.4, {
                x: '0%'
            });

            updateTogglers();
        });

        if (!$sideNavs.filter('.nk-navbar-overlay-content.open').length) {
            // hide overlay
            _utility.tween.to($overlay, 0.3, {
                opacity: 0,
                display: 'none'
            });
        }
    };
    _utility.$doc.on('click', '[data-nav-toggle]', function (e) {
        var $nav = (0, _utility.$)((0, _utility.$)(this).attr('data-nav-toggle'));
        if ($nav.hasClass('open')) {
            self.closeSide($nav);
        } else {
            // hide another navigations
            (0, _utility.$)('[data-nav-toggle]').each(function () {
                self.closeSide((0, _utility.$)((0, _utility.$)(this).attr('data-nav-toggle')));
            });

            self.openSide($nav);
        }
        e.preventDefault();
    });

    // overlay
    _utility.$doc.on('click', '.nk-navbar-overlay', function () {
        self.closeSide($sideNavs);
    });

    // hide sidebar if it invisible
    self.debounceResize(function () {
        $sideNavs.filter('.open').each(function () {
            if (!(0, _utility.$)(this).is(':visible')) {
                self.closeSide((0, _utility.$)(this));
            }
        });
    });

    // swipe side navbars
    if (!_utility.isTouch || typeof Hammer === 'undefined') {
        return;
    }
    var swipeStartSize = 50;
    var $swipeItem = void 0;
    var navSize = void 0;
    var openNav = void 0;
    var closeNav = void 0;
    var isRightSide = void 0;
    var isLeftSide = void 0;
    var isScrolling = 0;
    var swipeDir = void 0;
    var sidePos = false;
    var startSwipe = false;
    var endSwipe = false;

    // strange solution to fix pan events on the latest Chrome
    // https://github.com/hammerjs/hammer.js/issues/1065
    var mc = new Hammer.Manager(document, {
        touchAction: 'auto',
        inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
        recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]]
    });

    // If we detect a scroll before a panleft/panright, disable panning
    // thanks: https://github.com/hammerjs/hammer.js/issues/771
    mc.on('panstart', function (e) {
        if (e.additionalEvent === 'panup' || e.additionalEvent === 'pandown') {
            isScrolling = 1;
        }
    });
    // Reenable panning
    mc.on('panend', function (e) {
        if (!isScrolling) {
            if ($swipeItem) {
                var swipeSize = void 0;
                if (sidePos) {
                    if (openNav) {
                        swipeSize = sidePos;
                    } else if (closeNav) {
                        swipeSize = navSize - sidePos;
                    } else {
                        swipeSize = 0;
                    }
                } else {
                    swipeSize = 0;
                }

                var transitionTime = Math.max(0.15, 0.4 * (navSize - swipeSize) / navSize);
                var swiped = 0;

                if (swipeSize && swipeSize > 10) {
                    var velocityTest = Math.abs(e.velocityX) > 0.7;
                    if (swipeSize >= navSize / 3 || velocityTest) {
                        swiped = 1;
                        if (openNav) {
                            self.openSide($swipeItem, transitionTime);
                        } else {
                            self.closeSide($swipeItem, transitionTime);
                        }
                    }
                }
                if (!swiped) {
                    if (openNav) {
                        self.closeSide($swipeItem, transitionTime);
                    } else {
                        self.openSide($swipeItem, transitionTime);
                    }
                }
            }
            openNav = false;
            closeNav = false;
            isRightSide = false;
            isLeftSide = false;
            swipeDir = false;
            sidePos = false;
            $swipeItem = false;
            startSwipe = false;
            endSwipe = false;
        }
        isScrolling = 0;
    });
    mc.on('panleft panright panup pandown', function (e) {
        if (isScrolling) {
            return;
        }

        var isFirst = false;
        var isFinal = e.isFinal;

        if (startSwipe === false) {
            startSwipe = e.center.x;
            isFirst = true;
        }
        endSwipe = e.center.x;

        // init
        if (isFirst) {
            if (e.direction === 2) {
                swipeDir = 'left';
            } else if (e.direction === 4) {
                swipeDir = 'right';
            } else {
                swipeDir = false;
            }

            // right side
            if ($rightSide && $rightSide.length) {
                navSize = $rightSide.width();

                // open
                if (_utility.wndW - startSwipe <= swipeStartSize && !$rightSide.hasClass('open') && !$leftSide.hasClass('open')) {
                    openNav = 1;
                    isRightSide = 1;

                    // close
                } else if (_utility.wndW - startSwipe >= navSize - 100 && $rightSide.hasClass('open')) {
                    closeNav = 1;
                    isRightSide = 1;
                }
            }

            // left side
            if ($leftSide && $leftSide.length && !isRightSide && $leftSide.is(':visible')) {
                navSize = $leftSide.width();

                // open
                if (startSwipe <= swipeStartSize && !$rightSide.hasClass('open') && !$leftSide.hasClass('open')) {
                    openNav = 1;
                    isLeftSide = 1;

                    // close
                } else if (startSwipe >= navSize - 100 && $leftSide.hasClass('open')) {
                    closeNav = 1;
                    isLeftSide = 1;
                }
            }

            // swipe item
            if (isLeftSide) {
                $swipeItem = $leftSide;
            } else if (isRightSide) {
                $swipeItem = $rightSide;
            } else {
                $swipeItem = false;
            }

            // move
        } else if (!isFinal && $swipeItem) {
            if (isRightSide && (openNav && swipeDir === 'left' || closeNav && swipeDir === 'right')) {
                // open side navbar
                if (openNav) {
                    sidePos = Math.min(navSize, Math.max(0, startSwipe - endSwipe));
                }

                // close side navbar
                if (closeNav) {
                    var curPos = startSwipe - endSwipe;
                    if (startSwipe < _utility.wndW - navSize) {
                        curPos = _utility.wndW - navSize - endSwipe;
                    }
                    sidePos = navSize - Math.abs(Math.max(-navSize, Math.min(0, curPos)));
                }

                _utility.tween.set($swipeItem, {
                    x: -100 * sidePos / navSize + '%'
                });
            } else if (isLeftSide && (openNav && swipeDir === 'right' || closeNav && swipeDir === 'left')) {
                // open mobile navbar
                if (openNav) {
                    sidePos = Math.min(navSize, Math.max(0, endSwipe - startSwipe));
                }

                // close mobile navbar
                if (closeNav) {
                    var curPos2 = endSwipe - startSwipe;
                    if (startSwipe > navSize) {
                        curPos2 = endSwipe - navSize;
                    }
                    sidePos = navSize - Math.abs(Math.max(-navSize, Math.min(0, curPos2)));
                }

                _utility.tween.set($swipeItem, {
                    x: 100 * sidePos / navSize + '%'
                });
            }
        }
    });

    // prevent scrolling when opening/hiding navigation
    window.addEventListener('touchmove', function (e) {
        if (isRightSide || isLeftSide) {
            e.preventDefault();
        }
    }, { passive: false });
}

exports.initNavbarSide = initNavbarSide;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initNavbarFullscreen = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Navbar Fullscreen

-------------------------------------------------------------------*/
function initNavbarFullscreen() {
    var self = this;
    var $navbar = (0, _utility.$)('.nk-navbar-full');

    self.fullscreenNavbarIsOpened = function () {
        return $navbar.hasClass('open');
    };

    self.toggleFullscreenNavbar = function () {
        self[self.fullscreenNavbarIsOpened() ? 'closeFullscreenNavbar' : 'openFullscreenNavbar']();
    };
    self.openFullscreenNavbar = function () {
        if (self.fullscreenNavbarIsOpened() || !$navbar.length) {
            return;
        }

        // active all togglers
        (0, _utility.$)('.nk-navbar-full-toggle').addClass('active');

        $navbar.addClass('open');

        // prevent body scrolling
        self.bodyOverflow(1);

        // trigger event
        _utility.$wnd.trigger('nk-open-full-navbar', [$navbar]);
    };

    self.closeFullscreenNavbar = function () {
        if (!self.fullscreenNavbarIsOpened() || !$navbar.length) {
            return;
        }

        // deactive all togglers
        (0, _utility.$)('.nk-navbar-full-toggle').removeClass('active');

        // open navbar block
        $navbar.removeClass('open');

        // restore body scrolling after a small delay
        setTimeout(function () {
            if (!self.fullscreenNavbarIsOpened()) {
                self.bodyOverflow(0);
            }
        }, 150);

        // trigger event
        _utility.$wnd.trigger('nk-close-full-navbar', [$navbar]);
    };

    _utility.$doc.on('click', '.nk-navbar-full-toggle', function (e) {
        self.toggleFullscreenNavbar();
        e.preventDefault();
    });

    _utility.$wnd.on('nk-open-share-place', self.closeFullscreenNavbar);
}

exports.initNavbarFullscreen = initNavbarFullscreen;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initNavbarItemsEffect1 = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

 Init Items Effect 1 for navbars

 -------------------------------------------------------------------*/
function initNavbarItemsEffect1() {
  (0, _utility.$)('.nk-navbar-items-effect-1 .nk-nav li > a').each(function () {
    (0, _utility.$)(this).wrapInner('<span>');
  });
}

exports.initNavbarItemsEffect1 = initNavbarItemsEffect1;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initNavbarDropEffect1 = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Dropdown Effect 1 for side navbars and fullscreen

-------------------------------------------------------------------*/
function initNavbarDropEffect1() {
    var self = this;
    var $navbars = (0, _utility.$)('.nk-navbar-drop-effect-1');

    // add back item for dropdowns
    $navbars.find('.dropdown').prepend('<li class="dropdown-back"><a href="#">' + self.options.templates.navbarBackItem + '</a></li>');

    // change height of opened dropdown
    function updateSideNavDropdown($item) {
        var $nav = $item.parents('.nk-navbar:eq(0)');
        var $khNav = $nav.find('.nk-nav');
        var $nanoCont = $nav.find('.nano-content');
        var $drop = $nav.find('.nk-drop-item.open > .dropdown:not(.closed)');

        var dropHeight = '';
        if ($drop.length) {
            dropHeight = $drop.innerHeight();
        }

        $khNav.css({
            height: dropHeight,
            minHeight: dropHeight
        });
        self.initPluginNano($nav);

        // scroll to top
        _utility.tween.to($nanoCont, 0.3, {
            scrollTo: { y: 0 },
            delay: 0.2
        });
    }

    // open / close submenu
    function toggleSubmenu(open, $drop) {
        var $newItems = $drop.find('> .dropdown > li > a');
        var $oldItems = $drop.parent().find('> li > a');

        if (open) {
            $drop.addClass('open').parent().addClass('closed');
        } else {
            $drop.removeClass('open').parent().removeClass('closed');

            var tmp = $newItems;
            $newItems = $oldItems;
            $oldItems = tmp;
        }

        // show items
        _utility.tween.set($newItems, {
            x: open ? '15%' : '-15%',
            opacity: 0,
            display: 'block'
        }, 0.1);
        _utility.tween.staggerTo($newItems, 0.2, {
            x: '0%',
            opacity: 1,
            delay: 0.1
        }, 0.03);

        // hide items
        _utility.tween.staggerTo($oldItems, 0.2, {
            x: open ? '-15%' : '15%',
            opacity: 0
        }, 0.03, function () {
            $oldItems.css('display', 'none');
        });
    }

    $navbars.on('click', '.nk-drop-item > a', function (e) {
        toggleSubmenu(true, (0, _utility.$)(this).parent());
        updateSideNavDropdown((0, _utility.$)(this));
        e.preventDefault();
    });
    $navbars.on('click', '.dropdown-back > a', function (e) {
        toggleSubmenu(false, (0, _utility.$)(this).parent().parent().parent());
        updateSideNavDropdown((0, _utility.$)(this));
        e.preventDefault();
    });
}

exports.initNavbarDropEffect1 = initNavbarDropEffect1;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initNavbarDropEffect2 = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

 Init Dropdown Effect 2 for side navbars and fullscreen

 -------------------------------------------------------------------*/
function initNavbarDropEffect2() {
    var self = this;
    var $navbars = (0, _utility.$)('.nk-navbar-drop-effect-2');

    // open / close submenu
    function toggleSubmenu($dropdown) {
        var $nav = $dropdown.closest('.nk-navbar');
        var height = $dropdown.innerHeight();

        // close sibling navigations
        var $openedSiblings = $nav.find('.dropdown.open').filter(function () {
            return !((0, _utility.$)(this).is($dropdown) || (0, _utility.$)(this).find($dropdown).length);
        });
        _utility.tween.to($openedSiblings, 0.3, {
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            display: 'none',
            onComplete: function onComplete() {
                $openedSiblings.attr('style', '');
                $openedSiblings.removeClass('open');
            }
        });

        // show current dropdown
        $dropdown.addClass('open');
        $dropdown.css({
            display: 'block',
            height: 0
        });

        _utility.tween.to($dropdown, 0.3, {
            height: height,
            onComplete: function onComplete() {
                $dropdown.css('height', '');
                self.initPluginNano($nav);
            }
        });
    }

    $navbars.on('click', '.nk-drop-item > a', function (e) {
        var $dropdown = (0, _utility.$)(this).next('.dropdown:not(.open)');
        if ($dropdown.length) {
            toggleSubmenu($dropdown);
            e.preventDefault();
        }
    });
}

exports.initNavbarDropEffect2 = initNavbarDropEffect2;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initHeaderTitle = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Header Title

-------------------------------------------------------------------*/
function initHeaderTitle() {
    var self = this;
    var $navbarHeader = (0, _utility.$)('.nk-header:not(.nk-header-left)');
    var isNavbarOpaque = $navbarHeader.hasClass('nk-header-opaque');
    var isNavbarTransparent = (0, _utility.$)('.nk-navbar-top').hasClass('nk-header-transparent');
    var $headerTitle = (0, _utility.$)('.nk-header-title > .nk-header-content');
    var $fullHeaderTitle = (0, _utility.$)('.nk-header-title-full > .nk-header-content');

    // remove header title padding if navbar opaque
    if (isNavbarOpaque) {
        $headerTitle.css('padding-top', 0);
    }

    self.debounceResize(function () {
        if ((isNavbarTransparent || isNavbarOpaque) && (!$fullHeaderTitle.length || !isNavbarOpaque)) {
            return;
        }

        var navH = $navbarHeader.outerHeight() || 0;

        // add header title padding
        if (!isNavbarTransparent && !isNavbarOpaque) {
            $headerTitle.css('padding-top', navH);
        }

        // fix header title height
        if ($fullHeaderTitle.length) {
            var headerH = '100vh';

            if (isNavbarOpaque) {
                headerH = 'calc(100vh - ' + navH + 'px)';
            }

            $fullHeaderTitle.css('min-height', headerH);
        }
    });
}

exports.initHeaderTitle = initHeaderTitle;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initCounters = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Counters

-------------------------------------------------------------------*/
function initCounters() {
    var self = this;
    var $progressCount = (0, _utility.$)('.nk-progress.nk-count');
    var $numberCount = (0, _utility.$)('.nk-count:not(.nk-progress)');

    // set default progress
    $progressCount.each(function () {
        (0, _utility.$)(this).attr('data-nk-count', (0, _utility.$)(this).attr('data-progress')).attr('data-nk-mask', (0, _utility.$)(this).attr('data-progress-mask')).find('.nk-progress-line > div').css('width', ((0, _utility.$)(this).attr('data-nk-count-from') || '0') + '%').find('.nk-progress-percent').html('');
    });

    // set default numbers
    $numberCount.each(function () {
        (0, _utility.$)(this).attr('data-nk-count', (0, _utility.$)(this).attr('data-nk-count') || parseInt((0, _utility.$)(this).text(), 10)).html((0, _utility.$)(this).attr('data-nk-count-from') || '0');
    });

    var countersNum = 1;
    function runCounters() {
        if (!countersNum) {
            return;
        }

        var progress = $progressCount.filter('[data-nk-count]');
        var numbers = $numberCount.filter('[data-nk-count]');
        countersNum = progress.length + numbers.length;

        // progress
        $progressCount.filter('[data-nk-count]').each(function () {
            var $item = (0, _utility.$)(this);
            if (self.isInViewport($item)) {
                var count = {
                    curr: $item.attr('data-nk-count-from') || '0',
                    to: $item.attr('data-nk-count'),
                    mask: $item.attr('data-nk-mask') || '{$}%'
                };
                var $itemLine = $item.find('.nk-progress-line > div');
                var $itemLabel = $item.find('.nk-progress-percent');

                _utility.tween.to($itemLine, 1, {
                    width: count.to + '%'
                });
                _utility.tween.to(count, 1, {
                    curr: count.to,
                    roundProps: 'curr',
                    ease: Circ.easeIn,
                    onUpdate: function onUpdate() {
                        $itemLabel.text(count.mask.replace('{$}', count.curr));
                    }
                });
                $item.removeAttr('data-nk-count');
            }
        });

        // number
        $numberCount.filter('[data-nk-count]').each(function () {
            var $item = (0, _utility.$)(this);
            if (self.isInViewport($item)) {
                var count = {
                    curr: $item.text(),
                    to: $item.attr('data-nk-count')
                };
                $item.removeAttr('data-nk-count data-nk-count-from');
                _utility.tween.to(count, 1, {
                    curr: count.to,
                    roundProps: 'curr',
                    ease: Circ.easeIn,
                    onUpdate: function onUpdate() {
                        $item.text(count.curr);
                    }
                });
            }
        });
    }

    self.throttleScroll(runCounters);
    runCounters();
}

exports.initCounters = initCounters;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initAnchors = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Anchors

-------------------------------------------------------------------*/
function initAnchors() {
    var self = this;

    // click on anchors
    var $leftSideNav = (0, _utility.$)('.nk-navbar-left-side');
    var $rightSideNav = (0, _utility.$)('.nk-navbar-right-side');
    function closeNavs() {
        self.closeSide($leftSideNav);
        self.closeSide($rightSideNav);
        self.closeFullscreenNavbar();
    }
    _utility.$doc.on('click', '.navbar a, .nk-navbar a, a.btn, a.nk-btn, a.nk-anchor', function (e) {
        var isHash = this.hash;
        var isURIsame = this.baseURI === window.location.href;

        if (isHash && isURIsame) {
            // sometimes hashs have no valid selector like ##hash, it will throw errors
            try {
                var $hashBlock = (0, _utility.$)(isHash);
                var hash = isHash.replace(/^#/, '');
                if ($hashBlock.length || hash === 'top' || hash === 'bottom') {
                    // close navigations
                    closeNavs();

                    // scroll to block
                    self.scrollTo($hashBlock.length ? $hashBlock : hash);

                    e.preventDefault();
                }
            } catch (ev) {} // eslint-disable-line
        }
    });

    // add active class on navbar items
    var $anchorItems = (0, _utility.$)('.nk-navbar .nk-nav > li > a[href*="#"]');
    var anchorBlocks = [];
    function hashInArray(item) {
        for (var k = 0; k < anchorBlocks.length; k++) {
            if (anchorBlocks[k].hash === item) {
                return k;
            }
        }
        return false;
    }
    // get all anchors + blocks on the page
    $anchorItems.each(function () {
        var hash = this.hash.replace(/^#/, '');
        if (!hash) {
            return;
        }

        var $item = (0, _utility.$)(this).parent();
        var $block = (0, _utility.$)('#' + hash);

        if (hash && $block.length || hash === 'top') {
            var inArray = hashInArray(hash);
            if (inArray === false) {
                anchorBlocks.push({
                    hash: hash,
                    $item: $item,
                    $block: $block
                });
            } else {
                anchorBlocks[inArray].$item = anchorBlocks[inArray].$item.add($item);
            }
        }
    });
    // prepare anchor list and listen for scroll to activate items in navbar
    function updateAnchorItemsPositions() {
        for (var k = 0; k < anchorBlocks.length; k++) {
            var item = anchorBlocks[k];
            var blockTop = 0;
            var blockH = _utility.wndH;
            if (item.$block.length) {
                blockTop = item.$block.offset().top;
                blockH = item.$block.innerHeight();
            }
            item.activate = blockTop - _utility.wndH / 2;
            item.deactivate = blockTop + blockH - _utility.wndH / 2;
        }
    }
    function setAnchorActiveItem(type, ST) {
        for (var k = 0; k < anchorBlocks.length; k++) {
            var item = anchorBlocks[k];
            var active = ST >= item.activate && ST < item.deactivate;
            item.$item[active ? 'addClass' : 'removeClass']('active');
        }
    }
    if (anchorBlocks.length) {
        updateAnchorItemsPositions();
        setAnchorActiveItem('static', _utility.$wnd.scrollTop());
        self.throttleScroll(setAnchorActiveItem);
        self.debounceResize(updateAnchorItemsPositions);
    }

    // show/hide scroll up button
    var $scrollUp = (0, _utility.$)('.nk-scroll-up');
    if ($scrollUp.length) {
        (0, _utility.throttleScroll)(function (type, top) {
            if (top > 400) {
                $scrollUp.addClass('nk-scroll-up-show');
            } else {
                $scrollUp.removeClass('nk-scroll-up-show');
            }
        });
    }
}

exports.initAnchors = initAnchors;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initVideoBlocks = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

 Init Video Blocks

 -------------------------------------------------------------------*/
function initVideoBlocks() {
    if (typeof window.VideoWorker === 'undefined') {
        return;
    }
    var self = this;

    // open fullscreen videos
    var openedFSVideo = void 0;
    self.openFullScreenVideo = function (url) {
        if (openedFSVideo) {
            return;
        }
        openedFSVideo = 1;

        // get api for this video
        self.FullScreenVideoApi = new VideoWorker(url, {
            autoplay: 1,
            loop: 0,
            mute: 0,
            controls: 1
        });

        // set video size
        function setVideoSize() {
            var ratio = 16 / 9;
            var resultW = void 0;
            var resultH = void 0;

            if (ratio > _utility.wndW / _utility.wndH) {
                resultW = _utility.wndW * 0.9;
                resultH = resultW / ratio;
            } else {
                resultH = _utility.wndH * 0.9;
                resultW = resultH * ratio;
            }
            self.FullScreenVideoWrapper.css({
                width: resultW,
                height: resultH,
                top: (_utility.wndH - resultH) / 2,
                left: (_utility.wndW - resultW) / 2
            });
        }

        // create fullscreen video wrapper if doesn't exist
        if (!self.FullScreenVideo) {
            self.FullScreenVideo = (0, _utility.$)('<div class="nk-video-fullscreen"></div>').appendTo(_utility.$body);

            self.closeFullScreenVideo = function () {
                if (openedFSVideo) {
                    openedFSVideo = 0;

                    self.FullScreenVideoApi.pause();

                    // hide animation
                    _utility.tween.to(self.FullScreenVideo, 0.4, {
                        opacity: 0,
                        display: 'none',
                        onComplete: function onComplete() {
                            self.FullScreenVideoWrapper.html('');
                        }
                    });
                    _utility.tween.to(self.FullScreenVideoWrapper, 0.4, {
                        scale: 0.9
                    });

                    // restore body scrolling
                    self.bodyOverflow(0);
                }
            };

            // close icon
            (0, _utility.$)('<div class="nk-video-fullscreen-close">' + self.options.templates.fullscreenVideoClose + '</div>').on('click', self.closeFullScreenVideo).appendTo(self.FullScreenVideo);

            // video container
            self.FullScreenVideoWrapper = (0, _utility.$)('<div class="nk-video-fullscreen-cont"></div>').appendTo(self.FullScreenVideo);

            setVideoSize();
            self.debounceResize(setVideoSize);
        }

        // check api and run fullscreen
        if (self.FullScreenVideoApi && self.FullScreenVideoApi.isValid()) {
            self.FullScreenVideoApi.getIframe(function (iframe) {
                var $parent = (0, _utility.$)(iframe).parent();
                self.FullScreenVideoWrapper.append(iframe);
                $parent.remove();

                // pause audio
                if (typeof soundManager !== 'undefined') {
                    soundManager.pauseAll();
                }

                // show animation
                _utility.tween.fromTo(self.FullScreenVideo, 0.4, {
                    opacity: 0
                }, {
                    opacity: 1,
                    display: 'block'
                });
                _utility.tween.fromTo(self.FullScreenVideoWrapper, 0.4, {
                    opacity: 0,
                    scale: 0.9
                }, {
                    opacity: 1,
                    scale: 1,
                    delay: 0.3
                });

                // prevent body scrolling
                self.bodyOverflow(1);
            });
        }
    };
    _utility.$doc.on('click', '.nk-video-fullscreen-toggle', function (e) {
        e.preventDefault();
        self.openFullScreenVideo((0, _utility.$)(this).attr('href'));
    });

    // init plain video
    function addPlainPlayButton($plainCont) {
        $plainCont.find('.nk-video-plain-toggle').html(self.options.templates.plainVideoIcon);
    }
    function addPlainLoadButton($plainCont) {
        $plainCont.find('.nk-video-plain-toggle').html(self.options.templates.plainVideoLoadIcon || self.options.templates.plainVideoIcon);
    }
    (0, _utility.$)('.nk-plain-video[data-video]').each(function () {
        var $plainCont = (0, _utility.$)(this);
        var $plainIframe = void 0;
        var url = (0, _utility.$)(this).attr('data-video');
        var thumb = (0, _utility.$)(this).attr('data-video-thumb');
        var api = new VideoWorker(url, {
            autoplay: 0,
            loop: 0,
            mute: 0,
            controls: 1
        });

        if (api && api.isValid()) {
            var loaded = 0;
            var clicked = 0;

            // add play event
            $plainCont.on('click', function () {
                if (_utility.isMobile) {
                    window.open(api.url);
                    return;
                }

                if (clicked) {
                    return;
                }
                clicked = 1;

                // add loading button
                if (!loaded) {
                    addPlainLoadButton($plainCont);

                    api.getIframe(function (iframe) {
                        // add iframe
                        $plainIframe = (0, _utility.$)(iframe);
                        var $parent = $plainIframe.parent();
                        _utility.tween.set(iframe, {
                            opacity: 0,
                            visibility: 'hidden'
                        });
                        $plainIframe.appendTo($plainCont);
                        $parent.remove();
                        api.play();
                    });
                } else {
                    api.play();
                }
            });

            // add play button
            $plainCont.append('<span class="nk-video-plain-toggle"></span>');
            addPlainPlayButton($plainCont);

            // set thumb
            if (thumb) {
                $plainCont.css('background-image', 'url("' + thumb + '")');
            } else {
                api.getImageURL(function (imgSrc) {
                    $plainCont.css('background-image', 'url("' + imgSrc + '")');
                });
            }

            if (_utility.isMobile) {
                return;
            }

            api.on('ready', function () {
                api.play();
            });
            api.on('play', function () {
                _utility.tween.to($plainIframe, 0.5, {
                    opacity: 1,
                    visibility: 'visible',
                    onComplete: function onComplete() {
                        // add play button
                        if (!loaded) {
                            addPlainPlayButton($plainCont);
                            loaded = 1;
                        }
                    }
                });

                // pause audio
                if (typeof soundManager !== 'undefined') {
                    soundManager.pauseAll();
                }
            });
            api.on('pause', function () {
                _utility.tween.to($plainIframe, 0.5, {
                    opacity: 0,
                    onComplete: function onComplete() {
                        _utility.tween.set($plainIframe, {
                            visibility: 'hidden'
                        });
                        clicked = 0;
                    }
                });
            });
        }
    });
}

exports.initVideoBlocks = initVideoBlocks;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initFullPage = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Fullpage

-------------------------------------------------------------------*/
function initFullPage() {
    var $fullPage = (0, _utility.$)('.nk-fullpage:eq(0)');
    var $eachItems = $fullPage.find('.nk-fullpage-item');
    var $topNavbar = (0, _utility.$)('.nk-navbar-top');
    if (!$fullPage.length || !$eachItems.length) {
        return;
    }

    // hide footer
    (0, _utility.$)('.nk-footer').hide();

    (0, _utility.$)('html').css('overflow', 'hidden');
    (0, _utility.$)('.nk-main').css('overflow', 'visible');
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 10);

    // parse slides
    var slides = [];
    $eachItems.each(function () {
        var $this = (0, _utility.$)(this);
        slides.push({
            $item: $this,
            $viewBtn: $this.find('.nk-fullpage-view-button').html(),
            $content: $this.find('.nk-fullpage-content').html(),
            img: $this.find('.nk-fullpage-image').attr('src') || '',
            letter: $this.attr('data-letter') || '',
            number: $this.attr('data-number') || '',
            bgDark: $this.hasClass('nk-fullpage-item-bg-dark')
        });
    });

    // image blocks
    var $image1 = (0, _utility.$)('<div class="nk-fullpage-bg-image">').appendTo($fullPage);
    var $image2 = (0, _utility.$)('<div class="nk-fullpage-bg-image">').appendTo($fullPage);

    // content
    var $content = (0, _utility.$)('<div class="nk-fullpage-content">');
    var $content2 = (0, _utility.$)('<div class="nk-fullpage-content">');
    var $contentButton = (0, _utility.$)('<div class="nk-fullpage-view-button">');
    $fullPage.append($content);
    $fullPage.append($content2);
    $fullPage.append($contentButton);

    // bullet navigation
    var $bullets = '<ul class="nk-fullpage-nav active">';
    for (var k = 0; k < slides.length; k++) {
        $bullets += '<li>' + slides[k].letter + '</li>';
    }
    $bullets += '</ul>';
    $bullets = (0, _utility.$)($bullets);
    $fullPage.append($bullets);
    var $bulletsItems = $bullets.children('li');

    // numbers
    var $numbers = (0, _utility.$)('<div class="nk-fullpage-number">');
    var $numbers2 = (0, _utility.$)('<div class="nk-fullpage-number">');
    $fullPage.append($numbers);
    $fullPage.append($numbers2);

    var isBusy = 0;
    var curIndex = 0;

    // show new slide
    // effect: fade, up, down
    function slideShow(index) {
        var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fade';
        var force = arguments[2];

        if (typeof slides[index] !== 'undefined' && curIndex !== index && !isBusy || force) {
            isBusy = 1;

            // animate image background
            switch (effect) {
                case 'up':
                case 'down':
                    _utility.tween.set($image2, {
                        y: effect === 'down' ? '100%' : '-100%',
                        scale: 1.1,
                        display: 'block'
                    });
                    $image2.css('background-image', 'url("' + slides[index].img + '")');
                    _utility.tween.to($image2, 0.5, {
                        y: '0%',
                        scale: 1,
                        force3D: true,
                        ease: Power1.easeInOut,
                        onComplete: function onComplete() {
                            $image2.css('background-image', '');
                            _utility.tween.set($image2, {
                                display: 'none',
                                clearProps: 'transform'
                            });
                        }
                    });
                    _utility.tween.to($image1, 0.5, {
                        opacity: 0,
                        scale: 0.9,
                        force3D: true,
                        ease: Power1.easeInOut,
                        onComplete: function onComplete() {
                            $image1.css('background-image', 'url("' + slides[index].img + '")');
                            _utility.tween.set($image1, {
                                opacity: 1,
                                clearProps: 'transform'
                            });
                            isBusy = 0;
                        }
                    });
                    break;
                default:
                    // fade
                    _utility.tween.set($image2, {
                        opacity: 0,
                        display: 'block'
                    });
                    $image2.css('background-image', 'url("' + slides[index].img + '")');
                    _utility.tween.to($image2, 0.5, {
                        opacity: 1,
                        force3D: true,
                        onComplete: function onComplete() {
                            $image1.css('background-image', 'url("' + slides[index].img + '")');
                            $image2.css('background-image', '');
                            _utility.tween.set($image2, {
                                display: 'none'
                            });
                            isBusy = 0;
                        }
                    });
                    break;
            }

            // activate bullet
            $bulletsItems.removeClass('active');
            $bulletsItems.eq(index).addClass('active');

            // show slide number
            _utility.tween.set($numbers2, {
                opacity: 0,
                y: 0,
                display: 'block'
            });
            $numbers2.html(slides[index].number);
            _utility.tween.to($numbers, 0.5, {
                opacity: 0,
                y: -50,
                force3D: true
            });
            _utility.tween.to($numbers2, 0.5, {
                opacity: 1,
                y: 0,
                force3D: true,
                delay: 0.1,
                onComplete: function onComplete() {
                    $numbers.html(slides[index].number);
                    _utility.tween.set($numbers, {
                        opacity: 1,
                        y: 0
                    });
                    _utility.tween.set($numbers2, {
                        display: 'none'
                    });
                }
            });

            // set new content
            _utility.tween.set($content2, {
                opacity: 0,
                y: effect === 'down' ? 100 : -100,
                scale: 0.9,
                display: 'flex'
            });
            $content2.html(slides[index].$content);
            _utility.tween.to($content, 0.5, {
                opacity: 0,
                y: effect === 'down' ? -100 : 100,
                scale: 0.9,
                force3D: true,
                onComplete: function onComplete() {
                    // change navbar color
                    if ($topNavbar.hasClass('nk-navbar-transparent')) {
                        $topNavbar[slides[index].bgDark ? 'addClass' : 'removeClass']('nk-navbar-dark');
                    }
                }
            });
            _utility.tween.to($content2, 0.5, {
                opacity: 1,
                y: 0,
                scale: 1,
                force3D: true,
                delay: 0.4,
                onComplete: function onComplete() {
                    $content.html(slides[index].$content);
                    _utility.tween.set($content, {
                        opacity: 1,
                        clearProps: 'transform'
                    });
                    _utility.tween.set($content2, {
                        display: 'none'
                    });
                }
            });

            // set new button
            $contentButton.html(slides[index].$viewBtn);

            curIndex = index;
        }
    }
    slideShow(curIndex, 'fade', 1);
    $bullets.on('click', '> li', function () {
        var index = (0, _utility.$)(this).index();
        if (index > curIndex) {
            slideShow(index, 'down');
        } else if (index < curIndex) {
            slideShow(index, 'up');
        }
    });

    // show next / previous slider
    function slideShowNext() {
        if (curIndex !== slides.length - 1) {
            slideShow(curIndex + 1, 'down');
        }
    }
    function slideShowPrev() {
        if (curIndex !== 0) {
            slideShow(curIndex - 1, 'up');
        }
    }

    // next button click
    (0, _utility.$)('.nk-fullpage').on('click', '.nk-fullpage-scroll-down', function (e) {
        e.preventDefault();
        slideShowNext();
    });

    var wheelEvent = 'onwheel' in document ? 'wheel' : 'mousewheel';
    if (wheelEvent) {
        // mouse wheel scroll
        var timeout = void 0;
        var isStopped = true;
        _utility.$wnd.on(wheelEvent, function (e) {
            // check if delta >= 2 and mouse under slider
            if (Math.abs(e.originalEvent.deltaY) < 2 || !(0, _utility.$)(e.target).parents('.nk-fullpage').length) {
                return;
            }

            // we need to check acceleration because of mac os smooth scroll.
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                isStopped = true;
            }, 100);

            if (!isStopped) {
                return;
            }
            isStopped = false;

            if (e.originalEvent.deltaY > 0) {
                slideShowNext();
            } else if (e.originalEvent.deltaY < 0) {
                slideShowPrev();
            }
        });
    }

    // touch swipe
    var touchStart = 0;
    var touchDelta = 0;
    _utility.$wnd.on('touchstart', function (e) {
        touchStart = e.originalEvent.touches[0].screenY;
        touchDelta = 0;
    });
    _utility.$wnd.on('touchmove touchend', function (e) {
        var y = e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0].screenY : false;
        touchDelta = y === false ? touchDelta : touchStart - y;

        // check if delta >= 2 and mouse under slider
        if (Math.abs(touchDelta) < 2 || !(0, _utility.$)(e.target).parents('.nk-fullpage').length) {
            return;
        }

        if (e.type === 'touchend') {
            if (touchDelta > 0) {
                slideShowNext();
            } else if (touchDelta < 0) {
                slideShowPrev();
            }
        }
    });
}

exports.initFullPage = initFullPage;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initHoverImage = undefined;

var _utility = __webpack_require__(0);

/* Hover Image */
function initHoverImage() {
    var $hoverImages = (0, _utility.$)('.nk-hover-image');

    if (!$hoverImages.length) {
        return;
    }

    // change image src on links hover
    function setHoverImage($item) {
        $item.each(function () {
            var $this = (0, _utility.$)(this);
            var $hoverImage = $this.closest('.nk-hover-image');
            $hoverImage.find('.nk-hover-image-links a').removeClass('active');
            $this.addClass('active');

            var $img = $hoverImage.find('.nk-hover-image-img:not(.hide):eq(0)');
            var $clonedImg = $img.clone();

            $img.after($clonedImg);

            $img.attr('src', $this.attr('data-hover-image'));

            // Trigger a reflow, flushing the CSS changes. This need to place new element in dom and show it, then add opacity 0 with transition.
            // Info here - https://stackoverflow.com/questions/11131875/what-is-the-cleanest-way-to-disable-css-transition-effects-temporarily
            // eslint-disable-next-line
            $clonedImg[0].offsetHeight;

            $clonedImg.addClass('hide');

            setTimeout(function () {
                $clonedImg.remove();
            }, 500);
        });
    }

    $hoverImages.on('mouseover', '.nk-hover-image-links a:not(.active)', function () {
        setHoverImage((0, _utility.$)(this));
    });
    setHoverImage((0, _utility.$)('.nk-hover-image .nk-hover-image-links a.active'));

    // sticky image
    function updateImagePosition() {
        window.requestAnimationFrame(function () {
            $hoverImages.each(function () {
                var $this = (0, _utility.$)(this);
                var $cont = $this.find('.nk-hover-image-img-cont');
                var $img = $cont.find('.bg-image');
                var thisRect = $this[0].getBoundingClientRect();
                var setTop = 0;
                var fixed = false;

                // if scrolled page - enable sticky
                if (thisRect.top <= 0 && _utility.wndH - thisRect.bottom <= 0) {
                    fixed = true;

                    // scrolled down - need to stick to the parent bottom
                } else if (_utility.wndH - thisRect.bottom > 0) {
                    setTop = thisRect.bottom - thisRect.top - _utility.wndH;
                }

                $img.css({
                    position: fixed ? 'fixed' : '',
                    left: fixed ? $cont.offset().left : '',
                    width: fixed ? $cont.width() : '',
                    top: setTop || ''
                });
            });
        });
    }
    updateImagePosition();
    _utility.$wnd.on('ready load resize orientationchange scroll', updateImagePosition);
}

exports.initHoverImage = initHoverImage;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPortfolio = undefined;

var _utility = __webpack_require__(0);

/* Portfolio */
function initPortfolio() {
    var $halfCarousel = (0, _utility.$)('.nk-portfolio-single-half > .row > div').children('.nk-carousel, .nk-carousel-2, .nk-carousel-3');

    if (!$halfCarousel.length) {
        return;
    }

    // half portfolio carousel size
    (0, _utility.debounceResize)(function () {
        $halfCarousel.css('height', '');
        $halfCarousel.find('.flickity-viewport').css('height', Math.max(800, Math.min(_utility.wndH, $halfCarousel.closest('.nk-portfolio-single-half').height())));
    });
}

exports.initPortfolio = initPortfolio;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initShop = undefined;

var _utility = __webpack_require__(0);

/* Shop */
function initShop() {
    var self = this;
    var $header = (0, _utility.$)('.nk-shop-header');
    var $products = (0, _utility.$)('.nk-shop-products');

    // saved layout size.
    var layoutSize = localStorage.getItem('skylith-shop-layout-size');
    if (!layoutSize) {
        if ($products.hasClass('nk-shop-products-1-col')) {
            layoutSize = 1;
        } else if ($products.hasClass('nk-shop-products-2-col')) {
            layoutSize = 2;
        } else if ($products.hasClass('nk-shop-products-4-col')) {
            layoutSize = 4;
        } else {
            layoutSize = 3;
        }
    }

    function updateLayoutClass() {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

        size = parseInt(size, 10) || 3;

        (0, _utility.$)('.nk-shop-layout-toggle').removeClass('active').filter('[data-cols="' + size + '"]').addClass('active');

        $products.removeClass('nk-shop-products-1-col nk-shop-products-2-col nk-shop-products-3-col nk-shop-products-4-col').addClass('nk-shop-products-' + size + '-col');

        localStorage.setItem('skylith-shop-layout-size', size);
    }

    if ($products.length) {
        updateLayoutClass(layoutSize);

        // on layout toggle click.
        $header.on('click', '.nk-shop-layout-toggle:not(.active)', function (e) {
            e.preventDefault();
            var $this = (0, _utility.$)(this);
            updateLayoutClass($this.attr('data-cols'));
        });
    }

    // filter toggle
    var $filter = (0, _utility.$)('.nk-shop-filter');

    function toggleFilter() {
        var active = $filter.hasClass('active');

        _utility.tween.set($filter, {
            display: 'block',
            height: 'auto',
            marginBottom: '',
            paddingTop: '',
            paddingBottom: ''
        });
        _utility.tween.set($filter, {
            height: $filter.outerHeight()
        });
        if (active) {
            _utility.tween.to($filter, 0.3, {
                display: 'none',
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginBottom: 0,
                ease: Power1.easeInOut,
                onComplete: function onComplete() {
                    $filter.removeAttr('style');
                    (0, _utility.debounceResize)();
                }
            });

            $filter.removeClass('active');
            (0, _utility.$)('.nk-shop-filter-toggle').removeClass('active');
        } else {
            _utility.tween.from($filter, 0.3, {
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginBottom: 0,
                ease: Power1.easeInOut,
                onComplete: function onComplete() {
                    $filter.removeAttr('style');
                    (0, _utility.debounceResize)();
                }
            });

            $filter.addClass('active');
            (0, _utility.$)('.nk-shop-filter-toggle').addClass('active');
        }
    }

    if ($filter.length) {
        $header.on('click', '.nk-shop-filter-toggle', function (e) {
            e.preventDefault();
            toggleFilter();
        });
    }

    // Cart toggle
    var $cart = (0, _utility.$)('.nk-shop-cart');

    if ($cart.length) {
        $header.on('click', '.nk-shop-cart-toggle', function (e) {
            e.preventDefault();
            $cart.toggleClass('active');
        });
        (0, _utility.$)('.nk-shop-cart-close').on('click', function (e) {
            e.preventDefault();
            $cart.toggleClass('active');
        });
        $cart.on('click', function (e) {
            if (e.target === this) {
                e.stopPropagation();
                $cart.toggleClass('active');
            }
        });
    }

    // scroll to ratings
    (0, _utility.$)('a.nk-product-rating').on('click', function (e) {
        var isHash = this.hash;
        if (isHash) {
            var $hashBlock = (0, _utility.$)(isHash).closest('.nk-tabs');
            if ($hashBlock.length) {
                self.scrollTo($hashBlock);
            }
            (0, _utility.$)('.nk-tabs').find('[data-toggle="tab"][href="' + isHash + '"]').click();
        }
        e.preventDefault();
    });

    // carousel for products
    (0, _utility.$)('.nk-product-carousel').each(function () {
        var $carousel = (0, _utility.$)(this).find('.nk-carousel-inner');
        var $thumbs = (0, _utility.$)(this).find('.nk-product-carousel-thumbs');
        var $thumbsCont = $thumbs.children();
        var curY = 0;
        var thumbsH = 0;
        var thumbsContH = 0;
        var thumbsBusy = false;

        function updateValues() {
            if ($thumbsCont[0]._gsTransform && $thumbsCont[0]._gsTransform.y) {
                curY = $thumbsCont[0]._gsTransform.y;
            } else {
                curY = 0;
            }
            thumbsH = $thumbs.height();
            thumbsContH = $thumbsCont.height();
        }

        $thumbsCont.on('click', '> div', function () {
            if (thumbsBusy) {
                return;
            }

            var index = (0, _utility.$)(this).index();
            $carousel.flickity('select', index);
        });

        $carousel.on('select.flickity', function () {
            var api = $carousel.data('flickity');
            if (!api) {
                return;
            }
            // set selected nav cell
            var $selected = $thumbsCont.children().removeClass('active').eq(api.selectedIndex).addClass('active');

            // scroll nav
            updateValues();
            var selectedTop = $selected.position().top + curY;
            if (selectedTop < 0) {
                _utility.tween.to($thumbsCont, 0.2, {
                    y: curY - selectedTop
                });
            } else {
                var selectedH = $selected.outerHeight(true);
                if (selectedTop + selectedH > thumbsH) {
                    _utility.tween.to($thumbsCont, 0.2, {
                        y: curY - (selectedTop + selectedH - thumbsH)
                    });
                }
            }
        });

        var startY = false;
        var mc = new Hammer.Manager($thumbs[0]);
        mc.add(new Hammer.Pan({
            pointers: 1,
            threshold: 0
        }));
        mc.on('pan press', function (e) {
            e.preventDefault();

            // init
            if (startY === false) {
                updateValues();
                startY = curY;
            }

            // move
            thumbsBusy = true;
            if (thumbsContH > thumbsH) {
                curY = Math.min(0, Math.max(e.deltaY + startY, thumbsH - thumbsContH));
                _utility.tween.set($thumbsCont, {
                    y: curY
                });
            }
            if (e.isFinal) {
                startY = false;

                setTimeout(function () {
                    thumbsBusy = false;
                }, 0);
            }
        });
    });
}

exports.initShop = initShop;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initStretch = undefined;

var _utility = __webpack_require__(0);

/* Stretch items */
function initStretch() {
    var $stretchItems = (0, _utility.$)('.nk-stretch, .nk-blog-isotope-wide');
    if (!$stretchItems.length) {
        return;
    }

    var $customCSS = (0, _utility.$)('<style>').appendTo('head');

    // add ID
    var uniqid = 1;
    $stretchItems.each(function () {
        if (!$stretchItems.attr('id')) {
            $stretchItems.attr('id', 'nk-stretch-item-' + uniqid++);
        }
    });

    function stretchThumbnails() {
        var styles = '';
        $stretchItems.each(function () {
            var $this = (0, _utility.$)(this);
            var rect = this.getBoundingClientRect();
            var left = rect.left;
            var right = rect.right - rect.width;
            var ml = parseFloat($this.css('margin-left') || 0);
            var mr = parseFloat($this.css('margin-right') || 0);
            if ($this.hasClass('nk-blog-isotope-wide')) {
                if (left === right) {
                    styles += '#' + $this.attr('id') + ' .nk-post-thumb {\n                        left: ' + (-rect.left + ml) + 'px;\n                        right: ' + (-rect.left + mr) + 'px;\n                        width: calc(100% + ' + (rect.left * 2 - ml - mr) + 'px);\n                    }';
                }
            } else {
                styles += '#' + $this.attr('id') + ' {\n                    margin-left: ' + (ml - left) + 'px;\n                    margin-right: ' + (mr - right) + 'px;\n                }';
            }
        });
        $customCSS.html(styles);

        // relayout isotope
        $stretchItems.closest('.nk-isotope').each(function () {
            if ((0, _utility.$)(this).data('isotope')) {
                (0, _utility.$)(this).isotope('layout');
            }
        });
    }
    stretchThumbnails();
    _utility.$wnd.on('ready load resize orientationchange', stretchThumbnails);
}

exports.initStretch = initStretch;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initSlider = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

 Init Slider

 -------------------------------------------------------------------*/
function initSlider() {
    var $sliders = (0, _utility.$)('.nk-slider');
    if (!$sliders.length) {
        return;
    }

    var self = this;

    // init each slider
    $sliders.each(function () {
        var $slider = (0, _utility.$)(this);
        var $eachItems = $slider.find('.nk-slider-item');

        // parse slides
        var slides = [];
        $eachItems.each(function () {
            var $this = (0, _utility.$)(this);
            slides.push({
                $item: $this,
                $content: $this.find('.nk-slider-content').html(),
                img: $this.find('.nk-slider-image').attr('src'),
                author: $this.attr('data-author'),
                title: $this.attr('data-title'),
                thumb: $this.attr('data-thumb')
            });
        });

        // set height
        var height = $slider.attr('data-height') || 600;
        $slider.css('min-height', height);

        // container for slider items
        var $container = (0, _utility.$)('<div class="container' + ($slider.attr('data-container') === 'false' ? '-fluid' : '') + '">');
        (0, _utility.$)('<div class="nk-slider-container">').append($container).appendTo($slider);

        // image blocks
        var $image1 = (0, _utility.$)('<div class="nk-slider-bg-image">').appendTo($slider);
        var $image2 = (0, _utility.$)('<div class="nk-slider-bg-image">').appendTo($slider);

        // content
        var $content = (0, _utility.$)('<div class="nk-slider-content">').append('<div></div>').appendTo($container);
        var $content2 = (0, _utility.$)('<div class="nk-slider-content">').append('<div></div>').appendTo($container);

        // content centering
        var contentCentering = $slider.attr('data-content-centering') || 'bottom';
        $content.addClass('nk-slider-content-' + contentCentering);
        $content2.addClass('nk-slider-content-' + contentCentering);

        var isBusy = 0;
        var curIndex = 0;

        // autoplay
        var enableAutoplay = $slider.attr('data-autoplay');
        var autoplayTimeout = void 0;
        function runAutoplay() {
            clearTimeout(autoplayTimeout);
            if (enableAutoplay) {
                autoplayTimeout = setTimeout(function () {
                    // eslint-disable-next-line
                    slideShowNext();
                }, Math.max(parseInt(enableAutoplay, 10), 1000));
            }
        }

        // author name
        var showAuthor = $slider.attr('data-show-author') === 'true';
        var $author = showAuthor ? (0, _utility.$)('<div class="nk-slider-author">').appendTo($container) : false;
        function updateAuthor() {
            if (showAuthor && $author) {
                var text = '';
                if (typeof slides[curIndex] !== 'undefined' && slides[curIndex].author) {
                    text = self.options.templates.sliderAuthor.replace('{{name}}', slides[curIndex].author);
                }
                $author.html(text);
            }
        }

        // slide number
        var showSlideNumbers = $slider.attr('data-show-slide-numbers') === 'true';
        var $slideNumbers = showSlideNumbers ? (0, _utility.$)('<div class="nk-slider-numbers">').appendTo($container) : false;
        function updateSlideNumbers() {
            if (showSlideNumbers && $slideNumbers) {
                $slideNumbers.html((curIndex < 9 ? '0' : '') + (curIndex + 1) + ' / ' + (slides.length < 10 ? '0' : '') + slides.length);
            }
        }

        // navigation
        var $rightNav = void 0;
        if ($slider.attr('data-show-nav') === 'true') {
            $rightNav = '<ul class="nk-slider-nav">';
            for (var k = 0; k < slides.length; k++) {
                $rightNav += '<li>' + (k < 9 ? '0' : '') + (k + 1) + '</li>';
            }
            $rightNav += '</ul>';
            $rightNav = (0, _utility.$)($rightNav);
            $container.append($rightNav);

            $rightNav.on('click', 'li:not(.active)', function () {
                var idx = (0, _utility.$)(this).index();
                var direction = 'right';

                if (idx > curIndex) {
                    direction = 'left';
                }

                // eslint-disable-next-line
                slideShow(idx, direction);
            });
        }
        function updateNavNumbers() {
            if ($rightNav && $rightNav.length) {
                $rightNav.children('li').removeClass('active').eq(curIndex).addClass('active');
            }
        }

        // bullets
        var $bullets = void 0;
        if ($slider.attr('data-show-bullets') === 'true') {
            $bullets = '<ul class="nk-slider-bullets">';
            for (var _k = 0; _k < slides.length; _k++) {
                $bullets += '<li>' + (_k < 9 ? '0' : '') + (_k + 1) + '</li>';
            }
            $bullets += '</ul>';
            $bullets = (0, _utility.$)($bullets);
            $container.append($bullets);

            $bullets.on('click', 'li:not(.active)', function () {
                var idx = (0, _utility.$)(this).index();
                var direction = 'right';

                if (idx > curIndex) {
                    direction = 'left';
                }

                // eslint-disable-next-line
                slideShow(idx, direction);
            });
        }
        function updateBullets() {
            if ($bullets && $bullets.length) {
                $bullets.children('li').removeClass('active').eq(curIndex).addClass('active');
            }
        }

        // thumbs
        var $thumbs = void 0;
        var $thumbsCont = void 0;
        var thumbsCurX = 0;
        var thumbsW = 0;
        var thumbsContW = 0;
        var thumbsBusy = false;
        function updateThumbs() {
            if ($thumbsCont && $thumbsCont.length) {
                $thumbsCont.children('li').removeClass('active').eq(curIndex).addClass('active');

                if ($thumbsCont[0]._gsTransform && $thumbsCont[0]._gsTransform.x) {
                    thumbsCurX = $thumbsCont[0]._gsTransform.x;
                } else {
                    thumbsCurX = 0;
                }
                thumbsW = $thumbs.width();
                thumbsContW = $thumbsCont.width();
            }
        }
        function scrollThumbs() {
            if ($thumbs && $thumbs.length) {
                var $selected = $thumbsCont.children('li').eq(curIndex);
                var selectedLeft = $selected.position().left;
                if (selectedLeft < 0) {
                    _utility.tween.to($thumbsCont, 0.2, {
                        x: thumbsCurX - selectedLeft
                    });
                } else {
                    var selectedW = $selected.outerWidth(true);
                    if (selectedLeft + selectedW > thumbsW) {
                        _utility.tween.to($thumbsCont, 0.2, {
                            x: thumbsCurX - (selectedLeft + selectedW - thumbsW)
                        });
                    }
                }
            }
        }
        if ($slider.attr('data-show-thumbs') === 'true') {
            $thumbs = '<div class="nk-slider-thumbs"><ul>';
            for (var _k2 = 0; _k2 < slides.length; _k2++) {
                $thumbs += '<li><img src="' + slides[_k2].thumb + '" alt=""></li>';
            }
            $thumbs += '</ul></div>';
            $thumbs = (0, _utility.$)($thumbs);
            $thumbsCont = $thumbs.children();
            $container.append($thumbs);

            $thumbsCont.on('click', 'li:not(.active)', function () {
                if (thumbsBusy) {
                    return;
                }

                var idx = (0, _utility.$)(this).index();
                var direction = 'right';

                if (idx > curIndex) {
                    direction = 'left';
                }

                // eslint-disable-next-line
                slideShow(idx, direction);

                scrollThumbs();
            });

            // swipe
            var thumbsStartX = false;
            var mc = new Hammer.Manager($thumbs[0]);
            mc.add(new Hammer.Pan({
                pointers: 1,
                threshold: 0
            }));
            mc.on('pan press', function (e) {
                e.preventDefault();

                // init
                if (thumbsStartX === false) {
                    updateThumbs();
                    thumbsStartX = thumbsCurX;
                }

                // move
                thumbsBusy = true;
                if (thumbsContW > thumbsW) {
                    thumbsCurX = Math.min(0, Math.max(e.deltaX + thumbsStartX, thumbsW - thumbsContW));
                    _utility.tween.set($thumbsCont, {
                        x: thumbsCurX
                    });
                }
                if (e.isFinal) {
                    thumbsStartX = false;

                    setTimeout(function () {
                        thumbsBusy = false;
                    }, 0);
                }
            });
        }

        // show new slide
        // effect: fade, up, down
        function slideShow(index) {
            var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fade';
            var force = arguments[2];

            if (typeof slides[index] !== 'undefined' && curIndex !== index && !isBusy || force) {
                isBusy = 1;

                // animate image background
                switch (effect) {
                    case 'left':
                    case 'right':
                        _utility.tween.set($image2, {
                            x: effect === 'left' ? '100%' : '-100%',
                            display: 'block'
                        });
                        $image2.css('background-image', 'url("' + slides[index].img + '")');
                        _utility.tween.to($image2, 0.8, {
                            x: '0%',
                            force3D: true,
                            ease: Power1.easeInOut
                        });
                        _utility.tween.to($image1, 0.8, {
                            opacity: 0,
                            scale: 0.9,
                            force3D: true,
                            ease: Power1.easeInOut,
                            onComplete: function onComplete() {
                                $image1.css('background-image', 'url("' + slides[index].img + '")');
                                _utility.tween.set($image1, {
                                    scale: 1,
                                    opacity: 1
                                });
                                $image2.css('background-image', '');
                                _utility.tween.set($image2, {
                                    display: 'none'
                                });
                                isBusy = 0;
                            }
                        });
                        break;
                    default:
                        // fade
                        _utility.tween.set($image2, {
                            opacity: 0,
                            display: 'block'
                        });
                        $image2.css('background-image', 'url("' + slides[index].img + '")');
                        _utility.tween.to($image2, 0.8, {
                            opacity: 1,
                            force3D: true,
                            onComplete: function onComplete() {
                                $image1.css('background-image', 'url("' + slides[index].img + '")');
                                $image2.css('background-image', '');
                                _utility.tween.set($image2, {
                                    display: 'none'
                                });
                                isBusy = 0;
                            }
                        });
                        break;
                }

                // set new content
                _utility.tween.set($content2, {
                    opacity: 0,
                    y: effect === 'left' ? 100 : -100,
                    display: 'flex'
                });

                $content2.children().html(slides[index].$content);

                _utility.tween.to($content, 0.5, {
                    opacity: 0,
                    y: effect === 'left' ? -100 : 100,
                    force3D: true
                });
                _utility.tween.to($content2, 0.5, {
                    opacity: 1,
                    y: 0,
                    force3D: true,
                    delay: 0.1,
                    onComplete: function onComplete() {
                        $content.children().html(slides[index].$content);

                        _utility.tween.set($content, {
                            opacity: 1,
                            clearProps: 'transform'
                        });
                        _utility.tween.set($content2, {
                            display: 'none'
                        });
                    }
                });

                curIndex = index;

                $eachItems.removeClass('nk-slider-item-current').eq(index).addClass('nk-slider-item-current');

                updateAuthor();
                updateSlideNumbers();
                updateNavNumbers();
                updateBullets();
                updateThumbs();
                scrollThumbs();
                runAutoplay();
            }
        }
        slideShow(curIndex, 'fade', 1);

        // show next / previous slider
        function slideShowNext() {
            slideShow(curIndex !== slides.length - 1 ? curIndex + 1 : 0, 'left');
        }
        function slideShowPrev() {
            slideShow(curIndex !== 0 ? curIndex - 1 : slides.length - 1, 'right');
        }

        // create arrows
        if ($slider.attr('data-show-arrows') === 'true') {
            (0, _utility.$)('<div class="nk-slider-arrow nk-slider-arrow-prev"><span class="pe-7s-angle-left"></span></div>').appendTo($container);
            (0, _utility.$)('<div class="nk-slider-arrow nk-slider-arrow-next"><span class="pe-7s-angle-right"></span></div>').appendTo($container);
        }

        // create slideshow controls
        if ($slider.attr('data-show-slideshow-nav') === 'true') {
            (0, _utility.$)('<div class="nk-slider-slideshow-nav">\n                <div class="nk-slider-arrow nk-slider-arrow-prev"><span class="pe-7s-angle-left"></span></div>\n                <div class="nk-slider-arrow nk-slider-arrow-next"><span class="pe-7s-angle-right"></span></div>\n                <div class="nk-slider-fullscreen"><span class="pe-7s-expand1"></span></div>\n            </div>').appendTo($container);
        }

        // click on controls
        $slider.on('click', '.nk-slider-arrow-prev', function () {
            slideShowPrev();
        });
        $slider.on('click', '.nk-slider-arrow-next', function () {
            slideShowNext();
        });

        // touch swipe
        var touchStart = 0;
        var touchDelta = 0;
        _utility.$wnd.on('touchstart', function (e) {
            touchStart = e.originalEvent.touches[0].screenX;
            touchDelta = 0;
        });
        _utility.$wnd.on('touchmove touchend', function (e) {
            var x = e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0].screenX : false;
            touchDelta = x === false ? touchDelta : touchStart - x;

            // check if delta >= 2 and mouse under slider
            if (Math.abs(touchDelta) < 2 || !(0, _utility.$)(e.target).parents('.nk-slider').length) {
                return;
            }

            if (e.type === 'touchend') {
                if (touchDelta > 0) {
                    slideShowNext();
                } else if (touchDelta < 0) {
                    slideShowPrev();
                }
            }
        });
    });
}

exports.initSlider = initSlider;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initForms = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init AJAX Forms

-------------------------------------------------------------------*/
function initForms() {
    var self = this;

    // Create Spinners in input number
    (0, _utility.$)('<span class="nk-form-control-number-up"></span>').insertAfter('.nk-form-control-number input');
    (0, _utility.$)('<span class="nk-form-control-number-down"></span>').insertAfter('.nk-form-control-number input');
    _utility.$doc.on('click', '.nk-form-control-number-up', function () {
        var $input = (0, _utility.$)(this).siblings('input');
        var max = $input.attr('max') || 9999999;
        var newVal = void 0;

        var oldValue = parseFloat($input.val());
        if (oldValue >= max) {
            newVal = oldValue;
        } else {
            newVal = oldValue + 1;
        }
        $input.val(newVal);
        $input.trigger('change');
    });
    _utility.$doc.on('click', '.nk-form-control-number-down', function () {
        var $input = (0, _utility.$)(this).siblings('input');
        var min = $input.attr('min') || -9999999;
        var newVal = void 0;

        var oldValue = parseFloat($input.val());
        if (oldValue <= min) {
            newVal = oldValue;
        } else {
            newVal = oldValue - 1;
        }
        $input.val(newVal);
        $input.trigger('change');
    });

    if (typeof _utility.$.validator === 'undefined') {
        return;
    }

    // Validate Forms
    (0, _utility.$)('form:not(.nk-form-ajax):not([novalidate])').each(function () {
        (0, _utility.$)(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement: function errorPlacement(error, element) {
                var $parent = element.parent('.input-group');
                var $parentNumber = element.parent('.nk-form-control-number');
                if ($parent.length) {
                    $parent.after(error);
                } else if ($parentNumber.length) {
                    $parentNumber.parent().after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            }
        });
    });
    // ajax form
    (0, _utility.$)('form.nk-form-ajax:not([novalidate])').each(function () {
        (0, _utility.$)(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement: function errorPlacement(error, element) {
                var $parent = element.parent('.input-group');
                if ($parent.length) {
                    $parent.after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            },

            // Submit the form via ajax (see: jQuery Form plugin)
            submitHandler: function submitHandler(form) {
                var $form = (0, _utility.$)(form);
                var $responseSuccess = $form.find('.nk-form-response-success');
                var $responseError = $form.find('.nk-form-response-error');

                _utility.$.ajax({
                    type: 'POST',
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    success: function success(response) {
                        response = JSON.parse(response);
                        if (response.type && response.type === 'success') {
                            $responseError.hide();
                            $responseSuccess.html(response.response).show();
                            form.reset();
                        } else {
                            $responseSuccess.hide();
                            $responseError.html(response.response).show();
                        }
                        self.debounceResize();
                    },
                    error: function error(response) {
                        $responseSuccess.hide();
                        $responseError.html(response.responseText).show();
                        self.debounceResize();
                    }
                });
            }
        });
    });
}

exports.initForms = initForms;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initTeamBlock = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

 Team Block

 -------------------------------------------------------------------*/
function initTeamBlock() {
    function activateMemberBlock($item) {
        var id = $item.attr('data-item-id');

        // add active class to item
        $item.siblings().removeClass('active');
        $item.addClass('active');

        // add class to item background
        $item.siblings('.nk-team-block-backgrounds:eq(0)').find('[data-bg-id="' + id + '"]').addClass('active').siblings().removeClass('active');
    }

    // prepare team blocks
    (0, _utility.$)('.nk-team-block').each(function () {
        var $this = (0, _utility.$)(this);

        // prepare backgrounds
        var $backgrounds = (0, _utility.$)('<div class="nk-team-block-backgrounds">');
        $this.find('.nk-team-member img.nk-team-member-photo').each(function () {
            var $img = (0, _utility.$)(this);
            var $parent = $img.parent();
            var id = $parent.index();

            $parent.attr('data-item-id', id);
            (0, _utility.$)('<div>').css({
                'background-image': 'url("' + $img.attr('src') + '")'
            }).attr('data-bg-id', id).appendTo($backgrounds);
        });
        $this.append($backgrounds);

        // activate item
        var $activeMember = $this.children('.nk-team-member.active:eq(0)');
        if (!$activeMember.length) {
            $activeMember = $this.children('.nk-team-member:eq(0)');
        }
        activateMemberBlock($activeMember);
    });

    // hover activation
    _utility.$body.on('click', '.nk-team-block .nk-team-member', function () {
        activateMemberBlock((0, _utility.$)(this));
    });
}

exports.initTeamBlock = initTeamBlock;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initGmaps = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Gmaps

-------------------------------------------------------------------*/
function initGmaps() {
    // stretch gmaps
    function stretch() {
        // column stretch
        (0, _utility.$)('.nk-gmaps-stretch').each(function () {
            var $this = (0, _utility.$)(this);
            var $row = $this.closest('.row');
            var $col = $this.closest('[class*="col-"]');
            var rectGmap = this.getBoundingClientRect();
            var rectRow = $row[0].getBoundingClientRect();
            var rectCol = $col[0].getBoundingClientRect();
            var leftGmap = rectGmap.left;
            var rightGmap = _utility.wndW - rectGmap.right;
            var leftRow = rectRow.left + (parseFloat($row.css('padding-left')) || 0);
            var rightRow = _utility.wndW - rectRow.right + (parseFloat($row.css('padding-right')) || 0);
            var leftCol = rectCol.left;
            var rightCol = _utility.wndW - rectCol.right;
            var css = {
                'margin-left': 0,
                'margin-right': 0
            };

            var bodyLeft = parseFloat(_utility.$body.css('paddingLeft'));
            var bodyRight = parseFloat(_utility.$body.css('paddingRight'));

            // We need to round numbers because in some situations the same blocks have different offsets, for example
            // Row right is 68
            // Col right is 68.015625
            // I don't know why :(
            if (Math.round(leftRow) === Math.round(leftCol)) {
                var ml = parseFloat($this.css('margin-left') || 0);
                css['margin-left'] = ml - leftGmap + bodyLeft;
            }

            if (Math.round(rightRow) === Math.round(rightCol)) {
                var mr = parseFloat($this.css('margin-right') || 0);
                css['margin-right'] = mr - rightGmap + bodyRight;
            }

            $this.css(css);
        });
    }

    stretch();
    _utility.$wnd.on('ready load resize orientationchange', function () {
        stretch();
    });
}

exports.initGmaps = initGmaps;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initInstagram = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Instagram

-------------------------------------------------------------------*/
function initInstagram() {
    var self = this;
    var $instagram = (0, _utility.$)('.nk-instagram');
    if (!$instagram.length || !self.options.templates.instagram) {
        return;
    }

    /**
     * Templating a instagram item using '{{ }}' braces
     * @param  {Object} data Instagram item details are passed
     * @return {String} Templated string
     */
    function templating(data, temp) {
        var tempVariables = ['link', 'image', 'caption'];

        for (var i = 0, len = tempVariables.length; i < len; i++) {
            temp = temp.replace(new RegExp('{{' + tempVariables[i] + '}}', 'gi'), data[tempVariables[i]]);
        }

        return temp;
    }

    $instagram.each(function () {
        var $this = (0, _utility.$)(this);
        var options = {
            userID: $this.attr('data-instagram-user-id') || null,
            count: $this.attr('data-instagram-count') || 8,
            template: $this.attr('data-instagram-template') || self.options.templates.instagram,
            quality: $this.attr('data-instagram-quality') || 'sm', // sm, md, lg
            loadingText: self.options.templates.instagramLoadingText,
            failText: self.options.templates.instagramFailText,
            apiPath: self.options.templates.instagramApiPath
        };

        // stop if running in file protocol
        if (window.location.protocol === 'file:') {
            $this.html('<div class="col-12">' + options.failText + '</div>');

            // eslint-disable-next-line
            console.error('You should run you website on webserver with PHP to get working Instagram');
            return;
        }

        $this.html('<div class="col-12">' + options.loadingText + '</div>');

        // Fetch instagram images
        _utility.$.getJSON(options.apiPath, {
            userID: options.userID,
            count: options.count
        }, function (response) {
            $this.html('');

            for (var i = 0; i < options.count; i++) {
                var instaItem = false;
                if (response[i]) {
                    instaItem = response[i];
                } else if (response.statuses && response.statuses[i]) {
                    instaItem = response.statuses[i];
                } else {
                    break;
                }

                var resolution = 'thumbnail';
                if (options.quality === 'md') {
                    resolution = 'low_resolution';
                }
                if (options.quality === 'lg') {
                    resolution = 'standard_resolution';
                }

                var tempData = {
                    link: instaItem.link,
                    image: instaItem.images[resolution].url,
                    caption: instaItem.caption
                };

                $this.append(templating(tempData, options.template));
            }

            // resize window
            self.debounceResize();
        }).fail(function (a) {
            $this.html('<div class="col-12">' + options.failText + '</div>');
            _utility.$.error(a.responseText);
        });
    });
}

exports.initInstagram = initInstagram;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initTwitter = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Twitter

-------------------------------------------------------------------*/
function initTwitter() {
    var self = this;
    var $twtFeeds = (0, _utility.$)('.nk-twitter-list, .nk-twitter-list-2');
    if (!$twtFeeds.length || !self.options.templates.twitter) {
        return;
    }

    /**
     * Templating a tweet using '{{ }}' braces
     * @param  {Object} data Tweet details are passed
     * @return {String}      Templated string
     */
    function templating(data, temp) {
        var tempVariables = ['date', 'tweet', 'avatar', 'url', 'retweeted', 'screen_name', 'user_name'];

        for (var i = 0, len = tempVariables.length; i < len; i++) {
            temp = temp.replace(new RegExp('{{' + tempVariables[i] + '}}', 'gi'), data[tempVariables[i]]);
        }

        return temp;
    }

    $twtFeeds.each(function () {
        var $this = (0, _utility.$)(this);
        var options = {
            username: $this.attr('data-twitter-user-name') || null,
            list: null,
            hashtag: $this.attr('data-twitter-hashtag') || null,
            count: $this.attr('data-twitter-count') || 2,
            hideReplies: $this.attr('data-twitter-hide-replies') === 'true',
            template: $this.attr('data-twitter-template') || self.options.templates.twitter,
            loadingText: self.options.templates.twitterLoadingText,
            failText: self.options.templates.twitterFailText,
            apiPath: self.options.templates.twitterApiPath
        };

        // stop if running in file protocol
        if (window.location.protocol === 'file:') {
            $this.html(options.failText);
            // eslint-disable-next-line
            console.error('You should run you website on webserver with PHP to get working Twitter');
            return;
        }

        // Set loading
        $this.html('<span>' + options.loadingText + '</span>');

        // Fetch tweets
        _utility.$.getJSON(options.apiPath, {
            username: options.username,
            list: options.list,
            hashtag: options.hashtag,
            count: options.count,
            exclude_replies: options.hideReplies
        }, function (twt) {
            $this.html('');

            for (var i = 0; i < options.count; i++) {
                var tweet = false;
                if (twt[i]) {
                    tweet = twt[i];
                } else if (twt.statuses && twt.statuses[i]) {
                    tweet = twt.statuses[i];
                } else {
                    break;
                }

                var tempData = {
                    user_name: tweet.user.name,
                    date: tweet.date_formatted,
                    tweet: tweet.text_entitled,
                    avatar: '<img src="' + tweet.user.profile_image_url + '" />',
                    url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                    retweeted: tweet.retweeted,
                    screen_name: '@' + tweet.user.screen_name
                };

                $this.append(templating(tempData, options.template));
            }

            // resize window
            self.debounceResize();
        }).fail(function (a) {
            $this.html(options.failText);
            _utility.$.error(a.responseText);
        });
    });
}

exports.initTwitter = initTwitter;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/* Object Fit Images */
function initPluginObjectFitImages() {
    if (typeof objectFitImages !== 'undefined') {
        objectFitImages();
    }
}

exports.initPluginObjectFitImages = initPluginObjectFitImages;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginStickySidebar = undefined;

var _utility = __webpack_require__(0);

/*------------------------------------------------------------------

  Init Plugin Sticky Sidebar

-------------------------------------------------------------------*/
function initPluginStickySidebar() {
    if (typeof _utility.$.fn.stick_in_parent === 'undefined') {
        return;
    }

    (0, _utility.$)('.nk-sidebar-sticky').each(function () {
        var $this = (0, _utility.$)(this);
        var $parent = $this.parent();

        $parent.addClass('nk-sidebar-sticky-parent');

        $this.wrapInner('<div>').children().stick_in_parent({
            parent: $parent,
            recalc_every: 50,
            offset_top: parseInt($this.attr('data-offset-top'), 10) || 0,

            // fixed ADS reloading issue https://github.com/leafo/sticky-kit/issues/45
            spacer: false
        })

        // we need to set min height on parent block (in theme it is equal height column) to prevent sidebar content jumping
        .on('sticky_kit:unbottom sticky_kit:stick sticky_kit:bottom', function () {
            $parent.css('min-height', (0, _utility.$)(this).height());
        }).on('sticky_kit:unstick', function () {
            $parent.css('min-height', '');
        });
    });
}

exports.initPluginStickySidebar = initPluginStickySidebar;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginNano = undefined;

var _utility = __webpack_require__(0);

/* Nano Scroller */
function initPluginNano($context) {
    if (typeof _utility.$.fn.nanoScroller !== 'undefined') {
        ($context || _utility.$doc).find('.nano').nanoScroller();
    }
}

exports.initPluginNano = initPluginNano;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginJarallax = undefined;

var _utility = __webpack_require__(0);

/* Jarallax */
function initPluginJarallax() {
    if (typeof _utility.$.fn.jarallax === 'undefined') {
        return;
    }
    var self = this;

    // video backgrounds
    (0, _utility.$)('.bg-video[data-video]').each(function () {
        (0, _utility.$)(this).attr('data-jarallax-video', (0, _utility.$)(this).attr('data-video'));
        (0, _utility.$)(this).removeAttr('data-video');
    });

    // header parallax
    var $parallaxHeader = (0, _utility.$)('.nk-header-title-parallax-content').eq(0);
    if ($parallaxHeader.length) {
        var $headerImageOrVideo = $parallaxHeader.find('> .bg-image, > .bg-video').eq(0);
        var $headerContent = $headerImageOrVideo.find('~ *');
        var options = {};

        var parallaxedBg = $headerImageOrVideo.hasClass('bg-image-parallax') || $headerImageOrVideo.hasClass('bg-video-parallax');
        if (parallaxedBg) {
            $parallaxHeader = $headerImageOrVideo;
            options.speed = self.options.parallaxSpeed;
        } else {
            options = {
                type: 'custom',
                imgSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                imgWidth: 1,
                imgHeight: 1
            };
        }

        options.onScroll = function (calc) {
            var scrollContent = Math.min(50, 50 * (1 - calc.visiblePercent));

            // fix if top banner not on top
            if (calc.beforeTop > 0) {
                scrollContent = 0;
            }

            $headerContent.css({
                opacity: calc.visiblePercent < 0 || calc.beforeTop > 0 ? 1 : calc.visiblePercent,
                transform: 'translateY(' + scrollContent + 'px) translateZ(0)'
            });
        };

        $parallaxHeader.jarallax(options);
    }

    // footer parallax
    var $parallaxFooter = (0, _utility.$)('.nk-footer-parallax, .nk-footer-parallax-opacity').eq(0);
    if ($parallaxFooter.length) {
        var $footerImage = $parallaxFooter.find('> .bg-image > div');
        var $footerContent = $parallaxFooter.find('> .bg-image ~ *');
        var footerParallaxScroll = $parallaxFooter.hasClass('nk-footer-parallax');
        var footerParallaxOpacity = $parallaxFooter.hasClass('nk-footer-parallax-opacity');
        $parallaxFooter.jarallax({
            type: 'custom',
            imgSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            imgWidth: 1,
            imgHeight: 1,
            onScroll: function onScroll(calc) {
                var scrollImg = -Math.min(100, 100 * (1 - calc.visiblePercent));
                var scrollInfo = -Math.min(50, 50 * (1 - calc.visiblePercent));
                if (footerParallaxScroll) {
                    $footerImage.css({
                        transform: 'translateY(' + scrollImg + 'px) translateZ(0)'
                    });
                    $footerContent.css({
                        transform: 'translateY(' + scrollInfo + 'px) translateZ(0)'
                    });
                }
                if (footerParallaxOpacity) {
                    $footerContent.css({
                        opacity: calc.visiblePercent < 0 ? 1 : calc.visiblePercent
                    });
                }
            }
        });
    }

    // primary parallax
    (0, _utility.$)('.bg-image-parallax, .bg-video-parallax').jarallax({
        speed: self.options.parallaxSpeed
    });

    // video without parallax
    (0, _utility.$)('.bg-video:not(.bg-video-parallax)').jarallax({
        speed: 1
    });
}

exports.initPluginJarallax = initPluginJarallax;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginFlickity = undefined;

var _utility = __webpack_require__(0);

function addDefaultArrows($carousel) {
    (0, _utility.$)('<div class="nk-flickity-arrow nk-flickity-arrow-prev"><span class="pe-7s-angle-left"></span></div>').on('click', function () {
        $carousel.flickity('previous');
    }).appendTo($carousel);

    (0, _utility.$)('<div class="nk-flickity-arrow nk-flickity-arrow-next"><span class="pe-7s-angle-right"></span></div>').on('click', function () {
        $carousel.flickity('next');
    }).appendTo($carousel);
}

function updateCustomArrows($carousel) {
    var data = $carousel.children('.nk-carousel-inner').data('flickity');
    var currIndex = data.selectedIndex;
    var nextIndex = void 0;
    var prevIndex = void 0;

    // get next and prev cells
    if (currIndex === 0) {
        nextIndex = 1;
        prevIndex = data.cells.length - 1;
    } else if (currIndex === data.cells.length - 1) {
        nextIndex = 0;
        prevIndex = data.cells.length - 2;
    } else {
        nextIndex = currIndex + 1;
        prevIndex = currIndex - 1;
    }
    var $nextCell = (0, _utility.$)(data.cells[nextIndex].element);
    var $prevCell = (0, _utility.$)(data.cells[prevIndex].element);
    var $currCell = (0, _utility.$)(data.cells[currIndex].element);

    // get name and sources
    var nextName = $nextCell.find('.nk-carousel-item-name').text();
    var prevName = $prevCell.find('.nk-carousel-item-name').text();
    var currName = $currCell.find('.nk-carousel-item-name').html();
    var currLinks = $currCell.find('.nk-carousel-item-links').html();

    // add info to buttons
    $carousel.find('.nk-carousel-next > .nk-carousel-arrow-name').html(nextName);
    $carousel.find('.nk-carousel-prev > .nk-carousel-arrow-name').html(prevName);
    $carousel.find('.nk-carousel-current > .nk-carousel-name').html(currName);
    $carousel.find('.nk-carousel-current > .nk-carousel-links').html(currLinks);
}

// prevent click event fire when drag carousel
function noClickEventOnDrag($carousel) {
    $carousel.on('dragStart.flickity', function () {
        (0, _utility.$)(this).find('.flickity-viewport').addClass('is-dragging');
    });
    $carousel.on('dragEnd.flickity', function () {
        (0, _utility.$)(this).find('.flickity-viewport').removeClass('is-dragging');
    });
}

/* Flickity */
function initPluginFlickity() {
    if (typeof window.Flickity === 'undefined') {
        return;
    }

    /*
     * Hack to add imagesLoaded event
     * https://github.com/metafizzy/flickity/issues/328
     */
    Flickity.prototype.imagesLoaded = function () {
        if (!this.options.imagesLoaded) {
            return;
        }
        var _this = this;
        var timeout = false;

        imagesLoaded(this.slider).on('progress', function (instance, image) {
            var cell = _this.getParentCell(image.img);
            _this.cellSizeChange(cell && cell.element);
            if (!_this.options.freeScroll) {
                _this.positionSliderAtSelected();
            }
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                _this.dispatchEvent('imagesLoadedTimeout', null, [image.img, cell.element]);
            }, 100);
        });
    };

    var self = this;

    // carousel 1
    var $carousel1 = (0, _utility.$)('.nk-carousel > .nk-carousel-inner:not(.flickity-enabled)').parent();
    if ($carousel1.length) {
        $carousel1.children('.nk-carousel-inner').each(function () {
            (0, _utility.$)(this).flickity({
                pageDots: (0, _utility.$)(this).parent().attr('data-dots') === 'true' || false,
                autoPlay: parseFloat((0, _utility.$)(this).parent().attr('data-autoplay')) || false,
                prevNextButtons: false,
                wrapAround: (0, _utility.$)(this).parent().attr('data-loop') === 'true',
                cellAlign: (0, _utility.$)(this).parent().attr('data-cell-align') || 'center'
            });
            if ((0, _utility.$)(this).parent().attr('data-arrows') === 'true') {
                addDefaultArrows((0, _utility.$)(this));
            }
            updateCustomArrows((0, _utility.$)(this).parent());
        }).on('select.flickity', function () {
            updateCustomArrows((0, _utility.$)(this).parent());
        });
        $carousel1.on('click', '.nk-carousel-next', function () {
            (0, _utility.$)(this).parent().children('.nk-carousel-inner').flickity('next');
        });
        $carousel1.on('click', '.nk-carousel-prev', function () {
            (0, _utility.$)(this).parent().children('.nk-carousel-inner').flickity('previous');
        });
        noClickEventOnDrag($carousel1.children('.nk-carousel-inner'));
    }

    // carousel 2
    (0, _utility.$)('.nk-carousel-2 > .nk-carousel-inner:not(.flickity-enabled)').each(function () {
        (0, _utility.$)(this).flickity({
            pageDots: (0, _utility.$)(this).parent().attr('data-dots') === 'true' || false,
            autoPlay: parseFloat((0, _utility.$)(this).parent().attr('data-autoplay')) || false,
            prevNextButtons: false,
            wrapAround: (0, _utility.$)(this).parent().attr('data-loop') === 'true',
            imagesLoaded: true,
            cellAlign: (0, _utility.$)(this).parent().attr('data-cell-align') || 'center'
        });
        if ((0, _utility.$)(this).parent().attr('data-arrows') === 'true') {
            addDefaultArrows((0, _utility.$)(this));
        }
        noClickEventOnDrag((0, _utility.$)(this));
    });

    // carousel 3
    var $carousel3 = (0, _utility.$)('.nk-carousel-3 > .nk-carousel-inner:not(.flickity-enabled)').parent();
    // set height for items
    function setHeightCarousel3() {
        $carousel3.each(function () {
            var $this = (0, _utility.$)(this);
            var $allImages = $this.find('img');
            var size = $this.attr('data-size') || 0.8;

            // fit item to container
            if (size === 'container') {
                var $cont = (0, _utility.$)('.container:eq(0)');
                var containerW = $cont.length ? $cont.width() : '';
                $allImages.css({
                    'max-width': containerW,
                    height: 'auto'
                });
            } else {
                var resultH = _utility.wndH * size;
                var maxItemW = Math.min($this.parent().width(), _utility.wndW) * size;
                $allImages.each(function () {
                    if (this.naturalWidth && this.naturalHeight && resultH * this.naturalWidth / this.naturalHeight > maxItemW) {
                        resultH = maxItemW * this.naturalHeight / this.naturalWidth;
                    }
                });
                $allImages.css('height', resultH);
            }

            $this.children('.nk-carousel-inner').flickity('reposition');
        });
    }
    if ($carousel3.length) {
        $carousel3.children('.nk-carousel-inner').each(function () {
            (0, _utility.$)(this).flickity({
                pageDots: (0, _utility.$)(this).parent().attr('data-dots') === 'true' || false,
                autoPlay: parseFloat((0, _utility.$)(this).parent().attr('data-autoplay')) || false,
                prevNextButtons: false,
                wrapAround: (0, _utility.$)(this).parent().attr('data-loop') === 'true',
                imagesLoaded: true,
                cellAlign: (0, _utility.$)(this).parent().attr('data-cell-align') || 'center'
            });
            updateCustomArrows((0, _utility.$)(this).parent());
            if ((0, _utility.$)(this).parent().attr('data-arrows') === 'true') {
                addDefaultArrows((0, _utility.$)(this));
            }
        }).on('select.flickity', function () {
            updateCustomArrows((0, _utility.$)(this).parent());
        }).on('imagesLoadedTimeout.flickity', function () {
            // fix items height when images loaded
            setHeightCarousel3();
        });
        $carousel3.on('click', '.nk-carousel-next', function () {
            (0, _utility.$)(this).parents('.nk-carousel-3:eq(0)').children('.nk-carousel-inner').flickity('next');
        });
        $carousel3.on('click', '.nk-carousel-prev', function () {
            (0, _utility.$)(this).parents('.nk-carousel-3:eq(0)').children('.nk-carousel-inner').flickity('previous');
        });
        setHeightCarousel3();
        self.debounceResize(setHeightCarousel3);
        noClickEventOnDrag($carousel3.children('.nk-carousel-inner'));
    }

    // update products carousel
    var $storeCarousel = (0, _utility.$)('.nk-carousel-1, .nk-carousel-1, .nk-carousel-2, .nk-carousel-3').filter('.nk-store:not(.nk-store-carousel-enabled)').addClass('.nk-store-carousel-enabled');
    function updateStoreProducts() {
        $storeCarousel.each(function () {
            var currentTallest = 0;
            var currentRowStart = 0;
            var rowDivs = [];
            var topPosition = 0;
            var currentDiv = 0;
            var $el = void 0;
            (0, _utility.$)(this).find('.nk-product').each(function () {
                $el = (0, _utility.$)(this);
                $el.css('height', '');
                topPosition = $el.position().top;

                if (currentRowStart !== topPosition) {
                    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].css('height', currentTallest);
                    }
                    rowDivs.length = 0; // empty the array
                    currentRowStart = topPosition;
                    currentTallest = $el.innerHeight();
                    rowDivs.push($el);
                } else {
                    rowDivs.push($el);
                    currentTallest = currentTallest < $el.innerHeight() ? $el.innerHeight() : currentTallest;
                }
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].css('height', currentTallest);
                }
            });
        });
    }
    if ($storeCarousel.length) {
        $storeCarousel.children('.nk-carousel-inner').on('imagesLoadedTimeout.flickity', function () {
            // fix items height when images loaded
            setHeightCarousel3();
        });
        self.debounceResize(updateStoreProducts);
        updateStoreProducts();
    }

    // Carousel Parallax
    // thanks to https://github.com/metafizzy/flickity/issues/468#issuecomment-309120518
    (0, _utility.$)('.nk-carousel, .nk-carousel-2, .nk-carousel-3').filter('[data-parallax="true"]').each(function () {
        var $carousel = (0, _utility.$)(this).find('.flickity-enabled');
        var flkty = $carousel.data('flickity');
        var $imgs = $carousel.find('.flickity-slider > div .nk-carousel-parallax-img');
        $carousel.on('scroll.flickity', function () {
            flkty.slides.forEach(function (slide, i) {
                var img = $imgs[i];
                var x = 0;

                if (i === 0) {
                    x = Math.abs(flkty.x) > flkty.slidesWidth ? flkty.slidesWidth + flkty.x + flkty.slides[flkty.slides.length - 1].outerWidth + slide.target : slide.target + flkty.x;
                } else if (i === flkty.slides.length - 1) {
                    x = Math.abs(flkty.x) + flkty.slides[i].outerWidth < flkty.slidesWidth ? slide.target - flkty.slidesWidth + flkty.x - flkty.slides[i].outerWidth : slide.target + flkty.x;
                } else {
                    x = slide.target + flkty.x;
                }
                (0, _utility.$)(img).css('transform', 'translateX(' + x * (-1 / 5) + 'px)');
            });
        });
    });

    // Add numbers inside dots
    (0, _utility.$)('.nk-carousel-dots-3').each(function () {
        var count = 0;
        (0, _utility.$)('.flickity-page-dots .dot').each(function () {
            count++;
            (0, _utility.$)(this).append((count < 10 ? '0' : '') + count);
        });
    });

    // Set position to arrows when aligner to the bottom and enabled dots
    function correctBottomArrows(item) {
        var $this = (0, _utility.$)(item);
        var carouselOffset = $this.offset();
        var $dots = $this.find('.flickity-page-dots .dot');
        var $arrPrev = $this.find('.nk-flickity-arrow-prev');
        var $arrNext = $this.find('.nk-flickity-arrow-next');

        // calculate position for the prev and next arrows
        var prevPosX = false;
        var nextPosX = false;
        var posY = $dots.offset().top;
        $dots.each(function () {
            var $dot = (0, _utility.$)(this);
            var dotOffset = $dot.offset();

            if (prevPosX === false || prevPosX > dotOffset.left) {
                prevPosX = dotOffset.left;
            }
            if (nextPosX === false || nextPosX < dotOffset.left) {
                nextPosX = dotOffset.left;
            }
        });
        prevPosX -= carouselOffset.left;
        nextPosX -= carouselOffset.left;
        posY -= carouselOffset.top;

        $arrPrev.css({
            top: posY,
            left: prevPosX,
            right: 'auto',
            bottom: 'auto'
        });
        $arrNext.css({
            top: posY,
            left: nextPosX,
            right: 'auto',
            bottom: 'auto'
        });
    }
    var resizeTimeout = void 0;
    _utility.$wnd.on('ready load resize', function () {
        (0, _utility.$)('[data-arrows="true"][data-dots="true"].nk-carousel-arrows-bottom-center .flickity-enabled').each(function () {
            var _this2 = this;

            correctBottomArrows(this);

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                correctBottomArrows(_this2);
            }, 155); // flickity have debounce with 150ms
        });
    });
}

exports.initPluginFlickity = initPluginFlickity;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginIsotope = undefined;

var _utility = __webpack_require__(0);

/* Isotope */
function initPluginIsotope() {
    if (typeof window.Isotope === 'undefined') {
        return;
    }
    var self = this;

    (0, _utility.$)('.nk-isotope').each(function () {
        var $this = (0, _utility.$)(this);
        var $grid = $this.isotope({
            itemSelector: '.nk-isotope-item'
        });
        $grid.imagesLoaded().progress(function () {
            $grid.isotope('layout');
        });
        $grid.on('arrangeComplete', function () {
            self.debounceResize();
        });

        // filter
        var $filter = [];
        if ($this.parent().hasClass('nk-portfolio-list')) {
            $filter = $this.parent().prev('.nk-isotope-filter');
        } else {
            $filter = $this.prev('.nk-isotope-filter');
        }
        if ($filter.length) {
            $filter.on('click', '[data-filter]', function (e) {
                e.preventDefault();
                var filter = (0, _utility.$)(this).attr('data-filter');

                (0, _utility.$)(this).addClass('active').siblings().removeClass('active');

                $grid.isotope({
                    filter: filter === '*' ? '' : '[data-filter*=' + filter + ']'
                });
            });
        }
    });

    // filter toggler
    _utility.$body.on('click', '[href="#nk-toggle-filter"]:not(.busy)', function (e) {
        var $pagination = (0, _utility.$)(this).parent('.nk-pagination');
        var $filter = $pagination.next('.nk-isotope-filter');
        var isActive = $filter.hasClass('nk-isotope-filter-active');

        if (!$pagination.length || !$filter.length) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        $pagination.addClass('busy');

        if (isActive) {
            $pagination.removeClass('nk-isotope-filter-active');
            $filter.removeClass('nk-isotope-filter-active');

            _utility.tween.to($filter.children(), 0.2, {
                opacity: 0
            });

            _utility.tween.to($filter, 0.2, {
                height: 0,
                marginBottom: 0,
                marginTop: 0,
                force3D: true,
                delay: 0.2,
                display: 'none',
                onComplete: function onComplete() {
                    $pagination.removeClass('busy');
                    (0, _utility.debounceResize)();
                }
            });
        } else {
            $pagination.addClass('nk-isotope-filter-active');
            $filter.addClass('nk-isotope-filter-active');

            $filter.css('height', 'auto');
            var filterHeight = $filter.height();
            $filter.css('height', 0);
            _utility.tween.set($filter.children(), {
                y: -10,
                opacity: 0
            });
            _utility.tween.to($filter, 0.2, {
                height: filterHeight,
                marginBottom: 30,
                marginTop: -23,
                force3D: true,
                display: 'block'
            });

            _utility.tween.staggerTo($filter.children(), 0.2, {
                y: 0,
                opacity: 1,
                delay: 0.1
            }, 0.04, function () {
                $pagination.removeClass('busy');
                (0, _utility.debounceResize)();
            });
        }
    });
}

exports.initPluginIsotope = initPluginIsotope;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginPhotoswipe = undefined;

var _utility = __webpack_require__(0);

/* PhotoSwipe */
function initPluginPhotoswipe() {
    var $gallery = (0, _utility.$)('.nk-popup-gallery');
    var $slideshow = (0, _utility.$)('.nk-slider .nk-slider-fullscreen').closest('.nk-slider');

    if ($slideshow.length) {
        $gallery = $gallery.add($slideshow);
    }

    if (typeof PhotoSwipe === 'undefined' || !$gallery.length) {
        return;
    }

    function parseVideoURL(url) {
        // parse youtube ID
        function getYoutubeID(ytUrl) {
            // eslint-disable-next-line no-useless-escape
            var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
            var match = ytUrl.match(regExp);
            return match && match[1].length === 11 ? match[1] : false;
        }

        // parse vimeo ID
        function getVimeoID(vmUrl) {
            // eslint-disable-next-line no-useless-escape
            var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
            var match = vmUrl.match(regExp);
            return match && match[3] ? match[3] : false;
        }

        var Youtube = getYoutubeID(url);
        var Vimeo = getVimeoID(url);

        if (Youtube) {
            return {
                type: 'youtube',
                id: Youtube
            };
        } else if (Vimeo) {
            return {
                type: 'vimeo',
                id: Vimeo
            };
        }

        return false;
    }

    // prepare photoswipe markup
    var markup = '' + '<div class="pswp nk-pswp" tabindex="-1" role="dialog" aria-hidden="true">' + '   <div class="pswp__bg"></div>' + '   <div class="pswp__scroll-wrap">' + '      <div class="pswp__container">' + '          <div class="pswp__item"></div>' + '          <div class="pswp__item"></div>' + '          <div class="pswp__item"></div>' + '      </div>' + '      <div class="pswp__ui pswp__ui--hidden">' + '          <div class="pswp__top-bar">' + '              <div class="pswp__counter"></div>' + '              <a class="pswp__button pswp__button--close" title="Close"></a>' + '              <a class="pswp__button pswp__button--share" title="Share"></a>' + '              <a class="pswp__button pswp__button--fs" title="Fullscreen"></a>' + '              <a class="pswp__button pswp__button--zoom" title="Zoom"></a>' + '          </div>' + '          <div class="pswp__preloader">' + '              <div class="pswp__preloader__icn">' + '                  <div class="pswp__preloader__cut">' + '                      <div class="pswp__preloader__donut"></div>' + '                  </div>' + '              </div>' + '          </div>' + '          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">' + '              <div class="pswp__share-tooltip"></div>' + '          </div>' + '          <a class="pswp__button pswp__button--arrow--left" title="Previous"></a>' + '          <a class="pswp__button pswp__button--arrow--right" title="Next"></a>' + '          <div class="pswp__caption">' + '              <div class="pswp__caption__center"></div>' + '          </div>' + '      </div>' + '   </div>' + '</div>';
    (0, _utility.$)('body').append(markup);

    // init code
    function parseThumbnailElements(el) {
        var thumbElements = (0, _utility.$)(el).find('.nk-gallery-item, .nk-slider-item > .nk-slider-image');
        var items = [];
        var $meta = void 0;
        var size = void 0;
        var videoSize = void 0;
        var item = void 0;
        var video = void 0;

        thumbElements.each(function () {
            $meta = (0, _utility.$)(this);
            size = ($meta.attr('data-size') || '1920x1080').split('x');
            videoSize = ($meta.attr('data-video-size') || '1920x1080').split('x');
            video = $meta.attr('data-video');
            video = video ? parseVideoURL(video) : video;

            if (video) {
                if (video.type === 'youtube') {
                    video = '<div class="nk-pswp-video"><div><iframe width="640" height="360" src="https://www.youtube.com/embed/' + video.id + '" frameborder="0" allowfullscreen></iframe></div></div>';
                } else {
                    video = '<div class="nk-pswp-video"><div><iframe src="https://player.vimeo.com/video/' + video.id + '?byline=0&portrait=0" width="640" height="360" frameborder="0" allowfullscreen></iframe></div></div>';
                }

                item = {
                    html: video,
                    vw: parseInt(videoSize[0], 10),
                    vh: parseInt(videoSize[1], 10)
                };
            } else {
                // create slide object
                item = {
                    src: $meta.hasClass('nk-slider-image') ? $meta.attr('src') : $meta.attr('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                // save link to element for getThumbBoundsFn
                item.el = this;
            }

            items.push(item);
        });

        return items;
    }

    function resizeVideo(data, curItem) {
        if (typeof curItem === 'undefined') {
            if (data && data.itemHolders.length) {
                data.itemHolders.forEach(function (val) {
                    if (val.item && val.item.html) {
                        resizeVideo(data, val.item);
                    }
                });
            }
            return;
        }

        // calculate real viewport in pixels
        var vpW = data.viewportSize.x * window.devicePixelRatio;
        var vpH = data.viewportSize.y * window.devicePixelRatio;
        var ratio = curItem.vw / curItem.vh;
        var resultW = void 0;
        var $container = (0, _utility.$)(curItem.container);

        var bars = data.options.barsSize;
        var barTop = 0;
        var barBot = 0;

        if (bars) {
            barTop = bars.top && bars.top !== 'auto' ? bars.top : 0;
            barBot = bars.bottom && bars.bottom !== 'auto' ? bars.bottom : 0;
        }
        vpH -= barTop + barBot;

        if (ratio > vpW / vpH) {
            resultW = vpW;
        } else {
            resultW = vpH * ratio;
        }

        $container.find('.nk-pswp-video').css('max-width', resultW);
        $container.css({
            top: barTop,
            bottom: barBot
        });
    }

    function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = (0, _utility.$)('.nk-pswp')[0];
        var items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        var options = {
            captionAndToolbarShowEmptyCaptions: false,
            closeEl: true,
            captionEl: false,
            fullscreenEl: true,
            zoomEl: true,
            shareEl: true,
            counterEl: true,
            arrowEl: true,
            shareButtons: [{ id: 'facebook', label: 'Share in Facebook', url: 'https://www.facebook.com/sharer/sharer.php?u={{url}}' }, { id: 'twitter', label: 'Share in Twitter', url: 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}' }, {
                id: 'pinterest',
                label: 'Pin to Pinterest',
                url: 'https://www.pinterest.com/pin/create/button/' + '?url={{url}}&media={{image_url}}&description={{text}}'
            }],
            bgOpacity: 1,
            tapToClose: true,
            tapToToggleControls: false,
            showHideOpacity: true,
            galleryUID: galleryElement.getAttribute('data-pswp-uid')
        };

        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid === index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (Number.isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

        gallery.listen('resize', function () {
            resizeVideo(this);
        });

        gallery.listen('afterChange', function () {
            resizeVideo(this);
        });

        gallery.init();
    }

    function photoswipeParseHash() {
        var hash = window.location.hash.substring(1);
        var params = {};

        if (hash.length < 5) {
            // pid=1
            return params;
        }

        var vars = hash.split('&');
        for (var _i = 0; _i < vars.length; _i++) {
            if (!vars[_i]) {
                continue;
            }
            var pair = vars[_i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        return params;
    }

    // select all gallery elements
    var i = 0;
    $gallery.each(function () {
        var $thisGallery = (0, _utility.$)(this);
        $thisGallery.attr('data-pswp-uid', i + 1);

        $thisGallery.on('click', '.nk-gallery-item, .nk-slider-fullscreen', function (e) {
            e.preventDefault();
            var index = 0;
            var isSlider = (0, _utility.$)(this).hasClass('nk-slider-fullscreen');
            var clicked = this;

            $thisGallery.find('.nk-gallery-item, .nk-slider-item').each(function (idx) {
                if (isSlider && (0, _utility.$)(this).hasClass('nk-slider-item-current') || !isSlider && this === clicked) {
                    index = idx;
                    return false;
                }
                return true;
            });

            openPhotoSwipe(index, $thisGallery[0]);
        });
        i++;
    });

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, $gallery.get(hashData.gid - 1), true, true);
    }
}

exports.initPluginPhotoswipe = initPluginPhotoswipe;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginJustifiedGallery = undefined;

var _utility = __webpack_require__(0);

/* JustifiedGallery */
function initPluginJustifiedGallery() {
    if (typeof _utility.$.fn.justifiedGallery === 'undefined') {
        return;
    }

    (0, _utility.$)('.nk-justified-gallery').each(function () {
        var $this = (0, _utility.$)(this);
        var margin = parseFloat($this.data('margins')) || 30;
        $this.css({
            marginLeft: -margin,
            marginRight: -margin,
            width: 'calc(100% + ' + margin * 2 + 'px)'
        }).justifiedGallery({
            rowHeight: $this.data('rowHeight') || 300,
            maxRowHeight: $this.data('maxRowHeight') || 400,
            lastRow: $this.data('lastRow') || 'justify',
            margins: margin
        });
    });
}

exports.initPluginJustifiedGallery = initPluginJustifiedGallery;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initPluginBootstrap = undefined;

var _utility = __webpack_require__(0);

/* Bootstrap */
function initPluginBootstrap() {
    var self = this;

    // Tabs
    _utility.$wnd.on('shown.bs.tab', function () {
        self.debounceResize();
    });

    // Tooltips
    (0, _utility.$)('[data-toggle="tooltip"]').tooltip();
}

exports.initPluginBootstrap = initPluginBootstrap;

/***/ })
/******/ ]);