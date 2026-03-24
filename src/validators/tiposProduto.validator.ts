import { BaseValidator } from './base.validator.js';
import {
  CreateTiposProdutoDTO,
  UpdateTiposProdutoDTO,
  TiposProdutoFilters,
} from '../types/tiposProduto.types.js';

/**
 * Validador de Tipos de Produto
 * Herda métodos genéricos de BaseValidator
 */
export class TiposProdutoValidator extends BaseValidator {
  static validarCriacao(data: CreateTiposProdutoDTO): void {
    this.validateRequiredString(data.nome, 'O nome do tipo de produto', 1);
    this.validateRequiredString(data.descricao, 'A descrição do tipo de produto', 1);
    this.validateRequiredBoolean(data.ativa, 'O status');
  }

  static validarAtualizacao(data: UpdateTiposProdutoDTO): void {
    if (data.nome !== undefined) {
      this.validateOptionalString(data.nome, 'O nome do tipo de produto', 1);
    }

    if (data.descricao !== undefined) {
      this.validateOptionalString(data.descricao, 'A descrição do tipo de produto', 1);
    }

    if (data.ativa !== undefined) {
      this.validateOptionalBoolean(data.ativa, 'O status');
    }
  }

  static validarFiltros(filters: TiposProdutoFilters): void {
    if (filters.ativa !== undefined) {
      this.validateOptionalBoolean(filters.ativa, 'O filtro de status');
    }
  }
}
