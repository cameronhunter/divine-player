var DivinePlayer = (function() {

  var PLAYERS = [HTML5Player, FlashPlayer];

  function DivinePlayer(el, options, onReady) {
    require(el, 'Element must be defined.');
    require(options, 'Options must be defined.');
    require(options.size, 'Size must be defined.');

    var Player = require(DivinePlayer.getSupportedPlayer(el), 'No supported player found.');

    return new Player(el, options, onReady);
  }

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
}());
