import GastoModel from '../model/gastos.model.js';
import { CreateGastoDTO, UpdateGastoDTO } from '../types/gastos.types.js';
import {
  NotFoundException,
  BadRequestException,
  InternalServerException,
} from '../utils/errorHandler.js';
import { toClient, toClientArray } from '../utils/toClient.js';
import { GastosValidator } from '../validators/gastos.validator.js';

export class GastoService {
  /**
   * Lista todos os gastos ou filtra por ano e/ou mês
   * @param ano - Ano opcional
   * @param mes - Mês opcional
   */
  async listar(ano?: number, mes?: number): Promise<Record<string, any>[]> {
    try {
      let query = GastoModel.find();

      if (ano !== undefined) {
        query = query.where('ano').equals(ano);
      }

      if (mes !== undefined) {
        query = query.where('mes').equals(mes);
      }

      const gastos = await query.exec();
      return toClientArray(gastos);
    } catch (error) {
      console.error('Erro ao buscar gastos:', error);
      throw new InternalServerException('Erro ao buscar Gastos');
    }
  }

  /**
   * Busca um gasto específico pelo ID
   * @param id - ID do gasto
   */
  async buscarPorId(id: string): Promise<Record<string, any>> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do gasto é obrigatório');
      }

      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('O ID do gasto é obrigatório');
      }

      const gasto = await GastoModel.findById(id).exec();

      if (!gasto) {
        throw new NotFoundException('Gasto não encontrado');
      }

      return toClient(gasto)!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Erro ao buscar gasto com id ${id}:`, error);
      throw new InternalServerException('Erro ao buscar Gasto');
    }
  }

  /**
   * Cria um novo gasto
   * @param data - Dados do gasto
   */
  async criar(data: CreateGastoDTO): Promise<Record<string, any>> {
    try {
      // Validar todos os dados
      GastosValidator.validateAll(data, false);

      const gasto = new GastoModel(data);
      await gasto.save();

      return toClient(gasto)!;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Erro ao criar gasto:', error);
      throw new InternalServerException('Erro ao criar Gasto');
    }
  }

  /**
   * Atualiza um gasto existente
   * @param id - ID do gasto
   * @param data - Dados para atualizar
   */
  async atualizar(
    id: string,
    data: UpdateGastoDTO
  ): Promise<Record<string, any>> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do gasto é obrigatório');
      }

      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('O ID do gasto é obrigatório');
      }

      // Validar dados fornecidos para atualização
      GastosValidator.validateAll(data, true);

      const gasto = await GastoModel.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true,
      }).exec();

      if (!gasto) {
        throw new NotFoundException('Gasto não encontrado para atualização');
      }

      return toClient(gasto)!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Erro ao atualizar gasto com id ${id}:`, error);
      throw new InternalServerException('Erro ao atualizar Gasto');
    }
  }

  /**
   * Deleta um gasto
   * @param id - ID do gasto
   */
  async deletar(id: string): Promise<Record<string, any>> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do gasto é obrigatório');
      }

      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('O ID do gasto é obrigatório');
      }

      const gasto = await GastoModel.findByIdAndDelete(id).exec();

      if (!gasto) {
        throw new NotFoundException('Gasto não encontrado para exclusão');
      }

      return toClient(gasto)!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Erro ao deletar gasto com id ${id}:`, error);
      throw new InternalServerException('Erro ao deletar Gasto');
    }
  }

  /**
   * Valida se é um MongoDB ObjectId válido
   */
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}

export default new GastoService();
