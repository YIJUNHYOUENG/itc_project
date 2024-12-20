const { createPorxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.us(
        "/api",
        createPorxyMiddleware({
            target: "http://localhost:5000",
            changeOrigin: true,
        })
    )
}