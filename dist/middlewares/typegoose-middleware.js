"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypegooseMiddleware = void 0;
const mongoose_1 = require("mongoose");
const convert_document_1 = require("../utils/convert-document");
const TypegooseMiddleware = async (_, next) => {
    const result = await next();
    if (Array.isArray(result)) {
        return result.map(item => item instanceof mongoose_1.Model ? (0, convert_document_1.convertDocument)(item) : item);
    }
    if (result instanceof mongoose_1.Model) {
        return (0, convert_document_1.convertDocument)(result);
    }
    return result;
};
exports.TypegooseMiddleware = TypegooseMiddleware;
//# sourceMappingURL=typegoose-middleware.js.map