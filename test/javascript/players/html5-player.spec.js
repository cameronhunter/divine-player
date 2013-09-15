/**
 * Difficulties
 *
 * The HTML5 video element is unsupported in PhantomJS which
 * makes things tricky to test in a headless environment.
 *
 * Link: https://github.com/ariya/phantomjs/wiki/Supported-Web-Standards#unsupported-features
 */
describe('HTML5Player', function() {

  var isPhantomJS = /PhantomJS/.test(navigator.userAgent);

  beforeEach(function() {
    jasmine.getFixtures().set(
      '<video id="video" loop muted>' +
        '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
      '</video>'
    );
    this.video = document.getElementById('video');

    this.android = {userAgentOverride: 'Android'};
    this.iPad = {userAgentOverride: 'iPad'};
  });

  describe('workarounds', function() {

    describe("Android doesn't loop correctly", function() {
      // Ignoring test until Chrome issue is resolved: https://code.google.com/p/chromium/issues/detail?id=157543
      xcit('should loop manually', !isPhantomJS, function() {
        var onReady = jasmine.createSpy('onReady');
        spyOn(this.video, 'play').andCallThrough();

        runs(function() {
          expect(this.video.hasAttribute('loop')).toBe(true);
          player = new HTML5Player(this.video, this.android, onReady);
          expect(this.video.loop).toBe(false);
        });

        waitsFor(function() {
          return onReady.callCount;
        }, 'onReady to be called');

        runs(function() {
          player.play();
        });

        waitsFor(function() {
          return this.video.ended;
        }, 10000, 'video to finish');

        runs(function() {
          expect(this.video.play.callCount).toBe(2);
          expect(this.video.play).toHaveBeenCalled();
        });
      });
    });

    describe("iPad won't show the play button if the controls are off", function() {
      cit('should add and remove the controls manually', !isPhantomJS, function() {
        expect(this.video.hasAttribute('controls')).toBe(false);

        var player = new HTML5Player(this.video, this.iPad);

        expect(this.video.controls).toBe(true);

        runs(function() {
          player.play();
        });

        waitsFor(function() {
          return !this.video.controls;
        });

        runs(function() {
          expect(this.video.controls).toBe(false);
        });
      });
    });

  });
});