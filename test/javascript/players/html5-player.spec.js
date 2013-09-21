describe('HTML5Player', function() {

  beforeEach(function() {
    jasmine.getFixtures().set(
      '<video id="video" loop muted>' +
        '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
      '</video>'
    );
    this.video = document.getElementById('video');
  });

  when('is Android', /android/i.test(navigator.userAgent), function() {
    it("doesn't loop correctly, so we do it manually", function() {
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
      }, this.video.duration * 1500, 'video to finish');

      runs(function() {
        expect(this.video.play.callCount).toBe(2);
        expect(this.video.play).toHaveBeenCalled();
      });
    });
  });

  when('is iPad', /ipad/i.test(navigator.userAgent), function() {
    it("won't play unless controls are on, so we show them until play is hit", function() {
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