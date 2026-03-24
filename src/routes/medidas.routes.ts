import { Router } from 'express';
import { MedidaController } from '../controller/medidas.controller.js';

const medidasRoutes = Router();

medidasRoutes.get('/', MedidaController.listar);
medidasRoutes.get('/:id', MedidaController.buscarPorId);
medidasRoutes.post('/', MedidaController.criar);
medidasRoutes.patch('/:id', MedidaController.atualizar);
medidasRoutes.delete('/:id', MedidaController.deletar);

export default medidasRoutes;
