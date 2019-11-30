const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/1.1/**', {
            changeOrigin: true,
            logLevel: 'debug',
            target: 'https://api.twitter.com/'
        })
    );
};