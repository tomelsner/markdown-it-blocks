'use strict';

const YouTubeService = require('./services/YouTubeService');
const VimeoService = require('./services/VimeoService');
const VineService = require('./services/VineService');
const PreziService = require('./services/PreziService');


class PluginEnvironment {

  constructor(md, options) {
    this.md = md;
    this.options = Object.assign(this.getDefaultOptions(), options);

    this._initServices();
  }

  _initServices() {
    let defaultServiceBindings = {
      'youtube': YouTubeService,
      'vimeo': VimeoService,
      'vine': VineService,
      'prezi': PreziService,
    };

    let serviceBindings = Object.assign({}, defaultServiceBindings, this.options.services);
    let services = {};
    for (let serviceName of Object.keys(serviceBindings)) {
      let serviceClass = serviceBindings[serviceName];
      services[serviceName] = new serviceClass(serviceName, this.options[serviceName], this);
    }

    this.services = services;
  }

  getDefaultOptions() {
    return {
      outputPlayerSize: true,
      elementDelimiter: '-',
      modifierDelimiter: '-',
      blockName: 'embed-responsive',
      modifierName: '16by9',
      allowFullScreen: true,

      url: (serviceName, videoID, options) => {
        let service = this.services[serviceName];
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


module.exports = PluginEnvironment;
