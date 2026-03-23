import ProductModel from '../model/products.model';
import { CreateProductDTO, UpdateProductDTO, IProduct, ProductFilters } from '../types/products.types';
import { ProductsValidator } from '../validators/products.validator';
import { BadRequestException, NotFoundException, InternalServerException } from '../utils/errorHandler';
import { productToClient, productsToClientArray } from '../utils/toClient';

export class ProductService {
  static async listar(filters?: ProductFilters): Promise<any[]> {
    try {
      let query = ProductModel.find();

      if (filters?.productType !== undefined && filters.productType.trim() !== '') {
        query = query.where('productType').equals(filters.productType);
      }

      const products = await query.exec();
      return productsToClientArray(products);
    } catch (error) {
      throw new InternalServerException('Erro ao buscar produtos');
    }
  }

  static async buscarPorId(id: string): Promise<any> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('O ID do produto é obrigatório');
      }

      const product = await ProductModel.findById(id).exec();

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      return productToClient(product);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Erro ao buscar produto');
    }
  }

  static async criar(dados: CreateProductDTO): Promise<any> {
    try {
      const validacao = ProductsValidator.validarCriacao(dados);

      if (!validacao.isValid) {
        const firstError = Object.values(validacao.errors)[0]?.[0];
        throw new BadRequestException(firstError || 'Validação falhou');
      }

      const product = await ProductModel.create(dados);
      return productToClient(product.toObject());
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerException('Erro ao criar produto');
    }
  }

  static async atualizar(id: string, dados: UpdateProductDTO): Promise<any> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('O ID do produto é obrigatório');
      }

      const validacao = ProductsValidator.validarAtualizacao(dados);

      if (!validacao.isValid) {
        const firstError = Object.values(validacao.errors)[0]?.[0];
        throw new BadRequestException(firstError || 'Validação falhou');
      }

      const productExistente = await ProductModel.findById(id).exec();

      if (!productExistente) {
        throw new NotFoundException('Produto não encontrado');
      }

      const productAtualizado = await ProductModel.findByIdAndUpdate(id, dados, {
        returnDocument: 'after',
      }).exec();

      if (!productAtualizado) {
        throw new NotFoundException('Produto não encontrado');
      }

      return productToClient(productAtualizado.toObject());
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Erro ao atualizar produto');
    }
  }

  static async deletar(id: string): Promise<any> {
    try {
      if (!id || id.trim().length === 0) {
        throw new BadRequestException('O ID do produto é obrigatório');
      }

      const product = await ProductModel.findByIdAndDelete(id).exec();

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      return productToClient(product.toObject());
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException('Erro ao deletar produto');
    }
  }
}
