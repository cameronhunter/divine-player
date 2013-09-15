var DivinePlayer = (function() {

  var PLAYERS = [HTML5Player, FlashPlayer];

  function DivinePlayer(el, options, onReady) {
    var Player = getSupportedPlayer(el);
    if (!Player) throw "No supported player found.";
    return new Player(el, options, onReady);
  }

  DivinePlayer.players = PLAYERS;

  function getSupportedPlayer(video) {
    for (var i=0, l=PLAYERS.length; i<l; i++) if (PLAYERS[i].canPlay(video)) {
      return PLAYERS[i];
    }
  }

  return DivinePlayer;
}());
