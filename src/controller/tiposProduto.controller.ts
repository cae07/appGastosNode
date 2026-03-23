import { Request, Response } from 'express';
import { TiposProdutoService } from '../services/tiposProduto.service';
import { handleError } from '../utils/errorHandler';

export class TiposProdutoController {
  static async listar(req: Request, res: Response) {
    try {
      const { ativa } = req.query;

      const filters: any = {};

      if (ativa !== undefined) {
        filters.ativa = ativa === 'true' ? true : false;
      }

      const tiposProduto = await TiposProdutoService.listar(filters);
      res.status(200).json(tiposProduto);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async buscarPorId(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const tiposProduto = await TiposProdutoService.buscarPorId(id);
      res.status(200).json(tiposProduto);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, ativa } = req.body;
      const tiposProduto = await TiposProdutoService.criar({
        nome,
        descricao,
        ativa,
      });
      res.status(201).json(tiposProduto);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async atualizar(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { nome, descricao, ativa } = req.body;
      const tiposProduto = await TiposProdutoService.atualizar(id, {
        nome,
        descricao,
        ativa,
      });
      res.status(200).json(tiposProduto);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async deletar(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const tiposProduto = await TiposProdutoService.deletar(id);
      res.status(200).json(tiposProduto);
    } catch (error) {
      handleError(error, res);
    }
  }
}
