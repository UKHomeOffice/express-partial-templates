'use strict';

var partials = require('../');
var fsTraverse = require('fs-tree-traverse');
var proxyquire = require('proxyquire');

describe('partial-templates', function () {

    var app, req, res, next,
        files = [
            '/usr/test/layout.html',
            '/usr/test/partials/a.html',
            '/usr/test/partials/b.html',
            '/usr/test/partials/image.jpeg'
        ];

    beforeEach(function () {
        app = {
            get: sinon.stub()
        };
        app.get.withArgs('view engine').returns('html');
        app.get.withArgs('views').returns('/usr/test');
        sinon.stub(fsTraverse, 'listSync').returns(files);
    });
    afterEach(function () {
        fsTraverse.listSync.restore();
    });

    it('returns a middleware function', function () {
        partials(app).should.be.a('function');
        partials(app).length.should.equal(3);
    });

    describe('options', function () {
        var partials;
        var traverseStub;

        beforeEach(function () {
            traverseStub = sinon.stub();
            partials = proxyquire('../', {
              './lib/traverse': traverseStub
            });
        });

        it('calls traverse with partials path if provided', function () {
            var path = '/path/to/partials';
            partials(app, {
              partials: path
            });
            traverseStub.args[0][0].should.be.equal(path);
        });

        it('calls traverse with ext if provided', function () {
            var ext = '.mustache';
            partials(app, {
              ext: ext
            });
            traverseStub.args[0][1].should.be.equal(ext);
        });

        it('calls traverse with prefix if provided', function () {
            var prefix = 'my-prefix';
            partials(app, {
              prefix: prefix
            });
            traverseStub.args[0][2].should.be.equal(prefix);
        });
    });

    describe('middleware', function () {

        beforeEach(function () {
            res = {
                locals: {}
            };
            next = sinon.stub();
        });

        it('does not overwrite existing partials', function () {
            res.locals.partials = {
                here: 'already'
            };
            partials(app)(req, res, next);
            res.locals.partials.should.eql({
                here: 'already',
                layout: '/usr/test/layout',
                'partials-a': '/usr/test/partials/a',
                'partials-b': '/usr/test/partials/b'
            });
        });

        it('adds partial templates to res.locals', function () {
            partials(app)(req, res, next);
            res.locals.partials.should.eql({
                layout: '/usr/test/layout',
                'partials-a': '/usr/test/partials/a',
                'partials-b': '/usr/test/partials/b'
            });
        });

        it('allows for an optional prefix', function () {
            partials(app, { prefix: 'foo' })(req, res, next);
            res.locals.partials.should.eql({
                'foo-layout': '/usr/test/layout',
                'foo-partials-a': '/usr/test/partials/a',
                'foo-partials-b': '/usr/test/partials/b'
            });
        });

        describe('multiple view directories', function () {
            var common;

            beforeEach(function () {
                common = [
                    '/usr/common/partials/c.html',
                    '/usr/common/partials/d.html',
                ];
                app.get.withArgs('views').returns(['/usr/test', '/usr/common']);
                fsTraverse.listSync.onCall(0).returns(common);
                fsTraverse.listSync.onCall(1).returns(files);
            });

            it('adds all views to res.partials', function () {
                partials(app)(req, res, next);
                res.locals.partials.should.eql({
                    layout: '/usr/test/layout',
                    'partials-a': '/usr/test/partials/a',
                    'partials-b': '/usr/test/partials/b',
                    'partials-c': '/usr/common/partials/c',
                    'partials-d': '/usr/common/partials/d'
                });
            });

            it('prefers left hand directories if there are duplicate keys', function () {
                fsTraverse.listSync.onCall(0).returns([
                  '/usr/common/partials/a.html'
                ]);
                partials(app)(req, res, next);
                res.locals.partials.should.eql({
                  layout: '/usr/test/layout',
                  'partials-a': '/usr/test/partials/a',
                  'partials-b': '/usr/test/partials/b'
                });
            });
        });

    });

});
