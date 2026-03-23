import { Document } from 'mongoose';

export interface ITiposDeGastos extends Document {
  nome: string;
  descricao: string;
  ativa: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export type CreateTiposDeGastosDTO = {
  nome: string;
  descricao: string;
  ativa: boolean;
};

export type UpdateTiposDeGastosDTO = {
  nome?: string;
  descricao?: string;
  ativa?: boolean;
};

export type TiposDeGastosFilters = {
  ativa?: boolean;
};

export type TiposDeGastosResponse = {
  _id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
