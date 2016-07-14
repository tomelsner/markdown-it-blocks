'use strict';

const path = require('path');
const generate = require('markdown-it-testgen');

const CustomService = require('./fakes/CustomService');


function setupMarkdownIt() {
  return require('markdown-it')({
    html: true,
    linkify: true,
    typography: true
  });
}


describe('markdown-it-video', function() {

  describe('with default options', function() {
    let md = setupMarkdownIt().use(require('../lib'));
    generate(path.join(__dirname, 'fixtures/video.txt'), md);
  });

  describe('with custom class names', function() {
    let md = setupMarkdownIt().use(require('../lib'), {
      containerClassName: 'custom-container',
      serviceClassPrefix: 'custom-container--service-'
    });
    generate(path.join(__dirname, 'fixtures/video-with-custom-class-names.txt'), md);
  });

  describe('without size attributes', function() {
    let md = setupMarkdownIt().use(require('../lib'), {
      outputPlayerSize: false
    });
    generate(path.join(__dirname, 'fixtures/video-without-size-attributes.txt'), md);
  });

  describe('without allowfullscreen attributes', function() {
    let md = setupMarkdownIt().use(require('../lib'), {
      allowFullScreen: false
    });
    generate(path.join(__dirname, 'fixtures/video-without-allowfullscreen-attributes.txt'), md);
  });

  describe('with custom service', function() {
    let md = setupMarkdownIt().use(require('../lib'), {
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
