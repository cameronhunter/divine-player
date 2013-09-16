describe('DivinePlayer', function() {

  beforeEach(function() {
    this.mockPlayer = jasmine.createSpy('Player');
    this.video = document.createElement('video');
  });

  it('should delegate to underlying video players', function() {
    spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);

    var options = {};
    var onReady = function() {};

    DivinePlayer(this.video, options, onReady);

    expect(this.mockPlayer).toHaveBeenCalledWith(this.video, options, onReady);
  });

  describe('error cases', function() {
    it("element isn't defined", function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);

      expect(function() {
        DivinePlayer(undefined);
      }).toThrow();
    });

    it('no supported player found', function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(undefined);

      expect(function() {
        DivinePlayer(this.video);
      }).toThrow();
    });
  });

  describe('options', function() {

    beforeEach(function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);
    });

    $.each(DivinePlayer.options, function() {
      var option = this;

      it('should set ' + option + ' property on video element', function() {
        var video = document.createElement('video');

        var options = {};
        options[option] = true;
        DivinePlayer(video, options);

        expect(video.hasAttribute(option)).toBeTruthy();
      });

      it('should remove the ' + option + ' property if present when value is overridden to false', function() {
        jasmine.getFixtures().set(
          '<video id="video" ' + option + '>' +
            '<source src="/base/test/fixtures/video.mp4" type="video/mp4">' +
          '</video>'
        );
        var video = document.getElementById('video');

        var options = {};
        expect(video.hasAttribute(option)).toBeTruthy();

        options[option] = false;
        DivinePlayer(video, options);

        expect(video.hasAttribute(option)).toBeFalsy();
      });
    });
  });

});