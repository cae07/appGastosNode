import { IEmbalagem } from '../types/embalagens.types';
import { IGasto } from '../types/gastos.types';
import { ILancamento } from '../types/lancamentos.types';

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
 * Transforma array de documentos do Mongoose (Embalagens)
 */
export function embalagenToClientArray(docs: IEmbalagem[]): Record<string, any>[] {
  return docs.map(doc => embalagemToClient(doc)!);
}

/**
 * Transforma o documento Gasto do Mongoose em um objeto para resposta no cliente
 */
export function gastoToClient(doc: IGasto | null): Record<string, any> | null {
  if (!doc) return null;

  const response: Record<string, any> = {
    _id: doc._id.toString(),
    descricao: doc.descricao,
    valor: doc.valor,
    tipoGastoId: doc.tipoGastoId,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    __v: doc.__v,
  };

  // Adicionar campos opcionais se existirem
  if (doc.ano !== undefined) {
    response.ano = doc.ano;
  }
  if (doc.mes !== undefined) {
    response.mes = doc.mes;
  }

  return response;
}

/**
 * Transforma array de documentos do Mongoose (Gastos)
 */
export function gastosToClientArray(docs: IGasto[]): Record<string, any>[] {
  return docs.map(doc => gastoToClient(doc)!);
}

/**
 * Transforma o documento Lançamento do Mongoose em um objeto para resposta no cliente
 */
export function lancamentoToClient(doc: ILancamento | null): Record<string, any> | null {
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    produtoName: doc.produtoName,
    quantity: doc.quantity,
    value: doc.value,
    ano: doc.ano,
    mes: doc.mes,
    embalagemId: doc.embalagemId,
    categoria: doc.categoria,
    mesNome: doc.mesNome,
    medidaId: doc.medidaId,
    tipoProdutoId: doc.tipoProdutoId,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    __v: doc.__v,
  };
}

/**
 * Transforma array de documentos do Mongoose (Lançamentos)
 */
export function lancamentosToClientArray(docs: ILancamento[]): Record<string, any>[] {
  return docs.map(doc => lancamentoToClient(doc)!);
}
