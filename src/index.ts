import express, { Express } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas

// Rota de saúde
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', mensagem: 'Servidor funcionando normalmente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
