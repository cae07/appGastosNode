import { Document } from 'mongoose';

export interface ITiposProduto extends Document {
  nome: string;
  descricao: string;
  ativa: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export type CreateTiposProdutoDTO = {
  nome: string;
  descricao: string;
  ativa: boolean;
};

export type UpdateTiposProdutoDTO = {
  nome?: string;
  descricao?: string;
  ativa?: boolean;
};

export type TiposProdutoFilters = {
  ativa?: boolean;
};

export type TiposProdutoResponse = {
  _id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
