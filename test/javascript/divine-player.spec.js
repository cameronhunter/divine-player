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

    ['autoplay', 'controls', 'loop', 'muted'].forEach(function(option) {
      it('should set ' + option + ' property on video element', function() {
        var options = {};

        this.video.removeAttribute(option);
        expect(this.video.getAttribute(option)).toBeFalsy();

        options[option] = true;
        DivinePlayer(this.video, options);

        expect(this.video.getAttribute(option)).toBeTruthy();
      });

      it('should remove the ' + option + ' property if present when value is overridden to false', function() {
        var options = {};

        this.video.setAttribute(option, true);
        expect(this.video.getAttribute(option)).toBeTruthy();

        options[option] = false;
        DivinePlayer(this.video, options);

        expect(this.video.getAttribute(option)).toBeFalsy();
      });
    });
  });

});