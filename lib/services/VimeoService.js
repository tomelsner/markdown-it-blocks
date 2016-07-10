'use strict';

const VideoServiceBase = require('./VideoServiceBase');


class VimeoService extends VideoServiceBase {

  getDefaultOptions() {
    return { width: 500, height: 281 };
  }

  extractVideoID(reference) {
    let match = reference.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    return match && typeof match[3] === 'string' ? match[3] : reference;
  }

  getVideoUrl(videoID) {
    return '//player.vimeo.com/video/' + videoID;
  }

}


module.exports = VimeoService;
