import { Request, Response } from 'express';
import LancamentoService from '../services/lancamentos.service.js';
import { handleError } from '../utils/errorHandler.js';
import { CreateLancamentoDTO, UpdateLancamentoDTO, LancamentoFilters } from '../types/lancamentos.types.js';

export class LancamentoController {
  /**
   * GET /lancamentos
   * Lista todos os lançamentos com suporte a filtros e ordenação
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { ano, mes, produtoId, categoria, data_gte, data_lte, _sort, _order } = req.query;

      // Construir objeto de filtros
      const filters: LancamentoFilters = {};

      if (ano !== undefined) {
        const anoNum = Number(ano);
        if (isNaN(anoNum)) {
          res.status(400).json({
            statusCode: 400,
            message: 'O ano deve ser um número válido',
          });
          return;
        }
        filters.ano = anoNum;
      }

      if (mes !== undefined) {
        const mesNum = Number(mes);
        if (isNaN(mesNum)) {
          res.status(400).json({
            statusCode: 400,
            message: 'O mês deve ser um número válido',
          });
          return;
        }
        filters.mes = mesNum;
      }

      if (produtoId !== undefined) {
        filters.produtoId = String(produtoId);
      }

      if (categoria !== undefined) {
        filters.categoria = String(categoria);
      }

      if (data_gte !== undefined) {
        filters.data_gte = String(data_gte);
      }

      if (data_lte !== undefined) {
        filters.data_lte = String(data_lte);
      }

      if (_sort !== undefined) {
        filters._sort = String(_sort);
      }

      if (_order !== undefined) {
        filters._order = String(_order) as 'asc' | 'desc';
      }

      const lancamentos = await LancamentoService.listar(filters);
      res.status(200).json(lancamentos);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * GET /lancamentos/:lancamentoId
   * Busca um lançamento específico pelo ID
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const lancamentoId = Array.isArray(req.params.lancamentoId)
        ? req.params.lancamentoId[0]
        : req.params.lancamentoId;

      const lancamento = await LancamentoService.buscarPorId(lancamentoId);
      res.status(200).json(lancamento);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * POST /lancamentos
   * Cria um novo lançamento
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateLancamentoDTO = req.body;
      const lancamento = await LancamentoService.criar(data);
      res.status(201).json(lancamento);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * PATCH /lancamentos/:lancamentoId
   * Atualiza um lançamento existente
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const lancamentoId = Array.isArray(req.params.lancamentoId)
        ? req.params.lancamentoId[0]
        : req.params.lancamentoId;

      const data: UpdateLancamentoDTO = req.body;
      const lancamento = await LancamentoService.atualizar(lancamentoId, data);
      res.status(200).json(lancamento);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * DELETE /lancamentos/:lancamentoId
   * Deleta um lançamento permanentemente
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const lancamentoId = Array.isArray(req.params.lancamentoId)
        ? req.params.lancamentoId[0]
        : req.params.lancamentoId;

      const lancamento = await LancamentoService.deletar(lancamentoId);
      res.status(200).json(lancamento);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new LancamentoController();
