import { Router } from 'express';
import LancamentoController from '../controller/lancamentos.controller.js';

const router = Router();

/**
 * GET /lancamentos
 * Lista todos os lançamentos com suporte a filtros e ordenação
 * Query params: ?ano=2024&mes=3&categoria=Compras&_sort=value&_order=desc
 */
router.get('/', (req, res) => LancamentoController.listar(req, res));

/**
 * GET /lancamentos/:lancamentoId
 * Busca um lançamento específico pelo ID
 */
router.get('/:lancamentoId', (req, res) => LancamentoController.buscarPorId(req, res));

/**
 * POST /lancamentos
 * Cria um novo lançamento
 * Body: { produtoName, quantity, value, ano, mes, embalagemId, categoria, mesNome, medidaId, tipoProdutoId }
 */
router.post('/', (req, res) => LancamentoController.criar(req, res));

/**
 * PATCH /lancamentos/:lancamentoId
 * Atualiza um lançamento existente
 * Body: { todos os campos opcionais }
 */
router.patch('/:lancamentoId', (req, res) => LancamentoController.atualizar(req, res));

/**
 * DELETE /lancamentos/:lancamentoId
 * Deleta um lançamento permanentemente
 */
router.delete('/:lancamentoId', (req, res) => LancamentoController.deletar(req, res));

export default router;
