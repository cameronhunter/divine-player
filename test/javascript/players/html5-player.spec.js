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
      '<video id="video" loop>' +
        '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
      '</video>'
    );
    this.video = document.getElementById('video');

    this.android = {userAgentOverride: 'Android'};
    this.iPad = {userAgentOverride: 'iPad'};
  });

  describe('workarounds', function() {

    describe("Android doesn't loop correctly", function() {
      cit('should loop manually', !isPhantomJS, function() {
        spyOn(this.video, 'play');

        expect(this.video.hasAttribute('loop')).toBe(true);

        var player = new HTML5Player(this.video, this.android);

        expect(this.video.loop).toBe(false);

        runs(function() {
          player.play();
        });

        waitsFor(function() {
          return this.video.play.callCount;
        }, this.video.duration * 1500);

        runs(function() {
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