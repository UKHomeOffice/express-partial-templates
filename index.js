'use strict';

var _ = require('underscore'),
    fs = require('fs'),
    path = require('path');

module.exports = function (app) {

    var ext = '.' + app.get('view engine');
    var regexp = new RegExp(ext + '$');

    function parseDir(partials, dir, prefix) {
        var files = fs.readdirSync(dir);
        prefix = prefix || '';

        _.each(files, function (file) {
            var stat = fs.statSync(path.join(dir, file)),
                pathName,
                partialName;
            if (stat.isDirectory()) {
                parseDir(partials, path.join(dir, file), prefix + '/' + file);
            } else if (file.match(regexp)) {
                pathName = (prefix + '/' + file).replace(/^\//, '');
                partialName = pathName.replace(/\//g, '-').replace(regexp, '');
                partials[partialName] = pathName;
            }
        });
        return partials;
    }

    var partials = parseDir({}, app.get('views'));

    return function (req, res, next) {
        res.locals.partials = res.locals.partials || {};
        _.extend(res.locals.partials, partials);
        next();
    };
};
