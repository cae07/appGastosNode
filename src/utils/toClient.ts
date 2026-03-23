import { IEmbalagem } from '../types/embalagens.types';

/**
 * Transforma o documento do Mongoose em um objeto para resposta no cliente
 * Remove campos internos e formata conforme necessário
 */
export function embalagemToClient(doc: IEmbalagem | null): Record<string, any> | null {
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    quantidade: doc.quantidade,
    ativa: doc.ativa,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    __v: doc.__v,
  };
}

/**
 * Transforma array de documentos do Mongoose
 */
export function embalagenToClientArray(docs: IEmbalagem[]): Record<string, any>[] {
  return docs.map(doc => embalagemToClient(doc)!);
}
