/**
 * 
 * @param doc 
 * @returns any
 */

export function toClient(doc: any): Record<string, any> | null {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  return {
    id: _id.toString(),
    ...rest,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
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
