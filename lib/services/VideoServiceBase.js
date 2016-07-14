'use strict';


function defaultUrlFilter(url, _videoID, _serviceName, _options) {
  return url;
}


class VideoServiceBase {

  constructor(name, options, env) {
    this.name = name;
    this.options = Object.assign(this.getDefaultOptions(), options);
    this.env = env;
  }

  getDefaultOptions() {
    return {};
  }

  extractVideoID(reference) {
    return reference;
  }

  getVideoUrl(videoID) {
    throw new Error('not implemented');
  }

  getFilteredVideoUrl(videoID) {
    let filterUrlDelegate = typeof this.env.options.filterUrl === 'function'
        ? this.env.options.filterUrl
        : defaultUrlFilter;
    let videoUrl = this.getVideoUrl(videoID);
    return filterUrlDelegate(videoUrl, this.name, videoID, this.env.options);
  }

  getEmbedCode(videoID) {
    let containerClassNames = [];
    if (this.env.options.containerClassName) {
      containerClassNames.push(this.env.options.containerClassName);
    }

    let escapedServiceName = this.env.md.utils.escapeHtml(this.name);
    containerClassNames.push(this.env.options.serviceClassPrefix + escapedServiceName);

    let videoUrl = this.getFilteredVideoUrl(videoID);

    let html =
      `<div class="${containerClassNames.join(' ')}">` +
        '<iframe type="text/html';

    if (this.env.options.outputPlayerSize === true) {
      if (typeof this.options.width !== 'undefined' && this.options.width !== null) {
        html += `" width="${this.options.width}`;
      }
      if (typeof this.options.height !== 'undefined' && this.options.height !== null) {
        html += `" height="${this.options.height}`;
      }
    }

    html +=   `" src="${videoUrl}` +
              '" frameborder="0"';

    if (this.env.options.allowFullScreen === true) {
      html += ' webkitallowfullscreen mozallowfullscreen allowfullscreen';
    }

    html += '>' +
        '</iframe>' +
      '</div>\n';

    return html;
  }

}


module.exports = VideoServiceBase;
