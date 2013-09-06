var HTML5Player = (function() {
  function player(el, options, onReady) {
    this.el = el;

    if (options.autoplay != null) this.el.autoplay = options.autoplay;
    if (options.controls != null) this.el.controls = options.controls;
    if (options.loop != null) this.el.loop = options.loop;
    if (options.muted != null) this.el.muted = options.muted;

    workarounds(this.el);

    if (onReady) onReady(this);
  }

  player.canPlay = function(el) {
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

  player.fn = player.prototype;

  player.fn.play = function() {
    this.el.play();
  };

  player.fn.pause = function() {
    this.el.pause();
  };

  player.fn.paused = function() {
    return this.el.paused;
  };

  player.fn.mute = function() {
    this.el.muted = true;
  };

  player.fn.unmute = function() {
    this.el.muted = false;
  };

  player.fn.muted = function() {
    return this.el.muted;
  };

  return player;

  function workarounds(el) {
    /**
     * The iPad has a strange glitch where it won't show the play button if the
     * controls are off. It also won't autoplay in any-way until the user
     * presses the button.
     */
    if (/ipad/i.test(navigator.userAgent)) {
      el.controls = true;
      el.addEventListener('play', function() {
        el.controls = false;
      }, false);
    }

    /**
     * There is a bug on android that causes the loop attribute to kill all
     * events from the video player. So we do it manually.
     */
    if (/android/i.test(navigator.userAgent)) {
      el.loop = false;
      el.addEventListener('ended', function() {
        el.play();
      }, false);
    }
  }
}());