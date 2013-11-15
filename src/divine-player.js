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

var DivinePlayer = (function(DEBUG) {

  var PLAYERS = [HTML5Player, FlashPlayer, ImagePlayer];
  var OPTIONS = ['autoplay', 'controls', 'loop', 'muted'];

  function DivinePlayer(el, options, onReady) {
    if (DEBUG) {
      require(el, 'Element must be defined.');
    }

    var options = options || {};

    if (options.allowHashMessage) {
      var hashOptions = window.location.hash.replace('#', '').split(',');
      for (var i=0, l=hashOptions.length; i<l; i++) if (OPTIONS.indexOf(hashOptions[i]) >= 0) {
        options[hashOptions[i]] = true;
      }
    }

    for (var i=0, l=OPTIONS.length; i<l; i++) {
      var property = OPTIONS[i];
      var state = options[OPTIONS[i]];
      if (state != null) attr(el, property, state);
    }

    var Player = DivinePlayer.getSupportedPlayer(el);

    if (DEBUG) {
      require(Player, 'No supported player found.');
    }

    var player = new Player(el, options, onReady);

    if (options.allowHashMessage) {
      addEventListener('hashchange', function() {
        handleCommand(window.location.hash.replace('#', ''), player);
      });
    }

    if (options.allowPostMessage) {
      addEventListener('message', function(message) {
        handleCommand(message.data, player);
      });
    }

    return player;
  }

  if (DEBUG) {
    DivinePlayer.players = PLAYERS;
    DivinePlayer.options = OPTIONS;
  }

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

  function addEventListener(event, fn) {
    if (window.addEventListener) {
      window.addEventListener(event, fn, false);
    } else {
      window.attachEvent('on' + event, fn);
    }
  }

  function handleCommand(command, player) {
    switch(command) {
      case 'play': player.play(); break;
      case 'pause': player.pause(); break;
      case 'mute': player.mute(); break;
      case 'unmute': player.unmute(); break;
    }
  }
}(window['DEBUG'] || false));
