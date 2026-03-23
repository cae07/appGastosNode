import { Document } from 'mongoose';

// Interface para o documento no MongoDB
export interface ILancamento extends Document {
  produtoName: string;
  quantity: number;
  value: number;
  ano: number;
  mes: number;
  embalagemId: string;
  categoria: string;
  mesNome: string;
  medidaId: string;
  tipoProdutoId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Interface para o request body (criação)
export interface CreateLancamentoDTO {
  produtoName: string;
  quantity: number;
  value: number;
  ano: number;
  mes: number;
  embalagemId: string;
  categoria: string;
  mesNome: string;
  medidaId: string;
  tipoProdutoId: string;
}

// Interface para o request body (atualização)
export interface UpdateLancamentoDTO {
  produtoName?: string;
  quantity?: number;
  value?: number;
  ano?: number;
  mes?: number;
  embalagemId?: string;
  categoria?: string;
  mesNome?: string;
  medidaId?: string;
  tipoProdutoId?: string;
}

// Interface para filtros
export interface LancamentoFilters {
  ano?: number;
  mes?: number;
  produtoId?: string;
  categoria?: string;
  data_gte?: string;
  data_lte?: string;
  _sort?: string;
  _order?: 'asc' | 'desc';
}

// Interface para resposta do cliente
export interface LancamentoResponse {
  _id: string;
  produtoName: string;
  quantity: number;
  value: number;
  ano: number;
  mes: number;
  embalagemId: string;
  categoria: string;
  mesNome: string;
  medidaId: string;
  tipoProdutoId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
