var HTML5Player = (function() {

  function HTML5Player(el, options, onReady) {
    this.el = el;
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
     * There is a bug on android that causes the loop attribute to kill all
     * events from the video player. So we do it manually.
     */
    if (/android/i.test(userAgent)) {
      el.loop = false;
      el.addEventListener('ended', function() {
        el.play();
      }, false);
    }

    /**
     * Workaround for Android and Chrome not autoplaying when controls are
     * off.
     *
     * The iPad has a strange glitch where it won't show the play button if the
     * controls are off. It also won't autoplay in any-way until the user
     * presses the button.
     */
    el.controls = true;
    el.addEventListener('play', function() {
      el.controls = false;
    }, false);

    /**
     * Firefox and Opera need to be explicitly play for tests to pass.
     */
    if (el.hasAttribute('autoplay')) {
      el.play();
    }
  }
}());
