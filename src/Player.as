package {

  import flash.display.Loader;
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  import flash.events.NetStatusEvent;
  import flash.external.ExternalInterface;
  import flash.media.SoundTransform;
  import flash.media.Video;
  import flash.net.NetConnection;
  import flash.net.NetStream;
  import flash.net.URLRequest;
  import flash.system.Security;

  public class Player extends Sprite {

    private var posterUrl: String;
    private var videoUrl: String;
    private var loop: Boolean;
    private var muted: Boolean;
    private var autoplay: Boolean;

    private var videoPlaying: Boolean;

    private var poster: Loader;
    private var video: Video;
    private var posterContainer: Sprite;

    private var connection: NetConnection;
    private var stream: NetStream;

    public function Player() {
      stage.align = StageAlign.TOP_LEFT;
      stage.scaleMode = StageScaleMode.NO_SCALE;

      Security.allowDomain("*");
      Security.allowInsecureDomain("*");

      registerExternalMethods();

      posterUrl = loaderInfo.parameters.poster;
      videoUrl = loaderInfo.parameters.video;
      loop = loaderInfo.parameters.loop == "true";
      muted = loaderInfo.parameters.muted == "true";
      autoplay = loaderInfo.parameters.autoplay == "true";

      setBackgroundColor();

      if (posterUrl) {
        loadPoster();
      }

      loadVideo();
    }

    private function play(): void {
      videoPlaying = true;
      stream.resume();
    }

    private function pause(): void {
      videoPlaying = false;
      stream.pause();
    }

    private function isPaused(): Boolean {
      return !videoPlaying;
    }

    private function mute(): void {
      stream.soundTransform = new SoundTransform(0);
    }

    private function unmute(): void {
      stream.soundTransform = new SoundTransform(1);
    }

    private function isMuted(): Boolean {
      return stream.soundTransform.volume == 0;
    }

    private function registerExternalMethods(): void {
      ExternalInterface.addCallback("play", play);
      ExternalInterface.addCallback("pause", pause);
      ExternalInterface.addCallback("paused", isPaused);
      ExternalInterface.addCallback("mute", mute);
      ExternalInterface.addCallback("unmute", unmute);
      ExternalInterface.addCallback("muted", isMuted);
      ExternalInterface.call("DivineVideoPlayer.ready");
    }

    private function setBackgroundColor(): void {
      graphics.beginFill(0x000000, 1);
      graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
      graphics.endFill();
    }

    private function loadPoster(): void {
      posterContainer = new Sprite();
      addChild(posterContainer);

      poster = new Loader();
      poster.width = stage.stageWidth;
      poster.height = stage.stageHeight;
      poster.contentLoaderInfo.addEventListener(Event.COMPLETE, function(): void {
        posterContainer.addChild(poster);
      });

      poster.load(new URLRequest(posterUrl));
    }

    private function loadVideo(): void {
      connection = new NetConnection();
      connection.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      connection.connect(null);
    }

    private function netStatusHandler(event: NetStatusEvent): void {
      switch (event.info.code) {
        case "NetConnection.Connect.Success": connectStream(); break;
        case "NetStream.Play.Stop": if (loop) stream.seek(0); break;
      }
    }

    private function connectStream(): void {
      video = new Video(stage.stageWidth, stage.stageHeight);
      addChild(video);

      stream = new NetStream(connection);
      stream.soundTransform = new SoundTransform(muted ? 0 : 1);
      stream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      video.attachNetStream(stream);

      stream.play(videoUrl);
      if (!autoplay) pause();
    }

  }

}