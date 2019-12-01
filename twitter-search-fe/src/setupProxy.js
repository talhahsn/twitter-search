const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/api/**', {
            changeOrigin: true,
            logLevel: 'debug',
            target: 'http://localhost:3001/'
        })
    )
};