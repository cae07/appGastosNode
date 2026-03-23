import LancamentoService from '../src/services/lancamentos.service';
import LancamentoModel from '../src/model/lancamentos.model';
import { BadRequestException, NotFoundException } from '../src/utils/errorHandler';
import { CreateLancamentoDTO } from '../src/types/lancamentos.types';

describe('LancamentoService', () => {
  const validLancamento = {
    produtoName: 'Martelo profissional',
    quantity: 10,
    value: 250.50,
    ano: 2024,
    mes: 3,
    embalagemId: '507f1f77bcf86cd799439011',
    categoria: 'Compras',
    mesNome: 'Março',
    medidaId: '507f1f77bcf86cd799439012',
    tipoProdutoId: '507f1f77bcf86cd799439013',
  };

  beforeEach(async () => {
    // Limpar base antes de cada teste
    await LancamentoModel.deleteMany({});
  });

  describe('criar', () => {
    it('deve criar um lançamento com sucesso', async () => {
      const resultado = await LancamentoService.criar(validLancamento);

      expect(resultado).toHaveProperty('_id');
      expect(resultado.produtoName).toBe('Martelo profissional');
      expect(resultado.quantity).toBe(10);
      expect(resultado.value).toBe(250.50);
      expect(resultado.ano).toBe(2024);
      expect(resultado.mes).toBe(3);
    });

    it('deve validar campos obrigatórios em criação', async () => {
      const incompleto = {
        produtoName: 'Produto',
        quantity: 10,
        // Falta os outros campos
      } as CreateLancamentoDTO;

      await expect(LancamentoService.criar(incompleto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar quantidade positiva', async () => {
      const dados = { ...validLancamento, quantity: 0 };
      await expect(LancamentoService.criar(dados)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar valor positivo', async () => {
      const dados = { ...validLancamento, value: -10 };
      await expect(LancamentoService.criar(dados)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar ano no intervalo 1900-2100', async () => {
      const dados = { ...validLancamento, ano: 1800 };
      await expect(LancamentoService.criar(dados)).rejects.toThrow(
        BadRequestException
      );
    });

    it('deve validar mês entre 1-12', async () => {
      const dados = { ...validLancamento, mes: 13 };
      await expect(LancamentoService.criar(dados)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('listar', () => {
    it('deve listar todos os lançamentos', async () => {
      await LancamentoService.criar(validLancamento);
      await LancamentoService.criar({
        ...validLancamento,
        produtoName: 'Chave inglesa',
      });

      const resultado = await LancamentoService.listar({});

      expect(resultado).toHaveLength(2);
    });

    it('deve filtrar por ano', async () => {
      await LancamentoService.criar(validLancamento);
      await LancamentoService.criar({
        ...validLancamento,
        ano: 2025,
        produtoName: 'Outro produto',
      });

      const resultado = await LancamentoService.listar({ ano: 2024 });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].ano).toBe(2024);
    });

    it('deve filtrar por mês', async () => {
      await LancamentoService.criar(validLancamento);
      await LancamentoService.criar({
        ...validLancamento,
        mes: 4,
        produtoName: 'Outro produto',
      });

      const resultado = await LancamentoService.listar({ mes: 3 });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].mes).toBe(3);
    });

    it('deve filtrar por categoria', async () => {
      await LancamentoService.criar(validLancamento);
      await LancamentoService.criar({
        ...validLancamento,
        categoria: 'Vendas',
        produtoName: 'Outro produto',
      });

      const resultado = await LancamentoService.listar({ categoria: 'Compras' });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].categoria).toBe('Compras');
    });

    it('deve filtrar combinando ano e mês', async () => {
      await LancamentoService.criar(validLancamento);
      await LancamentoService.criar({
        ...validLancamento,
        ano: 2024,
        mes: 4,
        produtoName: 'Outro produto',
      });
      await LancamentoService.criar({
        ...validLancamento,
        ano: 2025,
        mes: 3,
        produtoName: 'Terceiro produto',
      });

      const resultado = await LancamentoService.listar({ ano: 2024, mes: 3 });

      expect(resultado).toHaveLength(1);
      expect(resultado[0].ano).toBe(2024);
      expect(resultado[0].mes).toBe(3);
    });

    it('deve ordenar por campo e ordem', async () => {
      await LancamentoService.criar({
        ...validLancamento,
        value: 100,
      });
      await LancamentoService.criar({
        ...validLancamento,
        value: 200,
        produtoName: 'Segundo',
      });
      await LancamentoService.criar({
        ...validLancamento,
        value: 150,
        produtoName: 'Terceiro',
      });

      const resultadoAsc = await LancamentoService.listar({
        _sort: 'value',
        _order: 'asc',
      });

      expect(resultadoAsc[0].value).toBe(100);
      expect(resultadoAsc[1].value).toBe(150);
      expect(resultadoAsc[2].value).toBe(200);
    });

    it('deve ordenar descendente', async () => {
      await LancamentoService.criar({
        ...validLancamento,
        value: 100,
      });
      await LancamentoService.criar({
        ...validLancamento,
        value: 200,
        produtoName: 'Segundo',
      });

      const resultado = await LancamentoService.listar({
        _sort: 'value',
        _order: 'desc',
      });

      expect(resultado[0].value).toBe(200);
      expect(resultado[1].value).toBe(100);
    });
  });

  describe('buscarPorId', () => {
    it('deve encontrar um lançamento pelo ID', async () => {
      const criado = await LancamentoService.criar(validLancamento);
      const resultado = await LancamentoService.buscarPorId(criado._id);

      expect(resultado._id).toBe(criado._id);
      expect(resultado.produtoName).toBe(validLancamento.produtoName);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      const fakeId = '507f1f77bcf86cd799439999';

      await expect(LancamentoService.buscarPorId(fakeId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('deve lançar erro se ID inválido', async () => {
      await expect(LancamentoService.buscarPorId('id-invalido')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um lançamento', async () => {
      const criado = await LancamentoService.criar(validLancamento);
      const atualizado = await LancamentoService.atualizar(criado._id, {
        quantity: 20,
        value: 300,
      });

      expect(atualizado.quantity).toBe(20);
      expect(atualizado.value).toBe(300);
      expect(atualizado.produtoName).toBe(validLancamento.produtoName);
    });

    it('deve permitir atualizar apenas alguns campos', async () => {
      const criado = await LancamentoService.criar(validLancamento);
      const atualizado = await LancamentoService.atualizar(criado._id, {
        quantity: 30,
      });

      expect(atualizado.quantity).toBe(30);
      expect(atualizado.value).toBe(validLancamento.value);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      const fakeId = '507f1f77bcf86cd799439999';

      await expect(
        LancamentoService.atualizar(fakeId, { quantity: 10 })
      ).rejects.toThrow(NotFoundException);
    });

    it('deve validar dados na atualização', async () => {
      const criado = await LancamentoService.criar(validLancamento);

      await expect(
        LancamentoService.atualizar(criado._id, { mes: 13 })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deletar', () => {
    it('deve deletar um lançamento', async () => {
      const criado = await LancamentoService.criar(validLancamento);
      const deletado = await LancamentoService.deletar(criado._id);

      expect(deletado._id).toBe(criado._id);

      // Verificar que foi realmente deletado
      await expect(LancamentoService.buscarPorId(criado._id)).rejects.toThrow(
        NotFoundException
      );
    });

    it('deve retornar o lançamento deletado', async () => {
      const criado = await LancamentoService.criar(validLancamento);
      const deletado = await LancamentoService.deletar(criado._id);

      expect(deletado.produtoName).toBe(criado.produtoName);
      expect(deletado.quantity).toBe(criado.quantity);
    });

    it('deve lançar erro se ID não encontrado', async () => {
      const fakeId = '507f1f77bcf86cd799439999';

      await expect(LancamentoService.deletar(fakeId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
