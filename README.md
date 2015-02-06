# express-partial-templates

A middleware that will use the `views` path and the `view engine` string that are stored against an [Express](http://expressjs.com) `app` object to generate a key-value object that identifies and makes accessible the file paths of partial templates against `res.locals.partials` on execution.

## Installation

```
npm install [--save] express-partial-templates;
```

## Usage

```
app.use(require('express-partial-templates')(app));

```
