import { BaseValidator } from './base.validator.js';
import { CreateGastoDTO, UpdateGastoDTO } from '../types/gastos.types.js';

/**
 * Validador de Gastos
 * Herda métodos genéricos de BaseValidator
 * Diferencia entre criação (campos obrigatórios) e atualização (campos opcionais)
 */
export class GastosValidator extends BaseValidator {

  /**
   * Valida descrição
   */
  static validateDescricao(value: unknown, isUpdate: boolean = false): void {
    if (!isUpdate) {
      this.validateRequiredString(value, 'A descrição', 3, 255);
    } else if (value !== undefined && value !== null) {
      this.validateOptionalString(value, 'A descrição', 3, 255);
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
      this.validateOptionalNumber(value, 'O valor');
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
      this.validateOptionalObjectId(value, 'O tipo de gasto');
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
      this.validateOptionalNumber(value, 'O ano');
      this.validateNumberRange(value as number, 'O ano', 1900, 2100);
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
      this.validateOptionalNumber(value, 'O mês');
      this.validateNumberRange(value as number, 'O mês', 1, 12);
    }
  }

  /**
   * Valida todos os dados (create/update)
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
