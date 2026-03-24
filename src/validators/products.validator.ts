import { BaseValidator } from './base.validator.js';

/**
 * Validador de Produtos
 * Retorna { isValid, errors } em vez de lançar exceções
 */
export class ProductsValidator extends BaseValidator {
  static validarCriacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    const fields = ['name', 'measure', 'medidaId', 'productType', 'tipoProdutoId', 'embalagemId'];
    const fieldLabels: Record<string, string> = {
      name: 'O nome do produto',
      measure: 'A medida do produto',
      medidaId: 'O ID da medida',
      productType: 'O tipo de produto',
      tipoProdutoId: 'O ID do tipo de produto',
      embalagemId: 'O ID da embalagem',
    };

    for (const field of fields) {
      try {
        this.validateRequiredString(dados[field], fieldLabels[field], 1);
      } catch (error: any) {
        errors[field] = [error.message];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarAtualizacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    const fields = ['name', 'measure', 'medidaId', 'productType', 'tipoProdutoId', 'embalagemId'];
    const fieldLabels: Record<string, string> = {
      name: 'O nome do produto',
      measure: 'A medida do produto',
      medidaId: 'O ID da medida',
      productType: 'O tipo de produto',
      tipoProdutoId: 'O ID do tipo de produto',
      embalagemId: 'O ID da embalagem',
    };

    for (const field of fields) {
      if (dados[field] !== undefined && dados[field] !== null) {
        try {
          this.validateRequiredString(dados[field], fieldLabels[field], 1);
        } catch (error: any) {
          errors[field] = [error.message];
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarFiltros(filtros: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar productType (opcional)
    if (filtros.productType !== undefined && filtros.productType !== null) {
      try {
        this.validateOptionalString(filtros.productType, 'O tipo de produto', 1);
      } catch (error: any) {
        errors.productType = [error.message];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
