/**
 * Setup para testes - Configurações de antes/depois dos testes
 * Usa MongoDB em memória para testes isolados
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Aumentar timeout para operações de MongoDB
jest.setTimeout(10000);

// Iniciar servidor MongoDB em memória antes dos testes
beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log('\n✓ MongoDB em memória iniciado para testes');
  } catch (error) {
    console.error('✗ Erro ao iniciar MongoDB em memória:', error);
    throw error;
  }
});

// Limpar e desconectar após todos os testes
afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('✓ MongoDB em memória encerrado');
  } catch (error) {
    console.error('Erro ao encerrar MongoDB:', error);
  }
});
