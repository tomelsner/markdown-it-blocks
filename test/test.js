'use strict';

const path = require('path');
const generate = require('markdown-it-testgen');

const CustomService = require('./fakes/CustomService');


describe('markdown-it-video', function() {

  describe('with default options', function() {
    let md = require('markdown-it')({
      html: true,
      linkify: true,
      typography: true
    }).use(require('../lib'));
    generate(path.join(__dirname, 'fixtures/video.txt'), md);
  });

  describe('with bem convention', function() {
    let md = require('markdown-it')({
      html: true,
      linkify: true,
      typography: true
    }).use(require('../lib'), {
      outputPlayerId: false,
      elementDelimiter: '__',
      modifierDelimiter: '--'
    });
    generate(path.join(__dirname, 'fixtures/video-bem.txt'), md);
  });

  describe('without size attributes', function() {
    let md = require('markdown-it')({
      html: true,
      linkify: true,
      typography: true
    }).use(require('../lib'), {
      outputPlayerSize: false
    });
    generate(path.join(__dirname, 'fixtures/video-without-size-attributes.txt'), md);
  });

  describe('with custom service', function() {
    let md = require('markdown-it')({
      html: true,
      linkify: true,
      typography: true
    }).use(require('../lib'), {
      services: {
        'custom': CustomService,
        'youtube': CustomService
      },
      custom: {
        magicNumber: 123
      }
    });
    generate(path.join(__dirname, 'fixtures/video-with-custom-service.txt'), md);
  });

});
