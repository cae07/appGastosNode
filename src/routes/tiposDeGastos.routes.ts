import { Router } from 'express';
import { TiposDeGastosController } from '../controller/tiposDeGastos.controller';

const router = Router();

router.get('/', TiposDeGastosController.listar);
router.get('/:id', TiposDeGastosController.buscarPorId);
router.post('/', TiposDeGastosController.criar);
router.patch('/:id', TiposDeGastosController.atualizar);
router.delete('/:id', TiposDeGastosController.deletar);

export default router;
