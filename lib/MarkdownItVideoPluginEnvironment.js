'use strict';

const YouTubeService = require('./services/YouTubeService');
const VimeoService = require('./services/VimeoService');
const VineService = require('./services/VineService');
const PreziService = require('./services/PreziService');


class MarkdownItVideoPluginEnvironment {

  constructor(md, options) {
    this.md = md;
    this.options = Object.assign(this.getDefaultOptions(), options);

    this._initServices();
  }

  _initServices() {
    let self = this;

    let serviceBindings = {
      'youtube': YouTubeService,
      'vimeo': VimeoService,
      'vine': VineService,
      'prezi': PreziService,
    };

    let services = {};
    for (let serviceName of Object.keys(serviceBindings)) {
      let serviceClass = serviceBindings[serviceName];
      services[serviceName] = new serviceClass(serviceName, self.options[serviceName], self);
    }

    if (typeof self.options.services === 'object') {
      for (let key of Object.keys(self.options.services)) {
        services[key] = self.options.services[key];
      }
    }

    this.services = services;
  }

  getDefaultOptions() {
    let self = this;

    return {
      outputPlayerId: true,
      outputPlayerSize: true,
      elementDelimiter: '-',
      modifierDelimiter: '-',
      blockName: 'embed-responsive',
      modifierName: '16by9',

      url: function (serviceName, videoID, options) {
        let service = self.services[serviceName];
        return service.getVideoUrl(videoID);
      }
    };
  }

  getClassName(blockName, elementName, modifierName) {
    let className = blockName;
    if (elementName) {
      className += this.options.elementDelimiter + elementName;
    }
    if (modifierName) {
      className += this.options.modifierDelimiter + modifierName;
    }
    return className;
  }

}


module.exports = MarkdownItVideoPluginEnvironment;
