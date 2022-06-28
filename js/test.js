/* copyright abstrakti software */
var wtc;
if (!wtc) wtc = {};
String.prototype.trim = function $String$$trim$() {
    return this.replace(/^\s+|\s+$/g, "")
};
if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}
var zc = {
    addUnloadEvent: function (func) {
        var oldonunload = window.onunload;
        if (typeof window.onunload != "function") window.onunload = function $window$onunload$() {
            func()
        };
        else window.onunload = function $window$onunload$() {
            if (oldonunload) oldonunload();
            func()
        }
    }
};

wtc.tvg = {
    currentNode: null,
    det: null,
    currentDet: false,
    currentPgmId: null,
    currentSta: null,
    schedule: {},
    stations: {},
    popup: null,
    videoQuery: "startVideo=true",
    tzOffset: 0,
    durationText: null,
    init: function $wtc$gd$init$() {
        this.currentNode = null;
        this.det = null;
        this.currentDet = false;
        this.currentPgmId = null;
        this.currentSta = null;
        this.det = document.createElement("div");
        this.det.id = "zc-dt";
        this.det.innerHTML = "<div id='zc-dt-c'><a class='zc-close' rel='nofollow' id='zc-dt-c-a' href='#' onclick='wtc.tvg.cleanDetail(true,false,true); return false;'>Fechar</a></div><div id='zc-dt-i'></div>";
        zc.addUnloadEvent(function () {
            var b = wtc.gd;
            if (b) {
                b.cleanDetail(true, true);
                wtc.gd = b = null
            }
            if (document.querySelectorAll || document.getElementsByClassName) {
                var y = document.querySelectorAll ? document.querySelectorAll(".zc-pg") : document.getElementById("zc-grid").getElementsByClassName(".zc-pg");
                for (var i = 0; i < y.length; i++) y[i].onclick = null;
                y = null
            } else jQuery("#zc-grid td.zc-pg").removeAttr("onclick")
        })
    },
    ld: function $wtc$gd$a$(t, sch, tp) { // t é o td clicado
        if (sch == '0')
            return false;
        var d;
        var r;
        while (t.tagName.toUpperCase() != "TD")
            t = t.parentNode;
        if (!this.currentDet) { // se o currentDet ainda não estava carregado 
            t.className += " zc-pg-s";
            this.currentNode = t;
            //this.currentRow = r = t.parentNode.parentNode.parentNode;
            //alert($(t.parentNode.parentNode.parentNode).html());
            //alert($(t.parentNode.parentNode.parentNode).closest('.outerTable').html());
            //this.currentRow = r = $(t).closest('.outerTable').get(0);
            //this.currentRow = r = t.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            r = t.parentNode.parentNode.parentNode.parentNode; while (r.className.indexOf('outerTable') < 0) r = r.parentNode;
            this.currentRow = r;
            //alert($(r).html());
            //alert($(r.nextSibling).html());
            r.parentNode.insertBefore(this.det, r.nextSibling);
            this.currentDet = true;
            this.ldD(sch, tp)
        } else if (t != this.currentNode) { //se está mudando o detalhe pra outro td 
            r = this.currentRow;
            //var f = t.parentNode.parentNode.parentNode;
            //var f = $(t).closest('.outerTable').get(0);
            //var f = t.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            f = t.parentNode.parentNode.parentNode.parentNode; while (f.className.indexOf('outerTable') < 0) f = f.parentNode;
            if (r == f) this.cleanDetail(false, false, false);
            else {
                this.cleanDetail(true, false, true);
                r = f;
                r.parentNode.insertBefore(this.det, r.nextSibling)
            }
            t.className += " zc-pg-s";
            this.currentDet = true;
            this.currentNode = t;
            this.currentRow = r;
            f = null;
            this.ldD(sch, tp)
        } else this.cleanDetail(true, false, true); //se está fechando o detalhe do td atual
        r = null;
        d = null;
        t = null;
        return false
    },
    ldD: function $wtc$gd$ldD$(sch, tp) {
        var d = this.det || document.getElementById("zc-dt");
        var i = d.childNodes[1];
        jQuery(i).html('<img src="/images/ajax-loader.gif">');
        if (tp == "es")
            urlPrefix = "/Programas/es";
        if (tp == "cs")
            urlPrefix = "/Canais/s";
        jQuery.ajax({
            type: "GET",
            url: urlPrefix + sch.toString(),
            async: true,
            dataType: "html",
            cache: true,
            success: function (data) {
                if (data) {
                    var d = this.det || document.getElementById("zc-dt");
                    var i = d.childNodes[1];
                    //i.innerHTML = "";
                    //i.innerHTML = data;
                    try {
                        jQuery(i).html(data);
                    } catch (e) { }
                    //i.innerHTML += '<div class="zc-dt-copy"></div>';
                    //jQuery(".zc-dt-copy").css("width", narrowStyle);
                    i.innerHTML += '<br style="clear:both;"/>';
                    //jQuery(".zc-dt-copy").html(i.innerHTML);
                } else wtc.tvg.cleanDetail()
            },
            error: function () {
                wtc.tvg.cleanDetail()
                var d = this.det || document.getElementById("zc-dt");
                var i = d.childNodes[1];
                //jQuery(i).html('Ooops. Ocorreu um erro. :-(');
                jQuery(i).html('<b>Ooops. Ocorreu um erro!</b><br><img src="/images/triste.gif">');
            }
        })
    },

    cleanDetail: function $wtc$gd$cleanDetail$(removeDt, fullClean, cleanI) {
        var t;
        var c;
        var d = this.det;
        if (this.currentDet || (d = document.getElementById("zc-dt")) != null) {
            if (fullClean) if (c = d.firstChild.firstChild) {
                c.onclick = null;
                c = null
            }
            if (removeDt) {
                if (cleanI) {
                    d.childNodes[1].innerHTML =
                        "";
                    if (c = d.childNodes[2]) {
                        d.removeChild(c);
                        c = null
                    }
                }
                d.parentNode.removeChild(d)
            }
            if (t = this.currentNode) {
                t.className = t.className.replace(" zc-pg-s", "");
                t = null
            }
        }
        this.currentDet = false;
        d = null
    },

    setNarrowStyle: function $wtc$gd$setNarrowStyle$(pgmId) {
        var isNarrowGrid = jQuery("#zc-wrapper-inner").width() == 780 ? false : true;
        var narrowStyle;
        if (isNarrowGrid) if (this.schedule[pgmId].program.image) narrowStyle = "210px";
        else narrowStyle = "340px";
        else if (this.schedule[pgmId].program.image) narrowStyle = "372px";
        else narrowStyle = "510px";
        return narrowStyle
    }
};


/*
var LikeBtn;
if (!LikeBtn) LikeBtn = {};
LikeBtn.vote = function 
*/


