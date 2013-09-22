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

  [SWF(backgroundColor="0x000000")]
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

      videoPlaying = autoplay;

      if (posterUrl) {
        loadPoster();
      }

      loadVideo();

      if (loaderInfo.parameters.onReady) {
        ExternalInterface.call(loaderInfo.parameters.onReady);
      }
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
      muted = true;
      stream.soundTransform = new SoundTransform(0);
    }

    private function unmute(): void {
      muted = false;
      stream.soundTransform = new SoundTransform(1);
    }

    private function isMuted(): Boolean {
      return muted;
    }

    private function registerExternalMethods(): void {
      ExternalInterface.addCallback("divinePlay", play);
      ExternalInterface.addCallback("divinePause", pause);
      ExternalInterface.addCallback("divinePaused", isPaused);
      ExternalInterface.addCallback("divineMute", mute);
      ExternalInterface.addCallback("divineUnmute", unmute);
      ExternalInterface.addCallback("divineMuted", isMuted);
    }

    private function loadPoster(): void {
      posterContainer = new Sprite();
      posterContainer.width = stage.stageWidth;
      posterContainer.height = stage.stageHeight;
      addChildAt(posterContainer, 0);

      poster = new Loader();
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

    private function netStatusHandler(e: NetStatusEvent): void {
      switch (e.info.code) {
        case "NetConnection.Connect.Success":
          connectStream();
          break;
        case "NetStream.Play.Stop":
          if (loop) {
            stream.seek(0);
          }
          break;
        case "NetConnection.Connect.Failed":
        case "NetStream.Play.StreamNotFound":
          throwError(e.info.code, e.info.description);
          break;
        default:
          if (e.info.level == "error") {
            throwError(e.info.code, e.info.description);
          }
      }
    }

    private function connectStream(): void {
      video = new Video(stage.stageWidth, stage.stageHeight);
      addChildAt(video, 1);

      stream = new NetStream(connection);
      stream.bufferTime = 0.5;
      stream.soundTransform = new SoundTransform(muted ? 0 : 1);
      stream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      video.attachNetStream(stream);

      stream.play(videoUrl);
      if (autoplay) {
        videoPlaying = true;
      } else {
        videoPlaying = false;
        pause();
      }
    }

    private function throwError(code: int, description: String): void {
      var onError: String = loaderInfo.parameters.onError;
      if (onError) {
        ExternalInterface.call(onError, code, description);
      }
    }

  }

}