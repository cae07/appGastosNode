import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import { connectToDatabase } from './utils/api.js';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
import embalagenRoutes from './routes/embalagens.routes';
import gastosRoutes from './routes/gastos.routes';
import lancamentosRoutes from './routes/lancamentos.routes';
import medidasRoutes from './routes/medidas.routes';
import productsRoutes from './routes/products.routes';
import tiposDeGastosRoutes from './routes/tiposDeGastos.routes';
import tiposProdutoRoutes from './routes/tiposProduto.routes';

export const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Permite requisições de qualquer origem
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de saúde (antes do middleware de conexão)
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK',
    mensagem: 'Servidor funcionando normalmente'
  });
});

// Conectar ao banco na primeira requisição (lazy connection)
let dbConnected = false;
let connectionError: Error | null = null;

app.use(async (req, res, next) => {
  // Pular conexão para health check
  if (req.path === '/health' || req.path === '/') {
    return next();
  }

  // Se já possui erro persistente de conexão, retorna erro
  if (connectionError && dbConnected === false) {
    console.error('Erro persistente de conexão ao MongoDB');
    return res.status(503).json({
      error: 'Serviço indisponível',
      message: 'Falha ao conectar ao banco de dados. Tente novamente em alguns momentos.',
      timestamp: new Date().toISOString(),
    });
  }

  // Conecta apenas uma vez
  if (!dbConnected) {
    try {
      console.log('Iniciando conexão com o banco.');
      
      await connectToDatabase();
      dbConnected = true;
      connectionError = null;
    } catch (error) {
      connectionError = error instanceof Error ? error : new Error(String(error));
      console.error('Erro ao conectar ao banco na primeira requisição:', error);
      
      return res.status(503).json({
        error: 'Falha ao conectar ao banco de dados',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
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
