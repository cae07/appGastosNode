import { Request, Response } from 'express';
import GastoService from '../services/gastos.service.js';
import { handleError } from '../utils/errorHandler.js';
import { CreateGastoDTO, UpdateGastoDTO } from '../types/gastos.types.js';

export class GastoController {
  /**
   * GET /gastos
   * Lista todos os gastos ou filtra por ano/mês
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { ano, mes } = req.query;

      // Converter strings de query para números
      let anoFilter: number | undefined;
      let mesFilter: number | undefined;

      if (ano !== undefined) {
        anoFilter = Number(ano);
        if (isNaN(anoFilter)) {
          res.status(400).json({
            statusCode: 400,
            message: 'O ano deve ser um número válido',
          });
          return;
        }
      }

      if (mes !== undefined) {
        mesFilter = Number(mes);
        if (isNaN(mesFilter)) {
          res.status(400).json({
            statusCode: 400,
            message: 'O mês deve ser um número válido',
          });
          return;
        }
      }

      const gastos = await GastoService.listar(anoFilter, mesFilter);
      res.status(200).json(gastos);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * GET /gastos/:gastoId
   * Busca um gasto específico pelo ID
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const gastoId = Array.isArray(req.params.gastoId)
        ? req.params.gastoId[0]
        : req.params.gastoId;

      const gasto = await GastoService.buscarPorId(gastoId);
      res.status(200).json(gasto);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * POST /gastos
   * Cria um novo gasto
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateGastoDTO = req.body;
      const gasto = await GastoService.criar(data);
      res.status(201).json(gasto);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * PATCH /gastos/:gastoId
   * Atualiza um gasto existente
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const gastoId = Array.isArray(req.params.gastoId)
        ? req.params.gastoId[0]
        : req.params.gastoId;

      const data: UpdateGastoDTO = req.body;
      const gasto = await GastoService.atualizar(gastoId, data);
      res.status(200).json(gasto);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * DELETE /gastos/:gastoId
   * Deleta um gasto permanentemente
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const gastoId = Array.isArray(req.params.gastoId)
        ? req.params.gastoId[0]
        : req.params.gastoId;

      const gasto = await GastoService.deletar(gastoId);
      res.status(200).json(gasto);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new GastoController();
