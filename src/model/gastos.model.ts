import mongoose, { Schema, Model } from 'mongoose';
import { IGasto } from '../types/gastos.types.js';

// Schema do Gasto
const gastoSchema = new Schema<IGasto>(
  {
    descricao: {
      type: String,
      required: [true, 'A descrição do gasto é obrigatória'],
      minlength: [3, 'A descrição deve ter no mínimo 3 caracteres'],
      maxlength: [255, 'A descrição não pode ter mais de 255 caracteres'],
      trim: true,
    },
    valor: {
      type: Number,
      required: [true, 'O valor do gasto é obrigatório'],
      min: [0.01, 'O valor deve ser maior que zero'],
    },
    tipoGastoId: {
      type: String,
      required: [true, 'O tipo de gasto é obrigatório'],
      match: [/^[0-9a-fA-F]{24}$/, 'O tipo de gasto deve ser um ID válido'],
    },
    ano: {
      type: Number,
      required: false,
      min: [1900, 'O ano deve estar entre 1900 e 2100'],
      max: [2100, 'O ano deve estar entre 1900 e 2100'],
    },
    mes: {
      type: Number,
      required: false,
      min: [1, 'O mês deve estar entre 1 e 12'],
      max: [12, 'O mês não pode ser maior que 12'],
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    versionKey: '__v',
  }
);

// Índices para melhor performance
gastoSchema.index({ ano: 1 });
gastoSchema.index({ mes: 1 });
gastoSchema.index({ tipoGastoId: 1 });
gastoSchema.index({ ano: 1, mes: 1 });

// Criar e exportar o modelo
const GastoModel: Model<IGasto> = mongoose.model<IGasto>(
  'Gasto',
  gastoSchema,
  'gastos'
);

export default GastoModel;
