# Divine Player [![Build Status](https://secure.travis-ci.org/cameronhunter/divine-player.png)](http://travis-ci.org/cameronhunter/divine-player)

A very simple HTML5 video player that degrades to Flash if necessary. The flash player source (and build tools) are in the [divine-player-swf](https://github.com/cameronhunter/divine-player-swf) repository.

## Building
You can build the project using `grunt build`. This creates a `release` folder containing the minified javascript.

## Testing

Runs the tests in phantomjs:
```shell
grunt karma:specs
```

Runs the tests in a real browser:
```shell
grunt karma:specs-[chrome|firefox|ie|opera|safari]
```

Runs the tests locally in multiple browsers (which must be installed) common to an operating system:
```shell
grunt karma:specs-[linux|osx|windows]
```

## Testing using Sauce Labs
You can also run the tests remotely in real browsers with [Sauce Labs](https://saucelabs.com/u/CameronHunter):
```
grunt test:remote
```

Currently divine player is tested against:

* Android (4.0.4)
* Chrome (29)
* Firefox (23)
* IE8 (Windows XP)
* IE9 (Windows 7)
* IE10 (Windows 8)
* Safari 6 (OSX 10.8)
* iPad (iOS6)
* iPhone (iOS6)

## Integration test page

You can run a server which creates an `<iframe>` embedding the player in a page:
```shell
grunt server
```

This starts a [local server](http://localhost:9001/embed) which you can point devices to.

## Useful Links
* [WHATWG video element living spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#the-video-element)
* [MDN - HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
* [MDN - Media events](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Events/Media_events)
* [Safari HTML5 Audio and Video Guide](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4)
* [HTML5 video iPad issues](http://blog.millermedeiros.com/html5-video-issues-on-the-ipad-and-how-to-solve-them/)
* [Unsolved HTML5 video issues on iOS](http://blog.millermedeiros.com/unsolved-html5-video-issues-on-ios/)
* [HTML5 Video: Everything I Needed to Know](http://jronallo.github.io/blog/html5-video-everything-i-needed-to-know/)
