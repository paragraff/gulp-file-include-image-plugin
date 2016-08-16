### gulp-file-include-image-plugin
a plugin of gulp for [gulp-file-include](https://github.com/coderhaoxin/gulp-file-include) plugin

### include plugin to gulp-file-include

```js
fileinclude({
  ...
  plugins: ['node_modules/gulp-file-include-image-plugin']
  ...
})
```

### options

plugin require options:

  - context.patch.images: `string`, path to the included image in OS

  - context.settings.path.images: `string`,  path to the included image for http requests

```js
fileinclude({
  ...
  plugins: ['node_modules/gulp-file-include-image-plugin']
  context: {
    path: {
      images: 'srs/images
    },
    settings: {
      path: {
        images: 'http://some-domain.name/img'
      }
    }
  }
  ...
})
```

### Example

index.html
```html
<!DOCTYPE html>
<html>
  <body>
    @@{image file=some-image.png alt="some description" attribute="value"}@@
  </body>
</html>
```

images/some-image.png
```
**image content**
```

gulpfile.js
```js
var fileinclude = require('gulp-file-include'),
  gulp = require('gulp');

gulp.task('fileinclude', function() {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@{',
      postfix: '}@@',
      context: {
        path: {
          images: 'images'
        },
        settings: {
          path: {
            images: 'http://some-domain.name/img'
          }
        }
      }
    }))
    .pipe(gulp.dest('./dest'));
});
```

and the result is dest/index.html:
```
<!DOCTYPE html>
<html>
  <body>
    <img src="http://some-domain.name/img/some-image.png height="32" width="32" alt="some description" attribute="value" >
  </body>
</html>
```

### License
MIT
