import mongoose, { Connection } from 'mongoose';

let connection: Connection | null = null;
let isConnecting = false;
let connectionPromise: Promise<Connection> | null = null;

export async function connectToDatabase(
  maxRetries = 3,
  retryDelay = 1000
): Promise<Connection> {
  // Se já está conectado, retorna conexão existente
  if (connection && mongoose.connection.readyState === 1) {
    return connection;
  }

  // Se já está tentando conectar, espera pela promessa anterior
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  isConnecting = true;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/app_gastos';
  
  const attemptConnection = async (attempt: number): Promise<Connection> => {
    try {
      const client = await mongoose.connect(mongoUri, {
        retryWrites: true,
        w: 'majority',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      connection = client.connection;
      console.log('✓ Conectado ao MongoDB com sucesso');
      return connection;
    } catch (error) {
      if (attempt < maxRetries) {
        console.warn(
          `⚠ Erro ao conectar ao MongoDB (tentativa ${attempt}/${maxRetries}):`,
          error instanceof Error ? error.message : String(error)
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
        return attemptConnection(attempt + 1);
      } else {
        console.error(
          '✗ Falha ao conectar ao MongoDB após',
          maxRetries,
          'tentativas:',
          error
        );
        throw error;
      }
    }
  };

  try {
    connectionPromise = attemptConnection(1);
    const result = await connectionPromise;
    return result;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      connection = null;
      console.log('✓ Desconectado do MongoDB');
    }
  } catch (error) {
    console.error('✗ Erro ao desconectar do MongoDB:', error);
  }
}

export default { connectToDatabase, disconnectFromDatabase };
