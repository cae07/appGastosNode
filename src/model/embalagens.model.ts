import mongoose, { Schema, Model } from 'mongoose';
import { IEmbalagem } from '../types/embalagens.types';

// Schema da Embalagem
const embalagemSchema = new Schema<IEmbalagem>(
  {
    quantidade: {
      type: Number,
      required: [true, 'O campo "quantidade" é obrigatório'],
    },
    ativa: {
      type: Boolean,
      required: [true, 'O campo "ativa" é obrigatório'],
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    versionKey: '__v',
  }
);

// Criar e exportar o modelo
const EmbalagemModel: Model<IEmbalagem> = mongoose.model<IEmbalagem>(
  'Embalagem',
  embalagemSchema
);

export default EmbalagemModel;
