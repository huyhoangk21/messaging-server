"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = void 0;
const graphql_1 = require("graphql");
const formatError = (e) => {
    const formatted = new graphql_1.GraphQLError(e.message);
    formatted.extensions.code = e.extensions.code;
    return formatted;
};
const errorsHandler = (e) => {
    if (e.message.startsWith('Database Error')) {
        return formatError(new graphql_1.GraphQLError('Internal server error'));
    }
    return formatError(e);
};
exports.errorsHandler = errorsHandler;
//# sourceMappingURL=errors-handler.js.map