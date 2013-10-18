# Divine Player [![Build Status](https://secure.travis-ci.org/cameronhunter/divine-player.png)](http://travis-ci.org/cameronhunter/divine-player)

A very simple HTML5 video player that degrades to Flash if necessary.

## Building
You can build the project using `grunt build`. This creates a `release` folder containing the minified javascript.

## Testing

<dl>
  <dt><code>grunt karma:headless</code></dt>
  <dd>Runs the tests in phantomjs</dd>

  <dt><code>grunt karma:[chrome|firefox|ie|opera|safari]</code></dt>
  <dd>Runs the tests locally in a real browser (which must be installed)</dd>

  <dt><code>grunt karma:[linux|osx|windows]</code></dt>
  <dd>Runs the tests locally in multiple browsers (which must be installed) common to an operating system</dd>
</dl>


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

## Useful Links
* [WHATWG video element living spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#the-video-element)
* [MDN - HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
* [MDN - Media events](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Events/Media_events)
* [Safari HTML5 Audio and Video Guide](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4)
* [HTML5 video iPad issues](http://blog.millermedeiros.com/html5-video-issues-on-the-ipad-and-how-to-solve-them/)
* [Unsolved HTML5 video issues on iOS](http://blog.millermedeiros.com/unsolved-html5-video-issues-on-ios/)
* [HTML5 Video: Everything I Needed to Know](http://jronallo.github.io/blog/html5-video-everything-i-needed-to-know/)
