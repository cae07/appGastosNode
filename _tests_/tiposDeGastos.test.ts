import { TiposDeGastosModel } from '../src/model/tiposDeGastos.model';
import { TiposDeGastosService } from '../src/services/tiposDeGastos.service';
import { BadRequestException, NotFoundException } from '../src/utils/errorHandler';

describe('TiposDeGastos Service', () => {
  beforeEach(async () => {
    await TiposDeGastosModel.deleteMany({});
  });

  // =====================
  // CRIAR (8 testes)
  // =====================

  describe('criar', () => {
    it('deve criar um tipo de gasto com sucesso', async () => {
      const resultado = await TiposDeGastosService.criar({
        nome: 'Compras de Insumos',
        descricao: 'Gastos com aquisição de materiais',
        ativa: true,
      });

      expect(resultado.nome).toBe('Compras de Insumos');
      expect(resultado.descricao).toBe('Gastos com aquisição de materiais');
      expect(resultado.ativa).toBe(true);
      expect(resultado._id).toBeDefined();
    });

    it('deve lançar erro quando nome é obrigatório', async () => {
      try {
        await TiposDeGastosService.criar({
          nome: '',
          descricao: 'Descrição teste',
          ativa: true,
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
        expect(error.message).toContain('nome');
      }
    });

    it('deve lançar erro quando descricao é obrigatória', async () => {
      try {
        await TiposDeGastosService.criar({
          nome: 'Nome teste',
          descricao: '',
          ativa: true,
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
        expect(error.message).toContain('descrição');
      }
    });

    it('deve lançar erro quando nome é duplicado', async () => {
      await TiposDeGastosService.criar({
        nome: 'Nome único',
        descricao: 'Descrição 1',
        ativa: true,
      });

      try {
        await TiposDeGastosService.criar({
          nome: 'Nome único',
          descricao: 'Descrição 2',
          ativa: false,
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
        expect(error.message).toContain('nome');
      }
    });

    it('deve aceitar ativa como verdadeiro', async () => {
      const resultado = await TiposDeGastosService.criar({
        nome: 'Tipo Ativo',
        descricao: 'Tipo ativo',
        ativa: true,
      });

      expect(resultado.ativa).toBe(true);
    });

    it('deve aceitar ativa como falso', async () => {
      const resultado = await TiposDeGastosService.criar({
        nome: 'Tipo Inativo',
        descricao: 'Tipo inativo',
        ativa: false,
      });

      expect(resultado.ativa).toBe(false);
    });

    it('deve lançar erro quando ativa é obrigatório', async () => {
      try {
        await TiposDeGastosService.criar({
          nome: 'Nome teste',
          descricao: 'Descrição teste',
          ativa: undefined as any,
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
      }
    });

    it('deve criar múltiplos tipos de gastos com nomes diferentes', async () => {
      const tipo1 = await TiposDeGastosService.criar({
        nome: 'Tipo 1',
        descricao: 'Descrição 1',
        ativa: true,
      });

      const tipo2 = await TiposDeGastosService.criar({
        nome: 'Tipo 2',
        descricao: 'Descrição 2',
        ativa: false,
      });

      expect(tipo1._id).not.toBe(tipo2._id);
      expect(tipo1.nome).not.toBe(tipo2.nome);
    });
  });

  // =====================
  // LISTAR (4 testes)
  // =====================

  describe('listar', () => {
    it('deve listar todos os tipos de gastos', async () => {
      await TiposDeGastosService.criar({
        nome: 'Tipo 1',
        descricao: 'Descrição 1',
        ativa: true,
      });

      await TiposDeGastosService.criar({
        nome: 'Tipo 2',
        descricao: 'Descrição 2',
        ativa: false,
      });

      const resultado = await TiposDeGastosService.listar();
      expect(resultado.length).toBe(2);
    });

    it('deve filtrar apenas tipos ativos', async () => {
      await TiposDeGastosService.criar({
        nome: 'Ativo',
        descricao: 'Descrição',
        ativa: true,
      });

      await TiposDeGastosService.criar({
        nome: 'Inativo',
        descricao: 'Descrição',
        ativa: false,
      });

      const resultado = await TiposDeGastosService.listar({ ativa: true });
      expect(resultado.length).toBe(1);
      expect(resultado[0].ativa).toBe(true);
    });

    it('deve filtrar apenas tipos inativos', async () => {
      await TiposDeGastosService.criar({
        nome: 'Ativo',
        descricao: 'Descrição',
        ativa: true,
      });

      await TiposDeGastosService.criar({
        nome: 'Inativo',
        descricao: 'Descrição',
        ativa: false,
      });

      const resultado = await TiposDeGastosService.listar({ ativa: false });
      expect(resultado.length).toBe(1);
      expect(resultado[0].ativa).toBe(false);
    });

    it('deve retornar array vazio quando não há tipos', async () => {
      const resultado = await TiposDeGastosService.listar();
      expect(resultado).toEqual([]);
    });
  });

  // =====================
  // BUSCAR POR ID (3 testes)
  // =====================

  describe('buscarPorId', () => {
    it('deve buscar um tipo por ID com sucesso', async () => {
      const criado = await TiposDeGastosService.criar({
        nome: 'Tipo teste',
        descricao: 'Descrição teste',
        ativa: true,
      });

      const resultado = await TiposDeGastosService.buscarPorId(criado._id);
      expect(resultado.nome).toBe('Tipo teste');
      expect(resultado._id).toBe(criado._id);
    });

    it('deve lançar erro quando ID não é encontrado', async () => {
      try {
        await TiposDeGastosService.buscarPorId('507f1f77bcf86cd799439011');
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof NotFoundException).toBe(true);
        expect(error.message).toContain('não encontrado');
      }
    });

    it('deve lançar erro quando ID está vazio', async () => {
      try {
        await TiposDeGastosService.buscarPorId('');
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
        expect(error.message).toContain('obrigatório');
      }
    });
  });

  // =====================
  // ATUALIZAR (4 testes)
  // =====================

  describe('atualizar', () => {
    it('deve atualizar todos os campos', async () => {
      const criado = await TiposDeGastosService.criar({
        nome: 'Original',
        descricao: 'Descrição original',
        ativa: true,
      });

      const resultado = await TiposDeGastosService.atualizar(criado._id, {
        nome: 'Atualizado',
        descricao: 'Descrição atualizada',
        ativa: false,
      });

      expect(resultado.nome).toBe('Atualizado');
      expect(resultado.descricao).toBe('Descrição atualizada');
      expect(resultado.ativa).toBe(false);
    });

    it('deve atualizar apenas alguns campos', async () => {
      const criado = await TiposDeGastosService.criar({
        nome: 'Original',
        descricao: 'Descrição original',
        ativa: true,
      });

      const resultado = await TiposDeGastosService.atualizar(criado._id, {
        descricao: 'Descrição atualizada',
      });

      expect(resultado.nome).toBe('Original');
      expect(resultado.descricao).toBe('Descrição atualizada');
      expect(resultado.ativa).toBe(true);
    });

    it('deve lançar erro quando novo nome é duplicado', async () => {
      await TiposDeGastosService.criar({
        nome: 'Tipo 1',
        descricao: 'Descrição 1',
        ativa: true,
      });

      const tipo2 = await TiposDeGastosService.criar({
        nome: 'Tipo 2',
        descricao: 'Descrição 2',
        ativa: true,
      });

      try {
        await TiposDeGastosService.atualizar(tipo2._id, {
          nome: 'Tipo 1',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
        expect(error.message).toContain('outro');
      }
    });

    it('deve lançar erro quando ID não é encontrado', async () => {
      try {
        await TiposDeGastosService.atualizar('507f1f77bcf86cd799439011', {
          nome: 'Novo nome',
        });
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof NotFoundException).toBe(true);
        expect(error.message).toContain('não encontrado');
      }
    });
  });

  // =====================
  // DELETAR (3 testes)
  // =====================

  describe('deletar', () => {
    it('deve deletar um tipo com sucesso', async () => {
      const criado = await TiposDeGastosService.criar({
        nome: 'Para deletar',
        descricao: 'Será deletado',
        ativa: true,
      });

      const resultado = await TiposDeGastosService.deletar(criado._id);
      expect(resultado._id).toBe(criado._id);

      try {
        await TiposDeGastosService.buscarPorId(criado._id);
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof NotFoundException).toBe(true);
      }
    });

    it('deve lançar erro quando ID não é encontrado', async () => {
      try {
        await TiposDeGastosService.deletar('507f1f77bcf86cd799439011');
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof NotFoundException).toBe(true);
        expect(error.message).toContain('não encontrado');
      }
    });

    it('deve lançar erro quando ID está vazio', async () => {
      try {
        await TiposDeGastosService.deletar('');
        fail('Deveria ter lançado erro');
      } catch (error: any) {
        expect(error instanceof BadRequestException).toBe(true);
        expect(error.message).toContain('obrigatório');
      }
    });
  });
});
