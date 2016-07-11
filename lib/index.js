// Process @[youtube](youtubeVideoID)
// Process @[vimeo](vimeoVideoID)
// Process @[vine](vineVideoID)
// Process @[prezi](preziID)

'use strict';

const MarkdownItVideoPluginEnvironment = require('./MarkdownItVideoPluginEnvironment');
const renderer = require('./renderer');
const tokenizer = require('./tokenizer');


function setup(md, options) {
  let env = new MarkdownItVideoPluginEnvironment(md, options);

  md.block.ruler.before('fence', 'video', tokenizer.bind(env), {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules['video'] = renderer.bind(env);
}


module.exports = setup;
