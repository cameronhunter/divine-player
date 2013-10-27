var HTML5Player = (function() {

  function HTML5Player(el, options, onReady) {
    this.el = el;
    this.el.width = options.width || el.videoWidth;
    this.el.height = options.height || el.videoHeight;
    this.el.muted = el.hasAttribute('muted');
    workarounds(this.el, navigator.userAgent);
    if (onReady) onReady(this);
  }

  HTML5Player.name = HTML5Player.name || 'HTML5Player';

  HTML5Player.canPlay = function(el) {
    try {
      var sources = el.getElementsByTagName('source');
      for (var i=0, l = sources.length; i<l; i++) {
        var type = sources[i].getAttribute('type');
        var canPlayType = el.canPlayType(type);
        if (canPlayType) return true;
      }
    } catch(e) {/* IGNORE */}
    return false;
  };

  HTML5Player.fn = HTML5Player.prototype;

  HTML5Player.fn.play = function() {
    this.el.play();
  };

  HTML5Player.fn.pause = function() {
    this.el.pause();
  };

  HTML5Player.fn.paused = function() {
    return this.el.paused;
  };

  HTML5Player.fn.mute = function() {
    this.el.muted = true;
  };

  HTML5Player.fn.unmute = function() {
    this.el.muted = false;
  };

  HTML5Player.fn.muted = function() {
    return this.el.muted;
  };

  return HTML5Player;

  function workarounds(el, userAgent) {
    var iPad = /ipad/i.test(userAgent);
    var iPhone = /ipad/i.test(userAgent);
    var android = /android/i.test(userAgent);
    var chrome = /chrome/i.test(userAgent);

    var mobile = iPad || iPhone || android;

    /**
     * https://github.com/cameronhunter/divine-player/issues/1
     */
    if(el.hasAttribute('poster') && chrome && !mobile) {
      var poster = el.getAttribute('poster');
      el.removeAttribute('poster');
    }

    /**
     * https://github.com/cameronhunter/divine-player/issues/2
     */
    if (!el.hasAttribute('controls') && (iPad || android)) {
      el.controls = true;
      el.addEventListener('play', function() {
        el.controls = false;
      }, false);
    }

    /**
     * https://github.com/cameronhunter/divine-player/issues/3
     */
    if (android) {
      el.loop = false;
      el.addEventListener('ended', function() {
        el.play();
      }, false);
    }

    /**
     * Firefox and Opera require explicit play calls for autoplay tests to pass.
     */
    if (el.hasAttribute('autoplay')) {
      el.play();
    }
  }
}());
