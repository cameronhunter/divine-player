package {

  import flash.display.Loader;
  import flash.display.Sprite;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;
  import flash.events.Event;
  import flash.media.Video;
  import flash.text.TextField;
  import flash.net.NetConnection;
  import flash.net.NetStream;
  import flash.net.URLRequest;
  import flash.events.NetStatusEvent;

  public class Player extends Sprite {

    private var position: uint = 0;

    private var posterContainer: Sprite;
    private var poster: Loader;
    private var video: Video;

    private var connection: NetConnection;

    public function Player() {
      stage.align = StageAlign.TOP_LEFT;
      stage.scaleMode = StageScaleMode.NO_SCALE;

      loadPoster(loaderInfo.parameters.poster);
      loadVideo(loaderInfo.parameters.video);
    }

    private function loadPoster(url: String): void {
      posterContainer = new Sprite();
      addChild(posterContainer);

      poster = new Loader();
      poster.contentLoaderInfo.addEventListener(Event.COMPLETE, function(): void {
        posterContainer.addChild(poster);
      });
      poster.load(new URLRequest(url));
    }

    private function loadVideo(url: String): void {
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

      posterContainer.visible = false;

      var stream: NetStream = new NetStream(connection);
      stream.addEventListener(NetStatusEvent.NET_STATUS, netStatusHandler);
      video.attachNetStream(stream);

      stream.play(loaderInfo.parameters.video);
    }

  }

}