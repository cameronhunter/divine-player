var SauceLabConfig = require("./karma.saucelabs.conf");

module.exports = function (config) {
  SauceLabConfig(config);

  config.set({
    frameworks: ["jasmine"],
    singleRun: true,
    browserDisconnectTimeout: 5000,
    files: [
      "test/specs/jasmine-helpers/jasmine-test.js",

      // Code under test
      "release/html5-video-shim.min.js",
      "release/divine-player.debug.js",

      // Stub player for testing
      "test/specs/players/stub-player.js",

      // Test libraries
      "bower_components/jquery/jquery.js",
      "bower_components/jasmine-jquery/lib/jasmine-jquery.js",
      "test/specs/jasmine-helpers/jasmine-cit.js",
      "test/specs/jasmine-helpers/jasmine-helpers.js",

      // Behaviour specifications
      "test/specs/**/*.spec.js",

      // Fixtures for use in tests cases
      {pattern: "test/fixtures/*", included: false, served: true},

      // Needed for testing Flash player
      {pattern: "bower_components/divine-player-swf/release/divine-player.swf", included: false, served: true}
    ]
  });
};
