import { CreateProductDTO, UpdateProductDTO } from '../types/products.types';

export class ProductsValidator {
  static validarCriacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar name
    if (dados.name === undefined || dados.name === null) {
      errors.name = ['O nome do produto é obrigatório'];
    } else if (typeof dados.name !== 'string') {
      errors.name = ['O nome deve ser uma string'];
    } else if (dados.name.trim().length === 0) {
      errors.name = ['O nome é obrigatório'];
    }

    // Validar measure
    if (dados.measure === undefined || dados.measure === null) {
      errors.measure = ['A medida do produto é obrigatória'];
    } else if (typeof dados.measure !== 'string') {
      errors.measure = ['A medida deve ser uma string'];
    } else if (dados.measure.trim().length === 0) {
      errors.measure = ['A medida não pode estar vazia'];
    }

    // Validar medidaId
    if (dados.medidaId === undefined || dados.medidaId === null) {
      errors.medidaId = ['O ID da medida é obrigatório'];
    } else if (typeof dados.medidaId !== 'string') {
      errors.medidaId = ['O ID da medida deve ser uma string'];
    } else if (dados.medidaId.trim().length === 0) {
      errors.medidaId = ['O ID da medida não pode estar vazio'];
    }

    // Validar productType
    if (dados.productType === undefined || dados.productType === null) {
      errors.productType = ['O tipo de produto é obrigatório'];
    } else if (typeof dados.productType !== 'string') {
      errors.productType = ['O tipo de produto deve ser uma string'];
    } else if (dados.productType.trim().length === 0) {
      errors.productType = ['O tipo de produto não pode estar vazio'];
    }

    // Validar tipoProdutoId
    if (dados.tipoProdutoId === undefined || dados.tipoProdutoId === null) {
      errors.tipoProdutoId = ['O ID do tipo de produto é obrigatório'];
    } else if (typeof dados.tipoProdutoId !== 'string') {
      errors.tipoProdutoId = ['O ID do tipo de produto deve ser uma string'];
    } else if (dados.tipoProdutoId.trim().length === 0) {
      errors.tipoProdutoId = ['O ID do tipo de produto não pode estar vazio'];
    }

    // Validar embalagemId
    if (dados.embalagemId === undefined || dados.embalagemId === null) {
      errors.embalagemId = ['O ID da embalagem é obrigatório'];
    } else if (typeof dados.embalagemId !== 'string') {
      errors.embalagemId = ['O ID da embalagem deve ser uma string'];
    } else if (dados.embalagemId.trim().length === 0) {
      errors.embalagemId = ['O ID da embalagem não pode estar vazio'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarAtualizacao(dados: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar name (opcional em UPDATE)
    if (dados.name !== undefined && dados.name !== null) {
      if (typeof dados.name !== 'string') {
        errors.name = ['O nome deve ser uma string'];
      } else if (dados.name.trim().length === 0) {
        errors.name = ['O nome é obrigatório'];
      }
    }

    // Validar measure (opcional em UPDATE)
    if (dados.measure !== undefined && dados.measure !== null) {
      if (typeof dados.measure !== 'string') {
        errors.measure = ['A medida deve ser uma string'];
      } else if (dados.measure.trim().length === 0) {
        errors.measure = ['A medida não pode estar vazia'];
      }
    }

    // Validar medidaId (opcional em UPDATE)
    if (dados.medidaId !== undefined && dados.medidaId !== null) {
      if (typeof dados.medidaId !== 'string') {
        errors.medidaId = ['O ID da medida deve ser uma string'];
      } else if (dados.medidaId.trim().length === 0) {
        errors.medidaId = ['O ID da medida não pode estar vazio'];
      }
    }

    // Validar productType (opcional em UPDATE)
    if (dados.productType !== undefined && dados.productType !== null) {
      if (typeof dados.productType !== 'string') {
        errors.productType = ['O tipo de produto deve ser uma string'];
      } else if (dados.productType.trim().length === 0) {
        errors.productType = ['O tipo de produto não pode estar vazio'];
      }
    }

    // Validar tipoProdutoId (opcional em UPDATE)
    if (dados.tipoProdutoId !== undefined && dados.tipoProdutoId !== null) {
      if (typeof dados.tipoProdutoId !== 'string') {
        errors.tipoProdutoId = ['O ID do tipo de produto deve ser uma string'];
      } else if (dados.tipoProdutoId.trim().length === 0) {
        errors.tipoProdutoId = ['O ID do tipo de produto não pode estar vazio'];
      }
    }

    // Validar embalagemId (opcional em UPDATE)
    if (dados.embalagemId !== undefined && dados.embalagemId !== null) {
      if (typeof dados.embalagemId !== 'string') {
        errors.embalagemId = ['O ID da embalagem deve ser uma string'];
      } else if (dados.embalagemId.trim().length === 0) {
        errors.embalagemId = ['O ID da embalagem não pode estar vazio'];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validarFiltros(filtros: any): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Validar productType (opcional)
    if (filtros.productType !== undefined && filtros.productType !== null) {
      if (typeof filtros.productType !== 'string') {
        errors.productType = ['O tipo de produto deve ser uma string'];
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
