/**
 * Divine Player
 *
 * This component chooses a supported player from the PLAYERS array, it also
 * adds and removes attributes to the <video> element depending on the options
 * supplied by the user. An exception is thrown if no supported player is found,
 * developers should handle this appropriately and fallback as necessary.
 *
 * Issues
 *
 * 1. IE9 throws a "Error: Not implemented" exception when adding or removing
 *    'autoplay' and 'loop' properties. Perhaps because it doesn't make sense
 *    to add these properties after element initialisation?
 */

var DivinePlayer = (function() {

  var PLAYERS = [HTML5Player, FlashPlayer];
  var OPTIONS = ['autoplay', 'controls', 'loop', 'muted'];

  function DivinePlayer(el, options, onReady) {
    require(el, 'Element must be defined.');

    var options = options || {};

    for (var i=0, l=OPTIONS.length; i<l; i++) {
      var property = OPTIONS[i];
      var state = options[OPTIONS[i]];
      if (state != null) attr(el, property, state);
    }

    var Player = require(DivinePlayer.getSupportedPlayer(el), 'No supported player found.');

    return new Player(el, options, onReady);
  }

  // Exposed for testing purposes.
  DivinePlayer.players = PLAYERS;
  DivinePlayer.options = OPTIONS;
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

  function attr(el, property, active) {
    if (active) {
      // Issue #1
      try { el.setAttribute(property, property); } catch(e) {/* Ignore */}
    } else {
      el.removeAttribute(property);
    }
  }
}());
