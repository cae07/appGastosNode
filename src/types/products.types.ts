import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  measure: string;
  medidaId: string;
  productType: string;
  tipoProdutoId: string;
  embalagemId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CreateProductDTO {
  name: string;
  measure: string;
  medidaId: string;
  productType: string;
  tipoProdutoId: string;
  embalagemId: string;
}

export interface UpdateProductDTO {
  name?: string;
  measure?: string;
  medidaId?: string;
  productType?: string;
  tipoProdutoId?: string;
  embalagemId?: string;
}

export interface ProductFilters {
  productType?: string;
}

export interface ProductResponse {
  _id: string;
  name: string;
  measure: string;
  medidaId: string;
  productType: string;
  tipoProdutoId: string;
  embalagemId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
