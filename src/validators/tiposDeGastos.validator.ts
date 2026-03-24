import { BaseValidator } from './base.validator.js';
import {
  CreateTiposDeGastosDTO,
  UpdateTiposDeGastosDTO,
  TiposDeGastosFilters,
} from '../types/tiposDeGastos.types.js';

/**
 * Validador de Tipos de Gastos
 * Herda métodos genéricos de BaseValidator
 */
export class TiposDeGastosValidator extends BaseValidator {
  static validarCriacao(data: CreateTiposDeGastosDTO): void {
    this.validateRequiredString(data.nome, 'O nome do tipo de gasto', 1);
    this.validateRequiredString(data.descricao, 'A descrição do tipo de gasto', 1);
    this.validateRequiredBoolean(data.ativa, 'O status');
  }

  static validarAtualizacao(data: UpdateTiposDeGastosDTO): void {
    if (data.nome !== undefined) {
      this.validateOptionalString(data.nome, 'O nome do tipo de gasto', 1);
    }

    if (data.descricao !== undefined) {
      this.validateOptionalString(data.descricao, 'A descrição do tipo de gasto', 1);
    }

    if (data.ativa !== undefined) {
      this.validateOptionalBoolean(data.ativa, 'O status');
    }
  }

  static validarFiltros(filters: TiposDeGastosFilters): void {
    if (filters.ativa !== undefined) {
      this.validateOptionalBoolean(filters.ativa, 'O filtro de status');
    }
  }
}
