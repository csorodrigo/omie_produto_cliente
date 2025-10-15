"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var helmet_1 = require("helmet");
var dotenv = require("dotenv");
var search_routes_1 = require("./routes/search.routes");
// Carrega variáveis de ambiente
dotenv.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3002;
// Middlewares
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS configuration
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Health check
app.get('/api/health', function (req, res) {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'OMIE-CIARA Integration',
        port: PORT
    });
});
// Routes
app.use('/api/search', search_routes_1.default);
// Error handling
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(err.status || 500).json(__assign({ error: true, message: err.message || 'Internal Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
// 404 handler
app.use(function (req, res) {
    res.status(404).json({
        error: true,
        message: 'Route not found',
        path: req.path
    });
});
// Start server
app.listen(PORT, function () {
    console.log("=\uFFFD OMIE-CIARA Integration Server running on port ".concat(PORT));
    console.log("=\uFFFD Health check available at http://localhost:".concat(PORT, "/api/health"));
    console.log("=\n Search endpoints available at http://localhost:".concat(PORT, "/api/search"));
});
exports.default = app;
