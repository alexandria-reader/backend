"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalErrorHandler = exports.notFoundHandler = void 0;
const tslib_1 = require("tslib");
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const notFoundHandler = function (_req, _res, next) {
    next(boom_1.default.notFound('The requested resource does not exist.'));
};
exports.notFoundHandler = notFoundHandler;
const generalErrorHandler = function (err, _req, res, _next) {
    const { output: { payload: error, statusCode }, } = boom_1.default.boomify(err);
    console.log(err.message);
    res.status(statusCode).json({ error });
};
exports.generalErrorHandler = generalErrorHandler;
