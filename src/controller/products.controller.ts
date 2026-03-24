import { Request, Response } from 'express';
import { ProductService } from '../services/products.service.js';
import { handleError } from '../utils/errorHandler.js';

export class ProductController {
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const { productType } = req.query;

      const filters: any = {};

      if (productType !== undefined) {
        filters.productType = String(productType);
      }

      const products = await ProductService.listar(filters);

      res.status(200).json(products);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const product = await ProductService.buscarPorId(id);

      res.status(200).json(product);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.criar(req.body);

      res.status(201).json(product);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const product = await ProductService.atualizar(id, req.body);

      res.status(200).json(product);
    } catch (error) {
      handleError(error, res);
    }
  }

  static async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const product = await ProductService.deletar(id);

      res.status(200).json(product);
    } catch (error) {
      handleError(error, res);
    }
  }
}
