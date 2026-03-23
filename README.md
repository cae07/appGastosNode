# App Gastos Backend

Um backend robusto e escalável para gerenciamento de gastos e embalagens, construído com Node.js, TypeScript e Express, preparado para deploy em ambientes serverless como Vercel.

## 📋 Descrição da Solução

O **App Gastos Backend** é um sistema completo de API REST que oferece funcionalidades para:

- ✅ **Gerenciamento de Embalagens**: CRUD completo com filtros por status
- 📊 **Gestão de Gastos**: (Documentação preparada para implementação futura)
- 🔒 **Validações Robustas**: Validações complexas em todos os endpoints
- 🗄️ **Persistência com MongoDB**: Integração com Mongoose ODM
- 🧪 **Testes Unitários**: Cobertura com Jest
- ⚡ **Serverless Ready**: Otimizado para Vercel Functions

## 🛠️ Tecnologias Utilizadas

### Backend Stack
- **Node.js v18+** - Runtime JavaScript
- **TypeScript 5.9** - Tipagem estática
- **Express 5.2** - Framework web
- **Mongoose 9.3** - ODM para MongoDB
- **Jest 30.2** - Framework de testes
- **tsx/ts-node** - Executores TypeScript

### Infraestrutura
- **MongoDB** - Banco de dados NoSQL
- **Vercel** - Plataforma de deploy serverless

## 📁 Estrutura do Projeto

```
src/
├── api/
│   └── handler.ts              # Entry point para Vercel Functions
├── controller/
│   └── embalagens.controller.ts # Controladores HTTP
├── routes/
│   └── embalagens.routes.ts     # Definição de rotas
├── services/
│   └── embalagens.service.ts    # Lógica de negócio
├── model/
│   └── embalagens.model.ts      # Schemas Mongoose
├── types/
│   └── embalagens.types.ts      # Interfaces e tipos
├── utils/
│   ├── api.ts                   # Conexão com MongoDB
│   ├── errorHandler.ts          # Tratamento de erros
│   └── toClient.ts              # Transformação de dados
└── index.ts                     # Aplicação principal

_tests_/
├── embalagens.test.ts           # Testes unitários

dist/                            # Output TypeScript compilado
```

## 🚀 Como Usar

### Instalação Local

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/appGastosBackend.git
cd appGastosBackend

# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais MongoDB
```

### Variáveis de Ambiente

```env
# MongoDB Connection String (MongoDB Atlas recomendado)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/app_gastos?retryWrites=true&w=majority

# Port do servidor (local)
PORT=3000

# Environment
NODE_ENV=development
```

### Executar Localmente

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção (compilar e rodar)
npm run build
npm run start
```

### Executar Testes

```bash
# Rodar testes uma vez
npm test

# Rodar testes em modo watch
npm run test:watch
```

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

### Endpoints Disponíveis

#### Health Check
```bash
GET /health
# Resposta: { status: 'OK', mensagem: '...', timestamp: '...' }
```

#### Embalagens - CRUD Completo
```bash
# Listar todas (com filtro opcional por status)
GET /embalagens?ativa=true

# Buscar por ID
GET /embalagens/:id

# Criar nova embalagem
POST /embalagens
# Body: { quantidade: number, ativa: boolean }

# Atualizar embalagem
PATCH /embalagens/:id
# Body: { quantidade?: number, ativa?: boolean }

# Deletar embalagem
DELETE /embalagens/:id
```

Para mais detalhes sobre os endpoints, consulte:
- [Documentação de Embalagens](./IMPLEMENTACAO_EMBALAGENS.md)
- [Exemplos de Requisições](./EXEMPLOS_REQUISICOES.md)

## 🚢 Deploy no Vercel

### Pré-requisitos
- Conta no Vercel (https://vercel.com)
- Repositório GitHub
- MongoDB Atlas (ou outro MongoDB cloud)

### Passos para Deploy

1. **Preparar variáveis de ambiente no Vercel:**
   ```bash
   MONGODB_URI: mongodb+srv://...
   NODE_ENV: production
   ```

2. **Conectar repositório ao Vercel:**
   - Acesse https://vercel.com/new
   - Selecione seu repositório GitHub
   - Configure as variáveis de ambiente
   - Deploy!

3. **Verificar deployment:**
   ```bash
   curl https://seu-projeto.vercel.app/health
   ```

### Configuração (vercel.json)
O arquivo `vercel.json` já está configurado com:
- Build command: `npm run build`
- Output directory: `dist`
- Serverless functions otimizadas
- Rewrites automáticas para Express

## ✅ Checklist de Deploy

- [x] tsconfig.json corrigido (rootDir e ignoreDeprecations)
- [x] vercel.json criado com configurações serverless
- [x] .env.example fornecido
- [x] src/index.ts refatorado para serverless
- [x] src/api/handler.ts criado para Vercel Functions
- [x] package.json atualizado com @vercel/node
- [x] CORS headers configurados
- [x] Rota de health check implementada
- [x] Tratamento de erros robusto
- [x] Testes unitários disponíveis
- [ ] Module de Gastos completar implementação
- [ ] Documentação de Gastos revisar antes do deploy

## 🧪 Testes

O projeto inclui testes unitários com Jest:

```bash
# Ran testes com cobertura
npm test -- --coverage

# Testes específicos
npm test -- embalagens.test.ts
```

## 📝 Padrões de Código

- **OOP**: Classes para controllers, services e models
- **DTO Pattern**: Interfaces para tipos de dados
- **Error Handling**: Exceções tipadas e tratamento centralizado
- **Validação**: Validadores reutilizáveis
- **Middleware**: Pipeline de middleware padrão Express

## 🔐 Segurança

- ✅ CORS habilitado
- ✅ Validação de entrada em todos os endpoints
- ✅ Tratamento de erros sem exposição de stack trace em produção
- ✅ MongoDB com autenticação (ao usar Atlas)
- ⚠️ **TODO**: Adicionar JWT/autenticação quando necessário

## 📚 Contribuição

Para contribuir com este projeto:

1. Faça um fork
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
6. Mantenha os testes atualizados
7. Siga os padrões de código do projeto

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

**Caê Calçolari** - Desenvolvedor Full Stack

---

**Última atualização:** Março 2026
**Versão:** 1.0.0
