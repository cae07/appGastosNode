import { BadRequestException, NotFoundException } from '../utils/errorHandler';
import { TiposProdutoModel } from '../model/tiposProduto.model';
import { TiposProdutoValidator } from '../validators/tiposProduto.validator';
import {
  CreateTiposProdutoDTO,
  UpdateTiposProdutoDTO,
  TiposProdutoFilters,
} from '../types/tiposProduto.types';
import { tiposProdutoToClient } from '../utils/toClient';

export class TiposProdutoService {
  static async listar(filters?: TiposProdutoFilters) {
    try {
      if (filters) {
        TiposProdutoValidator.validarFiltros(filters);
      }

      const query: any = {};

      if (filters?.ativa !== undefined) {
        query.ativa = filters.ativa;
      }

      const tiposProduto = await TiposProdutoModel.find(query).exec();
      return tiposProduto.map(tipo => tiposProdutoToClient(tipo));
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao buscar tipos de produtos');
    }
  }

  static async buscarPorId(id: string) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do tipo de produto é obrigatório');
      }

      const tiposProduto = await TiposProdutoModel.findById(id).exec();

      if (!tiposProduto) {
        throw new NotFoundException('Tipo de produto não encontrado');
      }

      return tiposProdutoToClient(tiposProduto);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao buscar tipo de produto');
    }
  }

  static async criar(data: CreateTiposProdutoDTO) {
    try {
      TiposProdutoValidator.validarCriacao(data);

      const novoTiposProduto = new TiposProdutoModel(data);
      const resultado = await novoTiposProduto.save();

      return tiposProdutoToClient(resultado);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('E11000') || error.message.includes('duplicate')) {
          throw new BadRequestException('Já existe um tipo de produto com este nome');
        }
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao criar tipo de produto');
    }
  }

  static async atualizar(id: string, data: UpdateTiposProdutoDTO) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do tipo de produto é obrigatório');
      }

      TiposProdutoValidator.validarAtualizacao(data);

      // Se está atualizando o nome, verifica unicidade
      if (data.nome) {
        const existente = await TiposProdutoModel.findOne({
          nome: data.nome,
          _id: { $ne: id },
        }).exec();

        if (existente) {
          throw new BadRequestException(
            'Já existe outro tipo de produto com este nome'
          );
        }
      }

      const tiposProduto = await TiposProdutoModel.findByIdAndUpdate(
        id,
        data,
        { returnDocument: 'after' }
      ).exec();

      if (!tiposProduto) {
        throw new NotFoundException('Tipo de produto não encontrado');
      }

      return tiposProdutoToClient(tiposProduto);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao atualizar tipo de produto');
    }
  }

  static async deletar(id: string) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do tipo de produto é obrigatório');
      }

      const tiposProduto = await TiposProdutoModel.findByIdAndDelete(id).exec();

      if (!tiposProduto) {
        throw new NotFoundException('Tipo de produto não encontrado');
      }

      return tiposProdutoToClient(tiposProduto);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao deletar tipo de produto');
    }
  }
}
