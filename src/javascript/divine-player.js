var DivinePlayer = (function() {

  var PLAYERS = [HTML5Player, FlashPlayer];

  function DivinePlayer(el, options, onReady) {
    require(el, 'Element must be defined.');

    var options = options || {};

    attr(el, 'autoplay', options.autoplay);
    attr(el, 'controls', options.controls);
    attr(el, 'loop', options.loop);
    attr(el, 'muted', options.muted);

    var Player = require(DivinePlayer.getSupportedPlayer(el), 'No supported player found.');

    return new Player(el, options, onReady);
  }

  // Exposed for testing purposes.
  DivinePlayer.players = PLAYERS;
  DivinePlayer.getSupportedPlayer = function(video) {
    for (var i=0, l=PLAYERS.length; i<l; i++) if (PLAYERS[i].canPlay(video)) {
      return PLAYERS[i];
    }
  };

  return DivinePlayer;

  function require(condition, message) {
    if (!condition) throw (message || "Requirement isn't fullfilled");
    return condition;
  }

  function attr(el, name, value) {
    if (value == null) return;

    if (value) {
      el.setAttribute(name, value);
    } else {
      el.removeAttribute(name);
    }
  }
}());
