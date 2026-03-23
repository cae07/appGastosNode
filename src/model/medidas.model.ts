import mongoose from 'mongoose';
import { IMedida } from '../types/medidas.types';

const MedidaSchema = new mongoose.Schema<IMedida>(
  {
    nome: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sigla: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ativa: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'medidas',
  }
);

// Índice para filtro de status (unique é criado automaticamente pelo schema)
MedidaSchema.index({ ativa: 1 });

const MedidaModel = mongoose.model<IMedida>('Medida', MedidaSchema);

export default MedidaModel;
