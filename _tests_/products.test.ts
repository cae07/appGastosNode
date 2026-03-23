import mongoose from 'mongoose';
import ProductModel from '../src/model/products.model';
import { ProductService } from '../src/services/products.service';
import { BadRequestException, NotFoundException } from '../src/utils/errorHandler';

describe('ProductService', () => {
  beforeEach(async () => {
    await ProductModel.deleteMany({});
  });

  describe('criar()', () => {
    it('deve criar um produto com sucesso', async () => {
      const dados = {
        name: 'Martelo profissional XL',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      const resultado = await ProductService.criar(dados);

      expect(resultado).toBeDefined();
      expect(resultado.name).toBe('Martelo profissional XL');
      expect(resultado.measure).toBe('kg');
      expect(resultado.productType).toBe('Ferramenta');
      expect(resultado._id).toBeDefined();
    });

    it('deve rejeitar criação sem nome', async () => {
      const dados = {
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação com nome vazio', async () => {
      const dados = {
        name: '   ',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação sem medida', async () => {
      const dados = {
        name: 'Martelo',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação sem medidaId', async () => {
      const dados = {
        name: 'Martelo',
        measure: 'kg',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação sem productType', async () => {
      const dados = {
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação sem tipoProdutoId', async () => {
      const dados = {
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        embalagemId: '507f1f77bcf86cd799439013',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação sem embalagemId', async () => {
      const dados = {
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
      };

      try {
        await ProductService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('listar()', () => {
    it('deve listar todos os produtos', async () => {
      await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      await ProductService.criar({
        name: 'Parafuso',
        measure: 'g',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Hardware',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.listar();

      expect(resultado).toHaveLength(2);
    });

    it('deve listar produtos filtrados por tipo', async () => {
      await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      await ProductService.criar({
        name: 'Parafuso',
        measure: 'g',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Hardware',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.listar({ productType: 'Ferramenta' });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].productType).toBe('Ferramenta');
    });

    it('deve retornar array vazio quando nenhum produto corresponde ao filtro', async () => {
      await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.listar({ productType: 'Inexistente' });

      expect(resultado).toHaveLength(0);
    });
  });

  describe('buscarPorId()', () => {
    it('deve buscar um produto por ID', async () => {
      const produto = await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.buscarPorId(produto._id);

      expect(resultado).toBeDefined();
      expect(resultado.name).toBe('Martelo');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      try {
        await ProductService.buscarPorId(fakeId);
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve lançar BadRequestException para ID vazio', async () => {
      try {
        await ProductService.buscarPorId('');
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('atualizar()', () => {
    it('deve atualizar um produto completamente', async () => {
      const produto = await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.atualizar(produto._id, {
        name: 'Martelo XXL',
        measure: 'ton',
      });

      expect(resultado.name).toBe('Martelo XXL');
      expect(resultado.measure).toBe('ton');
    });

    it('deve atualizar apenas um campo', async () => {
      const produto = await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.atualizar(produto._id, {
        name: 'Martelo Super',
      });

      expect(resultado.name).toBe('Martelo Super');
      expect(resultado.measure).toBe('kg');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      try {
        await ProductService.atualizar(fakeId, { name: 'Novo Nome' });
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve rejeitar update com nome vazio', async () => {
      const produto = await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      try {
        await ProductService.atualizar(produto._id, { name: '   ' });
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deletar()', () => {
    it('deve deletar um produto com sucesso', async () => {
      const produto = await ProductService.criar({
        name: 'Martelo',
        measure: 'kg',
        medidaId: '507f1f77bcf86cd799439011',
        productType: 'Ferramenta',
        tipoProdutoId: '507f1f77bcf86cd799439012',
        embalagemId: '507f1f77bcf86cd799439013',
      });

      const resultado = await ProductService.deletar(produto._id);

      expect(resultado).toBeDefined();
      expect(resultado.name).toBe('Martelo');

      // Verificar que foi deletado
      try {
        await ProductService.buscarPorId(produto._id);
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve lançar NotFoundException ao deletar ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      try {
        await ProductService.deletar(fakeId);
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve lançar BadRequestException para ID vazio', async () => {
      try {
        await ProductService.deletar('');
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
