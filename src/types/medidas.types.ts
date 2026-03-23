import { Document } from 'mongoose';

export interface IMedida extends Document {
  nome: string;
  sigla: string;
  ativa: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CreateMedidaDTO {
  nome: string;
  sigla: string;
  ativa: boolean;
}

export interface UpdateMedidaDTO {
  nome?: string;
  sigla?: string;
  ativa?: boolean;
}

export interface MedidaFilters {
  ativa?: boolean;
}

export interface MedidaResponse {
  _id: string;
  nome: string;
  sigla: string;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
