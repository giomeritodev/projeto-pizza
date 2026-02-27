# Contexto do Projeto — Backend (proj_pizza)

Este documento descreve a arquitetura, organização, endpoints, dependências e principais decisões do backend.

**Arquitetura**
- Padrão: Rotas → Controller → Services → Banco de Dados (Prisma)
- Fluxo: a rota recebe a requisição, o `Controller` extrai dados e chama o `Service`. O `Service` contém a lógica de negócio, comunica com o Prisma (BD) e devolve o resultado para o `Controller`, que responde ao cliente.
- Controllers são finos: validam apenas pré-condições mínimas e tratam erros do service. Services encapsulam operações sobre o banco e regras (por exemplo, `CreateProductService`, `AddItemOrderService`).


## Rotas / Endpoints
O projeto expõe todos os recursos através de um conjunto de rotas REST organizadas e protegidas por middlewares. A tabela abaixo resume cada rota com os middlewares aplicados, o controller/service responsável e os parâmetros esperados.

| Método | Rota | Middlewares | Controller → Service | Parâmetros & Descrição |
|--------|------|-------------|----------------------|-------------------------|
| POST   | `/users` | nenhum | `CreateUserController` → `CreateUserService` | Cria usuário. Body: `name`, `email`, `password` |
| POST   | `/session` | nenhum | `AuthUserController` → `AuthUserService` | Login. Body: `email`, `password` → retorna JWT |
| GET    | `/me` | `isAuthenticated` | `DetailUserController` → `DetailUserService` | Retorna dados do usuário logado. |
| POST   | `/category` | `isAuthenticated`, `isAdmin` | `CreateCategoryController` → `CreateCategoryService` | Body: `name`. Cria categoria. |
| GET    | `/category` | `isAuthenticated` | `ListCategoryController` → `ListCategoryService` | Lista todas as categorias. |
| POST   | `/product` | `isAuthenticated`, `isAdmin`, upload(single 'file') | `CreateProductController` → `CreateProductService` | Cria produto. Body: `name`, `price`, `description`, `category_id`; multipart para arquivo `file`. |
| GET    | `/products` | `isAuthenticated` | `ListProductController` → `ListProductService` | Query: `disabled` (true/false, default false). Lista produtos com filtro. |
| DELETE | `/product/:id` | `isAuthenticated`, `isAdmin` | `DeleteProductController` → `DeleteProductService` | Path param `id`. Marca produto como deletado/habilita? (ou remove). |
| GET    | `/category/product` | `isAuthenticated` | `ListProductsByCategoryController` → `ListProductsByCategoryService` | Query: `category_id`. Retorna produtos habilitados de uma categoria. |
| POST   | `/order` | `isAuthenticated` | `CreateOrderController` → `CreateOrderService` | Body: `table`, `name?`. Cria pedido em rascunho. |
| GET    | `/orders` | `isAuthenticated` | `ListOrderController` → `ListOrderService` | Lista pedidos (filtro interno por status/draft). |
| DELETE | `/order` | `isAuthenticated` | `DeleteOrderController` → `DeleteOrderService` | Query: `order_id`. Exclui pedido completo. |
| POST   | `/order/add` | `isAuthenticated` | `AddItemOrderController` → `AddItemOrderService` | Body: `order_id`, `product_id`, `amount`. Adiciona item a pedido. |
| DELETE | `/order/remove` | `isAuthenticated` | `RemoveItemOrderController` → `RemoveItemOrderService` | Query: `item_id`. Remove item de pedido. |
| GET    | `/order/detail` | `isAuthenticated` | `OrderDetailController` → `OrderDetailService` | Query: `order_id`. Retorna pedido com itens e produtos. |
| PUT    | `/order/send` | `isAuthenticated` | `SendOrderController` → `SendOrderService` | Body: `order_id`. Marca pedido como enviado (`draft = false`). |
| PUT    | `/order/finish` | `isAuthenticated` | `FinishOrderController` → `FinishOrderService` | Body: `order_id`. Marca pedido como pronto (`status = true`). |

> **Observação:** todas as rotas que recebem dados via `body`, `query` ou `params` são validadas usando schemas Zod (`validateSchema`).

**Observações**
- Rota `/product` utiliza `multer` para upload e o arquivo é enviado ao Cloudinary via config em `src/config/cloudinary.ts`.
- Rota `/orders` & `/order` referem-se a listagem e exclusão de pedidos, respectivamente.
- Endpoints de order usam mix de query params e body conforme padrões existentes.


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
- Enum:
  - `Role` — STAFF, ADMIN

- Models:
  
  **User**
  - `id` (Int, @id, autoincrement)
  - `name` (String)
  - `email` (String, @unique)
  - `password` (String)
  - `role` (Role, @default(STAFF))
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)
  
  **Category**
  - `id` (Int, @id, autoincrement)
  - `name` (String)
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)
  - `products` (Product[], relação 1-N)
  
  **Product**
  - `id` (Int, @id, autoincrement)
  - `name` (String)
  - `price` (Int, em centavos)
  - `description` (String)
  - `banner` (String, URL/path da imagem)
  - `disabled` (Boolean, @default(false))
  - `category_id` (Int, foreign key)
  - `category` (Category, relação N-1 com onDelete: Cascade)
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)
  - `items` (Item[], relação 1-N)
  
  **Order**
  - `id` (Int, @id, autoincrement)
  - `table` (Int, número da mesa)
  - `status` (Boolean, @default(false) → False = Pendente, True = Pronto)
  - `draft` (Boolean, @default(true) → False = Rascunho, True = Pedido enviado para produção)
  - `name` (String?, nome opcional)
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)
  - `items` (Item[], relação 1-N)
  
  **Item**
  - `id` (Int, @id, autoincrement)
  - `amount` (Int, quantidade)
  - `order_id` (Int, foreign key)
  - `order` (Order, relação N-1 com onDelete: Cascade)
  - `product_id` (Int, foreign key)
  - `product` (Product, relação N-1 com onDelete: Cascade)
  - `createdAt` (DateTime, @default(now()))
  - `updatedAt` (DateTime, @updatedAt)

Observações: o campo `price` é inteiro (centavos). Relações usam `onDelete: Cascade` para integridade referencial.

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
