import { Request, Response } from 'express';
import { TiposDeGastosService } from '../services/tiposDeGastos.service.js';
import { handleError } from '../utils/errorHandler.js';

export class TiposDeGastosController {
  static async listar(req: Request, res: Response) {
    try {
      const { ativa } = req.query;

      const filters: any = {};

      if (ativa !== undefined) {
        filters.ativa = ativa === 'true' ? true : false;
      }

      const tiposDeGastos = await TiposDeGastosService.listar(filters);
      res.status(200).json(tiposDeGastos);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async buscarPorId(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const tiposDeGastos = await TiposDeGastosService.buscarPorId(id);
      res.status(200).json(tiposDeGastos);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, ativa } = req.body;
      const tiposDeGastos = await TiposDeGastosService.criar({
        nome,
        descricao,
        ativa,
      });
      res.status(201).json(tiposDeGastos);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async atualizar(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { nome, descricao, ativa } = req.body;
      const tiposDeGastos = await TiposDeGastosService.atualizar(id, {
        nome,
        descricao,
        ativa,
      });
      res.status(200).json(tiposDeGastos);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async deletar(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const tiposDeGastos = await TiposDeGastosService.deletar(id);
      res.status(200).json(tiposDeGastos);
    } catch (error) {
      handleError(error, res);
    }
  }
}
