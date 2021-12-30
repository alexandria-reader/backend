"use strict";
/* eslint-disable max-len */
// generic database query function, takes SQL statement and parameters
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pg_1 = require("pg");
const pg_format_1 = (0, tslib_1.__importDefault)(require("pg-format"));
const config_1 = (0, tslib_1.__importDefault)(require("../lib/config"));
const logQuery = function (statement) {
    const timeStamp = new Date();
    const formattedTimeStamp = timeStamp.toString().substring(4, 24);
    console.log(formattedTimeStamp, statement);
};
let isProduction = (config_1.default.NODE_ENV === 'production');
if (!config_1.default.NODE_ENV)
    isProduction = true;
let connectionString;
if (isProduction) {
    connectionString = config_1.default.DATABASE_URL;
}
else {
    connectionString = config_1.default[`${(_a = config_1.default.NODE_ENV) === null || _a === void 0 ? void 0 : _a.toUpperCase()}_DATABASE_URL`];
}
const CONNECTION = {
    connectionString,
    ssl: (connectionString === null || connectionString === void 0 ? void 0 : connectionString.includes('amazonaws')) ? { rejectUnauthorized: false } : false,
};
function default_1(statement, ...parameters) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const sql = (0, pg_format_1.default)(statement, ...parameters);
        const client = new pg_1.Client(CONNECTION);
        yield client.connect();
        try {
            if (config_1.default.NODE_ENV !== 'test')
                logQuery(sql);
            const result = yield client.query(sql);
            return result;
        }
        finally {
            yield client.end();
        }
    });
}
exports.default = default_1;
