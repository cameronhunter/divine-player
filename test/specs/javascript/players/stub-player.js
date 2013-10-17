var StubPlayer = (function() {

  function StubPlayer(el, options, onReady) {
    if (onReady) onReady();
  }

  StubPlayer.canPlay = function() {
    return true;
  };

  StubPlayer.fn = StubPlayer.prototype;

  StubPlayer.fn.play = noop;
  StubPlayer.fn.pause = noop;
  StubPlayer.fn.mute = noop;
  StubPlayer.fn.unmute = noop;

  return StubPlayer;

  function noop() {}
}());