var DivinePlayer = (function() {

  var PLAYERS = [HTML5Player, FlashPlayer];

  return {
    getSupportedPlayer: function() {
      for (var i=0, l=PLAYERS.length; i<l; i++) {
        if (PLAYERS[i].canPlay(video)) return PLAYERS[i];
      }
    }
  };

}());
