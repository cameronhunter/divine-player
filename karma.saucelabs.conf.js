var pkg = require("./package.json");

module.exports = function (config) {
  config.set({
    sauceLabs: {
      startConnect: false,
      username: "CameronHunter",
      accessKey: "2bf6bee8-218e-46f9-83e4-01b9d7c23ca4",
      testName: pkg.name + " v" + pkg.version
    },

    // For more SauceLabs browsers see: https://saucelabs.com/docs/platforms/webdriver
    customLaunchers: {
      "SL_Chrome": {
        base: "SauceLabs",
        browserName: "chrome"
      },
      "SL_Firefox": {
        base: "SauceLabs",
        browserName: "firefox"
      },
      "SL_Safari": {
        base: "SauceLabs",
        browserName: "safari",
        platform: "OS X 10.8",
        version: "6"
      },
      "SL_IE_8": {
        base: "SauceLabs",
        browserName: "internet explorer",
        version: "8"
      },
      "SL_IE_9": {
        base: "SauceLabs",
        browserName: "internet explorer",
        platform: "windows 7",
        version: "9"
      },
      "SL_IE_10": {
        base: "SauceLabs",
        browserName: "internet explorer",
        platform: "windows 8",
        version: "10"
      },
      "SL_iPad": {
        base: "SauceLabs",
        browserName: "ipad",
        platform: "OS X 10.8",
        version: "6",
        "device-orientation": "portrait"
      },
      "SL_iPhone": {
        base: "SauceLabs",
        browserName: "iphone",
        platform: "OS X 10.8",
        version: "6",
        "device-orientation": "portrait"
      },
      "SL_Android": {
        base: "SauceLabs",
        browserName: "android",
        platform: "Linux",
        version: "4",
        "device-orientation": "portrait"
      }
    }
  });
};
