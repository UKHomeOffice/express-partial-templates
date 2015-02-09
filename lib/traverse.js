var fs = require('fs'),
    path = require('path');

module.exports = function (root, ext) {

    ext = ext || '.html';
    var regexp = new RegExp(ext + '$');

    function parseDir(partials, dir, prefix) {
        var files = fs.readdirSync(dir);
        prefix = prefix || '';

        files.forEach(function (file) {
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

    return parseDir({}, root);

};