if (typeof (LikeBtn) == "undefined" || !LikeBtn) {
    //(function (b) {
    //    var a = b.createElement("link");
    //    a.type = "text/css";
    //    a.rel = "stylesheet";
    //    a.href = "//likebtn.com/css/854b4eb.css";
    //    (b.getElementsByTagName("head")[0] || b.getElementsByTagName("body")[0]).appendChild(a)
    //})(document);
    var LikeBtn = function (b) {
        var c = {};
        c.locales = ["en", "ru", "de", "ja", "uk", "kk", "nl", "hu", "sv", "tr"];
        c.styles = ["white", "lightgray", "gray", "black", "padded", "drop", "line", "github", "transparent", "youtube", "habr", "heartcross", "plusminus", "google", "greenred", "large"];
        c.debug = 0;
        c.runned = 0;
        c.interval;
        c.plan = 0;
        c.cookie_vote_name = "likebtn_vote";
        c.cookie_lifetime = 31449600;
        c.cookie_count_lifetime = "1800";
        c.cookie_count_name = "likebtn_count";
        c.cookie_locale_lifetime = 2592000;
        c.lang_auto = "auto";
        c.default_lang = "en";
        c.cookie_locale_name = "likebtn_locale";
        c.http_headers_backend = "http://ajaxhttpheaders2.appspot.com";
        c.browser_locale_detection_running = false;
        c.browser_locale;
        c.max_buttons_per_page = {
            0: 1,
            1: 10,
            2: 25,
            3: 1000000,
            4: 1000000
        };
        c.addthis_loaded = false;
        c.share_buttons_count = 8;
        c.popup_close_delay = 2000;
        c.local_delimiter = "!";
        c.deafault_popup_content_order = ["popup_share", "popup_donate", "popup_html"];
        c.addthis_buttons = {
            all: ["facebook", "twitter", "preferred_1", "preferred_2", "preferred_3", "preferred_4", "email", "compact"],
            ru: ["vk", "odnoklassniki_ru", "twitter", "facebook", "preferred_1", "preferred_2", "email", "compact"]
        };
        c.event_types = {
            loaded: "likebtn.loaded",
            like: "likebtn.like",
            like: "likebtn.like",
            unlike: "likebtn.unlike",
            dislike: "likebtn.dislike",
            undislike: "likebtn.undislike"
        };
        c.settings = {
            values: [],
            schema: {
                lang: {
                    type: "lang"
                },
                identifier: {
                    type: "string"
                },
                group_identifier: {
                    type: "string"
                },
                local_domain: {
                    type: "string"
                },
                domain_from_parent: {
                    type: "bool"
                },
                show_like_label: {
                    type: "bool"
                },
                show_dislike_label: {
                    type: "bool"
                },
                popup_dislike: {
                    type: "bool"
                },
                like_enabled: {
                    type: "bool"
                },
                dislike_enabled: {
                    type: "bool"
                },
                counter_clickable: {
                    type: "bool"
                },
                counter_type: {
                    type: "string"
                },
                counter_show: {
                    type: "bool"
                },
                substract_dislikes: {
                    type: "bool"
                },
                display_only: {
                    type: "bool"
                },
                unlike_allowed: {
                    type: "bool"
                },
                like_dislike_at_the_same_time: {
                    type: "bool"
                },
                style: {
                    type: "string"
                },
                share_enabled: {
                    type: "bool"
                },
                item_url: {
                    type: "url"
                },
                item_title: {
                    type: "string",
                    escape: "html"
                },
                item_description: {
                    type: "string",
                    escape: "html"
                },
                item_image: {
                    type: "url"
                },
                addthis_pubid: {
                    type: "string"
                },
                addthis_service_codes: {
                    type: "string"
                },
                show_copyright: {
                    type: "bool"
                },
                popup_enabled: {
                    type: "bool"
                },
                popup_position: {
                    type: "string"
                },
                popup_style: {
                    type: "string"
                },
                popup_hide_on_outside_click: {
                    type: "bool"
                },
                popup_html: {
                    type: "string"
                },
                popup_donate: {
                    type: "string",
                    escape: "no"
                },
                popup_content_order: {
                    type: "string",
                    escape: "html"
                },
                event_handler: {
                    type: "string"
                },
                debug: {
                    type: "bool"
                },
                info_message: {
                    type: "bool"
                },
                i18n_like: {
                    type: "string",
                    escape: "html"
                },
                i18n_dislike: {
                    type: "string",
                    escape: "html"
                },
                i18n_like_tooltip: {
                    type: "string",
                    escape: "html"
                },
                i18n_dislike_tooltip: {
                    type: "string",
                    escape: "html"
                },
                i18n_unlike_tooltip: {
                    type: "string",
                    escape: "html"
                },
                i18n_undislike_tooltip: {
                    type: "string",
                    escape: "html"
                },
                i18n_share_text: {
                    type: "string",
                    escape: "html"
                },
                i18n_popup_close: {
                    type: "string",
                    escape: "html"
                },
                i18n_popup_text: {
                    type: "string",
                    escape: "html"
                },
                i18n_popup_donate: {
                    type: "string",
                    escape: "html"
                },
                host: {
                    type: "string",
                    nonmodifiable: 1
                },
                url: {
                    type: "string",
                    nonmodifiable: 1
                }
            }
        };
        c.settings.values = [];
        c.settings.default_values = {
            lang: "en",
            identifier: "",
            group_identifier: "",
            local_domain: "",
            domain_from_parent: 0,
            show_like_label: 1,
            show_dislike_label: 0,
            popup_dislike: 0,
            like_enabled: 1,
            dislike_enabled: 1,
            counter_clickable: 0,
            counter_type: "number",
            counter_show: "1",
            display_only: 0,
            substract_dislikes: 0,
            unlike_allowed: 1,
            like_dislike_at_the_same_time: 0,
            style: "white",
            share_enabled: 1,
            item_url: "",
            item_title: "",
            item_description: "",
            item_image: "",
            addthis_pubid: "ra-511b51aa3d843ec4",
            addthis_service_codes: "",
            show_copyright: 1,
            popup_enabled: 1,
            popup_position: "top",
            popup_style: "light",
            popup_hide_on_outside_click: 1,
            popup_html: "",
            popup_donate: "",
            popup_content_order: "",
            event_handler: "",
            debug: 0,
            info_message: 1,
            i18n_like: "",
            i18n_dislike: "",
            i18n_like_tooltip: "",
            i18n_dislike_tooltip: "",
            i18n_unlike_tooltip: "",
            i18n_undislike_tooltip: "",
            i18n_share_text: "",
            i18n_popup_close: "",
            i18n_popup_text: "",
            i18n_popup_donate: "",
            host: window.location.hostname,
            url: window.location.href
        };
        c.translations = {
            en: {
                i18n_like: "Like",
                i18n_dislike: "Dislike",
                i18n_like_tooltip: "I like this",
                i18n_dislike_tooltip: "I dislike this",
                i18n_unlike_tooltip: "Unlike",
                i18n_undislike_tooltip: "Undislike",
                i18n_share_text: "Would you like to share?",
                i18n_popup_close: "Close",
                i18n_popup_text: "Glad you liked it!",
                i18n_popup_donate: "Show gratitude in the form of a donation"
            }
        };
        c.dynamic_settings = {
            values: []
        };
        c.plans = {
            TRIAL: 9,
            FREE: 0,
            PLUS: 1,
            PRO: 2,
            VIP: 3,
            ULTRA: 4
        };
        c.forced_domain_from_parent = ["static.wix.com", "htmlcomponentservice.appspot.com"];
        c.loaded_assets = [];
        c.settings.set = function (e, h, g) {
            if (c.settings.schema[h] == null) {
                c.log("Unknown property name: property: " + h + ", index: " + e);
                return false
            }
            var f = c.settings.schema[h];
            var d;
            //c.assert(!f.nonmodifiable, "Attempt to modify unmodifiable property: " + h);
            switch (f.type) {
                case "bool":
                    if ((parseInt(g) || g == "true") && g != "false") {
                        d = 1
                    } else {
                        d = 0
                    }
                    break;
                case "url":
                    d = g + "";
                    c.log((d.substr(0, 7) == "http://" || d.substr(0, 8) == "https://" || d.substr(0, 2) == "//"), "Wrong URL format: " + g);
                    break;
                case "string":
                    d = g + "";
                    break;
                case "lang":
                    d = g + "";
                    break
            }
            if (c.isDefined(f.escape)) {
                switch (f.escape) {
                    case "html":
                        d = c.escapeHTML(d);
                        d = c.replaceAll(/"/, "&quot;", d);
                        break;
                    case "no":
                }
            } else {
                if (d) {
                    d = c.replaceAll(/"/, "", d + "")
                }
            } if (h == "style" && !c.inArray(d, c.styles)) {
                d = c.settings.default_values.style
            }
            if (typeof (c.settings.values[e]) == "undefined") {
                c.settings.values[e] = c.settings.default_values
            }
            c.settings.values[e][h] = d;
            if (h == "debug" && d) {
                c.debug = 1
            }
            return c.settings
        };
        c.settings.setDefaultHost = function () {
            c.settings.default_values.host = c.punycode.ToUnicode(c.settings.default_values.host)
        };
        c.dynamic_settings.set = function (d, f, e) {
            if (!c.isDefined(c.dynamic_settings.values[d])) {
                c.dynamic_settings.values[d] = {}
            }
            c.dynamic_settings.values[d][f] = e;
            return c.dynamic_settings
        };
        c.dynamic_settings.get = function (d, f) {
            var e;
            if (c.isDefined(c.dynamic_settings.values[d]) && c.isDefined(c.dynamic_settings.values[d][f])) {
                e = c.dynamic_settings.values[d][f]
            }
            return e
        };
        c.assertionError = function (d) {
            this.message = d
        };
        c.assertionError.prototype.toString = function () {
            return "LikeBtn: Assertion Error: " + (this.message || "[no message]")
        };
        c.assert = function (e, d) {
            if (!e) {
                c.log("LikeBtn assertion failed: " + d);
                throw new c.assertionError(d)
            }
        };
        c.isLocaleSupported = function (e) {
            var d = false;
            for (var f = 0; f < c.locales.length; f++) {
                if (c.locales[f] == e) {
                    d = true
                }
            }
            return d
        };
        c.init = function (d) {
            if (typeof document.body.style.maxHeight == "undefined") {
                return
            }
            c.settings.setDefaultHost();
            if ((typeof (d) == "undefined" || !d || !c.runned) && !c.interval) {
                c.interval = setInterval(function () {
                    c.initWrappers();
                    if (document.readyState === "complete") {
                        clearInterval(c.interval);
                        c.interval = 0
                    }
                }, 100)
            }
            c.addEventListener(document.body, "click", c.onBodyClick)
        };
        c.initWrappers = function () {
            var d;
            c.runned = 1;
            var f = c.q(".likebtn-wrapper");
            for (for_index = 0; for_index < f.length; for_index++) {
                var h = f[for_index];
                if (c.hasClass(h, "lb-loaded")) {
                    continue
                }
                h.className += " lb-loaded";
                d = c.dynamic_settings.values.length;
                if (c.dynamic_settings.get(d, "loaded")) {
                    continue
                }
                c.settings.values.push(c.cloneObject(c.settings.default_values));
                for (var e in c.settings.schema) {
                    value = h.getAttribute("data-" + e);
                    if (value) {
                        c.settings.set(d, e, value)
                    }
                }
                if (!c.settings.get(d, "identifier")) {
                    c.settings.set(d, "identifier", c.normalizeUrlIdentifier(c.settings.get(d, "url")))
                }
                value = h.getAttribute("data-color_scheme");
                if (value) {
                    c.settings.set(d, "style", value)
                }
                c.log("Settings loaded (index: " + d + ")", c.settings.values[d]);
                c.dynamic_settings.set(d, "wrapper", h);
                c.dynamic_settings.set(d, "identifier_hash", c.hashCode(c.settings.get(d, "identifier")));
                var g = c.settings.get(d, "lang");
                if (g == c.lang_auto || !c.isLocaleSupported(g)) {
                    c.browser_locale = c.getCookie(c.cookie_locale_name);
                    if (!c.browser_locale) {
                        if (!c.browser_locale_detection_running) {
                            c.browser_locale_detection_running = true;
                            c.dynamic_settings.set(d, "locale", "");
                            c.detectLocaleAndLoad()
                        }
                    } else {
                        if (c.isLocaleSupported(c.browser_locale)) {
                            c.dynamic_settings.set(d, "locale", c.browser_locale)
                        } else {
                            c.dynamic_settings.set(d, "locale", c.default_lang)
                        }
                        c.load(d)
                    }
                } else {
                    c.dynamic_settings.set(d, "locale", g);
                    c.load(d)
                }
            }
        };
        c.detectLocaleAndLoad = function () {
            //c.JSONP.get(c.http_headers_backend, {}, function (g) {
            //    c.log("Bworser Accept-Language", g);
            //    if (c.isDefined(g) && c.isDefined(g["Accept-Language"])) {
            //        c.browser_locale = g["Accept-Language"].substr(0, 2)
            //    } else {
            //        c.browser_locale = c.default_lang
            //    }
            //    c.browser_locale_detection_running = false;
            //    var e = new Date();
            //    e.setSeconds(e.getSeconds() + parseInt(c.cookie_locale_lifetime));
            //    c.setCookie(c.cookie_locale_name, c.browser_locale, {
            //        expires: e,
            //        path: "/"
            //    });
            //    var f = c.browser_locale;
            //    if (!c.isLocaleSupported(f)) {
            //        f = c.default_lang
            //    }
            //    for (var d in c.settings.values) {
            //        if (!c.isDefined(c.dynamic_settings.values[d]) || !c.isDefined(c.dynamic_settings.values[d]["locale"]) || !c.dynamic_settings.values[d]["locale"]) {
            //            c.dynamic_settings.set(d, "locale", f);
            //            c.load(d)
            //        }
            //    }
            //}, "callback", function () {
            //    for (var d in c.settings.values) {
            //        if (!c.isDefined(c.dynamic_settings.values[d]) || !c.isDefined(c.dynamic_settings.values[d]["locale"]) || !c.dynamic_settings.values[d]["locale"]) {
            //            c.dynamic_settings.set(d, "locale", c.default_lang);
            //            c.load(d)
            //        }
            //    }
            //})
        };
        c.load = function (e) {
            var d = "//likebtn.com/widget/item/";
            //c.assert(typeof (c.settings.values[e]) != "undefined", "Settings not found on LikeBtn load: " + e);
            //var f = c.getRequestSettings(e);
            if (c.isDefined(f.error_message)) {
                var g = c.dynamic_settings.get(e, "wrapper");
                c.infoMessage(e, g, f.error_message);
                c.dynamic_settings.set(e, "loaded", true);
                return
            }
            d = d + "?settings=" + encodeURIComponent(c.Base64.encode((c.JSON.encode(f))));
            c.log("Load HTML: " + d);
            //c.JSONP.get(d, {}, function (m) {
            //    var n = c.getIndexByIdentifierHash(c.hashCode(m.identifier), true);
            //    var h = c.dynamic_settings.get(n, "wrapper");
            //    if (!c.isDefined(h) || !h) {
            //        return false
            //    }
            //    if (c.isDefined(m.plan)) {
            //        c.plan = m.plan
            //    }
            //    h.className += " lb-style-" + "github"; //settings.get(n, "style")
            //    h.className += " lb-popup-position-" + "top"; // settings.get(n, "popup_position")
            //    h.className += " lb-popup-style-" + "light"; // settings.get(n, "popup_style")
            //    if (m.disabled) {
            //        c.infoMessage(n, h, 'Your website has been disabled. Contact <a href="http://www.likebtn.com" title="Like Button">LikeBtn.com</a>')
            //    } else {
            //        if (n >= c.max_buttons_per_page[c.plan]) {
            //            c.infoMessage(n, h, "Max " + c.max_buttons_per_page[c.plan] + ' buttons allowed. Upgrade your website plan on <a href="http://www.likebtn.com/#plans_pricing" title="Like Button">LikeBtn.com</a>');
            //            c.dynamic_settings.set(n, "loaded", true);
            //            return
            //        } else {
            //            if (!c.checkPlan(c.plans.ULTRA) && "https:" == document.location.protocol) {
            //                c.infoMessage(n, h, 'Your plan does not allow to load Like Button using HTTPS. Upgrade your website plan on <a href="http://www.likebtn.com/#plans_pricing" title="Like Button">LikeBtn.com</a>');
            //                c.dynamic_settings.set(n, "loaded", true);
            //                return
            //            } else {
            //                h.innerHTML = c.getHtml(m, n);
            //            }
            //        }
            //    }
            //    var o = c.getItemCountFromCookie(n);
            //    if (typeof (o) != "undefined" && o) {
            //        if (typeof (o["1"]) != "undefined") {
            //            var p = c.getItemCountEl(n, 1);
            //            if (typeof (p) != "undefined") {
            //                o["1"] = parseInt(o["1"]);
            //                if (isNaN(o["1"])) {
            //                    o["1"] = 0
            //                }
            //                c.showCounter(p, n)
            //            }
            //        } else {
            //            o["1"] = 0
            //        } if (typeof (o["-1"]) != "undefined") {
            //            var r = c.getItemCountEl(n, "-1");
            //            if (typeof (r) != "undefined") {
            //                o["-1"] = parseInt(o["-1"]);
            //                if (isNaN(o["-1"])) {
            //                    o["-1"] = 0
            //                }
            //                c.showCounter(r, n);
            //            }
            //        } else {
            //            o["-1"] = 0
            //        }
            //        var q = c.getCountsPrepared(n, {
            //            "1": o["1"],
            //            "-1": o["-1"]
            //        });
            //        if (c.isDefined(p)) {
            //            p.innerHTML = q["1"];
            //            p.setAttribute("data-count", o["1"]);
            //            c.showCounter(p, n)
            //        }
            //        if (c.isDefined(r)) {
            //            r.innerHTML = q["-1"];
            //            r.setAttribute("data-count", o["-1"]);
            //            c.showCounter(r, n)
            //        }
            //    }
            //    var l = c.getItemVoteType(n);
            //    if (l) {
            //        var k = [];
            //        if (l == "-1") {
            //            k.push(c.q("#lb-dislike-" + n))
            //        } else {
            //            if (l == "1") {
            //                k.push(c.q("#lb-like-" + n))
            //            } else {
            //                if (l == "2") {
            //                    k.push(c.q("#lb-dislike-" + n));
            //                    k.push(c.q("#lb-like-" + n))
            //                }
            //            }
            //        }
            //        for (el_index in k) {
            //            var j = k[el_index];
            //            if (typeof (j[0]) != "undefined") {
            //                j[0].className += " lb-voted"
            //            }
            //        }
            //        //c.processGroupIdentifier(n, 1)
            //    }
            //    c.setPopupPosition(n);
            //    c.dynamic_settings.set(n, "loaded", true);
            //    //c.triggerEvent(c.event_types.loaded, n)
            //})
        };
        c.share = function (O, z) {
            jQuery.ajax({
                type: "POST",
                url: "/Content/Vote",
                data: { ContentID: z, vote: O, previousVote: previousvote },
                success: function (data) {
                    //alert(data);
                    if (data == 0) {
                        c.displayVote(O, z);
                        modalLogin();
                    }

                }
            })
            c.displayVote(O, z);
        };
        c.vote = function (O, z) {
            if (O == 1) {
                var g = c.q("#lb-like-" + z + ".lb-share-active")
            } else {
                var g = c.q("#lb-dislike-" + z + ".lb-share-active")
            } if (typeof (g[0]) != "undefined") {
                return
            }
            previousvote = (typeof (c.q("#lb-like-" + z + ".lb-voted")[0]) != "undefined") ? 1 : 0
                         + (typeof (c.q("#lb-dislike-" + z + ".lb-voted")[0]) != "undefined") ? -1 : 0;
            //alert('Vote: ' + O + ', Content:' + z + ', previousvote=' + previousvote);
            jQuery.ajax({
                type: "POST",
                url: "/Content/Vote",
                data: { ContentID: z, vote: O, previousVote: previousvote },
                success: function (data) {
                    //alert(data);
                    if (data == 0)
                    {
                        c.displayVote(O, z);
                        modalLogin();
                    }

                }
            })
            c.displayVote(O, z);
        };
        c.displayVote = function (O, z) {
            //var x = c.getRequestSettings(z);
            //if (!c.needDomainFromParent(z)) {
            //    x.url = window.location.href
            //} else {
            //    if (document.referrer) {
            //        x.url = document.referrer
            //    } else {
            //        x.url = window.location.href
            //    }
            //}
            //var j = "//likebtn.com/widget/vote/1/2";
            //c.assert(typeof (c.settings.values[z]) != "undefined", "Settings not for LikeBtn: " + z);
            //c.log("Sending Vote request", c.settings.values[z]);
            //j = j.replace("/1/2", "/" + parseInt(O) + "/" + parseInt(z));
            //j = j + "?settings=" + encodeURIComponent(c.Base64.encode((c.JSON.encode(x))));
            //j = j + "&item_vote_type=" + c.getItemVoteType(z);
            //j = j + "&like_dislike_at_the_same_time=" + "0"; //settings.get(z, "like_dislike_at_the_same_time");
            //j = j + "&t=" + (new Date()).getTime() + "&nocache=.php";
            //c.log("Vote: " + j);

            //c.JSONP.get(j, {}, function (Q) {
            //    c.log("Vote result", Q);
            //    if (typeof (Q.result) == "undefined" || !Q.result || typeof (Q.data.type) == "undefined") {
            //        return
            //    }
            //    var T = c.getItemCount(Q.data.index, 1);
            //    var V = c.getItemCount(Q.data.index, "-1");
            //    var S = {
            //        "1": T,
            //        "-1": V
            //    };
            //    var P = c.getItemIdentifierHash(Q.data.index);
            //    var U = new Date();
            //    U.setSeconds(U.getSeconds() + parseInt(c.cookie_count_lifetime));
            //    c.setCookie(c.cookie_count_name + "" + P, c.JSON.encode(S), {
            //        expires: U,
            //        path: "/"
            //    });
            //    var W = c.getCookieAsObject(c.cookie_vote_name);
            //    if (typeof (W) == "undefined") {
            //        W = {}
            //    }
            //    if (Q.data.type == 0) {
            //        delete W[P]
            //    } else {
            //        W[P] = parseInt(Q.data.type)
            //    }
            //    var R = new Date();
            //    R.setYear(R.getFullYear() + 1);
            //    c.setCookie(c.cookie_vote_name, c.JSON.encode(W), {
            //        expires: R,
            //        path: "/"
            //    })
            //});

            var K = false;
            var L;
            var m;
            var B;
            var r;
            var w;
            var D;
            var u;
            if (O == 1) {
                L = c.q("#lb-like-" + z);
                m = c.q("#lb-like-" + z + " .lb-count");
                B = c.q("#lb-dislike-" + z);
                r = c.q("#lb-dislike-" + z + " .lb-count");
                w = c.q("#lb-dislike-" + z + ".lb-voted .lb-count");
                K = true;
                D = c.q("#lb-like-" + z + " .lb-a");
                u = c.q("#lb-like-" + z + " .lb-share-tt")
            } else {
                L = c.q("#lb-dislike-" + z);
                m = c.q("#lb-dislike-" + z + " .lb-count");
                B = c.q("#lb-like-" + z);
                r = c.q("#lb-like-" + z + " .lb-count");
                w = c.q("#lb-like-" + z + ".lb-voted .lb-count");
            }
            var n = "";
            if (typeof (L[0]) != "undefined") {
                if ((" " + L[0].className + " ").replace(/[\n\t]/g, " ").indexOf(" lb-voted ") > -1) {
                    if (typeof (L[0]) != "undefined") {
                        L[0].className = L[0].className.replace(/lb\-voted/, "")
                    } else {
                        c.log("Clicked element not found on Vote")
                    } if (typeof (m[0]) != "undefined") {
                        var t = parseInt(m[0].getAttribute("data-count"));
                        if (!isNaN(t) && t) {
                            var H = t - 1;
                            c.updateCountsAfterClick(z, O, H, m[0], r[0])
                        }
                    } else {
                        c.log("Click element count not found on Vote")
                    }
                    K = false;
                    //c.processGroupIdentifier(z, 0);
                    if (O == 1) {
                        n = c.event_types.unlike
                    } else {
                        n = c.event_types.undislike
                    }
                } else {
                    if (typeof (L[0]) != "undefined") {
                        L[0].className += " lb-voted"
                    } else {
                        c.log("Clicked element not found on Vote")
                    } if (typeof (m[0]) != "undefined") {
                        var t = parseInt(m[0].getAttribute("data-count"));
                        if (isNaN(t)) {
                            t = 0
                        }
                        var H = t + 1;
                        c.updateCountsAfterClick(z, O, H, m[0], r[0])
                    } else {
                        c.log("Click element count not found on Vote")
                    }
                    if (typeof (B[0]) != "undefined") {
                        B[0].className = B[0].className.replace(/lb\-voted/, "")
                    } else {
                        c.log("Other element not found on Vote")
                    } if (typeof (w[0]) != "undefined") {
                        var t = parseInt(w[0].getAttribute("data-count"));
                        if (!isNaN(t) && t) {
                            var H = t - 1;
                            var E;
                            if (O == 1) {
                                E = "-1"
                            } else {
                                E = "1"
                            }
                            c.updateCountsAfterClick(z, E, H, r[0], m[0])
                        }
                    }
                    c.shareHide(null, z);
                    //c.processGroupIdentifier(z, 1);
                    if (O == 1) {
                        n = c.event_types.like
                    } else {
                        n = c.event_types.dislike
                    }
                }
                c.showCounter(m[0], z);
                c.showCounter(w[0], z);

                var G = 0; //settings.get(z, "popup_enabled")

                if (K && G && typeof (L[0]) != "undefined") {
                    c.dynamic_settings.set(z, "no_popup_close", true);
                    window.setTimeout(function () {
                        c.dynamic_settings.set(z, "no_popup_close", false)
                    }, c.popup_close_delay);
                    if (typeof (u[0]) != "undefined") {
                        L[0].className += " lb-share-active";
                        u[0].style.display = "block"
                    } else {
                        if (typeof (D[0]) != "undefined") {
                            var J = '<i class="lb-tt lb-share-tt"><i class="lb-tt-lt"></i><i class="lb-tt-rt"></i><i class="lb-tt-m2"></i><i class="lb-tt-m">';
                            var o = 1; // settings.default_values.share_enabled;
                            var F = "";
                            if (o) {
                                F += '<div class="lb-popup-label lb-popup-label-share">' + "Would you like to share?" + "</div>";
                                var I = "http://www.tvmap.com.br";
                                if (!I) {
                                    I = window.location.href
                                }
                                F += '<span class="addthis_toolbox addthis_default_style " addthis:url="' + I + '" ';
                                var e = "TV Map - Guia de Programação da TV"; // c.settings.get(z, "item_title");
                                if (e) {
                                    F += ' addthis:title="' + e + '" '
                                }
                                var q = "Guia de Programação da TV Brasileira, com todos canais da TV aberta e da TV por assinatura"; // c.settings.get(z, "item_description");
                                if (q) {
                                    F += ' addthis:description="' + q + '" '
                                }
                                F += ">";
                                var d = "google_plusone_share, facebook, twitter, gmail, hotmail, yahoomail, email"; //c.settings.get(z, "addthis_service_codes");
                                var h = [];
                                //if (c.checkPlan(c.plans.PRO) && d) {
                                h = d.split(",");
                                //} else {
                                //    if (c.isDefined(c.addthis_buttons[c.dynamic_settings.get(z, "locale")])) {
                                //        h = c.addthis_buttons[c.dynamic_settings.get(z, "locale")]
                                //    } else {
                                //        h = c.addthis_buttons.all
                                //    }
                                //}
                                for (var f in h) {
                                    if (f >= c.share_buttons_count || isNaN(parseInt(f))) {
                                        break
                                    }
                                    F += '<a class="addthis_button_' + c.trim(h[f]) + '"></a>'
                                }
                                F += "</span>"
                            }
                            var k = c.settings.default_values.popup_donate;
                            var A = "";
                            //if (c.checkPlan(c.plans.VIP)) {
                            //    k = c.settings.get(z, "popup_donate");
                            //    A = c.getPopupDonateHtml(k, z);
                            //    if (k && !A) {
                            //        c.log("Could not parse popup donate JSON:" + k)
                            //    }
                            //}
                            var N = ""; //c.settings.default_values.popup_html;
                            //if (c.checkPlan(c.plans.PRO)) {
                            //    N = c.settings.get(z, "popup_html")
                            //}
                            var C = "popup_share,popup_donate,popup_html"; //c.settings.get(z, "popup_content_order") + "";
                            C = c.replaceAll(" ", "", C);
                            var v = C.split(",");
                            for (default_popup_element_index in c.deafault_popup_content_order) {
                                if (!c.inArray(c.deafault_popup_content_order[default_popup_element_index], v)) {
                                    v.push(c.deafault_popup_content_order[default_popup_element_index])
                                }
                            }
                            for (popup_element_index in v) {
                                switch (v[popup_element_index]) {
                                    case "popup_share":
                                        if (F) {
                                            J += F
                                        }
                                        break;
                                    case "popup_donate":
                                        if (A) {
                                            J += '<div class="lb-popup-label lb-popup-label-donate">' + "Show gratitude in the form of a donation" + "</div>";
                                            J += A
                                        }
                                        break;
                                    case "popup_html":
                                        if (N) {
                                            J += N
                                        }
                                        break
                                }
                            }
                            if (!o && !N && !A) {
                                J += '<span class="lb-share-tt-popup_text">';
                                J += "Glad you liked it!";
                                J += "</span>";
                            }
                            J += '<i class="lb-share-tt-ft">'; // <a class="lb-share-tt-tm" href="http://www.likebtn.com" target="_blank">&copy; LikeBtn.com</a>';
                            J += '<i class="lb-share-tt-cl" onclick="LikeBtn.shareHide(event, ' + z + '); return false;">';
                            J += "Fechar";
                            J += " X";
                            J += "</i></i>";
                            J += '</i><i class="lb-tt-lb"></i><i class="lb-tt-rb"></i><i class="lb-tt-a"></i></i>';
                            D[0].innerHTML = J + D[0].innerHTML;
                            var y;
                            if (O == 1) {
                                y = c.q("#lb-like-" + z + " .lb-share-tt-tm")
                            } else {
                                if (c.settings.get(z, "popup_dislike")) {
                                    y = c.q("#lb-dislike-" + z + " .lb-share-tt-tm")
                                }
                            } if (c.isDefined(y[0])) {
                                //if (c.checkPlan(c.plans.VIP) && !c.settings.get(z, "show_copyright")) {
                                y[0].style.left = "-1000px"
                                //} else {
                                //    //y[0].style.color = "#f9f6f6"; //dark
                                //    y[0].style.color = "#787869"; //light
                                //    y[0].style.padding = "0";
                                //    y[0].style.margin = "0";
                                //    y[0].style["text-indent"] = "0";
                                //    y[0].style.left = "0";
                                //    y[0].style.top = "1px";
                                //    y[0].style.border = "0";
                                //    y[0].style["font-size"] = "9px"
                                //}
                            }
                            if (typeof (addthis) == "undefined" && !c.addthis_loaded) {
                                //if (c.checkPlan(c.plans.PRO)) {
                                var l = "ra-52ba2dd035ac7c93"; //c.settings.get(z, "addthis_pubid")
                                //} else {
                                //    var l = c.settings.default_values.addthis_pubid
                                //}
                                var p = document.createElement("script");
                                p.type = "text/javascript";
                                p.async = true;
                                p.src = "http://s7.addthis.com/js/300/addthis_widget.js?domready=1#pubid=" + l;
                                (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(p)
                            } else {
                                if (O == 1) {
                                    var M = c.q("#lb-like-" + z + " .addthis_toolbox")
                                } else {
                                    var M = c.q("#lb-dislike-" + z + " .addthis_toolbox")
                                } if (typeof (M[0]) != "undefined") {
                                    addthis.toolbox(M[0])
                                }
                            }
                            c.addthis_loaded = true;
                            L[0].className += " lb-share-active"
                        }
                        c.setPopupPosition(z);
                        el_popup = null;
                        if (O == 1) {
                            el_popup = c.q("#lb-like-" + z + " .lb-share-tt")
                        } else {
                            el_popup = c.q("#lb-dislike-" + z + " .lb-share-tt")
                        } if (c.isDefined(el_popup[0])) {
                            c.addEventListener(el_popup[0], "click", c.stopPropagation)
                        }
                    }
                } else {
                    c.shareHide(null, z)
                } if (1 == 0) { // !unlike_allowed
                    var s = c.dynamic_settings.get(z, "wrapper");
                    if (c.isDefined(s)) {
                        s.className += " lb-display-only"
                    }
                }
                //c.triggerEvent(n, z)
            }
        };
        c.getLabel = function (e, f, g) {
            var d = "";
            if (c.settings.get(e, f)) {
                d = c.settings.get(e, f)
            } else {
                if (typeof (c.translations[c.dynamic_settings.get(e, "locale")]) != "undefined") {
                    d = c.translations[c.dynamic_settings.get(e, "locale")][f]
                } else {
                    d = g
                }
            }
            return d
        };
        c.updateCountsAfterClick = function (g, j, f, d, e) {
            var h;
            if (j == 1) {
                h = c.getCountsPrepared(g, {
                    "1": f,
                    "-1": c.getItemCount(g, "-1")
                });
                d.innerHTML = h["1"];
                if (c.isDefined(e)) {
                    e.innerHTML = h["-1"]
                }
            } else {
                h = c.getCountsPrepared(g, {
                    "1": c.getItemCount(g, "1"),
                    "-1": f
                });
                d.innerHTML = h["-1"];
                if (c.isDefined(e)) {
                    e.innerHTML = h["1"]
                }
            }
            d.setAttribute("data-count", f)
        };
        c.getRequestSettings = function (g) {
            var h = c.settings.get(g, "host");
            var j = {
                host: "",
                identifier: ""
            };
            if (!c.isDefined(c.settings.values[g])) {
                return j
            }
            var k = c.trim(c.settings.get(g, "local_domain"));
            if (c.isDefined(k) && k) {
                if (c.isDomainLocal(k)) {
                    k = c.punycode.ToUnicode(k);
                    var f = c.punycode.ToUnicode(window.location.hostname);
                    var e = c.extractHostFromLocalDomain(k);
                    if (e == f) {
                        h = k
                    } else {
                        j.error_message = 'Domain "' + e + '" specified in local_domain parameter does not match current page domain "' + f + '", parameter is ignored (see <a href="http://www.likebtn.com/en/faq#local_domain" title="Like Button FAQ">LikeBtn.com FAQ</a>)';
                        return j
                    }
                } else {
                    j.error_message = 'Passed local_domain parameter "' + k + '" has wrong format, parameter is ignored (see <a href="http://www.likebtn.com/en/faq#local_domain" title="Like Button FAQ">LikeBtn.com FAQ</a>)';
                    return j
                }
            } else {
                if (c.needDomainFromParent(g)) {
                    var d = c.getDomainFromUrl(document.referrer);
                    if (d) {
                        h = d
                    }
                }
            }
            j.host = h;
            j.identifier = c.settings.values[g]["identifier"];
            return j
        };
        c.needDomainFromParent = function (d) {
            if ((c.settings.get(d, "domain_from_parent") || c.inArray(c.settings.get(d, "host"), c.forced_domain_from_parent)) && window.location != window.parent.location) {
                return true
            } else {
                return false
            }
        };
        //c.getHtml = function (j, f) {
        //    var d = "";
        //    var h = null;
        //    var l = {};
        //    if (!c.isDefined(j)) {
        //        return d
        //    }
        //    if (c.isDefined(c.settings.values[f])) {
        //        h = c.settings.values[f]
        //    }
        //    l = c.translations[c.dynamic_settings.get(f, "locale")];
        //    if (!h || !l) {
        //        return d
        //    }
        //    var g = c.getCountsPrepared(f, {
        //        "1": j.like,
        //        "-1": j.dislike
        //    });
        //    if (h.like_enabled || !h.dislike_enabled) {
        //        d += '<span class="lb-like' + (j.client_vote_type ? " lb-voted" : "") + (h.counter_clickable ? " lb-counter-clickable" : "") + '" id="lb-like-' + f + '" ' + (h.counter_clickable ? 'onclick="LikeBtn.vote(1, ' + f + ');"' : "") + ">";
        //        d += "<span " + ((!h.counter_clickable && !h.display_only) ? 'onclick="LikeBtn.vote(1, ' + f + ');"' : "") + ' class="lb-a">';
        //        d += '<i class="lb-tt"><i class="lb-tt-lt"></i><i class="lb-tt-rt"></i><i class="lb-tt-m">' + (h.i18n_like_tooltip ? h.i18n_like_tooltip : l.i18n_like_tooltip) + '</i><i class="lb-tt-mu">' + (h.i18n_unlike_tooltip ? h.i18n_unlike_tooltip : l.i18n_unlike_tooltip) + '</i><i class="lb-tt-m2"></i><i class="lb-tt-lb"></i><i class="lb-tt-rb"></i><i class="lb-tt-a"></i></i>';
        //        d += '<span class="lb-like-icon">&nbsp;</span>';
        //        if (h.show_like_label) {
        //            d += '<span class="lb-like-label">' + (h.i18n_like ? h.i18n_like : l.i18n_like) + "</span>"
        //        }
        //        var k = true;
        //        if ((!j.like)) {
        //            k = false
        //        }
        //        d += '</span><span class="lb-count' + (!k ? " lb-hidden" : "") + '" data-count="' + j.like + '">' + g["1"] + "</span></span>"
        //    }
        //    if (h.dislike_enabled) {
        //        d += '<span class="lb-dislike ' + ((h.client_vote_type == -1) ? " lb-voted" : "") + (h.counter_clickable ? " lb-counter-clickable" : "") + '" id="lb-dislike-' + f + '" ' + (h.counter_clickable ? 'onclick="LikeBtn.vote(-1, ' + f + ');"' : "") + ">";
        //        d += "<span " + ((!h.counter_clickable && !h.display_only) ? 'onclick="LikeBtn.vote(-1, ' + f + ');"' : "") + ' class="lb-a">';
        //        d += '<i class="lb-tt"><i class="lb-tt-lt"></i><i class="lb-tt-rt"></i><i class="lb-tt-m">' + (h.i18n_dislike_tooltip ? h.i18n_dislike_tooltip : l.i18n_dislike_tooltip) + '</i><i class="lb-tt-mu">' + (h.i18n_undislike_tooltip ? h.i18n_undislike_tooltip : l.i18n_undislike_tooltip) + '</i><i class="lb-tt-m2"></i><i class="lb-tt-lb"></i><i class="lb-tt-rb"></i><i class="lb-tt-a"></i></i>';
        //        d += '<span class="lb-dislike-icon">&nbsp;</span>';
        //        if (h.show_dislike_label) {
        //            d += '<span class="lb-dislike-label">' + (h.i18n_dislike ? h.i18n_dislike : l.i18n_dislike) + "</span>"
        //        }
        //        var e = true;
        //        if (((!j.dislike || h.substract_dislikes))) {
        //            e = false
        //        }
        //        d += '</span><span class="lb-count' + (!e ? " lb-hidden" : "") + '" data-count="' + j.dislike + '">' + g["-1"] + "</span></span>"
        //    }
        //    return d
        //};
        c.getItemCount = function (d, e) {
            if (!e) {
                return undefined
            }
            var f = c.getItemCountEl(d, e);
            if (typeof (f) != "undefined") {
                return f.getAttribute("data-count")
            }
            return undefined
        };
        c.getItemCountEl = function (d, e) {
            if (e == 1) {
                var f = c.q("#lb-like-" + d + " .lb-count")
            } else {
                var f = c.q("#lb-dislike-" + d + " .lb-count")
            } if (typeof (f[0]) != "undefined") {
                return f[0]
            }
            return undefined
        };
        c.getCountsPrepared = function (f, e) {
            var h = {};
            e["1"] = parseInt(e["1"]);
            if (isNaN(e["1"])) {
                e["1"] = 0
            }
            e["-1"] = parseInt(e["-1"]);
            if (isNaN(e["-1"])) {
                e["-1"] = 0
            }
            h = {
                "1": e["1"],
                "-1": e["-1"]
            }
            return h
        };
        c.getItemVoteType = function (d) {
            var e = c.getItemIdentifierHash(d);
            if (e) {
                var f = c.getCookieAsObject(c.cookie_vote_name);
                if (c.isDefined(f) && c.isDefined(f[e])) {
                    return f[e]
                }
            }
            return ""
        };
        c.getItemCountFromCookie = function (d) {
            var e = c.getItemIdentifierHash(d);
            if (e) {
                var f = c.getCookieAsObject(c.cookie_count_name + "" + e);
                if (c.isDefined(f)) {
                    return f
                }
            }
            return ""
        };
        c.getCookieAsObject = function (d) {
            var e = c.getCookie(d);
            return c.JSON.decode(e)
        };
        c.getItemIdentifier = function (e) {
            var d = c.settings.get(e, "identifier");
            if (!d) {
                d = c.normalizeUrlIdentifier(c.settings.get(e, "url"))
            }
            return d
        };
        c.getItemIdentifierHash = function (e) {
            var d = c.getItemIdentifier(e);
            return c.hashCode(d)
        };
        c.getIndexByIdentifierHash = function (f, e) {
            for (var d in c.dynamic_settings.values) {
                if (c.dynamic_settings.get(d, "identifier_hash") == f) {
                    if (c.isDefined(e) && e) {
                        if (c.isDefined(c.dynamic_settings.get(d, "loaded"))) {
                            continue
                        }
                    }
                    return d
                }
            }
            return -1
        };
        c.normalizeUrlIdentifier = function (d) {
            var f = document.createElement("a");
            f.href = d;
            var e = f.pathname;
            if (!e) {
                e = "/"
            }
            if (e.charAt(0) != "/") {
                e = "/" + e
            }
            return e
        };
        c.showCounter = function (e, d) {
            if (typeof (e) != "undefined") {
                if ((parseInt(e.innerHTML) == 0)) {
                    e.style.display = "none"
                } else {
                    e.style.display = "inline-block"
                }
            }
        };
        c.setPopupPosition = function (d) {
            if ("top" == "right") { // c.settings.get(d, "popup_position")
                el_like = c.q("#lb-like-" + d);
                el_popups = c.q("#lb-like-" + d + " .lb-tt");
                if (c.isDefined(el_like[0])) {
                    for (popup_index in el_popups) {
                        el_popups[popup_index].style.left = (parseInt(el_like[0].clientWidth) + 5) + "px"
                    }
                }
                el_dislike = c.q("#lb-dislike-" + d);
                el_popups = c.q("#lb-dislike-" + d + " .lb-tt");
                if (c.isDefined(el_dislike[0])) {
                    for (popup_index in el_popups) {
                        el_popups[popup_index].style.left = (parseInt(el_dislike[0].clientWidth) + 5) + "px"
                    }
                }
            }
        };
        c.hashCode = function (e) {
            var d = 0;
            if (!c.isDefined(e) || e.length == 0) {
                return d
            }
            for (i = 0; i < e.length; i++) {
                chr = e.charCodeAt(i);
                d = ((d << 5) - d) + chr;
                d = d & d
            }
            return d
        };
        c.trim = function (d) {
            d += "";
            return d.replace(/^\s+|\s+$/g, "")
        };
        c.inArray = function (g, f) {
            var e = f.length;
            for (var d = 0; d < e; d++) {
                if (f[d] == g) {
                    return true
                }
            }
            return false
        };
        c.escapeHTML = function (d) {
            var e = document.createElement("pre");
            var f = document.createTextNode(d);
            e.appendChild(f);
            return e.innerHTML
        };
        c.unescapeHTML = function (d) {
            var f = document.createElement("div");
            f.innerHTML = d;
            return f.childNodes.length === 0 ? "" : f.childNodes[0].nodeValue
        };
        //c.checkPlan = function (d) {
        //    if (c.plan >= d) {
        //        return true
        //    } else {
        //        return false
        //    }
        //};
        c.getPopupDonateHtml = function (h, f) {
            var g = "";
            var e = null;
            h = c.unescapeHTML(h);
            e = c.unserializeDonateStr(h);
            if (!e) {
                return
            }
            var d = document.title;
            if (e.purpose) {
                d = e.purpose
            } else {
                if (c.settings.get(f, "item_title")) {
                    d = c.settings.get(f, "item_title")
                }
            }
            for (var j in e.payment_systems) {
                g += c.getPaymentSystemHtml(e.payment_systems[j], d);
                g += "&nbsp;"
            }
            if (g) {
                g = '<div class="lb-donate-container">' + g + "</div>"
            }
            return g
        };
        c.getPaymentSystemHtml = function (l, f) {
            var h = "";
            var e = "";
            var g = "";
            var k = parseInt(l.amount_integer);
            var d = parseInt(l.amount_fractional);
            if (l.amount_integer || l.amount_fractional) {
                if (isNaN(k)) {
                    k = 0
                }
                if (isNaN(d)) {
                    d = 0
                }
                g = k + "." + d
            }
            f = c.replaceAll(/["&]/, "", f);
            switch (l.system) {
                case "PayPal":
                    e = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=" + escape(l.account) + "&item_name=" + f + "&currency_code=" + escape(l.currency) + "&amount=" + escape(g);
                    break;
                case "Bitcoin":
                    e = "bitcoin:" + escape(l.account) + "?label=" + f;
                    break;
                case "Google Wallet":
                    e = "mailto:" + escape(l.account) + "?Subject=" + f;
                    break;
                case "Yandex.Money":
                    e = "https://money.yandex.ru/quickpay/confirm.xml?quickpay-form=donate&receiver=" + escape(l.account) + "&sum=" + escape(g);
                    break;
                case "WebMoney":
                    e = "https://advisor.wmtransfer.com/Spasibo.aspx?url=" + escape(l.account);
                    break;
                case "Qiwi":
                    e = "https://visa.qiwi.com/payment/transfer/form.action?extra[%27account%27]=" + escape(l.account) + "&amountInteger=" + escape(l.amount_integer) + "&amountFraction=" + escape(l.amount_fractional) + "&extra[%27comment%27]=" + f;
                    break;
                case "SmsCoin":
                    if (l.language == "en") {
                        e = "http://donate.smscoin.com/js/smsdonate/index_en.html"
                    } else {
                        e = "http://donate.smscoin.com/js/smsdonate/index.html"
                    }
                    e += "?sid=" + escape(l.account) + "&language=" + escape(l.language);
                    break;
                case "Zaypay":
                    if (l.language) {
                        e = "http://www.zaypay.com//" + escape(l.language) + "/pay/" + escape(l.account) + "/payments/new"
                    } else {
                        e = "http://www.zaypay.com/pay/" + escape(l.account)
                    }
                    break
            }
            if (e) {
                var j = c.replaceAll(/[^A-z0-9]/, "", l.system.toLowerCase());
                h += '<a href="' + e + '" target="_blank" class="lb-donate lb-donate-' + j + '"></a>';
                c.loadAsset("/css/39cf8ef.css", "css")
            }
            return h
        };
        c.unserializeDonateStr = function (e) {
            var d = null;
            if (e) {
                d = c.JSON.decode(e);
                if (typeof (d.purpose) == "undefined") {
                    d.purpose = ""
                }
                if (typeof (d.payment_systems) == "undefined") {
                    d.payment_systems = []
                }
                for (var f in d.payment_systems) {
                    if (typeof (d.payment_systems[f].system) == "undefined") {
                        d.payment_systems[f].system = ""
                    }
                    if (typeof (d.payment_systems[f].account) == "undefined") {
                        d.payment_systems[f].account = ""
                    }
                    if (typeof (d.payment_systems[f].amount_fractional) == "undefined") {
                        d.payment_systems[f].amount_fractional = ""
                    }
                    if (typeof (d.payment_systems[f].amount_integer) == "undefined") {
                        d.payment_systems[f].amount_integer = ""
                    }
                    if (typeof (d.payment_systems[f].currency) == "undefined") {
                        d.payment_systems[f].currency = ""
                    }
                    if (typeof (d.payment_systems[f].language) == "undefined") {
                        d.payment_systems[f].language = ""
                    }
                }
                d = c.escapeDonateObj(d)
            }
            return d
        };
        c.escapeDonateObj = function (d, f) {
            if (typeof (d) != "undefined") {
                if (typeof (f) != "undefined" && f) {
                    d.purpose = c.replaceAll('"', "\\&quot;", d.purpose)
                } else {
                    d.purpose = c.replaceAll('"', "&quot;", d.purpose)
                }
                d.purpose = c.replaceAll(/&/, "", d.purpose);
                for (var e in d.payment_systems) {
                    if (isNaN(parseInt(e))) {
                        continue
                    }
                    d.payment_systems[e].system = c.replaceAll(/["&]/, "", d.payment_systems[e].system);
                    d.payment_systems[e].account = c.replaceAll(/["&]/, "", d.payment_systems[e].account);
                    if (typeof (d.payment_systems[e].amount_fractional) != "undefined") {
                        d.payment_systems[e].amount_fractional = c.replaceAll(/["&]/, "", d.payment_systems[e].amount_fractional)
                    }
                    if (typeof (d.payment_systems[e].amount_integer) != "undefined") {
                        d.payment_systems[e].amount_integer = c.replaceAll(/["&]/, "", d.payment_systems[e].amount_integer)
                    }
                    if (typeof (d.payment_systems[e].currency) != "undefined") {
                        d.payment_systems[e].currency = c.replaceAll(/["&]/, "", d.payment_systems[e].currency)
                    }
                    if (typeof (d.payment_systems[e].language) != "undefined") {
                        d.payment_systems[e].language = c.replaceAll(/["&]/, "", d.payment_systems[e].language)
                    }
                }
            }
            return d
        };
        c.loadAsset = function (g, f) {
            var h = window.document;
            if (c.inArray(g, c.loaded_assets)) {
                return false
            }
            var e = h.createElement("link");
            switch (f) {
                case "css":
                case "text/css":
                    e.type = "text/css";
                    e.rel = "stylesheet"
            }
            e.href = "//likebtn.com" + g;
            (h.getElementsByTagName("head")[0] || h.getElementsByTagName("body")[0]).appendChild(e);
            c.loaded_assets.push(g);
            return true
        };
        c.isDomainLocal = function (d) {
            if (c.isDefined(d) && d.match(new RegExp("^[^" + c.local_delimiter + "]+" + c.local_delimiter + "[^" + c.local_delimiter + "]+$"))) {
                return true
            } else {
                return false
            }
        };
        c.extractHostFromLocalDomain = function (d) {
            return d.replace(new RegExp("^([^" + c.local_delimiter + "]+)" + c.local_delimiter + "[^" + c.local_delimiter + "]+$"), "$1")
        };
        c.log = function (e, d) {
            if (!c.debug) {
                return
            }
            b.console && b.console.log("LikeBtn: " + e);
            if (typeof (d) != "undefined") {
                b.console && b.console.log(d)
            }
        };
        c.cloneObject = function (e) {
            if (e == null || typeof (e) != "object") {
                return e
            }
            var d = e.constructor();
            for (var f in e) {
                d[f] = c.cloneObject(e[f])
            }
            return d
        };
        c.shareHide = function (g, e) {
            var f = c.q("#lb-like-" + e + ".lb-share-active");
            var d;
            if (typeof (f[0]) != "undefined") {
                d = "lb-like"
            } else {
                d = "lb-dislike";
                f = c.q("#lb-dislike-" + e + ".lb-share-active")
            } if (typeof (f[0]) != "undefined") {
                f[0].className = f[0].className.replace(/\blb\-share\-active\b/, "")
            }
            var h = c.q("#" + d + "-" + e + " .lb-share-tt");
            if (typeof (h[0]) != "undefined") {
                h[0].style.display = "none"
            }
            c.stopPropagation(g)
        };
        c.infoMessage = function (d, f, e) {
            if (f && c.settings.get(d, "info_message")) {
                f.innerHTML = e
            } else {
                f.innerHTML = ""
            }
        };
        c.setCookie = function (f, j, g) {
            g = g || {};
            var m = g.expires;
            if (typeof m == "number" && m) {
                var l = new Date();
                l.setTime(l.getTime() + m * 1000);
                m = g.expires = l
            }
            if (m && m.toUTCString) {
                g.expires = m.toUTCString()
            }
            j = encodeURIComponent(j);
            var e = f + "=" + j;
            for (var h in g) {
                e += "; " + h;
                var k = g[h];
                if (k !== true) {
                    e += "=" + k
                }
            }
            document.cookie = e
        };
        c.getCookie = function (d) {
            var e = document.cookie.match(new RegExp("(?:^|; )" + d.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
            return e ? decodeURIComponent(e[1]) : undefined
        };
        c.hasClass = function (e, d) {
            return e.className.match(new RegExp("(\\s|^)" + d + "(\\s|$)"))
        };
        c.removeClass = function (e, d) {
            var f = new RegExp(d.replace(/-/, "-"));
            e.className = c.replaceAll(f, "", e.className)
        };
        c.getDomainFromUrl = function (e) {
            if (!e) {
                return ""
            }
            var d = document.createElement("a");
            d.href = e;
            return d.hostname
        };
        c.isDefined = function (d) {
            if (typeof (d) != "undefined") {
                return true
            } else {
                return false
            }
        };
        c.replaceAll = function (e, d, f) {
            if (typeof (f) != "string") {
                return f
            }
            return f.split(e).join(d)
        };
        //c.triggerEvent = function (k, d) {
        //    var g = c.settings.get(d, "event_handler");
        //    var j;
        //    var f = {
        //        type: "",
        //        settings: {},
        //        wrapper: null
        //    };
        //    if (!c.isDefined(g) || !g) {
        //        return false
        //    }
        //    var j = window[g];
        //    if (typeof (j) !== "function") {
        //        return false
        //    }
        //    f.type = k;
        //    if (c.isDefined(c.settings.values[d])) {
        //        f.settings = c.settings.values[d]
        //    }
        //    f.wrapper = c.dynamic_settings.get(d, "wrapper");
        //    try {
        //        j(f)
        //    } catch (h) {
        //        c.log("Error occured in event handler function '" + g + "': " + h.message)
        //    }
        //};
        c.onBodyClick = function () {
            for (index = 0; index < c.dynamic_settings.values.length; index++) {
                if (!c.dynamic_settings.get(index, "no_popup_close") && c.settings.get(index, "popup_hide_on_outside_click")) {
                    c.shareHide(null, index)
                }
            }
        };
        c.addEventListener = function (d, e, f) {
            if (typeof (d.addEventListener) === "function") {
                d.addEventListener(e, f)
            } else {
                d.attachEvent("on" + e, f)
            }
        };
        c.stopPropagation = function (d) {
            try {
                if (typeof (d) != "undefined") {
                    if (typeof (d.stopPropagation) != "undefined") {
                        d.stopPropagation()
                    } else {
                        d.cancelBubble = true
                    }
                }
            } catch (f) { }
        };
        c.JSON = {};
        c.JSON.encode = function (e) {
            var h = typeof (e);
            if (h != "object" || e === null) {
                if (h == "string") {
                    e = '"' + e + '"'
                }
                return String(e)
            } else {
                var j, f, g = [],
                    d = (e && e.constructor == Array);
                for (j in e) {
                    f = e[j];
                    h = typeof (f);
                    if (h == "function") {
                        continue
                    }
                    if (h == "string") {
                        f = '"' + f + '"'
                    } else {
                        if (h == "object" && f !== null) {
                            f = c.JSON.encode(f)
                        }
                    }
                    g.push((d ? "" : '"' + j + '":') + String(f))
                }
                return (d ? "[" : "{") + String(g) + (d ? "]" : "}")
            }
        };
        c.JSON.decode = function (g) {
            var d = {};
            try {
                d = window["eval"]("(function(){return " + g + ";})()")
            } catch (f) { }
            return d
        };
        c.Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (s) {
                var u = "";
                var l, n, p, m, o, q, r;
                var t = 0;
                s = c.Base64._utf8_encode(s);
                while (t < s.length) {
                    l = s.charCodeAt(t++);
                    n = s.charCodeAt(t++);
                    p = s.charCodeAt(t++);
                    m = l >> 2;
                    o = ((l & 3) << 4) | (n >> 4);
                    q = ((n & 15) << 2) | (p >> 6);
                    r = p & 63;
                    if (isNaN(n)) {
                        q = r = 64
                    } else {
                        if (isNaN(p)) {
                            r = 64
                        }
                    }
                    u = u + this._keyStr.charAt(m) + this._keyStr.charAt(o) + this._keyStr.charAt(q) + this._keyStr.charAt(r)
                }
                return u
            },
            decode: function (s) {
                var u = "";
                var l, n, p;
                var m, o, q, r;
                var t = 0;
                s = s.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (t < s.length) {
                    m = this._keyStr.indexOf(s.charAt(t++));
                    o = this._keyStr.indexOf(s.charAt(t++));
                    q = this._keyStr.indexOf(s.charAt(t++));
                    r = this._keyStr.indexOf(s.charAt(t++));
                    l = (m << 2) | (o >> 4);
                    n = ((o & 15) << 4) | (q >> 2);
                    p = ((q & 3) << 6) | r;
                    u = u + String.fromCharCode(l);
                    if (q != 64) {
                        u = u + String.fromCharCode(n)
                    }
                    if (r != 64) {
                        u = u + String.fromCharCode(p)
                    }
                }
                u = c.Base64._utf8_decode(u);
                return u
            },
            _utf8_encode: function (f) {
                f = f.replace(/\r\n/g, "\n");
                var g = "";
                for (var h = 0; h < f.length; h++) {
                    var j = f.charCodeAt(h);
                    if (j < 128) {
                        g += String.fromCharCode(j)
                    } else {
                        if ((j > 127) && (j < 2048)) {
                            g += String.fromCharCode((j >> 6) | 192);
                            g += String.fromCharCode((j & 63) | 128)
                        } else {
                            g += String.fromCharCode((j >> 12) | 224);
                            g += String.fromCharCode(((j >> 6) & 63) | 128);
                            g += String.fromCharCode((j & 63) | 128)
                        }
                    }
                }
                return g
            },
            _utf8_decode: function (g) {
                var f = "";
                var j = 0;
                var h = c1 = c2 = 0;
                while (j < g.length) {
                    h = g.charCodeAt(j);
                    if (h < 128) {
                        f += String.fromCharCode(h);
                        j++
                    } else {
                        if ((h > 191) && (h < 224)) {
                            c2 = g.charCodeAt(j + 1);
                            f += String.fromCharCode(((h & 31) << 6) | (c2 & 63));
                            j += 2
                        } else {
                            c2 = g.charCodeAt(j + 1);
                            c3 = g.charCodeAt(j + 2);
                            f += String.fromCharCode(((h & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            j += 3
                        }
                    }
                }
                return f
            }
        };
        //c.JSONP = (function () {
        //    var d = 0,
        //        f, h = this,
        //        e = {};

        //    function j(p, q) {
        //        var o = document.createElement("script"),
        //            m = false;
        //        o.src = p;
        //        o.async = true;
        //        var n = q || e.error;
        //        if (typeof n === "function") {
        //            o.onerror = function (r) {
        //                n({
        //                    url: p,
        //                    event: r
        //                })
        //            }
        //        }
        //        o.onload = o.onreadystatechange = function () {
        //            if (!m && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        //                m = true;
        //                o.onload = o.onreadystatechange = null;
        //                if (o && o.parentNode) {
        //                    o.parentNode.removeChild(o)
        //                }
        //            }
        //        };
        //        if (!f) {
        //            f = document.getElementsByTagName("head")[0]
        //        }
        //        f.appendChild(o)
        //    }

        //    function g(m) {
        //        return encodeURIComponent(m)
        //    }

        //    function k(o, s, t, r, n) {
        //        var q = (o || "").indexOf("?") === -1 ? "?" : "&",
        //            p;
        //        r = (r || e.callbackName || "likebtn_callback");
        //        var m = r + "_json";
        //        s = s || {};
        //        for (p in s) {
        //            if (s.hasOwnProperty(p)) {
        //                q += g(p) + "=" + g(s[p]) + "&"
        //            }
        //        }
        //        h[m] = function (u) {
        //            t(u)
        //        };
        //        j(o + q + r + "=" + m, n);
        //        return m
        //    }

        //    function l(m) {
        //        e = m
        //    }
        //    return {
        //        get: k,
        //        init: l
        //    }
        //}());
        c.punycode = new function a() {
            this.utf16 = {
                decode: function (u) {
                    var t = [],
                        v = 0,
                        s = u.length,
                        w, r;
                    while (v < s) {
                        w = u.charCodeAt(v++);
                        if ((w & 63488) === 55296) {
                            r = u.charCodeAt(v++);
                            if (((w & 64512) !== 55296) || ((r & 64512) !== 56320)) {
                                throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence")
                            }
                            w = ((w & 1023) << 10) + (r & 1023) + 65536
                        }
                        t.push(w)
                    }
                    return t
                },
                encode: function (t) {
                    var s = [],
                        u = 0,
                        r = t.length,
                        v;
                    while (u < r) {
                        v = t[u++];
                        if ((v & 63488) === 55296) {
                            throw new RangeError("UTF-16(encode): Illegal UTF-16 value")
                        }
                        if (v > 65535) {
                            v -= 65536;
                            s.push(String.fromCharCode(((v >>> 10) & 1023) | 55296));
                            v = 56320 | (v & 1023)
                        }
                        s.push(String.fromCharCode(v))
                    }
                    return s.join("")
                }
            };
            var j = 128;
            var o = 72;
            var d = "\x2D";
            var f = 36;
            var h = 700;
            var e = 1;
            var k = 26;
            var q = 38;
            var g = 2147483647;

            function n(r) {
                return r - 48 < 10 ? r - 22 : r - 65 < 26 ? r - 65 : r - 97 < 26 ? r - 97 : f
            }

            function p(s, r) {
                return s + 22 + 75 * (s < 26) - ((r != 0) << 5)
            }

            function m(u, t, s) {
                var r;
                u = s ? Math.floor(u / h) : (u >> 1);
                u += Math.floor(u / t);
                for (r = 0; u > (((f - e) * k) >> 1) ; r += f) {
                    u = Math.floor(u / (f - e))
                }
                return Math.floor(r + (f - e + 1) * u / (u + q))
            }

            function l(s, r) {
                s -= (s - 97 < 26) << 5;
                return s + ((!r && (s - 65 < 26)) << 5)
            }
            this.decode = function (z, u) {
                var x = [];
                var K = [];
                var E = z.length;
                var D, I, H, v, s, G, C, r, y, F, B, A, J;
                D = j;
                H = 0;
                v = o;
                s = z.lastIndexOf(d);
                if (s < 0) {
                    s = 0
                }
                for (G = 0; G < s; ++G) {
                    if (u) {
                        K[x.length] = (z.charCodeAt(G) - 65 < 26)
                    }
                    if (z.charCodeAt(G) >= 128) {
                        throw new RangeError("Illegal input >= 0x80")
                    }
                    x.push(z.charCodeAt(G))
                }
                for (C = s > 0 ? s + 1 : 0; C < E;) {
                    for (r = H, y = 1, F = f; ; F += f) {
                        if (C >= E) {
                            throw RangeError("punycode_bad_input(1)")
                        }
                        B = n(z.charCodeAt(C++));
                        if (B >= f) {
                            throw RangeError("punycode_bad_input(2)")
                        }
                        if (B > Math.floor((g - H) / y)) {
                            throw RangeError("punycode_overflow(1)")
                        }
                        H += B * y;
                        A = F <= v ? e : F >= v + k ? k : F - v;
                        if (B < A) {
                            break
                        }
                        if (y > Math.floor(g / (f - A))) {
                            throw RangeError("punycode_overflow(2)")
                        }
                        y *= (f - A)
                    }
                    I = x.length + 1;
                    v = m(H - r, I, r === 0);
                    if (Math.floor(H / I) > g - D) {
                        throw RangeError("punycode_overflow(3)")
                    }
                    D += Math.floor(H / I);
                    H %= I;
                    if (u) {
                        K.splice(H, 0, z.charCodeAt(C - 1) - 65 < 26)
                    }
                    x.splice(H, 0, D);
                    H++
                }
                if (u) {
                    for (H = 0, J = x.length; H < J; H++) {
                        if (K[H]) {
                            x[H] = (String.fromCharCode(x[H]).toUpperCase()).charCodeAt(0)
                        }
                    }
                }
                return this.utf16.encode(x)
            };
            this.ToUnicode = function (w) {
                var r = w.split(".");
                var t = [];
                for (var u = 0; u < r.length; ++u) {
                    var v = r[u];
                    t.push(v.match(/^xn--/) ? this.decode(v.slice(4)) : v)
                }
                return t.join(".")
            }
        }();
        c.q = (function () {
            function ao() {
                this.c = {}
            }

            function ax(d) {
                return aA.g(d) || aA.s(d, "(^|\\s+)" + d + "(\\s+|$)", 1)
            }

            function ak(g, d) {
                var h = 0,
                    f = g.length;
                for (; h < f; h++) {
                    d(g[h])
                }
            }

            function at(g) {
                for (var d = [], h = 0, f = g.length; h < f; ++h) {
                    aD(g[h]) ? d = d.concat(g[h]) : d[d.length] = g[h]
                }
                return d
            }

            function az(g) {
                var d = 0,
                    h = g.length,
                    f = [];
                for (; d < h; d++) {
                    f[d] = g[d]
                }
                return f
            }

            function aW(d) {
                while (d = d.previousSibling) {
                    if (d[aJ] == 1) {
                        break
                    }
                }
                return d
            }

            function av(d) {
                return d.match(ay)
            }

            function ar(w, E, k, f, o, F, C, z, q, j, x) {
                var D, l, u, B, A;
                if (this[aJ] !== 1) {
                    return !1
                }
                if (E && E !== "*" && this[aQ] && this[aQ].toLowerCase() !== E) {
                    return !1
                }
                if (k && (l = k.match(a1)) && l[1] !== this.id) {
                    return !1
                }
                if (k && (A = k.match(aT))) {
                    for (D = A.length; D--;) {
                        if (!ax(A[D].slice(1)).test(this.className)) {
                            return !1
                        }
                    }
                }
                if (q && aj.pseudos[q] && !aj.pseudos[q](this, x)) {
                    return !1
                }
                if (f && !C) {
                    B = this.attributes;
                    for (u in B) {
                        if (Object.prototype.hasOwnProperty.call(B, u) && (B[u].name || u) == o) {
                            return this
                        }
                    }
                }
                return f && !ai(F, aa(this, o) || "", C) ? !1 : this
            }

            function aN(d) {
                return al.g(d) || al.s(d, d.replace(a5, "\\$1"))
            }

            function ai(f, d, g) {
                switch (f) {
                    case "=":
                        return d == g;
                    case "^=":
                        return d.match(an.g("^=" + g) || an.s("^=" + g, "^" + aN(g), 1));
                    case "$=":
                        return d.match(an.g("$=" + g) || an.s("$=" + g, aN(g) + "$", 1));
                    case "*=":
                        return d.match(an.g(g) || an.s(g, aN(g), 1));
                    case "~=":
                        return d.match(an.g("~=" + g) || an.s("~=" + g, "(?:^|\\s+)" + aN(g) + "(?:\\s+|$)", 1));
                    case "|=":
                        return d.match(an.g("|=" + g) || an.s("|=" + g, "^" + aN(g) + "(-|$)", 1))
                }
                return 0
            }

            function af(z, E) {
                var k = [],
                    r = [],
                    F, C, x, q, u, j, A, D, o = E,
                    w = a7.g(z) || a7.s(z, z.split(am)),
                    B = z.match(ag);
                if (!w.length) {
                    return k
                }
                q = (w = w.slice(0)).pop(), w.length && (x = w[w.length - 1].match(a4)) && (o = ap(E, x[1]));
                if (!o) {
                    return k
                }
                A = av(q), j = o !== E && o[aJ] !== 9 && B && /^[+~]$/.test(B[B.length - 1]) ? function (d) {
                    while (o = o.nextSibling) {
                        o[aJ] == 1 && (A[1] ? A[1] == o[aQ].toLowerCase() : 1) && (d[d.length] = o)
                    }
                    return d
                }([]) : o[aM](A[1] || "*");
                for (F = 0, C = j.length; F < C; F++) {
                    if (D = ar.apply(j[F], A)) {
                        k[k.length] = D
                    }
                }
                return w.length ? (ak(k, function (d) {
                    ad(d, w, B) && (r[r.length] = d)
                }), r) : k
            }

            function aE(j, f, k) {
                if (ac(f)) {
                    return j == f
                }
                if (aD(f)) {
                    return !!~at(f).indexOf(j)
                }
                var h = f.split(","),
                    d, g;
                while (f = h.pop()) {
                    d = a7.g(f) || a7.s(f, f.split(am)), g = f.match(ag), d = d.slice(0);
                    if (ar.apply(j, av(d.pop())) && (!d.length || ad(j, d, g, k))) {
                        return !0
                    }
                }
                return !1
            }

            function ad(j, f, k, h) {
                function g(m, l, n) {
                    while (n = aU[k[l]](n, m)) {
                        if (ac(n) && ar.apply(n, av(f[l]))) {
                            if (!l) {
                                return n
                            }
                            if (d = g(n, l - 1, n)) {
                                return d
                            }
                        }
                    }
                }
                var d;
                return (d = g(j, f.length - 1, j)) && (!h || ab(d, h))
            }

            function ac(f, d) {
                return f && typeof f == "object" && (d = f[aJ]) && (d == 1 || d == 9)
            }

            function ae(g) {
                var d = [],
                    h, f;
                g: for (h = 0; h < g.length; ++h) {
                    for (f = 0; f < d.length; ++f) {
                        if (d[f] == g[h]) {
                            continue g
                        }
                    }
                    d[d.length] = g[h]
                }
                return d
            }

            function aD(d) {
                return typeof d == "object" && isFinite(d.length)
            }

            function aq(d) {
                return d ? typeof d == "string" ? aj(d)[0] : !d[aJ] && aD(d) ? d[0] : d : a2
            }

            function ap(f, d, g) {
                return f[aJ] === 9 ? f.getElementById(d) : f.ownerDocument && ((g = f.ownerDocument.getElementById(d)) && ab(g, f) && g || !ab(f, f.ownerDocument) && a6('[id="' + d + '"]', f)[0])
            }

            function aj(h, f) {
                var d, g, j = aq(f);
                if (!j || !h) {
                    return []
                }
                if (h === window || ac(h)) {
                    return !f || h !== window && ac(j) && ab(h, j) ? [h] : []
                }
                if (h && aD(h)) {
                    return at(h)
                }
                if (d = h.match(aG)) {
                    if (d[1]) {
                        return (g = ap(j, d[1])) ? [g] : []
                    }
                    if (d[2]) {
                        return az(j[aM](d[2]))
                    }
                    if (aO && d[3]) {
                        return az(j[aR](d[3]))
                    }
                }
                return a6(h, j)
            }

            function au(f, d) {
                return function (h) {
                    var g, e;
                    if (aI.test(h)) {
                        f[aJ] !== 9 && ((e = g = f.getAttribute("id")) || f.setAttribute("id", e = "__qwerymeupscotty"), h = '[id="' + e + '"]' + h, d(f.parentNode || f, h, !0), g || f.removeAttribute("id"));
                        return
                    }
                    h.length && d(f, h, !1)
                }
            }
            var a2 = document,
                aK = a2.documentElement,
                aR = "getElementsByClassName",
                aM = "getElementsByTagName",
                aX = "querySelectorAll",
                aL = "useNativeQSA",
                aQ = "tagName",
                aJ = "nodeType",
                a6, a1 = /#([\w\-]+)/,
                aT = /\.[\w\-]+/g,
                a4 = /^#([\w\-]+)$/,
                aY = /^\.([\w\-]+)$/,
                aP = /^([\w\-]+)$/,
                a3 = /^([\w]+)?\.([\w\-]+)$/,
                aI = /(^|,)\s*[>~+]/,
                aS = /^\s+|\s*([,\s\+\~>]|$)\s*/g,
                aZ = /[\s\>\+\~]/,
                aF = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/,
                a5 = /([.*+?\^=!:${}()|\[\]\/\\])/g,
                aH = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/,
                aw = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/,
                ah = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/,
                aG = new RegExp(a4.source + "|" + aP.source + "|" + aY.source),
                ag = new RegExp("(" + aZ.source + ")" + aF.source, "g"),
                am = new RegExp(aZ.source + aF.source),
                ay = new RegExp(aH.source + "(" + aw.source + ")?(" + ah.source + ")?"),
                aU = {
                    " ": function (d) {
                        return d && d !== aK && d.parentNode
                    },
                    ">": function (f, d) {
                        return f && f.parentNode == d.parentNode && f.parentNode
                    },
                    "~": function (d) {
                        return d && d.previousSibling
                    },
                    "+": function (g, d, h, f) {
                        return g ? (h = aW(g)) && (f = aW(d)) && h == f && h : !1
                    }
                };
            ao.prototype = {
                g: function (d) {
                    return this.c[d] || undefined
                },
                s: function (f, d, g) {
                    return d = g ? new RegExp(d) : d, this.c[f] = d
                }
            };
            var aA = new ao,
                al = new ao,
                an = new ao,
                a7 = new ao,
                ab = "compareDocumentPosition" in aK ? function (f, d) {
                    return (d.compareDocumentPosition(f) & 16) == 16
                } : "contains" in aK ? function (d, f) {
                    return f = f[aJ] === 9 || f == window ? aK : f, f !== d && f.contains(d)
                } : function (f, d) {
                    while (f = f.parentNode) {
                        if (f === d) {
                            return 1
                        }
                    }
                    return 0
                }, aa = function () {
                    var d = a2.createElement("p");
                    return (d.innerHTML = '<a href="#x">x</a>') && d.firstChild.getAttribute("href") != "#x" ? function (g, f) {
                        return f === "class" ? g.className : f === "href" || f === "src" ? g.getAttribute(f, 2) : g.getAttribute(f)
                    } : function (g, f) {
                        return g.getAttribute(f)
                    }
                }(),
                aO = !!a2[aR],
                a0 = a2.querySelector && a2[aX],
                aV = function (h, d) {
                    var k = [],
                        g, f;
                    try {
                        return d[aJ] === 9 || !aI.test(h) ? az(d[aX](h)) : (ak(g = h.split(","), au(d, function (m, l) {
                            f = m[aX](l), f.length == 1 ? k[k.length] = f.item(0) : f.length && (k = k.concat(az(f)))
                        })), g.length > 1 && k.length > 1 ? ae(k) : k)
                    } catch (j) { }
                    return aC(h, d)
                }, aC = function (m, q) {
                    var g = [],
                        j, r, d, p, k, h;
                    m = m.replace(aS, "$1");
                    if (r = m.match(a3)) {
                        k = ax(r[2]), j = q[aM](r[1] || "*");
                        for (d = 0, p = j.length; d < p; d++) {
                            k.test(j[d].className) && (g[g.length] = j[d])
                        }
                        return g
                    }
                    return ak(h = m.split(","), au(q, function (n, l, f) {
                        k = af(l, n);
                        for (d = 0, p = k.length; d < p; d++) {
                            if (n[aJ] === 9 || f || ab(k[d], q)) {
                                g[g.length] = k[d]
                            }
                        }
                    })), h.length > 1 && g.length > 1 ? ae(g) : g
                }, aB = function (d) {
                    typeof d[aL] != "undefined" && (a6 = d[aL] ? a0 ? aV : aC : aC)
                };
            return aB({
                useNativeQSA: !0
            }), aj.configure = aB, aj.uniq = ae, aj.is = aE, aj.pseudos = {}, aj
        }());
        return c
    }(window);
    //var _gaq = _gaq || [];
    //_gaq.push(["likebtn._setAccount", "UA-37384414-2"]);
    //_gaq.push(["likebtn._setDomainName", "likebtn.com"]);
    //_gaq.push(["likebtn._setCustomVar", 1, "TrackCV", "52adeda59ff5a3673dde025d069ae60b8e99766f6c", 3]);
    //_gaq.push(["likebtn._trackPageview"]);
    //(function () {
    //    var a = document.createElement("script");
    //    a.type = "text/javascript";
    //    a.async = true;
    //    a.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
    //    var b = document.getElementsByTagName("script")[0];
    //    b.parentNode.insertBefore(a, b)
    //})()
}
LikeBtn.init(true);
