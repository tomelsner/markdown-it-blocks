'use strict';

const VideoServiceBase = require('../../lib/services/VideoServiceBase');


class CustomService extends VideoServiceBase {

  getDefaultOptions() {
    return { magicNumber: 42 };
  }

  extractVideoID(reference) {
    let match = reference.match(/^https:\/\/example.com\/(.[^/]+)/);
    return match ? match[1] : reference;
  }

  getVideoUrl(videoID) {
    return `https://example.com/embed/${videoID}/${this.options.magicNumber}`;
  }

}


module.exports = CustomService;
