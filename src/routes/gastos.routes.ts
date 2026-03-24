import { Router } from 'express';
import GastoController from '../controller/gastos.controller.js';

const router = Router();

/**
 * GET /gastos
 * Lista todos os gastos ou filtra por ano/mês
 * Query params: ?ano=2024&mes=3
 */
router.get('/', (req, res) => GastoController.listar(req, res));

/**
 * GET /gastos/:gastoId
 * Busca um gasto específico pelo ID
 */
router.get('/:gastoId', (req, res) => GastoController.buscarPorId(req, res));

/**
 * POST /gastos
 * Cria um novo gasto
 * Body: { descricao: string, valor: number, tipoGastoId: string, ano?: number, mes?: number }
 */
router.post('/', (req, res) => GastoController.criar(req, res));

/**
 * PATCH /gastos/:gastoId
 * Atualiza um gasto existente
 * Body: { descricao?: string, valor?: number, tipoGastoId?: string, ano?: number, mes?: number }
 */
router.patch('/:gastoId', (req, res) => GastoController.atualizar(req, res));

/**
 * DELETE /gastos/:gastoId
 * Deleta um gasto permanentemente
 */
router.delete('/:gastoId', (req, res) => GastoController.deletar(req, res));

export default router;
