// Process @[youtube](youtubeVideoID)
// Process @[vimeo](vimeoVideoID)
// Process @[vine](vineVideoID)
// Process @[prezi](preziID)


'use strict';


var SYNTAX_CHARS = '@[]()';
var SYNTAX_CODES = SYNTAX_CHARS.split('').map(function (char) { return char.charCodeAt(0) });


function applyDefaultOptions(options, defaultOptions) {
  Object.keys(defaultOptions).forEach(function (key) {
    if (typeof options[key] === 'undefined') {
      options[key] = defaultOptions[key];
    }
  });
  return options;
}


function MarkdownItVideoPluginEnvironment(md, options) {
  this.md = md;
  this.options = applyDefaultOptions(options || {}, this.getDefaultOptions());

  this._initServices();
}

MarkdownItVideoPluginEnvironment.prototype._initServices = function () {
  var self = this;

  var serviceBindings = {
    'youtube': YouTubeService,
    'vimeo': VimeoService,
    'vine': VineService,
    'prezi': PreziService,
  };

  var services = {};
  Object.keys(serviceBindings).forEach(function (serviceName) {
    var serviceClass = serviceBindings[serviceName];
    services[serviceName] = new serviceClass(serviceName, self.options[serviceName], self);
  });

  if (typeof self.options.services === 'object') {
    Object.keys(self.options.services).forEach(function (key) {
      services[key] = self.options.services[key];
    });
  }

  this.services = services;
};

MarkdownItVideoPluginEnvironment.prototype.getDefaultOptions = function () {
  var self = this;

  return {
    outputPlayerId: true,
    outputPlayerSize: true,
    elementDelimiter: '-',
    modifierDelimiter: '-',
    blockName: 'embed-responsive',
    modifierName: '16by9',

    url: function (service, videoID, options) {
      var service = self.services[service];
      return service.getVideoUrl(videoID);
    }
  };
};

MarkdownItVideoPluginEnvironment.prototype.getClassName = function (blockName, elementName, modifierName) {
  var className = blockName;
  if (elementName) {
    className += this.options.elementDelimiter + elementName;
  }
  if (modifierName) {
    className += this.options.modifierDelimiter + modifierName;
  }
  return className;
};


function VideoServiceBase(name, options, env) {
  this.name = name;
  this.options = applyDefaultOptions(options || {}, this.getDefaultOptions());
  this.env = env;
}

VideoServiceBase.prototype.getDefaultOptions = function () {
  return {};
};

VideoServiceBase.prototype.extractVideoID = function (reference) {
  return reference;
};

VideoServiceBase.prototype.getVideoUrl = function (videoID) {
  throw new Error('not implemented');
};

VideoServiceBase.prototype.getEmbedCode = function (videoID) {
  var escapedVideoID = this.env.md.utils.escapeHtml(videoID);
  var escapedServiceName = this.env.md.utils.escapeHtml(this.name);

  var blockClassNames = [
    this.env.getClassName(this.env.options.blockName),
    this.env.getClassName(this.env.options.blockName, null, 'service-' + escapedServiceName)
  ];
  if (this.env.options.modifierName) {
    blockClassNames.push(
      this.env.getClassName(this.env.options.blockName, null, this.env.options.modifierName)
    );
  }

  var itemClassName = this.env.getClassName(this.env.options.blockName, 'item');

  var html =
    '<div class="' + blockClassNames.join(' ') + '">' +
      '<iframe class="' + itemClassName;

  if (this.env.options.outputPlayerId === true) {
    html += '" id="' + escapedServiceName + 'player';
  }

  if (this.env.options.outputPlayerSize === true) {
    html += '" width="' + (this.options.width) +
            '" height="' + (this.options.height);
  }

  html +=   '" type="text/html' +
            '" src="' + this.env.options.url(escapedServiceName, escapedVideoID, this.env.options) +
            '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>' +
      '</iframe>' +
    '</div>\n';

  return html;
};


function YouTubeService(name, options, env) {
  VideoServiceBase.call(this, name, options, env);
}

YouTubeService.prototype = Object.create(VideoServiceBase.prototype);
YouTubeService.prototype.constructor = YouTubeService;

YouTubeService.prototype.getDefaultOptions = function () {
  return { width: 640, height: 390 };
};

YouTubeService.prototype.extractVideoID = function (reference) {
  var match = reference.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
  return match && match[7].length === 11 ? match[7] : reference;
};

YouTubeService.prototype.getVideoUrl = function (videoID) {
  return '//www.youtube.com/embed/' + videoID;
};


function VimeoService(name, options, env) {
  VideoServiceBase.call(this, name, options, env);
}

VimeoService.prototype = Object.create(VideoServiceBase.prototype);
VimeoService.prototype.constructor = VimeoService;

