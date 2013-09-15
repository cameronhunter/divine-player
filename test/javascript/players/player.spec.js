/**
 * Issues
 *
 * 1. PhantomJS doesn't support Flash plugin, so we can't test the
 *    SWF external interface from JS.
 *    Link: https://github.com/ariya/phantomjs/wiki/Supported-Web-Standards#unsupported-features
 */
DivinePlayer.players.forEach(function(Player) {

  describe(Player.name, function() {

    beforeEach(function() {
      jasmine.getFixtures().set(
        '<video id="video" autoplay muted loop preload="auto" poster="/base/test/fixtures/poster.jpg" data-fallback-player="/base/release/swf/divine-player.swf">' +
          '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
        '</video>'
      );
      this.video = document.getElementById('video');
    });

    describe('static functionality', function() {
      it('should support Player.canPlay', function() {
        expect(Player.canPlay).toBeDefined();
      });
    });

    describe('player instantiation', function() {

      // Issue #1
      var isPhantomJSAndFlashPlayer = /PhantomJS/.test(navigator.userAgent) && Player.name === 'FlashPlayer';
      cit('should call the onReady callback', !isPhantomJSAndFlashPlayer, function() {
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

  });
});