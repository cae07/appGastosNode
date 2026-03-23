import express, { Express } from 'express';
import { connectToDatabase } from './utils/api';
import embalagenRoutes from './routes/embalagens.routes';
import gastosRoutes from './routes/gastos.routes';
import lancamentosRoutes from './routes/lancamentos.routes';
import medidasRoutes from './routes/medidas.routes';
import productsRoutes from './routes/products.routes';
import tiposDeGastosRoutes from './routes/tiposDeGastos.routes';
import tiposProdutoRoutes from './routes/tiposProduto.routes';

export const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco na primeira requisição
let dbConnected = false;

app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (error) {
      console.error('Erro ao conectar ao banco:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Falha ao conectar ao banco de dados',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
      }
    }
  }
  next();
});

// Rotas
app.use('/embalagens', embalagenRoutes);
app.use('/gastos', gastosRoutes);
app.use('/lancamentos', lancamentosRoutes);
app.use('/medidas', medidasRoutes);
app.use('/products', productsRoutes);
app.use('/tiposDeGastos', tiposDeGastosRoutes);
app.use('/tiposProduto', tiposProdutoRoutes);

// Rota de saúde
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK',
    mensagem: 'Servidor funcionando normalmente',
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (_req, res) => {
  res.json({
    api: 'App Gastos Backend',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      embalagens: '/embalagens',
      gastos: '/gastos',
      lancamentos: '/lancamentos',
      medidas: '/medidas',
      products: '/products',
      tiposDeGastos: '/tiposDeGastos',
      tiposProduto: '/tiposProduto'
    }
  });
});

// Iniciar servidor apenas se não estiver em ambiente serverless
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default app;
