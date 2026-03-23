import { Request, Response } from 'express';
import { MedidaService } from '../services/medidas.service';
import { handleError } from '../utils/errorHandler';

export class MedidaController {
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const { ativa } = req.query;

      const filters: any = {};

      // Converter string para booleano se fornecido
      if (ativa !== undefined) {
        filters.ativa = ativa === 'true';
      }

      const medidas = await MedidaService.listar(filters);

      res.status(200).json(medidas);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const medida = await MedidaService.buscarPorId(id);

      res.status(200).json(medida);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const medida = await MedidaService.criar(req.body);

      res.status(201).json(medida);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const medida = await MedidaService.atualizar(id, req.body);

      res.status(200).json(medida);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const medida = await MedidaService.deletar(id);

      res.status(200).json(medida);
    } catch (error) {
      handleError(error, res);
    }
  }
}
