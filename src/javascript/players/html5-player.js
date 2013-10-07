var HTML5Player = (function() {

  function HTML5Player(el, options, onReady) {
    this.el = el;
    this.el.width = options.size;
    this.el.height = options.size;
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
    /**
     * The iPad has a strange glitch where it won't show the play button if the
     * controls are off. It also won't autoplay in any-way until the user
     * presses the button.
     *
     * Android has an issue that the video disappears on play when controls
     * aren't visible.
     */
    if (!el.hasAttribute('controls') && (/ipad/i.test(userAgent) || /android/i.test(userAgent))) {
      el.controls = true;
      el.addEventListener('play', function() {
        el.controls = false;
      }, false);
    }

    /**
     * In Android, the loop attribute prevents events being triggered on the
     * video element, so we do it manually.
     *
     * Link: http://stackoverflow.com/a/8375870
     */
    if (/android/i.test(userAgent)) {
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
