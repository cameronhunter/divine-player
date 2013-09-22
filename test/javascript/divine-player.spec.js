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

  describe('postMessage API', function() {

    beforeEach(function() {
      spyOn(DivinePlayer, 'getSupportedPlayer').andReturn(StubPlayer);
      this.player = DivinePlayer(this.video, {allowPostMessage: true});
    });

    it('should play the video when "play" is posted', function() {
      var play = spyOn(this.player, 'play');
      runs(function() {
        window.postMessage('play', '*');
      });

      waitsFor(function() {
        return play.callCount;
      });

      runs(function() {
        expect(play).toHaveBeenCalled();
      });
    });

    it('should pause the video when "pause" is posted', function() {
      var pause = spyOn(this.player, 'pause');
      runs(function() {
        window.postMessage('pause', '*');
      });

      waitsFor(function() {
        return pause.callCount;
      });

      runs(function() {
        expect(pause).toHaveBeenCalled();
      });
    });

    it('should mute the video when "mute" is posted', function() {
      var mute = spyOn(this.player, 'mute');
      runs(function() {
        window.postMessage('mute', '*');
      });

      waitsFor(function() {
        return mute.callCount;
      });

      runs(function() {
        expect(mute).toHaveBeenCalled();
      });
    });

    it('should unmute the video when "unmute" is posted', function() {
      var unmute = spyOn(this.player, 'unmute');
      runs(function() {
        window.postMessage('unmute', '*');
      });

      waitsFor(function() {
        return unmute.callCount;
      });

      runs(function() {
        expect(unmute).toHaveBeenCalled();
      });
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