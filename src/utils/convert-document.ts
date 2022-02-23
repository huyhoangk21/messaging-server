import { Document } from 'mongoose';
import { getClassForDocument } from '@typegoose/typegoose';

export const convertDocument = (doc: Document) => {
  const convertedDocument = doc.toObject();
  const DocumentClass = getClassForDocument(doc)!;
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
  return convertedDocument;
};
