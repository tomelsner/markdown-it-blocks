# markdown-it-video

> markdown-it plugin for embedding hosted videos.

[![Build Status](https://travis-ci.org/brianjgeiger/markdown-it-video.svg?branch=master)](https://travis-ci.org/brianjgeiger/markdown-it-video)

## Usage

#### Enable plugin

```js
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-video', { // <-- this use(package_name) is required
  youtube: { width: 640, height: 390 },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 }
}));
```

#### YouTube

```md
@[youtube](dQw4w9WgXcQ)
```

is interpreted as

```html
<div class="embed-responsive embed-responsive-youtube embed-responsive-16by9">
  <iframe class="embed-responsive-item"
          id="youtubeplayer"
          type="text/html"
          width="640"
          height="390"
          src="//www.youtube.com/embed/dQw4w9WgXcQ"
          frameborder="0">
  </iframe>
</div>
```

Alternately, you could use a number of different YouTube URL formats rather than just the video id.

```md
@[youtube](http://www.youtube.com/embed/dQw4w9WgXcQ)
@[youtube](https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=feedrec_centerforopenscience_index)
@[youtube](http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o)
@[youtube](http://www.youtube.com/v/dQw4w9WgXcQ?fs=1&amp;hl=en_US&amp;rel=0)
@[youtube](http://www.youtube.com/watch?v=dQw4w9WgXcQ#t=0m10s)
@[youtube](http://www.youtube.com/embed/dQw4w9WgXcQ?rel=0)
@[youtube](http://www.youtube.com/watch?v=dQw4w9WgXcQ)
@[youtube](http://youtu.be/dQw4w9WgXcQ)
```

#### Vimeo

```md
@[vimeo](19706846)
```

is interpreted as

```html
<div class="embed-responsive embed-responsive-vimeo embed-responsive-16by9">
  <iframe class="embed-responsive-item"
          id="vimeoplayer"
          type="text/html"
          width="500"
          height="281"
          src="//player.vimeo.com/video/19706846"
          frameborder="0">
  </iframe>
</div>
```

Alternately, you could use the url instead of just the video id.

```md
@[vimeo](https://vimeo.com/19706846)
@[vimeo](https://player.vimeo.com/video/19706846)
```

#### Vine

```md
@[vine](etVpwB7uHlw)
```

is interpreted as

```html
<div class="embed-responsive embed-responsive-vine embed-responsive-16by9">
  <iframe class="embed-responsive-item"
          id="vineplayer"
          type="text/html"
          width="600"
          height="600"
          src="//vine.co/v/etVpwB7uHlw/embed/simple"
          frameborder="0">
  </iframe>
</div>
```

Alternately, you could use the url, or even the whole embed tag instead of just the video id.

```md
@[vine](https://vine.co/v/etVpwB7uHlw/embed/simple)
@[vine](https://vine.co/v/etVpwB7uHlw/embed/postcard?audio=1)
@[vine](<iframe src="https://vine.co/v/etVpwB7uHlw/embed/simple?audio=1" width="600" height="600" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>)
```

#### Prezi

```md
@[prezi](1kkxdtlp4241)
```

is interpreted as 

```html
<div class="embed-responsive embed-responsive-prezi embed-responsive-16by9">
  <iframe class="embed-responsive-item"
          id="preziplayer"
          type="text/html"
          width="550"
          height="400"
          src="https://prezi.com/embed/1kkxdtlp4241/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI"
          frameborder="0"
          webkitallowfullscreen mozallowfullscreen allowfullscreen>
  </iframe>
</div>
```

Alternately, you could use the url.

```md
@[prezi](https://prezi.com/1kkxdtlp4241/valentines-day/)
@[prezi](https://prezi.com/e3g83t83nw03/destination-prezi-template/)
@[prezi](https://prezi.com/prg6t46qgzik/anatomy-of-a-social-powered-customer-service-win/)
```

## Options

Option              | Type       | Default              | Description
:-------------------|:-----------|:---------------------|:----------------------------------------------------------------------------------------------------------------------------
`outputPlayerId`    | `boolean`  | `true`               | Indicates if a player 'id' attribute is written to output.
`outputPlayerSize`  | `boolean`  | `true`               | Indicates if 'width' and 'height' attributes are written to output.
`elementDelimiter`  | `string`   | `'-'`                | Character that separates element name from block name in CSS class.
`modifierDelimiter` | `string`   | `'-'`                | Character that separates modifier name from element name in CSS class.
`blockName`         | `string`   | `'embed-responsive'` | Class name of the embed container.
`modifierName`      | `string`   | `'16by9'`            | Modifier name to apply to embed container.
`url`               | `function` | -                    | A function that customizes url output. Signature: `function (serviceName: string, videoID: string, options: object): string`
                    |            |                      |
`{service-name}`    | `object`   | -                    | Options can be supplied to embed services. 
                    |            |                      |
`youtube.width`     | `number`   | `640`                | Width of YouTube embed.
`youtube.height`    | `number`   | `390`                | Height of YouTube embed.
                    |            |                      |
`vimeo.width`       | `number`   | `500`                | Width of Vimeo embed.
`vimeo.height`      | `number`   | `281`                | Height of Vimeo embed.
                    |            |                      |
`vine.width`        | `number`   | `600`                | Width of Vine embed.
`vine.height`       | `number`   | `600`                | Height of Vine embed.
`vine.embed`        | `string`   | `'simple'`           | Type of embed; for instance, `'simple'` or `'postcard'` (see https://dev.twitter.com/web/vine).
                    |            |                      |
`prezi.width`       | `number`   | `550`                | Width of Prezi embed.
`prezi.height`      | `number`   | `400`                | Height of Prezi embed.
