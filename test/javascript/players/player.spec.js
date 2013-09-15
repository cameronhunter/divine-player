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
      // We can't test Flash external interface in Phantom JS.
      var conditionalIt = /PhantomJS/.test(navigator.userAgent) && Player.name === 'FlashPlayer' ? xit : it;

      conditionalIt('should call the onReady callback', function() {
        var player, onReady = jasmine.createSpy('onReady');

        runs(function() {
          player = new Player(this.video, {size: 150}, onReady);
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
        this.player = new Player(this.video, {size: 150});
      });

      it('should support Player#play', function() {
        expect(this.player.play).toBeDefined();
      });

      it('should support Player#pause', function() {
        expect(this.player.pause).toBeDefined();
      });

      it('should support Player#paused', function() {
        expect(this.player.paused).toBeDefined();
      });

      it('should support Player#mute', function() {
        expect(this.player.mute).toBeDefined();
      });

      it('should support Player#unmute', function() {
        expect(this.player.unmute).toBeDefined();
      });

      it('should support Player#muted', function() {
        expect(this.player.muted).toBeDefined();
      });
    });

  });
});