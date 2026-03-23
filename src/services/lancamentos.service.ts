import LancamentoModel from '../model/lancamentos.model';
import {
  CreateLancamentoDTO,
  UpdateLancamentoDTO,
  LancamentoFilters,
} from '../types/lancamentos.types';
import {
  NotFoundException,
  BadRequestException,
  InternalServerException,
} from '../utils/errorHandler';
import { lancamentoToClient, lancamentosToClientArray } from '../utils/toClient';
import { LancamentosValidator, LancamentosFilterValidator } from '../validators/lancamentos.validator';

export class LancamentoService {
  /**
   * Lista todos os lançamentos com suporte a filtros e ordenação
   * @param filters - Filtros e parâmetros de ordenação
   */
  async listar(filters: LancamentoFilters): Promise<Record<string, any>[]> {
    try {
      // Validar filtros
      LancamentosFilterValidator.validateFilters(filters);

      let query = LancamentoModel.find();

      // Aplicar filtros
      if (filters.ano !== undefined) {
        query = query.where('ano').equals(filters.ano);
      }

      if (filters.mes !== undefined) {
        query = query.where('mes').equals(filters.mes);
      }

      if (filters.categoria !== undefined && filters.categoria.trim() !== '') {
        query = query.where('categoria').equals(filters.categoria);
      }

      if (filters.produtoId !== undefined && filters.produtoId.trim() !== '') {
        // Search by product name (fuzzy)
        query = query.where('produtoName').regex(new RegExp(filters.produtoId, 'i'));
      }

      if (filters.data_gte !== undefined && filters.data_gte.trim() !== '') {
        const dateGte = new Date(filters.data_gte);
        if (!isNaN(dateGte.getTime())) {
          query = query.where('createdAt').gte(dateGte.getTime());
        }
      }

      if (filters.data_lte !== undefined && filters.data_lte.trim() !== '') {
        const dateLte = new Date(filters.data_lte);
        if (!isNaN(dateLte.getTime())) {
          query = query.where('createdAt').lte(dateLte.getTime());
        }
      }

      // Aplicar ordenação
      if (filters._sort !== undefined && filters._sort.trim() !== '') {
        const sortField = filters._sort.trim();
        const sortOrder = filters._order === 'desc' ? -1 : 1;
        query = query.sort({ [sortField]: sortOrder });
      }

      const lancamentos = await query.exec();
      return lancamentosToClientArray(lancamentos);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Erro ao buscar lançamentos:', error);
      throw new InternalServerException('Erro ao buscar lançamentos');
    }
  }

  /**
   * Busca um lançamento específico pelo ID
   * @param id - ID do lançamento
   */
  async buscarPorId(id: string): Promise<Record<string, any>> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do lançamento é obrigatório');
      }

      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('O ID do lançamento é obrigatório');
      }

      const lancamento = await LancamentoModel.findById(id).exec();

      if (!lancamento) {
        throw new NotFoundException('Lançamento não encontrado');
      }

      return lancamentoToClient(lancamento)!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Erro ao buscar lançamento com id ${id}:`, error);
      throw new InternalServerException('Erro ao buscar lançamento');
    }
  }

  /**
   * Cria um novo lançamento
   * @param data - Dados do lançamento
   */
  async criar(data: CreateLancamentoDTO): Promise<Record<string, any>> {
    try {
      // Validar todos os dados
      LancamentosValidator.validateAll(data, false);

      const lancamento = new LancamentoModel(data);
      await lancamento.save();

      return lancamentoToClient(lancamento)!;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Erro ao criar lançamento:', error);
      throw new InternalServerException('Erro ao criar lançamento');
    }
  }

  /**
   * Atualiza um lançamento existente
   * @param id - ID do lançamento
   * @param data - Dados para atualizar
   */
  async atualizar(
    id: string,
    data: UpdateLancamentoDTO
  ): Promise<Record<string, any>> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do lançamento é obrigatório');
      }

      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('O ID do lançamento é obrigatório');
      }

      // Validar dados fornecidos para atualização
      LancamentosValidator.validateAll(data, true);

      const lancamento = await LancamentoModel.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true,
      }).exec();

      if (!lancamento) {
        throw new NotFoundException('Lançamento não encontrado');
      }

      return lancamentoToClient(lancamento)!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Erro ao atualizar lançamento com id ${id}:`, error);
      throw new InternalServerException('Erro ao atualizar lançamento');
    }
  }

  /**
   * Deleta um lançamento
   * @param id - ID do lançamento
   */
  async deletar(id: string): Promise<Record<string, any>> {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do lançamento é obrigatório');
      }

      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('O ID do lançamento é obrigatório');
      }

      const lancamento = await LancamentoModel.findByIdAndDelete(id).exec();

      if (!lancamento) {
        throw new NotFoundException('Lançamento não encontrado');
      }

      return lancamentoToClient(lancamento)!;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(`Erro ao deletar lançamento com id ${id}:`, error);
      throw new InternalServerException('Erro ao deletar lançamento');
    }
  }

  /**
   * Valida se é um MongoDB ObjectId válido
   */
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}

export default new LancamentoService();
