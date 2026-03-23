import mongoose from 'mongoose';
import MedidaModel from '../src/model/medidas.model';
import { MedidaService } from '../src/services/medidas.service';
import { BadRequestException, NotFoundException } from '../src/utils/errorHandler';

describe('MedidaService', () => {
  beforeEach(async () => {
    await MedidaModel.deleteMany({});
  });

  describe('criar()', () => {
    it('deve criar uma medida com sucesso', async () => {
      const dados = {
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      };

      const resultado = await MedidaService.criar(dados);

      expect(resultado).toBeDefined();
      expect(resultado.nome).toBe('Metro');
      expect(resultado.sigla).toBe('m');
      expect(resultado.ativa).toBe(true);
      expect(resultado._id).toBeDefined();
      expect(resultado.createdAt).toBeDefined();
    });

    it('deve rejeitar criação sem nome', async () => {
      const dados = {
        sigla: 'm',
        ativa: true,
      };

      try {
        await MedidaService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação sem sigla', async () => {
      const dados = {
        nome: 'Metro',
        ativa: true,
      };

      try {
        await MedidaService.criar(dados);
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação com nome duplicado', async () => {
      await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      try {
        await MedidaService.criar({
          nome: 'Metro',
          sigla: 'mt',
          ativa: true,
        });
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar criação com sigla duplicada', async () => {
      await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      try {
        await MedidaService.criar({
          nome: 'Metros',
          sigla: 'm',
          ativa: true,
        });
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('listar()', () => {
    it('deve listar todas as medidas', async () => {
      await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      await MedidaService.criar({
        nome: 'Quilograma',
        sigla: 'kg',
        ativa: true,
      });

      const resultado = await MedidaService.listar();

      expect(resultado).toHaveLength(2);
      expect(resultado[0].nome).toBe('Metro');
      expect(resultado[1].nome).toBe('Quilograma');
    });

    it('deve listar apenas medidas ativas', async () => {
      await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      await MedidaService.criar({
        nome: 'Quilograma',
        sigla: 'kg',
        ativa: false,
      });

      const resultado = await MedidaService.listar({ ativa: true });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].nome).toBe('Metro');
    });

    it('deve listar apenas medidas inativas', async () => {
      await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      await MedidaService.criar({
        nome: 'Quilograma',
        sigla: 'kg',
        ativa: false,
      });

      const resultado = await MedidaService.listar({ ativa: false });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].nome).toBe('Quilograma');
    });
  });

  describe('buscarPorId()', () => {
    it('deve buscar uma medida por ID', async () => {
      const medida = await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      const resultado = await MedidaService.buscarPorId(medida._id);

      expect(resultado).toBeDefined();
      expect(resultado.nome).toBe('Metro');
      expect(resultado.sigla).toBe('m');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      try {
        await MedidaService.buscarPorId(fakeId);
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve lançar BadRequestException para ID vazio', async () => {
      try {
        await MedidaService.buscarPorId('');
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('atualizar()', () => {
    it('deve atualizar uma medida completamente', async () => {
      const medida = await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      const resultado = await MedidaService.atualizar(medida._id, {
        nome: 'Centímetro',
        sigla: 'cm',
        ativa: false,
      });

      expect(resultado.nome).toBe('Centímetro');
      expect(resultado.sigla).toBe('cm');
      expect(resultado.ativa).toBe(false);
    });

    it('deve atualizar apenas um campo', async () => {
      const medida = await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      const resultado = await MedidaService.atualizar(medida._id, {
        ativa: false,
      });

      expect(resultado.nome).toBe('Metro');
      expect(resultado.sigla).toBe('m');
      expect(resultado.ativa).toBe(false);
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      try {
        await MedidaService.atualizar(fakeId, { ativa: false });
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve rejeitar atualização com nome duplicado', async () => {
      const medida1 = await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      await MedidaService.criar({
        nome: 'Centímetro',
        sigla: 'cm',
        ativa: true,
      });

      try {
        await MedidaService.atualizar(medida1._id, {
          nome: 'Centímetro',
        });
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('deve rejeitar atualização com sigla duplicada', async () => {
      const medida1 = await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      await MedidaService.criar({
        nome: 'Centímetro',
        sigla: 'cm',
        ativa: true,
      });

      try {
        await MedidaService.atualizar(medida1._id, {
          sigla: 'cm',
        });
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('deletar()', () => {
    it('deve deletar uma medida com sucesso', async () => {
      const medida = await MedidaService.criar({
        nome: 'Metro',
        sigla: 'm',
        ativa: true,
      });

      const resultado = await MedidaService.deletar(medida._id);

      expect(resultado).toBeDefined();
      expect(resultado.nome).toBe('Metro');

      // Verificar que foi deletada
      try {
        await MedidaService.buscarPorId(medida._id);
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve lançar NotFoundException ao deletar ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      try {
        await MedidaService.deletar(fakeId);
        fail('Deveria lançar NotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('deve lançar BadRequestException para ID vazio', async () => {
      try {
        await MedidaService.deletar('');
        fail('Deveria lançar BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
