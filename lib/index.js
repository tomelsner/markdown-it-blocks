// Process @[youtube](youtubeVideoID)
// Process @[vimeo](vimeoVideoID)
// Process @[vine](vineVideoID)
// Process @[prezi](preziID)

'use strict';

const MarkdownItVideoPluginEnvironment = require('./MarkdownItVideoPluginEnvironment');


const SYNTAX_CHARS = '@[]()';
const SYNTAX_CODES = SYNTAX_CHARS.split('').map(char => char.charCodeAt(0));


function render(tokens, idx, options, env) {
  let videoToken = tokens[idx];

  let service = videoToken.info.service;
  let videoID = videoToken.info.videoID;

  return service.getEmbedCode(videoID);
}

function tokenizeVideo(state, startLine, endLine, silent) {
  let start = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  let pos = start;

  if (max - startLine < SYNTAX_CHARS.length) { return false; }
  if (SYNTAX_CODES[0] !== state.src.charCodeAt(pos++)) { return false; }
  if (SYNTAX_CODES[1] !== state.src.charCodeAt(pos++)) { return false; }

  let serviceNameEndIndex = state.src.indexOf(']', pos);
  if (serviceNameEndIndex === -1 || serviceNameEndIndex >= max) { return false; }

  let serviceName = state.src
    .substr(pos, serviceNameEndIndex - pos)
    .trim()
    .toLowerCase();

  let service = this.services[serviceName];
  if (!service) { return false; }
  pos = serviceNameEndIndex;

  if (SYNTAX_CODES[2] !== state.src.charCodeAt(pos++)) { return false; }
  if (SYNTAX_CODES[3] !== state.src.charCodeAt(pos++)) { return false; }

  let videoReferenceEndIndex = state.src.indexOf(')', pos);
  if (videoReferenceEndIndex === -1 || videoReferenceEndIndex >= max) { return false; }

  let videoReference = state.src
    .substr(pos, videoReferenceEndIndex - pos)
    .trim();
  pos = videoReferenceEndIndex;

  if (SYNTAX_CODES[4] !== state.src.charCodeAt(pos++)) { return false; }

  if (!silent) {
    let token = state.push('video', 'div', 0);
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
      let trailingText = state.src
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


function setup(md, options) {
  let env = new MarkdownItVideoPluginEnvironment(md, options);

  md.block.ruler.before('fence', 'video', tokenizeVideo.bind(env), {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules['video'] = render.bind(env);
}


module.exports = setup;
