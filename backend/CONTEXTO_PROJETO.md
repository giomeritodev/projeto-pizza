# Contexto do Projeto — Backend (proj_pizza)

Este documento descreve a arquitetura, organização, endpoints, dependências e principais decisões do backend.

**Arquitetura**
- Padrão: Rotas -> Controller -> Services -> Banco de Dados
- Fluxo: a rota recebe a requisição, o `Controller` extrai dados e chama o `Service`. O `Service` contém a lógica de negócio, comunica com o Prisma (BD) e devolve o resultado para o `Controller`, que responde ao cliente.

**Endpoints principais**
- POST /users — Cria usuário (Rota pública)
- POST /session — Autenticação / login (Rota pública)
- GET /me — Detalhes do usuário logado (Requer `isAuthenticated`)
- POST /category — Cria categoria (Requer `isAuthenticated` e `isAdmin`)
- GET /category — Lista categorias (Requer `isAuthenticated`)

Arquivo de rotas: `src/routes.ts`

**Organização de pastas (resumo)**
- src/
  - controllers/ — controllers por recurso (ex.: `category`, `user`)
  - services/ — lógica de negócio por recurso
  - middlewares/ — `isAuthenticated`, `isAdmin`, `validateSchema`
  - schemas/ — validações Zod (ex.: `userSchema.ts`, `categorySchema.ts`)
  - prisma/ — inicialização do Prisma client (`src/prisma/index.ts`)
  - generated/prisma — cliente gerado pelo Prisma
  - routes.ts, server.ts

**Dependências e versões (conforme package.json)**
- @prisma/adapter-better-sqlite3: ^7.4.0
- @prisma/client: ^7.4.0
- bcryptjs: ^3.0.3
- cors: ^2.8.6
- dotenv: ^17.3.1
- express: ^5.2.1
- jsonwebtoken: ^9.0.3
- tsx: ^4.21.0
- zod: ^4.3.6

DevDependencies relevantes:
- prisma: ^7.4.0
- typescript: ^5.9.3
- @types/express, @types/jsonwebtoken, etc.

**Modelagem do banco (Prisma)**
- Banco: SQLite (datasource em `prisma/schema.prisma`)
- Models principais:
  - `User` (id, name, email(unique), password, role(enum Role {STAFF, ADMIN}), createdAt, updatedAt)
  - `Category` (id, name, createdAt, updatedAt, products[])
  - `Product` (id, name, price [inteiro em centavos], description, banner, disabled, category relation)
  - `Order` (id, table, status, draft, name?, items[])
  - `Item` (id, amount, order relation, product relation)

Observações: o campo `price` é inteiro (centavos). Relações usam `onDelete: Cascade` para integridade.

**Validação de entrada**
- Biblioteca: `zod`.
- Padrão: cada schema exporta um objeto Zod que valida `body`, `query` e `params` (ex.: `createUserSchema`, `authUserSchema`, `createCategorySchema`).
- Exemplo: `createCategorySchema` valida `body.name` como `string` com no mínimo 2 caracteres.

**Middlewares**
- `isAuthenticated` — valida o header `Authorization: Bearer <token>`, verifica o token JWT (`process.env.JWT_SECRET`) e popula `req.user_id` com o `sub` do token.
- `isAdmin` — utiliza `req.user_id` e consulta `prisma.user` para validar se `role === 'ADMIN'`.
- `validateSchema` — função factory que recebe um schema Zod e valida `body`, `query` e `params`, retornando erros formatados quando inválido.

**Prisma / Client gerado**
- Generator no `prisma/schema.prisma` escreve o client em `prisma/generated/prisma`.
- Arquivo de config: `prisma.config.ts` (usa `DATABASE_URL` da env).

**Variáveis de ambiente recomendadas**
- `DATABASE_URL` — string de conexão do Prisma (ex.: arquivo SQLite ou outro DB)
- `JWT_SECRET` — segredo para assinar/verificar tokens JWT
- `PORT` — porta do servidor (default 3333)

**Como rodar (local)**
1. Instalar dependências: `npm install`
2. Definir variáveis de ambiente (ex.: criar `.env` com `DATABASE_URL` e `JWT_SECRET`)
3. Rodar em desenvolvimento: `npm run dev` (usa `tsx watch src/server.ts`)

**Observações e boas práticas**
- Seguir o fluxo Controller -> Service para manter separação de responsabilidades.
- Manter validação Zod para todas as entradas públicas.
- Usar bcryptjs para hashing de senhas (já presente no projeto).
- Testar endpoints protegidos com token válido (usar `/session` para obter token).

Se quiser, posso:
- adicionar exemplos de request/responses para cada endpoint;
- gerar um arquivo `.env.example`;
- ou ampliar a documentação com diagramas ER do banco.
