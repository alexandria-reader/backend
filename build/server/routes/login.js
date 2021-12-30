"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const login_1 = (0, tslib_1.__importDefault)(require("../services/login"));
const loginRouter = express_1.default.Router();
exports.default = loginRouter.post('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const loggedInUser = yield login_1.default.login(email, password);
    res
        .status(200)
        .json(loggedInUser);
}));
