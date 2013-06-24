package {

  import flash.display.Loader;
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  import flash.events.NetStatusEvent;
  import flash.media.Video;
  import flash.net.NetConnection;
  import flash.net.NetStream;
  import flash.net.URLRequest;

  // TODO: Add external interface for play, pause, mute and unmute
  public class Player extends Sprite {

    private var posterUrl: String;
    private var videoUrl: String;

    private var poster: Loader;
    private var video: Video;
    private var posterContainer: Sprite;

    private var connection: NetConnection;
    private var stream: NetStream;

    public function Player() {
      stage.align = StageAlign.TOP_LEFT;
      stage.scaleMode = StageScaleMode.NO_SCALE;

      //posterUrl = loaderInfo.parameters['poster'];
      videoUrl = loaderInfo.parameters.video;

      setBackgroundColor();
      //if (posterUrl) loadPoster();
      loadVideo();
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
        case "NetStream.Play.StreamNotFound": break;
      }
    }

    private function connectStream(): void {
      video = new Video(stage.stageWidth, stage.stageHeight);
      addChild(video);

      //posterContainer.visible = false;

      stream = new NetStream(connection);
      stream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      video.attachNetStream(stream);

      stream.play(videoUrl);
    }

  }

}