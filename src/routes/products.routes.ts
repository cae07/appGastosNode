import { Router } from 'express';
import { ProductController } from '../controller/products.controller.js';

const productsRoutes = Router();

productsRoutes.get('/', ProductController.listar);
productsRoutes.get('/:id', ProductController.buscarPorId);
productsRoutes.post('/', ProductController.criar);
productsRoutes.patch('/:id', ProductController.atualizar);
productsRoutes.delete('/:id', ProductController.deletar);

export default productsRoutes;
