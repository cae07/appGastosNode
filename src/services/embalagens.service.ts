import EmbalagemModel from '../model/embalagens.model';
import {
  CreateEmbalagemDTO,
  UpdateEmbalagemDTO,
} from '../types/embalagens.types';
import {
  NotFoundException,
  BadRequestException,
  InternalServerException,
} from '../utils/errorHandler';
import { embalagemToClient, embalagenToClientArray } from '../utils/toClient';

export class EmbalagemService {
  /**
   * Lista todas as embalagens ou filtra por status
   * @param ativa - Filtro opcional por status
   */
  async listarEmbalagens(ativa?: boolean): Promise<Record<string, any>[]> {
    try {
      let query = EmbalagemModel.find();

      if (ativa !== undefined) {
        query = query.where('ativa').equals(ativa);
      }

      const embalagens = await query.exec();
      return embalagenToClientArray(embalagens);
    } catch (error) {
      console.error('Erro ao buscar embalagens:', error);
      throw new InternalServerException('Erro ao buscar embalagens');
    }
  }

  /**
   * Busca uma embalagem específica pelo ID
   * @param id - ID da embalagem
   */
  async buscarPorId(id: string): Promise<Record<string, any>> {
    try {
      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('ID inválido');
      }

      const embalagem = await EmbalagemModel.findById(id).exec();

      if (!embalagem) {
        throw new NotFoundException(
          `Embalagem com id ${id} não encontrada`
        );
      }

      return embalagemToClient(embalagem)!;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Erro ao buscar embalagem com id ${id}:`, error);
      throw new InternalServerException(
        `Erro ao buscar embalagem com id ${id}`
      );
    }
  }

  /**
   * Cria uma nova embalagem
   * @param data - Dados da embalagem
   */
  async criar(data: CreateEmbalagemDTO): Promise<Record<string, any>> {
    try {
      // Validações
      if (data.quantidade === undefined || data.quantidade === null) {
        throw new BadRequestException('O campo "quantidade" é obrigatório');
      }

      if (data.ativa === undefined || data.ativa === null) {
        throw new BadRequestException('O campo "ativa" é obrigatório');
      }

      const embalagem = new EmbalagemModel(data);
      await embalagem.save();

      return embalagemToClient(embalagem)!;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Erro ao criar embalagem:', error);
      throw new InternalServerException('Erro ao criar embalagem');
    }
  }

  /**
   * Atualiza uma embalagem existente
   * @param id - ID da embalagem
   * @param data - Dados para atualizar
   */
  async atualizar(
    id: string,
    data: UpdateEmbalagemDTO
  ): Promise<Record<string, any>> {
    try {
      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('ID inválido');
      }

      const embalagem = await EmbalagemModel.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true,
      }).exec();

      if (!embalagem) {
        throw new NotFoundException(
          `Embalagem com id ${id} não encontrada`
        );
      }

      return embalagemToClient(embalagem)!;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Erro ao atualizar embalagem com id ${id}:`, error);
      throw new InternalServerException(
        `Erro ao atualizar embalagem com id ${id}`
      );
    }
  }

  /**
   * Deleta uma embalagem
   * @param id - ID da embalagem
   */
  async deletar(id: string): Promise<Record<string, any>> {
    try {
      // Validar se é um ObjectId válido
      if (!this.isValidObjectId(id)) {
        throw new BadRequestException('ID inválido');
      }

      const embalagem = await EmbalagemModel.findByIdAndDelete(id).exec();

      if (!embalagem) {
        throw new NotFoundException(
          `Embalagem com id ${id} não encontrada`
        );
      }

      return embalagemToClient(embalagem)!;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Erro ao deletar embalagem com id ${id}:`, error);
      throw new InternalServerException(
        `Erro ao deletar embalagem com id ${id}`
      );
    }
  }

  /**
   * Valida se a string é um ObjectId válido do MongoDB
   */
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}

export default new EmbalagemService();
