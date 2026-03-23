/**
 * Testes para a API de Embalagens
 * Execute com: npm run test:watch
 */

import EmbalagemService from '../src/services/embalagens.service';
import EmbalagemModel from '../src/model/embalagens.model';

describe('EmbalagemService', () => {
  // Limpar banco antes de cada teste
  afterEach(async () => {
    await EmbalagemModel.deleteMany({});
  });

  describe('criar', () => {
    it('deve criar uma embalagem com sucesso', async () => {
      const data = { quantidade: 100, ativa: true };
      const embalagem = await EmbalagemService.criar(data);

      expect(embalagem).toHaveProperty('_id');
      expect(embalagem.quantidade).toBe(100);
      expect(embalagem.ativa).toBe(true);
    });

    it('deve lançar erro se quantidade não fornecida', async () => {
      const data = { quantidade: undefined, ativa: true } as any;

      await expect(EmbalagemService.criar(data)).rejects.toThrow(
        'O campo "quantidade" é obrigatório'
      );
    });

    it('deve lançar erro se ativa não fornecida', async () => {
      const data = { quantidade: 100, ativa: undefined } as any;

      await expect(EmbalagemService.criar(data)).rejects.toThrow(
        'O campo "ativa" é obrigatório'
      );
    });
  });

  describe('listarEmbalagens', () => {
    it('deve listar todas as embalagens', async () => {
      await EmbalagemService.criar({ quantidade: 100, ativa: true });
      await EmbalagemService.criar({ quantidade: 50, ativa: false });

      const embalagens = await EmbalagemService.listarEmbalagens();

      expect(embalagens).toHaveLength(2);
    });

    it('deve filtrar embalagens ativas', async () => {
      await EmbalagemService.criar({ quantidade: 100, ativa: true });
      await EmbalagemService.criar({ quantidade: 50, ativa: false });

      const embalagens = await EmbalagemService.listarEmbalagens(true);

      expect(embalagens).toHaveLength(1);
      expect(embalagens[0].ativa).toBe(true);
    });

    it('deve filtrar embalagens inativas', async () => {
      await EmbalagemService.criar({ quantidade: 100, ativa: true });
      await EmbalagemService.criar({ quantidade: 50, ativa: false });

      const embalagens = await EmbalagemService.listarEmbalagens(false);

      expect(embalagens).toHaveLength(1);
      expect(embalagens[0].ativa).toBe(false);
    });
  });

  describe('buscarPorId', () => {
    it('deve encontrar uma embalagem pelo ID', async () => {
      const criada = await EmbalagemService.criar({
        quantidade: 100,
        ativa: true,
      });
      const encontrada = await EmbalagemService.buscarPorId(criada._id);

      expect(encontrada._id).toBe(criada._id);
      expect(encontrada.quantidade).toBe(100);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      await expect(
        EmbalagemService.buscarPorId('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Embalagem com id 507f1f77bcf86cd799439011 não encontrada');
    });

    it('deve lançar erro se ID inválido', async () => {
      await expect(
        EmbalagemService.buscarPorId('invalid-id')
      ).rejects.toThrow('ID inválido');
    });
  });

  describe('atualizar', () => {
    it('deve atualizar uma embalagem', async () => {
      const criada = await EmbalagemService.criar({
        quantidade: 100,
        ativa: true,
      });

      const atualizada = await EmbalagemService.atualizar(criada._id, {
        quantidade: 200,
        ativa: false,
      });

      expect(atualizada.quantidade).toBe(200);
      expect(atualizada.ativa).toBe(false);
    });

    it('deve permitir atualizar apenas quantidade', async () => {
      const criada = await EmbalagemService.criar({
        quantidade: 100,
        ativa: true,
      });

      const atualizada = await EmbalagemService.atualizar(criada._id, {
        quantidade: 150,
      });

      expect(atualizada.quantidade).toBe(150);
      expect(atualizada.ativa).toBe(true);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      await expect(
        EmbalagemService.atualizar('507f1f77bcf86cd799439011', {
          quantidade: 200,
        })
      ).rejects.toThrow('Embalagem com id 507f1f77bcf86cd799439011 não encontrada');
    });
  });

  describe('deletar', () => {
    it('deve deletar uma embalagem', async () => {
      const criada = await EmbalagemService.criar({
        quantidade: 100,
        ativa: true,
      });

      await EmbalagemService.deletar(criada._id);

      await expect(
        EmbalagemService.buscarPorId(criada._id)
      ).rejects.toThrow();
    });

    it('deve retornar a embalagem deletada', async () => {
      const criada = await EmbalagemService.criar({
        quantidade: 100,
        ativa: true,
      });

      const deletada = await EmbalagemService.deletar(criada._id);

      expect(deletada._id).toBe(criada._id);
      expect(deletada.quantidade).toBe(100);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      await expect(
        EmbalagemService.deletar('507f1f77bcf86cd799439011')
      ).rejects.toThrow('Embalagem com id 507f1f77bcf86cd799439011 não encontrada');
    });
  });
});