VimeoService.prototype.getDefaultOptions = function () {
  return { width: 500, height: 281 };
};

VimeoService.prototype.extractVideoID = function (reference) {
  /*eslint-disable max-len */
  var match = reference.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  /*eslint-enable max-len */
  return match && typeof match[3] === 'string' ? match[3] : reference;
};

VimeoService.prototype.getVideoUrl = function (videoID) {
  return '//player.vimeo.com/video/' + videoID;
};


function VineService(name, options, env) {
  VideoServiceBase.call(this, name, options, env);
}

VineService.prototype = Object.create(VideoServiceBase.prototype);
VineService.prototype.constructor = VineService;

VineService.prototype.getDefaultOptions = function () {
  return { width: 600, height: 600, embed: 'simple' };
};

VineService.prototype.extractVideoID = function (reference) {
  var match = reference.match(/^http(?:s?):\/\/(?:www\.)?vine\.co\/v\/([a-zA-Z0-9]{1,13}).*/);
  return match && match[1].length === 11 ? match[1] : reference;
};

VineService.prototype.getVideoUrl = function (videoID) {
  return '//vine.co/v/' + videoID + '/embed/' + this.options.embed;
};


function PreziService(name, options, env) {
  VideoServiceBase.call(this, name, options, env);
}

PreziService.prototype = Object.create(VideoServiceBase.prototype);
PreziService.prototype.constructor = PreziService;

PreziService.prototype.getDefaultOptions = function () {
  return { width: 550, height: 400 };
};

PreziService.prototype.extractVideoID = function (reference) {
  var match = reference.match(/^https:\/\/prezi.com\/(.[^/]+)/);
  return match ? match[1] : reference;
};

PreziService.prototype.getVideoUrl = function (videoID) {
  return 'https://prezi.com/embed/' + videoID +
      '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;' +
      'landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;' +
      'landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI';
};


module.exports = function video_plugin(md, options) {
  var env = new MarkdownItVideoPluginEnvironment(md, options);

  md.block.ruler.before('fence', 'video', video_embed.bind(env), {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules['video'] = render.bind(env);
};


function render(tokens, idx, _options, env, self) {
  var videoToken = tokens[idx];

  var service = videoToken.info.service;
  var videoID = videoToken.info.videoID;

  return service.getEmbedCode(videoID);
}

function video_embed(state, startLine, endLine, silent) {
  var start = state.bMarks[startLine] + state.tShift[startLine];
  var max = state.eMarks[startLine];
  var pos = start;

  if (max - startLine < SYNTAX_CHARS.length) { return false; }
  if (SYNTAX_CODES[0] !== state.src.charCodeAt(pos++)) { return false; }
  if (SYNTAX_CODES[1] !== state.src.charCodeAt(pos++)) { return false; }

  var serviceNameEndIndex = state.src.indexOf(']', pos);
  if (serviceNameEndIndex === -1 || serviceNameEndIndex >= max) { return false; }

  var serviceName = state.src
    .substr(pos, serviceNameEndIndex - pos)
    .trim()
    .toLowerCase();

  var service = this.services[serviceName];
  if (!service) { return false; }
  pos = serviceNameEndIndex;

  if (SYNTAX_CODES[2] !== state.src.charCodeAt(pos++)) { return false; }
  if (SYNTAX_CODES[3] !== state.src.charCodeAt(pos++)) { return false; }

  var videoReferenceEndIndex = state.src.indexOf(')', pos);
  if (videoReferenceEndIndex === -1 || videoReferenceEndIndex >= max) { return false; }

  var videoReference = state.src
    .substr(pos, videoReferenceEndIndex - (pos))
    .trim();
  pos = videoReferenceEndIndex;

  if (SYNTAX_CODES[4] !== state.src.charCodeAt(pos++)) { return false; }

  if (!silent) {
    var token = state.push('video', 'div', 0);
    token.markup = state.src.slice(start, pos);
    token.block = true;
    token.info = {
      serviceName: serviceName,
      service: service,
      videoReference: videoReference,
      videoID: service.extractVideoID(videoReference)
    };
    token.map = [ startLine, startLine + 1 ];

    if (pos < max) {
      var trailingText = state.src
        .substr(pos, max - pos)
        .trim();

      if (trailingText !== '') {
        token = state.push('paragraph_open', 'p', 1);
        token.map = [ startLine, startLine + 1 ];

        token = state.push('inline', '', 0);
        token.content = trailingText;
        token.map = [ startLine, startLine + 1 ];
        token.children = [];

        token = state.push('paragraph_close', 'p', -1);
      }
    }

    state.line = startLine + 1;
  }

  return true;
}
