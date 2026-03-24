import { BadRequestException } from '../utils/errorHandler.js';

/**
 * Classe base centralizando todos os validadores genéricos e reutilizáveis
 * Padrão: Lança BadRequestException para erros de validação
 */
export class BaseValidator {
  /**
   * Valida uma string obrigatória
   * @param value - Valor a validar
   * @param fieldName - Nome do campo para mensagem de erro
   * @param minLength - Comprimento mínimo (padrão: 1)
   * @param maxLength - Comprimento máximo (padrão: sem limite)
   * @throws BadRequestException se inválido
   */
  protected static validateRequiredString(
    value: unknown,
    fieldName: string,
    minLength: number = 1,
    maxLength?: number
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
        `${fieldName} deve ter no mínimo ${minLength} caractere${minLength > 1 ? 's' : ''}`
      );
    }

    if (maxLength !== undefined && trimmed.length > maxLength) {
      throw new BadRequestException(
        `${fieldName} não pode ter mais de ${maxLength} caracteres`
      );
    }
  }

  /**
   * Valida uma string opcional
   * Se fornecida, aplica as mesmas regras de validateRequiredString
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param minLength - Comprimento mínimo (padrão: 1)
   * @param maxLength - Comprimento máximo (padrão: sem limite)
   * @throws BadRequestException se inválido
   */
  protected static validateOptionalString(
    value: unknown,
    fieldName: string,
    minLength: number = 1,
    maxLength?: number
  ): void {
    if (value === undefined || value === null) {
      return; // Campo é opcional
    }

    if (value === '') {
      throw new BadRequestException(`${fieldName} não pode estar vazio`);
    }

    this.validateRequiredString(value, fieldName, minLength, maxLength);
  }

  /**
   * Valida um número obrigatório
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se inválido
   */
  protected static validateRequiredNumber(
    value: unknown,
    fieldName: string
  ): void {
    if (value === undefined || value === null) {
      throw new BadRequestException(`${fieldName} é obrigatório`);
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new BadRequestException(`${fieldName} deve ser um número`);
    }
  }

  /**
   * Valida um número opcional
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se inválido
   */
  protected static validateOptionalNumber(
    value: unknown,
    fieldName: string
  ): void {
    if (value === undefined || value === null) {
      return; // Campo é opcional
    }

    if (typeof value !== 'number' || isNaN(value)) {
      throw new BadRequestException(`${fieldName} deve ser um número`);
    }
  }

  /**
   * Valida se um número é positivo (maior que zero)
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se não for positivo
   */
  protected static validatePositiveNumber(
    value: number,
    fieldName: string
  ): void {
    if (value <= 0) {
      throw new BadRequestException(`${fieldName} deve ser maior que zero`);
    }
  }

  /**
   * Valida se um número está dentro de um intervalo
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param min - Valor mínimo (inclusive)
   * @param max - Valor máximo (inclusive)
   * @throws BadRequestException se fora do intervalo
   */
  protected static validateNumberRange(
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
   * Valida casas decimais de um número
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param decimalPlaces - Número máximo de casas decimais
   * @throws BadRequestException se exceder casas decimais
   */
  protected static validateDecimalPlaces(
    value: number,
    fieldName: string,
    decimalPlaces: number
  ): void {
    const regex = new RegExp(`^\\d+(\\.\\d{1,${decimalPlaces}})?$`);
    if (!regex.test(value.toString())) {
      throw new BadRequestException(
        `${fieldName} deve ter no máximo ${decimalPlaces} casa${decimalPlaces > 1 ? 's' : ''} decimal${decimalPlaces > 1 ? 'is' : ''}` 
      );
    }
  }

  /**
   * Valida um boolean obrigatório
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se inválido
   */
  protected static validateRequiredBoolean(
    value: unknown,
    fieldName: string
  ): void {
    if (value === undefined || value === null) {
      throw new BadRequestException(`${fieldName} é obrigatório`);
    }

    if (typeof value !== 'boolean') {
      throw new BadRequestException(`${fieldName} deve ser um booleano`);
    }
  }

  /**
   * Valida um boolean opcional
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se inválido
   */
  protected static validateOptionalBoolean(
    value: unknown,
    fieldName: string
  ): void {
    if (value === undefined || value === null) {
      return; // Campo é opcional
    }

    if (typeof value !== 'boolean') {
      throw new BadRequestException(`${fieldName} deve ser um booleano`);
    }
  }

  /**
   * Valida um MongoDB ObjectId
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se inválido
   */
  protected static validateObjectId(
    value: unknown,
    fieldName: string
  ): void {
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
   * Valida um MongoDB ObjectId opcional
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @throws BadRequestException se inválido
   */
  protected static validateOptionalObjectId(
    value: unknown,
    fieldName: string
  ): void {
    if (value === undefined || value === null || value === '') {
      return; // Campo é opcional
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
   * Valida um campo contra um conjunto de valores permitidos
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param allowedValues - Array de valores permitidos
   * @param isRequired - Se o campo é obrigatório (padrão: true)
   * @throws BadRequestException se inválido
   */
  protected static validateEnum(
    value: unknown,
    fieldName: string,
    allowedValues: (string | number)[],
    isRequired: boolean = true
  ): void {
    if (value === undefined || value === null) {
      if (isRequired) {
        throw new BadRequestException(`${fieldName} é obrigatório`);
      }
      return;
    }

    if (!allowedValues.includes(value as string | number)) {
      throw new BadRequestException(
        `${fieldName} deve ser um dos seguintes valores: ${allowedValues.join(', ')}`
      );
    }
  }

  /**
   * Valida uma data (string em formato ISO ou objeto Date)
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param isRequired - Se o campo é obrigatório (padrão: true)
   * @throws BadRequestException se inválido
   */
  protected static validateDate(
    value: unknown,
    fieldName: string,
    isRequired: boolean = true
  ): void {
    if (value === undefined || value === null) {
      if (isRequired) {
        throw new BadRequestException(`${fieldName} é obrigatório`);
      }
      return;
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new BadRequestException(
          `${fieldName} deve ser uma data válida no formato ISO`
        );
      }
      return;
    }

    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        throw new BadRequestException(`${fieldName} deve ser uma data válida`);
      }
      return;
    }

    throw new BadRequestException(
      `${fieldName} deve ser uma data válida (string ISO ou Date)`
    );
  }

  /**
   * Valida um email
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param isRequired - Se o campo é obrigatório (padrão: true)
   * @throws BadRequestException se inválido
   */
  protected static validateEmail(
    value: unknown,
    fieldName: string,
    isRequired: boolean = true
  ): void {
    if (value === undefined || value === null || value === '') {
      if (isRequired) {
        throw new BadRequestException(`${fieldName} é obrigatório`);
      }
      return;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} deve ser uma string`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new BadRequestException(`${fieldName} deve ser um email válido`);
    }
  }

  /**
   * Valida um URL
   * @param value - Valor a validar
   * @param fieldName - Nome do campo
   * @param isRequired - Se o campo é obrigatório (padrão: true)
   * @throws BadRequestException se inválido
   */
  protected static validateUrl(
    value: unknown,
    fieldName: string,
    isRequired: boolean = true
  ): void {
    if (value === undefined || value === null || value === '') {
      if (isRequired) {
        throw new BadRequestException(`${fieldName} é obrigatório`);
      }
      return;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} deve ser uma string`);
    }

    try {
      new URL(value);
    } catch {
      throw new BadRequestException(`${fieldName} deve ser uma URL válida`);
    }
  }
}
