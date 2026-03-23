import GastoService from '../src/services/gastos.service';
import GastoModel from '../src/model/gastos.model';
import { BadRequestException, NotFoundException } from '../src/utils/errorHandler';
import { CreateGastoDTO } from '../src/types/gastos.types';

describe('GastoService', () => {
  const validTipoGastoId = '507f1f77bcf86cd799439011';

  beforeEach(async () => {
    // Limpar base antes de cada teste
    await GastoModel.deleteMany({});
  });

  describe('criar', () => {
    it('deve criar um gasto com sucesso', async () => {
      const data: CreateGastoDTO = {
        descricao: 'Compra de materiais',
        valor: 150.50,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 3
      };

      const resultado = await GastoService.criar(data);

      expect(resultado).toHaveProperty('_id');
      expect(resultado.descricao).toBe('Compra de materiais');
      expect(resultado.valor).toBe(150.50);
      expect(resultado.tipoGastoId).toBe(validTipoGastoId);
    });

    it('deve lançar erro se descricao não fornecida', async () => {
      const data = {
        valor: 150.50,
        tipoGastoId: validTipoGastoId,
      } as CreateGastoDTO;

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve lançar erro se valor não fornecido', async () => {
      const data = {
        descricao: 'Compra',
        tipoGastoId: validTipoGastoId,
      } as CreateGastoDTO;

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve lançar erro se tipoGastoId não fornecido', async () => {
      const data = {
        descricao: 'Compra',
        valor: 150.50,
      } as CreateGastoDTO;

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar comprimento mínimo da descrição', async () => {
      const data: CreateGastoDTO = {
        descricao: 'ab', // Menos de 3 caracteres
        valor: 150.50,
        tipoGastoId: validTipoGastoId,
      };

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar comprimento máximo da descrição', async () => {
      const data: CreateGastoDTO = {
        descricao: 'a'.repeat(256), // Mais de 255 caracteres
        valor: 150.50,
        tipoGastoId: validTipoGastoId,
      };

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar valor positivo', async () => {
      const data: CreateGastoDTO = {
        descricao: 'Compra',
        valor: 0,
        tipoGastoId: validTipoGastoId,
      };

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar casas decimais (máximo 2)', async () => {
      const data: CreateGastoDTO = {
        descricao: 'Compra',
        valor: 150.555, // Mais de 2 casas decimais
        tipoGastoId: validTipoGastoId,
      };

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar formato de MongoDB ObjectId', async () => {
      const data: CreateGastoDTO = {
        descricao: 'Compra',
        valor: 150.50,
        tipoGastoId: 'id-invalido',
      };

      await expect(GastoService.criar(data)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('listar', () => {
    it('deve listar todos os gastos', async () => {
      await GastoService.criar({
        descricao: 'Gasto 1',
        valor: 100,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 3,
      });

      await GastoService.criar({
        descricao: 'Gasto 2',
        valor: 200,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 4,
      });

      const resultado = await GastoService.listar();

      expect(resultado).toHaveLength(2);
    });

    it('deve filtrar gastos por ano', async () => {
      await GastoService.criar({
        descricao: 'Gasto 2024',
        valor: 100,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
      });

      await GastoService.criar({
        descricao: 'Gasto 2025',
        valor: 200,
        tipoGastoId: validTipoGastoId,
        ano: 2025,
      });

      const resultado = await GastoService.listar(2024);

      expect(resultado).toHaveLength(1);
      expect(resultado[0].descricao).toBe('Gasto 2024');
    });

    it('deve filtrar gastos por mês', async () => {
      await GastoService.criar({
        descricao: 'Gasto Mar',
        valor: 100,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 3,
      });

      await GastoService.criar({
        descricao: 'Gasto Abr',
        valor: 200,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 4,
      });

      const resultado = await GastoService.listar(undefined, 3);

      expect(resultado).toHaveLength(1);
      expect(resultado[0].descricao).toBe('Gasto Mar');
    });

    it('deve filtrar gastos por ano e mês', async () => {
      await GastoService.criar({
        descricao: 'Gasto 2024-03',
        valor: 100,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 3,
      });

      await GastoService.criar({
        descricao: 'Gasto 2024-04',
        valor: 200,
        tipoGastoId: validTipoGastoId,
        ano: 2024,
        mes: 4,
      });

      await GastoService.criar({
        descricao: 'Gasto 2025-03',
        valor: 300,
        tipoGastoId: validTipoGastoId,
        ano: 2025,
        mes: 3,
      });

      const resultado = await GastoService.listar(2024, 3);

      expect(resultado).toHaveLength(1);
      expect(resultado[0].descricao).toBe('Gasto 2024-03');
    });
  });

  describe('buscarPorId', () => {
    it('deve encontrar um gasto pelo ID', async () => {
      const gasto = await GastoService.criar({
        descricao: 'Compra de materiais',
        valor: 150.50,
        tipoGastoId: validTipoGastoId,
      });

      const resultado = await GastoService.buscarPorId(gasto._id);

      expect(resultado._id).toBe(gasto._id);
      expect(resultado.descricao).toBe('Compra de materiais');
    });

    it('deve lançar erro se ID não encontrado', async () => {
      const fakeId = '507f1f77bcf86cd799439999';

      await expect(GastoService.buscarPorId(fakeId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('deve lançar erro se ID inválido', async () => {
      await expect(GastoService.buscarPorId('id-invalido')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um gasto', async () => {
      const gasto = await GastoService.criar({
        descricao: 'Compra original',
        valor: 100,
        tipoGastoId: validTipoGastoId,
      });

      const atualizado = await GastoService.atualizar(gasto._id, {
        descricao: 'Compra atualizada',
        valor: 150,
      });

      expect(atualizado.descricao).toBe('Compra atualizada');
      expect(atualizado.valor).toBe(150);
    });

    it('deve permitir atualizar apenas descrição', async () => {
      const gasto = await GastoService.criar({
        descricao: 'Compra original',
        valor: 100,
        tipoGastoId: validTipoGastoId,
      });

      const atualizado = await GastoService.atualizar(gasto._id, {
        descricao: 'Nova descrição',
      });

      expect(atualizado.descricao).toBe('Nova descrição');
      expect(atualizado.valor).toBe(100); // Não deve mudar
    });

    it('deve lançar erro se ID não encontrado', async () => {
      const fakeId = '507f1f77bcf86cd799439999';

      await expect(
        GastoService.atualizar(fakeId, { descricao: 'Novo' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletar', () => {
    it('deve deletar um gasto', async () => {
      const gasto = await GastoService.criar({
        descricao: 'Compra a deletar',
        valor: 100,
        tipoGastoId: validTipoGastoId,
      });

      const deletado = await GastoService.deletar(gasto._id);

      expect(deletado._id).toBe(gasto._id);

      // Verificar que foi realmente deletado
      await expect(GastoService.buscarPorId(gasto._id)).rejects.toThrow(
        NotFoundException
      );
    });

    it('deve retornar o gasto deletado', async () => {
      const original = await GastoService.criar({
        descricao: 'Compra',
        valor: 100,
        tipoGastoId: validTipoGastoId,
      });

      const deletado = await GastoService.deletar(original._id);

      expect(deletado.descricao).toBe(original.descricao);
      expect(deletado.valor).toBe(original.valor);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      const fakeId = '507f1f77bcf86cd799439999';

      await expect(GastoService.deletar(fakeId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
