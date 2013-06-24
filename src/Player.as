package {

  import flash.display.Loader;
  import flash.display.Sprite;
  import flash.text.TextField;
  import flash.events.Event;
  import flash.net.URLRequest;
  import flash.events.IOErrorEvent;
  import flash.events.SecurityErrorEvent;
  import flash.display.StageAlign;
  import flash.display.StageScaleMode;

  public class Player extends Sprite {

    private var poster: Loader;

    public function Player() {
      stage.align = StageAlign.TOP_LEFT;
      stage.scaleMode = StageScaleMode.NO_SCALE;

      loadPoster(loaderInfo.parameters.poster);
    }

    private function loadPoster(url: String): void {
      poster = new Loader();
      poster.contentLoaderInfo.addEventListener(Event.COMPLETE, function(): void {
        addChild(poster);
      });
      poster.load(new URLRequest(url));
    }

  }

}