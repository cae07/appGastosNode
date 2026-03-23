import { Document } from 'mongoose';

// Interface para o documento no MongoDB
export interface IEmbalagem extends Document {
  quantidade: number;
  ativa: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Interface para o request body (criação)
export interface CreateEmbalagemDTO {
  quantidade: number;
  ativa: boolean;
}

// Interface para o request body (atualização)
export interface UpdateEmbalagemDTO {
  quantidade?: number;
  ativa?: boolean;
}

// Interface para resposta do cliente
export interface EmbalagemResponse {
  _id: string;
  quantidade: number;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
