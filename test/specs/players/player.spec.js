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
        '<video id="video" preload="auto" poster="/base/test/fixtures/poster.jpg" data-fallback-player="/base/bower_components/divine-player-swf/release/divine-player.swf">' +
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

    // Issue #1
    ignore('when testing the Flash player in a browser without flash', Player.name === 'FlashPlayer' && !flashSupported, function() {
      describe('construction', function() {
        it('should call the onReady callback', function() {
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

    ignore('when PhantomJS', isPhantomJS, function() {
      describe('initial properties', function() {

        beforeEach(function() {
          this.onReady = jasmine.createSpy('onReady');
        });

        it("should not start muted if the muted property isn't present", function() {
          runs(function() {
            this.player = new Player(this.video, {}, this.onReady);
          });

          waitsFor(function() {
            return this.onReady.callCount;
          }, "player to be ready");

          runs(function() {
            expect(this.player.muted()).toBe(false);
          });
        });

        it('should start muted if the muted property is present', function() {
          runs(function() {
            this.video.setAttribute('muted', 'muted');
            this.player = new Player(this.video, {}, this.onReady);
          });

          waitsFor(function() {
            return this.onReady.callCount;
          }, "player to be ready");

          runs(function() {
            expect(this.player.muted()).toBe(true);
          });
        });

        it("should not start playing if the autoplay property isn't present", function() {
          runs(function() {
            this.player = new Player(this.video, {}, this.onReady);
          });

          waitsFor(function() {
            return this.onReady.callCount;
          }, "player to be ready");

          runs(function() {
            expect(this.player.paused()).toBe(true);
          });
        });

        it('should start playing if the autoplay property is present', function() {
          runs(function() {
            this.video.setAttribute('autoplay', 'autoplay');
            this.player = new Player(this.video, {}, this.onReady);
          });

          waitsFor(function() {
            return this.onReady.callCount && !this.player.paused();
          }, "player to be ready and start playing");

          runs(function() {
            expect(this.player.paused()).toBe(false);
          });
        });
      });

      describe('video size', function() {
        beforeEach(function() {
          this.onReady = jasmine.createSpy('onReady');
          this.player = new Player(this.video, {width: 600, height: 300}, this.onReady);

          waitsFor(function() {
            return this.onReady.callCount;
          }, "player to be ready");
        });

        it('should have the correct width and height on the player element', function() {
          runs(function() {
            var element = document.getElementById('video');
            expect(element.width + '').toEqual('600');
            expect(element.height + '').toEqual('300');
          });
        });
      });

      describe('functionality and state', function() {
        beforeEach(function() {
          this.onReady = jasmine.createSpy('onReady');
          this.player = new Player(this.video, {}, this.onReady);

          waitsFor(function() {
            return this.onReady.callCount;
          }, "player to be ready");
        });

        it('#paused', function() {
          runs(function() {
            expect(this.player.paused()).toBe(true);
            this.player.play();
            expect(this.player.paused()).toBe(false);
            this.player.pause();
            expect(this.player.paused()).toBe(true);
          });
        });

        it('#muted', function() {
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
});
