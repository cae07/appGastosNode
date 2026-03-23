import { Response } from 'express';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundException extends ApiError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundException';
  }
}

export class BadRequestException extends ApiError {
  constructor(message: string) {
    super(400, message);
    this.name = 'BadRequestException';
  }
}

export class InternalServerException extends ApiError {
  constructor(message: string) {
    super(500, message);
    this.name = 'InternalServerException';
  }
}

/**
 * Função para tratamento de erros e envio da resposta
 */
export function handleError(error: unknown, res: Response): void {
  console.error('Erro:', error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    });
  } else if (error instanceof Error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Erro ao processar embalagem',
    });
  } else {
    res.status(500).json({
      statusCode: 500,
      message: 'Erro desconhecido',
    });
  }
}
