import { Request, Response } from 'express';
import EmbalagemService from '../services/embalagens.service';
import { handleError } from '../utils/errorHandler';
import {
  CreateEmbalagemDTO,
  UpdateEmbalagemDTO,
} from '../types/embalagens.types';

export class EmbalagemController {
  /**
   * GET /embalagens
   * Lista todas as embalagens ou filtra por status
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const { ativa } = req.query;

      // Converter string 'true'/'false' para boolean
      let ativaFilter: boolean | undefined;
      if (ativa !== undefined) {
        ativaFilter = ativa === 'true';
      }

      const embalagens = await EmbalagemService.listarEmbalagens(ativaFilter);
      res.status(200).json(embalagens);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * GET /embalagens/:id
   * Busca uma embalagem específica
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const embalagem = await EmbalagemService.buscarPorId(id);
      res.status(200).json(embalagem);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * POST /embalagens
   * Cria uma nova embalagem
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateEmbalagemDTO = req.body;
      const embalagem = await EmbalagemService.criar(data);
      res.status(201).json(embalagem);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * PATCH /embalagens/:id
   * Atualiza uma embalagem existente
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const data: UpdateEmbalagemDTO = req.body;
      const embalagem = await EmbalagemService.atualizar(id, data);
      res.status(200).json(embalagem);
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * DELETE /embalagens/:id
   * Deleta uma embalagem
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const embalagem = await EmbalagemService.deletar(id);
      res.status(200).json(embalagem);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new EmbalagemController();
