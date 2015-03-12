var fs = require('fs-tree-traverse'),
    _ = require('underscore'),
    path = require('path');

module.exports = function (root, ext, prefix) {

    ext = ext || '.html';
    prefix = prefix || '';

    if (prefix && prefix.substr(-1) !== '-') {
        prefix += '-';
    }

    var regexp = new RegExp(ext + '$');

    var files = fs.listSync(root);

    var response = {};
    _.chain(files)
        .filter(function (file) { return file.match(regexp); })
        .map(function (file) { return file.replace(regexp, ''); })
        .each(function (file) {
            var name = path.relative(root, file).split(path.sep).join('-');
            response[prefix + name] = file;
        });
    return response;
};