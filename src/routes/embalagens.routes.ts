import { Router } from 'express';
import EmbalagemController from '../controller/embalagens.controller.js';

const router = Router();

/**
 * GET /embalagens
 * Lista todas as embalagens ou filtra por status
 * Query params: ?ativa=true|false
 */
router.get('/', (req, res) => EmbalagemController.listar(req, res));

/**
 * GET /embalagens/:id
 * Busca uma embalagem específica pelo ID
 */
router.get('/:id', (req, res) => EmbalagemController.buscarPorId(req, res));

/**
 * POST /embalagens
 * Cria uma nova embalagem
 * Body: { quantidade: number, ativa: boolean }
 */
router.post('/', (req, res) => EmbalagemController.criar(req, res));

/**
 * PATCH /embalagens/:id
 * Atualiza uma embalagem existente
 * Body: { quantidade?: number, ativa?: boolean }
 */
router.patch('/:id', (req, res) => EmbalagemController.atualizar(req, res));

/**
 * DELETE /embalagens/:id
 * Deleta uma embalagem
 */
router.delete('/:id', (req, res) => EmbalagemController.deletar(req, res));

export default router;
