import { BaseValidator } from './base.validator.js';

/**
 * Validador de Medidas
 * Retorna { isValid, errors } em vez de lançar exceções
 * Permite acumular múltiplos erros antes de retornar
 */
export class MedidasValidator extends BaseValidator {
  static validarCriacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar nome
    try {
      this.validateRequiredString(dados.nome, 'O nome da medida', 1);
    } catch (error: any) {
      errors.nome = [error.message];
    }

    // Validar sigla
    try {
      this.validateRequiredString(dados.sigla, 'A sigla da medida', 1);
    } catch (error: any) {
      errors.sigla = [error.message];
    }

    // Validar ativa
    try {
      this.validateRequiredBoolean(dados.ativa, 'O status ativa');
    } catch (error: any) {
      errors.ativa = [error.message];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarAtualizacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar nome (opcional em UPDATE)
    if (dados.nome !== undefined && dados.nome !== null) {
      try {
        this.validateRequiredString(dados.nome, 'O nome da medida', 1);
      } catch (error: any) {
        errors.nome = [error.message];
      }
    }

    // Validar sigla (opcional em UPDATE)
    if (dados.sigla !== undefined && dados.sigla !== null) {
      try {
        this.validateRequiredString(dados.sigla, 'A sigla da medida', 1);
      } catch (error: any) {
        errors.sigla = [error.message];
      }
    }

    // Validar ativa (opcional em UPDATE)
    if (dados.ativa !== undefined && dados.ativa !== null) {
      try {
        this.validateOptionalBoolean(dados.ativa, 'O status ativa');
      } catch (error: any) {
        errors.ativa = [error.message];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarFiltros(filtros: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar ativa (opcional)
    if (filtros.ativa !== undefined && filtros.ativa !== null) {
      try {
        this.validateOptionalBoolean(filtros.ativa, 'O parâmetro ativa');
      } catch (error: any) {
        errors.ativa = [error.message];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
