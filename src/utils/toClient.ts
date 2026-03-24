/**
 * 
 * @param doc 
 * @returns any
 */

export function toClient(doc: any): Record<string, any> | null {
  if (!doc) return null;
  
  // Extrai _doc se existir (padrão mongoose com propriedades internas)
  const data = doc._doc || doc;
  const { _id, __v, ...rest } = data;
  
  return {
    id: _id.toString(),
    ...rest,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : data.createdAt?.toISOString?.(),
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : data.updatedAt?.toISOString?.()
  }
}

/**
 * 
 * @param docs 
 * @returns any[]
 */

export function toClientArray(docs: any[]): Record<string, any>[] {
  return docs.map(doc => toClient(doc)!);
}
