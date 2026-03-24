import { BadRequestException } from '../utils/errorHandler.js';
import { CreateGastoDTO, UpdateGastoDTO } from '../types/gastos.types.js';

/**
 * Validador de Gastos com regras complexas
 * Diferencia entre criação (campos obrigatórios) e atualização (campos opcionais)
 */
export class GastosValidator {
  /**
   * Valida string obrigatória
   */
  private static validateRequiredString(
    value: unknown,
    fieldName: string,
    minLength: number,
    maxLength: number
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

    if (trimmed.length > maxLength) {
      throw new BadRequestException(
        `${fieldName} não pode ter mais de ${maxLength} caracteres`
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
   * Valida casas decimais
   */
  private static validateDecimalPlaces(
    value: number,
    fieldName: string,
    decimalPlaces: number
  ): void {
    const regex = new RegExp(`^\\d+(\\.\\d{1,${decimalPlaces}})?$`);
    if (!regex.test(value.toString())) {
      throw new BadRequestException(
        `${fieldName} deve ter no máximo ${decimalPlaces} casas decimais`
      );
    }
  }

  /**
   * Valida MongoDB ObjectId
   */
  private static validateObjectId(value: unknown, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new BadRequestException(`${fieldName} é obrigatório`);
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} deve ser uma string`);
    }

    // Validar formato de ObjectId (24 caracteres hexadecimais)
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
      throw new BadRequestException(`${fieldName} deve ser um ID válido`);
    }
  }

  /**
   * Valida descrição
   */
  static validateDescricao(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredString(value, 'A descrição', 3, 255);
    } else if (value !== undefined && value !== null) {
      this.validateRequiredString(value, 'A descrição', 3, 255);
    }
  }

  /**
   * Valida valor
   */
  static validateValor(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredNumber(value, 'O valor');
      this.validatePositiveNumber(value as number, 'O valor');
      this.validateDecimalPlaces(value as number, 'O valor', 2);
    } else if (value !== undefined && value !== null) {
      this.validateRequiredNumber(value, 'O valor');
      this.validatePositiveNumber(value as number, 'O valor');
      this.validateDecimalPlaces(value as number, 'O valor', 2);
    }
  }

  /**
   * Valida tipo de gasto ID
   */
  static validateTipoGastoId(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateObjectId(value, 'O tipo de gasto');
    } else if (value !== undefined && value !== null) {
      this.validateObjectId(value, 'O tipo de gasto');
    }
  }

  /**
   * Valida ano
   */
  static validateAno(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      return; // Ano é opcional em criação
    }

    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' || isNaN(value)) {
        throw new BadRequestException('O ano deve ser um número');
      }
      if (value < 1900 || value > 2100) {
        throw new BadRequestException('O ano deve estar entre 1900 e 2100');
      }
    }
  }

  /**
   * Valida mês
   */
  static validateMes(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      return; // Mês é opcional em criação
    }

    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' || isNaN(value)) {
        throw new BadRequestException('O mês deve ser um número');
      }
      if (value < 1 || value > 12) {
        throw new BadRequestException('O mês deve estar entre 1 e 12');
      }
    }
  }

  /**
   * Valida todos os dados (create)
   */
  static validateAll(data: CreateGastoDTO | UpdateGastoDTO, isUpdate: boolean = false): void {
    if (isUpdate) {
      // Em atualização, validar apenas os campos fornecidos
      const updateData = data as UpdateGastoDTO;
      if (updateData.descricao !== undefined) {
        this.validateDescricao(updateData.descricao, true);
      }
      if (updateData.valor !== undefined) {
        this.validateValor(updateData.valor, true);
      }
      if (updateData.tipoGastoId !== undefined) {
        this.validateTipoGastoId(updateData.tipoGastoId, true);
      }
      if (updateData.ano !== undefined) {
        this.validateAno(updateData.ano, true);
      }
      if (updateData.mes !== undefined) {
        this.validateMes(updateData.mes, true);
      }
    } else {
      // Em criação, todos os campos obrigatórios devem estar presentes
      const createData = data as CreateGastoDTO;
      this.validateDescricao(createData.descricao, false);
      this.validateValor(createData.valor, false);
      this.validateTipoGastoId(createData.tipoGastoId, false);
      // Ano e mês são opcionais
      if (createData.ano !== undefined) {
        this.validateAno(createData.ano, false);
      }
      if (createData.mes !== undefined) {
        this.validateMes(createData.mes, false);
      }
    }
  }
}
