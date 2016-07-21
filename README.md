# express-partial-templates

A middleware that will use the `views` path and the `view engine` string that are stored against an [Express](http://expressjs.com) `app` object to generate a key-value object that identifies and makes accessible the file paths of partial templates against `res.locals.partials` on execution.  Default `views` path and `view engine` and `extension` can be overridden by passing an [options](#Options) object as the second argument.

## Installation

```bash
npm install [--save] express-partial-templates;
```

## Usage

```js
var app = require('express')();

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(require('express-partial-templates')(app));

app.use(function (req, res, next) {
    // res.locals.partials has been set.

    next();
});
```

## Options
An optional object can be passed to express-partial-templates as the second argument to alter the default behaviour.  Supported options are:

* partials - an absolute path to the folder containing partials. The application views directory is used if this is omitted.
* ext - the extension of the template files. Defaults to application view engine if omitted.
* prefix - an optional prefix used to lookup partials.

```js

var path = require('path');
var app = require('express')();

app.use(require('express-partial-templates')(app, {
    partials: path.resolve(__dirname, './path/to/partials'),
    ext: '.html',
    prefix: 'my-prefix'
}));
```
