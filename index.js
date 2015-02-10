'use strict';

var _ = require('underscore'),
    traverse = require('./lib/traverse');

var Parser = function (app) {

    var ext = '.' + app.get('view engine'),
        partials;

    return function (req, res, next) {

        function setPartials() {
            res.locals.partials = res.locals.partials || {};
            _.extend(res.locals.partials, partials);
            next();
        }

        if (!partials) {
            traverse(app.get('views'), ext, function (err, files) {
                if (err) { return next(err); }

                partials = files;
                setPartials();
            });
        } else {
            setPartials();
        }

    };
};

Parser.traverse = traverse;

module.exports = Parser;
