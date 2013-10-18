/**
 * Flash Player
 *
 * This player reads the properties from the video element, and replaces it with
 * an embedded SWF which handles the video playback.
 *
 * 1. FIXME: IE10 doesn't support dynamic object embeds. Not much of a big deal
 *           since it supports HTML5 video, but would be good to remove the
 *           workaround.
 *           Link: https://code.google.com/p/swfobject/issues/detail?id=667
 */

var FlashPlayer = (function(global) {

  var DEFAULT_SIZE = 150;

  // TODO: Select the mp4 instead of just the first source
  function FlashPlayer(el, options, onReady) {

    if (!options.size) options.size = DEFAULT_SIZE;

    var namespace = 'divinePlayer';
    var unique = (new Date).getTime();
    var callback = [namespace, 'onReady', unique].join('_');
    var onError = [namespace, 'onError', unique].join('_');

    var self = this;
    if (callback) {
      global[callback] = function() { onReady(self); };
    }

    global[onError] = function(code, description) {
      throw {'name': 'ActionScript ' + code, 'message': description};
    };

    var swf = override(el.getAttribute('data-fallback-player'), options.swf);

    if (!swf) throw 'SWF url must be specified.';

    this.swf = embed(swf, el, {
      size: options.size,
      autoplay: hasAttribute(el, 'autoplay'),
      muted: hasAttribute(el, 'muted'),
      loop: hasAttribute(el, 'loop'),
      poster: hasAttribute(el, 'poster') ? absolute(el.getAttribute('poster')) : undefined,
      video: getVideoUrl(el),
      onReady: callback,
      onError: onError
    });
  }

  FlashPlayer.name = FlashPlayer.name || 'FlashPlayer';

  FlashPlayer.canPlay = function() {
    try {
      // Issue #1
      if (/MSIE 10/i.test(navigator.userAgent)) return false;

      var flash = window.ActiveXObject ?
                    new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version') :
                    navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin.description;
      var match = /(\d+)[,.]\d+/.exec(flash);
      var majorVersion = parseInt(match[1], 10);
      return majorVersion >= 9;
    } catch (e) {/* Ignore */}
    return false;
  };

  FlashPlayer.fn = FlashPlayer.prototype;

  FlashPlayer.fn.play = function() {
    this.swf.divinePlay();
  };

  FlashPlayer.fn.pause = function() {
    this.swf.divinePause();
  };

  FlashPlayer.fn.paused = function() {
    return this.swf.divinePaused();
  };

  FlashPlayer.fn.mute = function() {
    this.swf.divineMute();
  };

  FlashPlayer.fn.unmute = function() {
    this.swf.divineUnmute();
  };

  FlashPlayer.fn.muted = function() {
    return this.swf.divineMuted();
  };

  return FlashPlayer;

  function absolute(url) {
    return (url || '').indexOf('//') === 0 ? document.location.protocol + url : url;
  }

  function getVideoUrl(el) {
    var sources = el.getElementsByTagName('source');
    return sources.length ? absolute(sources[0].src) : undefined;
  }

  function attrs(options) {
    return transform(options, function(k, v) {
      return k + '="' + v + '"';
    }, ' ');
  }

  function params(options) {
    return transform(options, function(k, v) {
      return '<param ' + attrs({name: k, value: v}) + ' />';
    }, '\n');
  }

  function flashvars(options) {
    return transform(options, function(k, v) {
      return k + '=' + encodeURIComponent(v);
    }, '&');
  }

  function transform(options, fn, joinWith) {
    var ret = [];
    for (var key in options) if (options.hasOwnProperty(key)) {
      ret.push(fn(key, options[key]));
    }
    return ret.join(joinWith);
  }

 function embed(swf, el, options) {
    var attributes = attrs({
      id: el.id,
      data: swf,
      width: options.size,
      height: options.size,
      type: 'application/x-shockwave-flash'
    });

    var parameters = params({
      movie: swf,
      allowScriptAccess: 'always',
      allowNetworking: 'all',
      wmode: 'opaque',
      quality: 'high',
      bgcolor: '#000000',
      flashvars: flashvars(options)
    });

    el.outerHTML = '<object ' + attributes + '>' + parameters + '</object>';

    return document.getElementById(el.id);
  }

  // IE7 and below doesn't support hasAttribute
  function hasAttribute(el, attribute) {
    return el.getAttribute(attribute) != null;
  }

  function override(original, custom) {
    return custom == null ? original : custom;
  }
}(this));