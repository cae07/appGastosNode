import mongoose, { Connection } from 'mongoose';

let connection: Connection | null = null;

export async function connectToDatabase(): Promise<Connection> {
  if (connection) {
    return connection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/app_gastos';

  try {
    const client = await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    connection = client.connection;
    console.log('✓ Conectado ao MongoDB com sucesso');
    return connection;
  } catch (error) {
    console.error('✗ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
    console.log('✓ Desconectado do MongoDB');
  }
}

export default { connectToDatabase, disconnectFromDatabase };
