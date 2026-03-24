import { BadRequestException, NotFoundException } from '../utils/errorHandler.js';
import { TiposDeGastosModel } from '../model/tiposDeGastos.model.js';
import { TiposDeGastosValidator } from '../validators/tiposDeGastos.validator.js';
import {
  CreateTiposDeGastosDTO,
  UpdateTiposDeGastosDTO,
  TiposDeGastosFilters,
} from '../types/tiposDeGastos.types.js';
import { toClient } from '../utils/toClient.js';

export class TiposDeGastosService {
  static async listar(filters?: TiposDeGastosFilters) {
    try {
      if (filters) {
        TiposDeGastosValidator.validarFiltros(filters);
      }

      const query: any = {};

      if (filters?.ativa !== undefined) {
        query.ativa = filters.ativa;
      }

      const tiposDeGastos = await TiposDeGastosModel.find(query).exec();
      return tiposDeGastos.map(tiposDeGastos => toClient(tiposDeGastos));
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao buscar tipos de Gastos');
    }
  }

  static async buscarPorId(id: string) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do tipo de Gastos é obrigatório');
      }

      const tiposDeGastos = await TiposDeGastosModel.findById(id).exec();

      if (!tiposDeGastos) {
        throw new NotFoundException('Tipo de Gastos não encontrado');
      }

      return toClient(tiposDeGastos);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao buscar tipo de Gastos');
    }
  }

  static async criar(data: CreateTiposDeGastosDTO) {
    try {
      TiposDeGastosValidator.validarCriacao(data);

      const novoTiposDeGastos = new TiposDeGastosModel(data);
      const resultado = await novoTiposDeGastos.save();

      return toClient(resultado);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('E11000') || error.message.includes('duplicate')) {
          throw new BadRequestException('Já existe um tipo de Gastos com este nome');
        }
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao criar tipo de Gastos');
    }
  }

  static async atualizar(id: string, data: UpdateTiposDeGastosDTO) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do tipo de Gastos é obrigatório');
      }

      TiposDeGastosValidator.validarAtualizacao(data);

      // Se está atualizando o nome, verifica unicidade
      if (data.nome) {
        const existente = await TiposDeGastosModel.findOne({
          nome: data.nome,
          _id: { $ne: id },
        }).exec();

        if (existente) {
          throw new BadRequestException(
            'Já existe outro tipo de Gastos com este nome'
          );
        }
      }

      const tiposDeGastos = await TiposDeGastosModel.findByIdAndUpdate(
        id,
        data,
        { returnDocument: 'after' }
      ).exec();

      if (!tiposDeGastos) {
        throw new NotFoundException('Tipo de Gastos não encontrado');
      }

      return toClient(tiposDeGastos);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao atualizar tipo de Gastos');
    }
  }

  static async deletar(id: string) {
    try {
      if (!id || id.trim() === '') {
        throw new BadRequestException('O ID do tipo de Gastos é obrigatório');
      }

      const tiposDeGastos = await TiposDeGastosModel.findByIdAndDelete(id).exec();

      if (!tiposDeGastos) {
        throw new NotFoundException('Tipo de Gastos não encontrado');
      }

      return toClient(tiposDeGastos);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new Error('Erro ao deletar tipo de Gastos');
    }
  }
}
