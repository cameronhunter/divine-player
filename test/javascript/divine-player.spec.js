describe('DivinePlayer', function() {

  beforeEach(function() {
    this.mockPlayer = jasmine.createSpy('Player');
    this.video = document.createElement('video');
  });

  it('should delegate to underlying video players', function() {
    spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);

    var options = {size: 150};
    var onReady = function() {};

    DivinePlayer(this.video, options, onReady);

    expect(this.mockPlayer).toHaveBeenCalledWith(this.video, options, onReady);
  });

  describe('error cases', function() {
    it("element isn't defined", function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);

      expect(function() {
        DivinePlayer(undefined, {});
      }).toThrow();
    });

    it("options isn't defined", function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);

      expect(function() {
        DivinePlayer(this.video);
      }).toThrow();
    });

    it("options.size isn't defined", function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(this.mockPlayer);

      expect(function() {
        DivinePlayer(this.video, {});
      }).toThrow();
    });

    it('no supported player found', function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(undefined);

      expect(function() {
        DivinePlayer(this.video, {size: 150});
      }).toThrow();
    });
  });


});