var DivinePlayer = function() {
    var HTML5Player = function() {
        function HTML5Player(b, c, d) {
            this.el = b, this.el.width = c.width || b.videoWidth, this.el.height = c.height || b.videoHeight, 
            this.el.muted = b.hasAttribute("muted"), a(this.el, navigator.userAgent), d && d(this);
        }
        function a(a, b) {
            var c = /ipad/i.test(b), d = /ipad/i.test(b), e = /android/i.test(b), f = /chrome/i.test(b), g = c || d || e;
            if (a.hasAttribute("poster") && f && !g) {
                {
                    a.getAttribute("poster");
                }
                a.removeAttribute("poster");
            }
            a.hasAttribute("controls") || !c && !e || (a.controls = !0, a.addEventListener("play", function() {
                a.controls = !1;
            }, !1)), e && (a.loop = !1, a.addEventListener("ended", function() {
                a.play();
            }, !1)), a.hasAttribute("autoplay") && a.play();
        }
        return HTML5Player.name = HTML5Player.name || "HTML5Player", HTML5Player.canPlay = function(a) {
            try {
                for (var b = a.getElementsByTagName("source"), c = 0, d = b.length; d > c; c++) {
                    var e = b[c].getAttribute("type"), f = a.canPlayType(e);
                    if (f) return !0;
                }
            } catch (g) {}
            return !1;
        }, HTML5Player.fn = HTML5Player.prototype, HTML5Player.fn.play = function() {
            this.el.play();
        }, HTML5Player.fn.pause = function() {
            this.el.pause();
        }, HTML5Player.fn.paused = function() {
            return this.el.paused;
        }, HTML5Player.fn.mute = function() {
            this.el.muted = !0;
        }, HTML5Player.fn.unmute = function() {
            this.el.muted = !1;
        }, HTML5Player.fn.muted = function() {
            return this.el.muted;
        }, HTML5Player;
    }(), FlashPlayer = function(a) {
        function FlashPlayer(d, e, f) {
            e.width || (e.width = k), e.height || (e.height = k);
            var g = "divinePlayer", l = new Date().getTime(), m = [ g, "onReady", l ].join("_"), n = [ g, "onError", l ].join("_"), o = this;
            m && (a[m] = function() {
                f(o);
            }), a[n] = function(a, b) {
                throw {
                    name: "ActionScript " + a,
                    message: b
                };
            };
            var p = j(d.getAttribute("data-fallback-player"), e.swf);
            if (!p) throw "SWF url must be specified.";
            this.swf = h(p, d, {
                width: e.width,
                height: e.height,
                autoplay: i(d, "autoplay"),
                muted: i(d, "muted"),
                loop: i(d, "loop"),
                poster: i(d, "poster") ? b(d.getAttribute("poster")) : void 0,
                video: c(d),
                onReady: m,
                onError: n
            });
        }
        function b(a) {
            return 0 === (a || "").indexOf("//") ? document.location.protocol + a : a;
        }
        function c(a) {
            var c = a.getElementsByTagName("source");
            return c.length ? b(c[0].src) : void 0;
        }
        function d(a) {
            return g(a, function(a, b) {
                return a + '="' + b + '"';
            }, " ");
        }
        function e(a) {
            return g(a, function(a, b) {
                return "<param " + d({
                    name: a,
                    value: b
                }) + " />";
            }, "\n");
        }
        function f(a) {
            return g(a, function(a, b) {
                return a + "=" + encodeURIComponent(b);
            }, "&");
        }
        function g(a, b, c) {
            var d = [];
            for (var e in a) a.hasOwnProperty(e) && d.push(b(e, a[e]));
            return d.join(c);
        }
        function h(a, b, c) {
            var g = d({
                id: b.id,
                data: a,
                width: c.width,
                height: c.height,
                type: "application/x-shockwave-flash"
            }), h = e({
                movie: a,
                allowScriptAccess: "always",
                allowNetworking: "all",
                wmode: "opaque",
                quality: "high",
                bgcolor: "#000000",
                flashvars: f(c)
            });
            return b.outerHTML = "<object " + g + ">" + h + "</object>", document.getElementById(b.id);
        }
        function i(a, b) {
            return null != a.getAttribute(b);
        }
        function j(a, b) {
            return null == b ? a : b;
        }
        var k = 150;
        return FlashPlayer.name = FlashPlayer.name || "FlashPlayer", FlashPlayer.canPlay = function() {
            try {
                if (/MSIE 10/i.test(navigator.userAgent)) return !1;
                var a = window.ActiveXObject ? new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version") : navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin.description, b = /(\d+)[,.]\d+/.exec(a), c = parseInt(b[1], 10);
                return c >= 9;
            } catch (d) {}
            return !1;
        }, FlashPlayer.fn = FlashPlayer.prototype, FlashPlayer.fn.play = function() {
            this.swf.divinePlay();
        }, FlashPlayer.fn.pause = function() {
            this.swf.divinePause();
        }, FlashPlayer.fn.paused = function() {
            return this.swf.divinePaused();
        }, FlashPlayer.fn.mute = function() {
            this.swf.divineMute();
        }, FlashPlayer.fn.unmute = function() {
            this.swf.divineUnmute();
        }, FlashPlayer.fn.muted = function() {
            return this.swf.divineMuted();
        }, FlashPlayer;
    }(this), ImagePlayer = function() {
        function ImagePlayer(c, d, e) {
            this._playing = b(c, "autoplay"), this._muted = b(c, "muted"), a(c, d, c.getAttribute("poster")), 
            e && e(this);
        }
        function a(a, b, c) {
            a.outerHTML = '<img id="' + a.id + '" src="' + c + '" width="' + b.width + '" height="' + b.height + '">';
        }
        function b(a, b) {
            return null != a.getAttribute(b);
        }
        return ImagePlayer.name = ImagePlayer.name || "ImagePlayer", ImagePlayer.canPlay = function(a) {
            return b(a, "poster");
        }, ImagePlayer.fn = ImagePlayer.prototype, ImagePlayer.fn.play = function() {
            this._playing = !0;
        }, ImagePlayer.fn.pause = function() {
            this._playing = !1;
        }, ImagePlayer.fn.paused = function() {
            return !this._playing;
        }, ImagePlayer.fn.mute = function() {
            this._muted = !0;
        }, ImagePlayer.fn.unmute = function() {
            this._muted = !1;
        }, ImagePlayer.fn.muted = function() {
            return this._muted;
        }, ImagePlayer;
    }(), DivinePlayer = function() {
        function DivinePlayer(e, g, h) {
            a(e, "Element must be defined.");
            var g = g || {};
            if (g.allowHashMessage) for (var i = window.location.hash.replace("#", "").split(","), j = 0, k = i.length; k > j; j++) f.indexOf(i[j]) >= 0 && (g[i[j]] = !0);
            for (var j = 0, k = f.length; k > j; j++) {
                var l = f[j], m = g[f[j]];
                null != m && b(e, l, m);
            }
            var n = DivinePlayer.getSupportedPlayer(e);
            a(n, "No supported player found.");
            var o = new n(e, g, h);
            return g.allowHashMessage && c("hashchange", function() {
                d(window.location.hash.replace("#", ""), o);
            }), g.allowPostMessage && c("message", function(a) {
                d(a.data, o);
            }), o;
        }
        function a(a, b) {
            if (!a) throw b || "Requirement isn't fullfilled";
            return a;
        }
        function b(a, b, c) {
            if (c) try {
                a.setAttribute(b, b);
            } catch (d) {} else a.removeAttribute(b);
        }
        function c(a, b) {
            window.addEventListener ? window.addEventListener(a, b, !1) : window.attachEvent("on" + a, b);
        }
        function d(a, b) {
            switch (a) {
              case "play":
                b.play();
                break;

              case "pause":
                b.pause();
                break;

              case "mute":
                b.mute();
                break;

              case "unmute":
                b.unmute();
            }
        }
        var e = [ HTML5Player, FlashPlayer, ImagePlayer ], f = [ "autoplay", "controls", "loop", "muted" ];
        return DivinePlayer.players = e, DivinePlayer.options = f, DivinePlayer.getSupportedPlayer = function(a) {
            for (var b = 0, c = e.length; c > b; b++) if (e[b].canPlay(a)) return e[b];
        }, DivinePlayer;
    }();
    return DivinePlayer;
}();