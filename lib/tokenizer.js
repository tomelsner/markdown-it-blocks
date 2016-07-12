'use strict';


const SYNTAX_CHARS = '@[]()'.split('');
const SYNTAX_CODES = SYNTAX_CHARS.map(char => char.charCodeAt(0));


function advanceToSymbol(state, endLine, symbol, pointer) {
  let maxPos = null;
  let symbolLine = pointer.line;
  let symbolIndex = state.src.indexOf(symbol, pointer.pos);

  if (symbolIndex === -1) { return false; }

  maxPos = state.eMarks[pointer.line];
  while (symbolIndex >= maxPos) {
    ++symbolLine;
    maxPos = state.eMarks[symbolLine];

    if (symbolLine >= endLine) { return false; }
  }

  pointer.prevPos = pointer.pos;
  pointer.pos = symbolIndex;
  pointer.line = symbolLine;
  return true;
}


function tokenizer(state, startLine, endLine, silent) {
  let startPos = state.bMarks[startLine] + state.tShift[startLine];
  let maxPos = state.eMarks[startLine];

  let pointer = { line: startLine, pos: startPos };

  if (maxPos - startPos < 2) { return false; }
  if (SYNTAX_CODES[0] !== state.src.charCodeAt(pointer.pos++)) { return false; }
  if (SYNTAX_CODES[1] !== state.src.charCodeAt(pointer.pos++)) { return false; }

  if (!advanceToSymbol(state, endLine, ']', pointer)) { return false; }

  let serviceName = state.src
    .substr(pointer.prevPos, pointer.pos - pointer.prevPos)
    .trim()
    .toLowerCase();

  let service = this.services[serviceName];
  if (!service) { return false; }

  ++pointer.pos;

  if (!advanceToSymbol(state, endLine, '(', pointer)) { return false; }
  ++pointer.pos;
  if (!advanceToSymbol(state, endLine, ')', pointer)) { return false; }

  let videoReference = state.src
    .substr(pointer.prevPos, pointer.pos - pointer.prevPos)
    .trim();

  ++pointer.pos;

  if (pointer.line >= endLine) { return false; }

  if (!silent) {
    let token = state.push('video', 'div', 0);
    token.markup = state.src.slice(startPos, pointer.pos);
    token.block = true;
    token.info = {
      serviceName: serviceName,
      service: service,
      videoReference: videoReference,
      videoID: service.extractVideoID(videoReference)
    };
    token.map = [ startLine, pointer.line + 1 ];

    maxPos = state.eMarks[pointer.line];

    if (pointer.pos < maxPos) {
      let trailingText = state.src
        .substr(pointer.pos, maxPos - pointer.pos)
        .trim();

      if (trailingText !== '') {
        token = state.push('paragraph_open', 'p', 1);
        token.map = [ pointer.line, pointer.line + 1 ];

        token = state.push('inline', '', 0);
        token.content = trailingText;
        token.map = [ pointer.line, pointer.line + 1 ];
        token.children = [];

        token = state.push('paragraph_close', 'p', -1);
      }
    }

    state.line = pointer.line + 1;
  }

  return true;
}


module.exports = tokenizer;
