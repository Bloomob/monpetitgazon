'use strict';

exports.config = {
    paths: {
        "public": "public"
    },
    files: {
        stylesheets: {
            joinTo: {
                'css/app.css': /^app/,
                'css/vendor.css': /^vendor/
            }
        },
        javascripts: {
            joinTo: {
                'js/app.js': /^app/,
                'js/vendor.js': /^vendor/
            }
        },
    },
    conventions: {
        assets: /assets[\\/]/
    },
    watcher: {
        awaitWriteFinish: true
    }
};
