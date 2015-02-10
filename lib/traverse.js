var list = require('fs-tree-traverse'),
    _ = require('underscore'),
    path = require('path');

module.exports = function (root, ext, callback) {

    ext = ext || '.html';
    var regexp = new RegExp(ext + '$');

    list(root, { relative: true }, function (err, files) {
        var response = {};
        _.chain(files)
            .filter(function (file) { return file.match(regexp); })
            .map(function (file) { return file.replace(regexp, '').replace(/^\.\//, ''); })
            .each(function (file) {
                response[file.replace(/\//g, '-')] = file;
            });
        callback(err, response);
    });

};