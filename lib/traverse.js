var fs = require('fs-tree-traverse'),
    _ = require('underscore'),
    path = require('path');

module.exports = function (root, ext) {

    ext = ext || '.html';
    var regexp = new RegExp(ext + '$');

    var files = fs.listSync(root, { relative: true });

    var response = {};
    _.chain(files)
        .filter(function (file) { return file.match(regexp); })
        .map(function (file) { return file.replace(regexp, '').replace(/^\.\//, ''); })
        .each(function (file) {
            response[file.replace(/\//g, '-')] = file;
        });
    return response;
};