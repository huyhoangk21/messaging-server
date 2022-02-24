"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDocument = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const convertDocument = (doc) => {
    const convertedDocument = doc.toObject();
    const DocumentClass = (0, typegoose_1.getClassForDocument)(doc);
    Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
    return convertedDocument;
};
exports.convertDocument = convertDocument;
//# sourceMappingURL=convert-document.js.map