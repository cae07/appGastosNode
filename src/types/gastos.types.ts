import { Document } from 'mongoose';

// Interface para o documento no MongoDB
export interface IGasto extends Document {
  descricao: string;
  valor: number;
  tipoGastoId: string;
  ano?: number;
  mes?: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Interface para o request body (criação)
export interface CreateGastoDTO {
  descricao: string;
  valor: number;
  tipoGastoId: string;
  ano?: number;
  mes?: number;
}

// Interface para o request body (atualização)
export interface UpdateGastoDTO {
  descricao?: string;
  valor?: number;
  tipoGastoId?: string;
  ano?: number;
  mes?: number;
}

// Interface para resposta do cliente
export interface GastoResponse {
  _id: string;
  descricao: string;
  valor: number;
  tipoGastoId: string;
  ano?: number;
  mes?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
