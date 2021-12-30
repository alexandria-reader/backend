"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const languages_1 = (0, tslib_1.__importDefault)(require("../services/languages"));
const languageRouter = express_1.default.Router();
languageRouter.get('/', (_req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const languages = yield languages_1.default.getAll();
    res.send(languages);
}));
exports.default = languageRouter;
