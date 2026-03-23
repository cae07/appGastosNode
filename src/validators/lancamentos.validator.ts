import { BadRequestException } from '../utils/errorHandler';
import { CreateLancamentoDTO, UpdateLancamentoDTO, LancamentoFilters } from '../types/lancamentos.types';

/**
 * Validador de Lançamentos com regras complexas
 * Diferencia entre criação (campos obrigatórios) e atualização (campos opcionais)
 */
export class LancamentosValidator {
  /**
   * Valida string obrigatória
   */
  private static validateRequiredString(
    value: unknown,
    fieldName: string,
    minLength: number = 1
  ): void {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(`${fieldName} é obrigatório`);
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} deve ser uma string`);
    }

    const trimmed = value.trim();
    if (trimmed === '') {
      throw new BadRequestException(`${fieldName} não pode estar vazio`);
    }

    if (trimmed.length < minLength) {
      throw new BadRequestException(
        `${fieldName} deve ter no mínimo ${minLength} caracteres`
      );
    }
  }

  /**
   * Valida número obrigatório
   */
  private static validateRequiredNumber(value: unknown, fieldName: string): void {
    if (value === undefined || value === null) {
      throw new BadRequestException(`${fieldName} é obrigatório`);
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new BadRequestException(`${fieldName} deve ser um número`);
    }
  }

  /**
   * Valida número positivo
   */
  private static validatePositiveNumber(
    value: number,
    fieldName: string
  ): void {
    if (value <= 0) {
      throw new BadRequestException(`${fieldName} deve ser maior que zero`);
    }
  }

  /**
   * Valida intervalo de números
   */
  private static validateNumberRange(
    value: number,
    fieldName: string,
    min: number,
    max: number
  ): void {
    if (value < min || value > max) {
      throw new BadRequestException(
        `${fieldName} deve estar entre ${min} e ${max}`
      );
    }
  }

  /**
   * Valida ano
   */
  static validateAno(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredNumber(value, 'O ano');
      this.validateNumberRange(value as number, 'O ano', 1900, 2100);
    } else if (value !== undefined && value !== null) {
      this.validateRequiredNumber(value, 'O ano');
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
      this.validateRequiredNumber(value, 'O mês');
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
      this.validateRequiredNumber(value, 'A quantidade');
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
      this.validateRequiredNumber(value, 'O valor');
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
      this.validateRequiredString(value, 'O nome do produto', 1);
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
      this.validateRequiredString(value, fieldName, 1);
    }
  }

  /**
   * Valida todos os dados (create)
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
 * Não lança exceção, apenas valida valores
 */
export class LancamentosFilterValidator {
  static validateFilters(filters: LancamentoFilters): void {
    if (filters.ano !== undefined) {
      if (typeof filters.ano !== 'number' || isNaN(filters.ano)) {
        throw new BadRequestException('O ano deve ser um número válido');
      }
      if (filters.ano < 1900 || filters.ano > 2100) {
        throw new BadRequestException('O ano deve estar entre 1900 e 2100');
      }
    }

    if (filters.mes !== undefined) {
      if (typeof filters.mes !== 'number' || isNaN(filters.mes)) {
        throw new BadRequestException('O mês deve ser um número válido');
      }
      if (filters.mes < 1 || filters.mes > 12) {
        throw new BadRequestException('O mês deve estar entre 1 e 12');
      }
    }

    if (filters._order !== undefined) {
      if (filters._order !== 'asc' && filters._order !== 'desc') {
        throw new BadRequestException('A ordem deve ser "asc" ou "desc"');
      }
    }
  }
}
