// User agent matchers
var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);
var iPad = /iPad/i.test(navigator.userAgent);
var iPhone = /iPhone/i.test(navigator.userAgent);
var android = /android/i.test(navigator.userAgent);
var chrome = /chrome/i.test(navigator.userAgent);
var mobile = iPad || iPhone || android;

var userAgent = (function() {
  console.info('User Agent: ' + navigator.userAgent);
  return navigator.userAgent;
}());

var flashSupported = (function() {
  try {
    if (/MSIE 10/i.test(navigator.userAgent)) return false;

    var flash = window.ActiveXObject ?
                  new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version') :
                  navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin.description;
    var match = /(\d+)[,.]\d+/.exec(flash);
    var majorVersion = parseInt(match[1], 10);

    console.info('Flash version: ' + flash);

    return majorVersion >= 9;
  } catch (e) {/* Ignore */}

  console.info('Flash version: None');
  return false;
}());
