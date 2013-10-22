describe('HTML5Player', function() {

  beforeEach(function() {
    jasmine.getFixtures().set(
      '<video id="video" loop muted poster="/base/test/fixtures/poster.jpg">' +
        '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
      '</video>'
    );
    this.video = document.getElementById('video');
  });

  /**
   * https://github.com/cameronhunter/divine-player/issues/1
   */
  when('is Chrome', /chrome/i.test(navigator.userAgent), function() {
    it("disappears if a poster is present - either due to preload attribute or no controls, so we remove the poster", function() {
      expect(this.video.hasAttribute('poster')).toBe(true);

      new HTML5Player(this.video, {});

      expect(this.video.hasAttribute('poster')).toBe(false);
    });
  });

  /**
   * https://github.com/cameronhunter/divine-player/issues/2
   */
  when('is Android or iPad', (/android/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent)), function() {
    it("won't play unless controls are on, so we show them until play is hit", function() {
      expect(this.video.hasAttribute('controls')).toBe(false);

      var player = new HTML5Player(this.video, {});

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

  /**
   * https://github.com/cameronhunter/divine-player/issues/3
   */
  when('is Android', /android/i.test(navigator.userAgent), function() {
    it("doesn't loop correctly, so we do it manually", function() {
      var onReady = jasmine.createSpy('onReady');
      spyOn(this.video, 'play').andCallThrough();

      runs(function() {
        expect(this.video.hasAttribute('loop')).toBe(true);
        player = new HTML5Player(this.video, {}, onReady);
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
      }, this.video.duration * 1500, 'video to finish');

      runs(function() {
        expect(this.video.play.callCount).toBe(2);
        expect(this.video.play).toHaveBeenCalled();
      });
    });
  });

});