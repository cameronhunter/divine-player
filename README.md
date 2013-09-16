# Divine Player [![Build Status](https://secure.travis-ci.org/cameronhunter/divine-player.png)](http://travis-ci.org/cameronhunter/divine-player)

A very simple HTML5 video player that degrades to Flash if necessary.

## Building
You can build the project using `grunt build`. This creates a `release` folder containing the minified javascript and the built SWF player.

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
