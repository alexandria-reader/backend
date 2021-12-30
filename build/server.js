"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_1 = (0, tslib_1.__importDefault)(require("http"));
const app_1 = (0, tslib_1.__importDefault)(require("./app"));
const config_1 = (0, tslib_1.__importDefault)(require("./lib/config"));
const server = http_1.default.createServer(app_1.default);
const { PORT, HOST } = config_1.default;
server.listen(Number(PORT), String(HOST), () => {
    console.log(`Alexandria is listening on port ${PORT} of ${HOST}.`);
});
