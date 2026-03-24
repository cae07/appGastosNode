import MedidaModel from '../model/medidas.model.js';
import { CreateMedidaDTO, UpdateMedidaDTO, MedidaFilters } from '../types/medidas.types.js';
import { MedidasValidator } from '../validators/medidas.validator.js';
import { BadRequestException, NotFoundException, InternalServerException } from '../utils/errorHandler.js';
import { toClient, toClientArray } from '../utils/toClient.js';

export class MedidaService {
  static async listar(filters?: MedidaFilters): Promise<any[]> {
    try {
      let query = MedidaModel.find();

      if (filters?.ativa !== undefined) {
        query = query.where('ativa').equals(filters.ativa);
      }

      const medidas = await query.exec();
      return toClientArray(medidas);
    } catch (error) {
      throw new InternalServerException('Erro ao buscar medidas');
    }
  }

  static async buscarPorId(id: string): Promise<any> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('O ID da medida é obrigatório');
      }

      const medida = await MedidaModel.findById(id).exec();

      if (!medida) {
        throw new NotFoundException('Medida não encontrada');
      }

      return toClient(medida);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Erro ao buscar medida');
    }
  }

  static async criar(dados: CreateMedidaDTO): Promise<any> {
    try {
      const validacao = MedidasValidator.validarCriacao(dados);

      if (!validacao.isValid) {
        const firstError = Object.values(validacao.errors)[0]?.[0];
        throw new BadRequestException(firstError || 'Validação falhou');
      }

      // Verificar unicidade de nome e sigla
      const nomeExistente = await MedidaModel.findOne({ nome: dados.nome.trim() }).exec();
      if (nomeExistente) {
        throw new BadRequestException('Já existe uma medida com este nome ou sigla');
      }

      const siglaExistente = await MedidaModel.findOne({ sigla: dados.sigla.trim() }).exec();
      if (siglaExistente) {
        throw new BadRequestException('Já existe uma medida com este nome ou sigla');
      }

      const medida = await MedidaModel.create(dados);
      return toClient(medida.toObject());
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerException('Erro ao criar medida');
    }
  }

  static async atualizar(id: string, dados: UpdateMedidaDTO): Promise<any> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('O ID da medida é obrigatório');
      }

      const validacao = MedidasValidator.validarAtualizacao(dados);

      if (!validacao.isValid) {
        const firstError = Object.values(validacao.errors)[0]?.[0];
        throw new BadRequestException(firstError || 'Validação falhou');
      }

      const medidaExistente = await MedidaModel.findById(id).exec();

      if (!medidaExistente) {
        throw new NotFoundException('Medida não encontrada');
      }

      // Validar unicidade de nome (se fornecido e diferente do atual)
      if (dados.nome !== undefined && dados.nome.trim() !== medidaExistente.nome) {
        const nomeExistente = await MedidaModel.findOne({ nome: dados.nome.trim() }).exec();
        if (nomeExistente) {
          throw new BadRequestException('Já existe outra medida com este nome ou sigla');
        }
      }

      // Validar unicidade de sigla (se fornecida e diferente da atual)
      if (dados.sigla !== undefined && dados.sigla.trim() !== medidaExistente.sigla) {
        const siglaExistente = await MedidaModel.findOne({ sigla: dados.sigla.trim() }).exec();
        if (siglaExistente) {
          throw new BadRequestException('Já existe outra medida com este nome ou sigla');
        }
      }

      const medidaAtualizada = await MedidaModel.findByIdAndUpdate(id, dados, {
        returnDocument: 'after',
      }).exec();

      if (!medidaAtualizada) {
        throw new NotFoundException('Medida não encontrada');
      }

      return toClient(medidaAtualizada.toObject());
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Erro ao atualizar medida');
    }
  }

  static async deletar(id: string): Promise<any> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('O ID da medida é obrigatório');
      }

      const medida = await MedidaModel.findByIdAndDelete(id).exec();

      if (!medida) {
        throw new NotFoundException('Medida não encontrada');
      }

      return toClient(medida.toObject());
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Erro ao deletar medida');
    }
  }
}
