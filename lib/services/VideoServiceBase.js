'use strict';


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

  getEmbedCode(videoID) {
    let escapedVideoID = this.env.md.utils.escapeHtml(videoID);
    let escapedServiceName = this.env.md.utils.escapeHtml(this.name);

    let blockClassNames = [
      this.env.getClassName(this.env.options.blockName),
      this.env.getClassName(this.env.options.blockName, null, 'service-' + escapedServiceName)
    ];
    if (this.env.options.modifierName) {
      blockClassNames.push(
        this.env.getClassName(this.env.options.blockName, null, this.env.options.modifierName)
      );
    }

    let itemClassName = this.env.getClassName(this.env.options.blockName, 'item');

    let html =
      `<div class="${blockClassNames.join(' ')}">` +
        `<iframe class="${itemClassName}`;

    if (this.env.options.outputPlayerSize === true) {
      if (typeof this.options.width !== 'undefined' && this.options.width !== null) {
        html += `" width="${this.options.width}`;
      }
      if (typeof this.options.height !== 'undefined' && this.options.height !== null) {
        html += `" height="${this.options.height}`;
      }
    }

    html +=   '" type="text/html' +
              `" src="${this.env.options.url(escapedServiceName, escapedVideoID, this.env.options)}` +
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
