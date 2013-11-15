/**
 * This player uses the poster image providing a clean static fallback if
 * other players such as the HTML5 or Flash players aren't supported.
 *
 * It would be awesome if this player showed a GIF rather than the poster. It
 * would provide the best possible end-user experience.
 */
var ImagePlayer = (function(DEBUG) {

  function ImagePlayer(el, options, onReady) {
    this._playing = hasAttribute(el, 'autoplay');
    this._muted = hasAttribute(el, 'muted');

    embed(el, options, el.getAttribute('poster'));

    if (onReady) onReady(this);
  }

  ImagePlayer.name = ImagePlayer.name || 'ImagePlayer';

  ImagePlayer.canPlay = function(el) {
    return hasAttribute(el, 'poster');
  };

  ImagePlayer.fn = ImagePlayer.prototype;

  ImagePlayer.fn.play = function() {
    this._playing = true;
  };

  ImagePlayer.fn.pause = function() {
    this._playing = false;
  };

  ImagePlayer.fn.paused = function() {
    return !this._playing;
  };

  ImagePlayer.fn.mute = function() {
    this._muted = true;
  };

  ImagePlayer.fn.unmute = function() {
    this._muted = false;
  };

  ImagePlayer.fn.muted = function() {
    return this._muted;
  };

  return ImagePlayer;

  function embed(el, options, poster) {
    el.outerHTML = '<img id="' + el.id + '" src="' + poster + '" width="' + options.width + '" height="' + options.height + '">';
  }

  // IE7 and below doesn't support hasAttribute
  function hasAttribute(el, attribute) {
    return el.getAttribute(attribute) != null;
  }
}(window['DEBUG'] || false));
