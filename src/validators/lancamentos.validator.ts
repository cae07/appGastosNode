import { BaseValidator } from './base.validator.js';
import { CreateLancamentoDTO, UpdateLancamentoDTO, LancamentoFilters } from '../types/lancamentos.types.js';

/**
 * Validador de Lançamentos
 * Herda métodos genéricos de BaseValidator
 * Diferencia entre criação (campos obrigatórios) e atualização (campos opcionais)
 */
export class LancamentosValidator extends BaseValidator {

  /**
   * Valida ano
   */
  static validateAno(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredNumber(value, 'O ano');
      this.validateNumberRange(value as number, 'O ano', 1900, 2100);
    } else if (value !== undefined && value !== null) {
      this.validateOptionalNumber(value, 'O ano');
      this.validateNumberRange(value as number, 'O ano', 1900, 2100);
    }
  }

  /**
   * Valida mês
   */
  static validateMes(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredNumber(value, 'O mês');
      this.validateNumberRange(value as number, 'O mês', 1, 12);
    } else if (value !== undefined && value !== null) {
      this.validateOptionalNumber(value, 'O mês');
      this.validateNumberRange(value as number, 'O mês', 1, 12);
    }
  }

  /**
   * Valida quantity
   */
  static validateQuantity(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredNumber(value, 'A quantidade');
      this.validatePositiveNumber(value as number, 'A quantidade');
    } else if (value !== undefined && value !== null) {
      this.validateOptionalNumber(value, 'A quantidade');
      this.validatePositiveNumber(value as number, 'A quantidade');
    }
  }

  /**
   * Valida value
   */
  static validateValue(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredNumber(value, 'O valor');
      this.validatePositiveNumber(value as number, 'O valor');
    } else if (value !== undefined && value !== null) {
      this.validateOptionalNumber(value, 'O valor');
      this.validatePositiveNumber(value as number, 'O valor');
    }
  }

  /**
   * Valida produtoName
   */
  static validateProdutoName(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredString(value, 'O nome do produto', 1);
    } else if (value !== undefined && value !== null) {
      this.validateOptionalString(value, 'O nome do produto', 1);
    }
  }

  /**
   * Valida campos de string genéricos
   */
  static validateStringField(
    value: unknown,
    fieldName: string,
    isUpdate: boolean = false
  ): void {
    if (!isUpdate) {
      this.validateRequiredString(value, fieldName, 1);
    } else if (value !== undefined && value !== null) {
      this.validateOptionalString(value, fieldName, 1);
    }
  }

  /**
   * Valida todos os dados (create/update)
   */
  static validateAll(
    data: CreateLancamentoDTO | UpdateLancamentoDTO,
    isUpdate: boolean = false
  ): void {
    if (isUpdate) {
      // Em atualização, validar apenas os campos fornecidos
      const updateData = data as UpdateLancamentoDTO;
      
      if (updateData.produtoName !== undefined) {
        this.validateProdutoName(updateData.produtoName, true);
      }
      if (updateData.quantity !== undefined) {
        this.validateQuantity(updateData.quantity, true);
      }
      if (updateData.value !== undefined) {
        this.validateValue(updateData.value, true);
      }
      if (updateData.ano !== undefined) {
        this.validateAno(updateData.ano, true);
      }
      if (updateData.mes !== undefined) {
        this.validateMes(updateData.mes, true);
      }
      if (updateData.embalagemId !== undefined) {
        this.validateStringField(updateData.embalagemId, 'O ID da embalagem', true);
      }
      if (updateData.categoria !== undefined) {
        this.validateStringField(updateData.categoria, 'A categoria', true);
      }
      if (updateData.mesNome !== undefined) {
        this.validateStringField(updateData.mesNome, 'O nome do mês', true);
      }
      if (updateData.medidaId !== undefined) {
        this.validateStringField(updateData.medidaId, 'O ID da medida', true);
      }
      if (updateData.tipoProdutoId !== undefined) {
        this.validateStringField(updateData.tipoProdutoId, 'O ID do tipo de produto', true);
      }
    } else {
      // Em criação, todos os campos obrigatórios devem estar presentes
      const createData = data as CreateLancamentoDTO;
      
      this.validateProdutoName(createData.produtoName, false);
      this.validateQuantity(createData.quantity, false);
      this.validateValue(createData.value, false);
      this.validateAno(createData.ano, false);
      this.validateMes(createData.mes, false);
      this.validateStringField(createData.embalagemId, 'O ID da embalagem', false);
      this.validateStringField(createData.categoria, 'A categoria', false);
      this.validateStringField(createData.mesNome, 'O nome do mês', false);
      this.validateStringField(createData.medidaId, 'O ID da medida', false);
      this.validateStringField(createData.tipoProdutoId, 'O ID do tipo de produto', false);
    }
  }
}

/**
 * Validador de filtros de Lançamentos
 */
export class LancamentosFilterValidator extends BaseValidator {
  static validateFilters(filters: LancamentoFilters): void {
    if (filters.ano !== undefined) {
      this.validateOptionalNumber(filters.ano, 'O ano');
      this.validateNumberRange(filters.ano as number, 'O ano', 1900, 2100);
    }

    if (filters.mes !== undefined) {
      this.validateOptionalNumber(filters.mes, 'O mês');
      this.validateNumberRange(filters.mes as number, 'O mês', 1, 12);
    }

    if (filters._order !== undefined) {
      this.validateEnum(filters._order, 'A ordem', ['asc', 'desc'], true);
    }
  }
}
