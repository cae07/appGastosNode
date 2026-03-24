import {
  CreateTiposDeGastosDTO,
  UpdateTiposDeGastosDTO,
  TiposDeGastosFilters,
} from '../types/tiposDeGastos.types.js';

export class TiposDeGastosValidator {
  static validarCriacao(data: CreateTiposDeGastosDTO): void {
    if (!data.nome || (typeof data.nome === 'string' && data.nome.trim() === '')) {
      throw new Error('O nome do tipo de Gastos é obrigatório');
    }

    if (
      !data.descricao ||
      (typeof data.descricao === 'string' && data.descricao.trim() === '')
    ) {
      throw new Error('A descrição do tipo de Gastos é obrigatória');
    }

    if (typeof data.ativa !== 'boolean') {
      throw new Error('O status é obrigatório');
    }
  }

  static validarAtualizacao(data: UpdateTiposDeGastosDTO): void {
    if (data.nome !== undefined) {
      if (typeof data.nome === 'string' && data.nome.trim() === '') {
        throw new Error('O nome do tipo de Gastos não pode ser vazio');
      }
    }

    if (data.descricao !== undefined) {
      if (typeof data.descricao === 'string' && data.descricao.trim() === '') {
        throw new Error('A descrição do tipo de Gastos não pode ser vazia');
      }
    }

    if (data.ativa !== undefined && typeof data.ativa !== 'boolean') {
      throw new Error('O status deve ser um booleano');
    }
  }

  static validarFiltros(filters: TiposDeGastosFilters): void {
    if (filters.ativa !== undefined && typeof filters.ativa !== 'boolean') {
      throw new Error('O filtro de status deve ser um booleano');
    }
  }
}
