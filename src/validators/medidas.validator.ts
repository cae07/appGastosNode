import { CreateMedidaDTO, UpdateMedidaDTO, MedidaFilters } from '../types/medidas.types';

export class MedidasValidator {
  static validarCriacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar nome
    if (dados.nome === undefined || dados.nome === null) {
      errors.nome = ['O nome da medida é obrigatório'];
    } else if (typeof dados.nome !== 'string') {
      errors.nome = ['O nome deve ser uma string'];
    } else if (dados.nome.trim().length === 0) {
      errors.nome = ['O nome da medida não pode estar vazio'];
    } else if (dados.nome.trim().length < 1) {
      errors.nome = ['O nome deve ter pelo menos 1 caractere'];
    }

    // Validar sigla
    if (dados.sigla === undefined || dados.sigla === null) {
      errors.sigla = ['A sigla da medida é obrigatória'];
    } else if (typeof dados.sigla !== 'string') {
      errors.sigla = ['A sigla deve ser uma string'];
    } else if (dados.sigla.trim().length === 0) {
      errors.sigla = ['A sigla da medida não pode estar vazia'];
    } else if (dados.sigla.trim().length < 1) {
      errors.sigla = ['A sigla deve ter pelo menos 1 caractere'];
    }

    // Validar ativa
    if (dados.ativa === undefined || dados.ativa === null) {
      errors.ativa = ['O status ativa é obrigatório'];
    } else if (typeof dados.ativa !== 'boolean') {
      errors.ativa = ['O status ativa deve ser um booleano'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarAtualizacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar nome (opcional em UPDATE)
    if (dados.nome !== undefined && dados.nome !== null) {
      if (typeof dados.nome !== 'string') {
        errors.nome = ['O nome deve ser uma string'];
      } else if (dados.nome.trim().length === 0) {
        errors.nome = ['O nome da medida não pode estar vazio'];
      } else if (dados.nome.trim().length < 1) {
        errors.nome = ['O nome deve ter pelo menos 1 caractere'];
      }
    }

    // Validar sigla (opcional em UPDATE)
    if (dados.sigla !== undefined && dados.sigla !== null) {
      if (typeof dados.sigla !== 'string') {
        errors.sigla = ['A sigla deve ser uma string'];
      } else if (dados.sigla.trim().length === 0) {
        errors.sigla = ['A sigla da medida não pode estar vazia'];
      } else if (dados.sigla.trim().length < 1) {
        errors.sigla = ['A sigla deve ter pelo menos 1 caractere'];
      }
    }

    // Validar ativa (opcional em UPDATE)
    if (dados.ativa !== undefined && dados.ativa !== null) {
      if (typeof dados.ativa !== 'boolean') {
        errors.ativa = ['O status ativa deve ser um booleano'];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarFiltros(filtros: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar ativa (opcional)
    if (filtros.ativa !== undefined && filtros.ativa !== null) {
      if (typeof filtros.ativa !== 'boolean') {
        errors.ativa = ['O parâmetro ativa deve ser um booleano'];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
