(function() {
  var video = document.getElementById('video');
  var container = document.getElementById('container');

  DivinePlayer(video, {size: 600}, function(player) {
    container.onclick = function() {
      player.paused() ? player.play() : player.pause();
      return false;
    };
  });
}());