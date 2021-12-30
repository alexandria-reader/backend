"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = exports.extractToken = void 0;
const tslib_1 = require("tslib");
/* eslint-disable max-len */
const jsonwebtoken_1 = (0, tslib_1.__importDefault)(require("jsonwebtoken"));
const boom_1 = (0, tslib_1.__importDefault)(require("@hapi/boom"));
const users_1 = (0, tslib_1.__importDefault)(require("../services/users"));
const extractToken = function (req, res, next) {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        res.locals.token = authorization.substring(7);
    }
    next();
};
exports.extractToken = extractToken;
const isJWTPayload = function (value) {
    return value.id !== undefined;
};
const getUserFromToken = function (_req, res, next) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (!res.locals.token)
            throw boom_1.default.unauthorized('token missing or invalid');
        const decodedToken = jsonwebtoken_1.default.verify(res.locals.token, process.env.SECRET);
        if (isJWTPayload(decodedToken)) {
            if (!decodedToken.id)
                throw boom_1.default.unauthorized('token invalid or missing');
            const userById = yield users_1.default.getById(decodedToken.id);
            res.locals.user = userById;
        }
        next();
    });
};
exports.getUserFromToken = getUserFromToken;
