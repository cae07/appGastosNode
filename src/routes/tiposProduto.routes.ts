import { Router } from 'express';
import { TiposProdutoController } from '../controller/tiposProduto.controller';

const router = Router();

router.get('/', TiposProdutoController.listar);
router.get('/:id', TiposProdutoController.buscarPorId);
router.post('/', TiposProdutoController.criar);
router.patch('/:id', TiposProdutoController.atualizar);
router.delete('/:id', TiposProdutoController.deletar);

export default router;
