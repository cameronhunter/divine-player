/**
 * Issues
 *
 * 1. PhantomJS doesn't support Flash plugin, so we can't test the
 *    SWF external interface from JS.
 *    Link: https://github.com/ariya/phantomjs/wiki/Supported-Web-Standards#unsupported-features
 */
$.each(DivinePlayer.players, function() {
  var Player = this;

  describe(Player.name, function() {

    beforeEach(function() {
      jasmine.getFixtures().set(
        '<video id="video" preload="auto" poster="/base/test/fixtures/poster.jpg" data-fallback-player="/base/release/swf/divine-player.swf">' +
          '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
        '</video>'
      );
      this.video = document.getElementById('video');
    });

    describe('static functionality', function() {
      it('should support #canPlay', function() {
        expect(Player.canPlay).toBeDefined();
      });
    });

    describe('construction', function() {

      // Issue #1
      var flashPlayerWithoutFlash = Player.name === 'FlashPlayer' && !flashSupported;

      cit('should call the onReady callback', !flashPlayerWithoutFlash, function() {
        var player, onReady = jasmine.createSpy('onReady');

        runs(function() {
          player = new Player(this.video, {}, onReady);
        });

        waitsFor(function() {
          return onReady.callCount;
        }, "onReady to be called");

        runs(function() {
          expect(onReady.callCount).toEqual(1);
          expect(onReady).toHaveBeenCalledWith(player);
        });
      });
    });

    describe('instance functionality', function() {
      beforeEach(function() {
        this.player = new Player(this.video, {});
      });

      it('should support #play', function() {
        expect(this.player.play).toBeDefined();
      });

      it('should support #pause', function() {
        expect(this.player.pause).toBeDefined();
      });

      it('should support #paused', function() {
        expect(this.player.paused).toBeDefined();
      });

      it('should support #mute', function() {
        expect(this.player.mute).toBeDefined();
      });

      it('should support #unmute', function() {
        expect(this.player.unmute).toBeDefined();
      });

      it('should support #muted', function() {
        expect(this.player.muted).toBeDefined();
      });
    });

    var createPlayer = function(video, properties, after) {
      var player, onReady = jasmine.createSpy('onReady');

      runs(function() {
        $.each(properties, function() {
          video.setAttribute(this, this);
        });

        player = new Player(video, {}, onReady);
      });

      waitsFor(function() {
        return onReady.callCount;
      });

      runs(function() {
        after(player);
      });
    };

    describe('initial properties', function() {

      beforeEach(function() {
        this.onReady = jasmine.createSpy('onReady');
      });

      cit("should not start muted if the muted property isn't present", !isPhantomJS, function() {
        runs(function() {
          this.player = new Player(this.video, {}, this.onReady);
        });

        waitsFor(function() {
          return this.onReady.callCount;
        });

        runs(function() {
          expect(this.player.muted()).toBe(false);
        });
      });

      cit('should start muted if the muted property is present', !isPhantomJS, function() {
        runs(function() {
          this.video.setAttribute('muted', 'muted');
          this.player = new Player(this.video, {}, this.onReady);
        });

        waitsFor(function() {
          return this.onReady.callCount;
        });

        runs(function() {
          expect(this.player.muted()).toBe(true);
        });
      });

      cit("should not start playing if the autoplay property isn't present", !isPhantomJS, function() {
        runs(function() {
          this.player = new Player(this.video, {}, this.onReady);
        });

        waitsFor(function() {
          return this.onReady.callCount;
        });

        runs(function() {
          expect(this.player.paused()).toBe(true);
        });
      });

      cit('should start playing if the autoplay property is present', !isPhantomJS, function() {
        runs(function() {
          this.video.setAttribute('autoplay', 'autoplay');
          this.player = new Player(this.video, {}, this.onReady);
        });

        waitsFor(function() {
          return this.onReady.callCount && !this.player.paused();
        });

        runs(function() {
          expect(this.player.paused()).toBe(false);
        });
      });
    });

    describe('functionality and state', function() {
      beforeEach(function() {
        this.onReady = jasmine.createSpy('onReady');
        this.player = new Player(this.video, {}, this.onReady);

        waitsFor(function() {
          return this.onReady.callCount;
        });
      });

      cit('#paused', !isPhantomJS, function() {
        runs(function() {
          expect(this.player.paused()).toBe(true);
          this.player.play();
          expect(this.player.paused()).toBe(false);
          this.player.pause();
          expect(this.player.paused()).toBe(true);
        });
      });

      cit('#muted', !isPhantomJS, function() {
        runs(function() {
          expect(this.player.muted()).toBe(false);
          this.player.mute();
          expect(this.player.muted()).toBe(true);
          this.player.unmute();
          expect(this.player.muted()).toBe(false);
        });
      });
    });

  });
});